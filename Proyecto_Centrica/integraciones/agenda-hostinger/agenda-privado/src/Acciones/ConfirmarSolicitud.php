<?php

declare(strict_types=1);

namespace Centrica\Agenda\Acciones;

use Centrica\Agenda\Aplicacion;
use Centrica\Agenda\Calendario;
use Centrica\Agenda\Fechas;
use Centrica\Agenda\PlantillaCorreo;
use Centrica\Agenda\Reglas;
use Centrica\Agenda\Solicitudes;
use Centrica\Agenda\Texto;
use Centrica\Agenda\Token;

/**
 * /api/agenda/confirmar.php — enlace del correo de confirmación. El GET solo
 * muestra un botón: algunos filtros de correo abren los enlaces solos y no
 * deben confirmar nada. El POST confirma y avisa al gerente.
 */
final class ConfirmarSolicitud
{
    private const ACCION = '/api/agenda/confirmar.php';

    public function __construct(private readonly Aplicacion $app)
    {
    }

    public function atender(): never
    {
        $peticion = $this->app->peticion;
        if (!in_array($peticion->metodo(), ['GET', 'POST'], true)) {
            $this->app->respuesta->metodoNoPermitido('GET', 'POST');
        }
        $solicitud = $this->solicitudVigente($peticion->token());
        if (!$peticion->esPost()) {
            $this->mostrarBoton($solicitud, (string) $peticion->token());
        }
        $this->confirmar($solicitud);
    }

    /** @return array<string, mixed> */
    private function solicitudVigente(mixed $token): array
    {
        $respuesta = $this->app->respuesta;
        $solicitud = $this->app->solicitudes()->porTokenConfirmar($token);
        $volver = '<p><a class="boton boton-secundario" href="/contacto">Ir al formulario de citas</a></p>';
        if ($solicitud === null) {
            $respuesta->pagina('Enlace no válido', '<p>Este enlace no existe o la solicitud ya se borró. Si quieres agendar una reunión, vuelve a enviar el formulario.</p>' . $volver, 404);
        }
        if ($solicitud['estado'] !== Solicitudes::POR_CONFIRMAR) {
            $this->yaConfirmada();
        }
        if ($solicitud['creada_en'] < Fechas::utc(Reglas::HORAS_CONFIRMAR * 3600)) {
            $respuesta->pagina('El enlace venció', '<p>Los enlaces de confirmación duran ' . Reglas::HORAS_CONFIRMAR . ' horas. Vuelve a enviar el formulario para agendar tu reunión.</p>' . $volver, 410);
        }
        return $solicitud;
    }

    /** @param array<string, mixed> $solicitud */
    private function mostrarBoton(array $solicitud, string $token): never
    {
        $this->app->respuesta->pagina(
            'Confirma tu solicitud',
            '<p>Solicitud de reunión virtual para el <strong>' . Texto::html(self::cuando($solicitud)) . '</strong> (hora de Colombia).</p>'
            . '<form method="post" action="' . self::ACCION . '">'
            . '<input type="hidden" name="t" value="' . Texto::html($token) . '">'
            . '<button class="boton" type="submit">Confirmar mi solicitud</button>'
            . '</form>'
        );
    }

    /** @param array<string, mixed> $solicitud */
    private function confirmar(array $solicitud): never
    {
        $tokenGestion = Token::nuevo();
        // Confirmar una sola vez aunque se pulse el botón dos veces
        if (!$this->app->solicitudes()->confirmar((int) $solicitud['id'], Token::hash($tokenGestion))) {
            $this->yaConfirmada();
        }
        if (!$this->avisarGerente($solicitud, $tokenGestion)) {
            $this->app->solicitudes()->deshacerConfirmacion((int) $solicitud['id']);
            $this->app->respuesta->pagina('No pudimos completar la confirmación', '<p>Tuvimos un problema al enviar tu solicitud. Vuelve a abrir el enlace del correo en unos minutos.</p>', 502);
        }
        $this->app->respuesta->pagina(
            '¡Listo, solicitud confirmada!',
            '<p>Nuestro gerente comercial revisará tu solicitud para el <strong>' . Texto::html(self::cuando($solicitud)) . '</strong> y te responderá en máximo '
            . Reglas::RESPUESTA_DIAS_HABILES . ' días hábiles.</p>'
            . '<p>Cuando la apruebe te llegará a <strong>' . Texto::html($solicitud['correo']) . '</strong> la invitación con el enlace de la videollamada.</p>'
            . '<p><a class="boton boton-secundario" href="/">Volver al sitio</a></p>'
        );
    }

    private function yaConfirmada(): never
    {
        $this->app->respuesta->pagina(
            'Tu solicitud ya está confirmada',
            '<p>Nuestro gerente comercial la está revisando y te responderá en máximo ' . Reglas::RESPUESTA_DIAS_HABILES . ' días hábiles.</p>'
        );
    }

    /** @param array<string, mixed> $solicitud */
    private function avisarGerente(array $solicitud, string $tokenGestion): bool
    {
        $cuando = self::cuando($solicitud);
        $disponibilidad = $this->resumenDisponibilidad($solicitud);
        $datos = [
            'Nombre' => $solicitud['nombre'],
            'Correo' => $solicitud['correo'],
            'Empresa' => $solicitud['empresa'],
            'Cargo' => $solicitud['cargo'] ?: '—',
            'Servicio de interés' => $solicitud['servicio'] ?: '—',
            'Fecha pedida' => $cuando,
            'Motivo' => $solicitud['mensaje'],
        ];
        $enlace = $this->app->url('/api/agenda/gestionar.php?t=' . $tokenGestion);
        $intro = "{$solicitud['nombre']} confirmó su correo y pide una reunión para el $cuando.";
        $textoPlano = "$intro\n$disponibilidad\n\n";
        foreach ($datos as $etiqueta => $valor) {
            $textoPlano .= "$etiqueta: $valor\n";
        }

        return $this->app->correo()->enviar(
            para: $this->app->correoGerente(),
            asunto: "Cita por aprobar: {$solicitud['nombre']} ({$solicitud['empresa']}) · " . Fechas::legible($solicitud['fecha']),
            html: PlantillaCorreo::html(
                'Nueva solicitud de cita por aprobar',
                PlantillaCorreo::parrafo(Texto::html($intro)) . PlantillaCorreo::parrafo(Texto::html($disponibilidad)) . PlantillaCorreo::tabla($datos),
                ['Elegir hora y aprobar', $enlace],
                'Al aprobar se crea la videollamada de Jitsi Meet y la invitación de calendario les llega a ti y al cliente. Responder este correo le escribe al cliente.'
            ),
            texto: $textoPlano . "\nElegir hora y aprobar: $enlace",
            responderA: $solicitud['correo']
        );
    }

    /** Adelanto de la disponibilidad del gerente el día pedido */
    private function resumenDisponibilidad(array $solicitud): string
    {
        $libres = $this->app->calendario()->espaciosLibres($solicitud['fecha'], $solicitud['franja']);
        $enFranja = array_values(array_filter($libres['espacios'], static fn(array $espacio) => $espacio['enFranja']));
        return match (true) {
            $libres['motivo'] === Calendario::FESTIVO => 'Ese día es festivo: no hay espacios disponibles.',
            $libres['espacios'] === [] => 'No tienes espacios libres ese día.',
            $enFranja === [] => 'No tienes espacios en la franja pedida, pero sí otros ' . count($libres['espacios']) . ' ese mismo día.',
            default => 'Tienes ' . count($enFranja) . ' espacio(s) libre(s) en la franja pedida (el primero a las ' . Fechas::hora($enFranja[0]['inicio']) . ').',
        };
    }

    /** "lunes 6 de octubre · Mañana (8:00 a 12:00 m.)" */
    private static function cuando(array $solicitud): string
    {
        return Fechas::legible($solicitud['fecha']) . ' · ' . Reglas::FRANJAS[$solicitud['franja']];
    }
}
