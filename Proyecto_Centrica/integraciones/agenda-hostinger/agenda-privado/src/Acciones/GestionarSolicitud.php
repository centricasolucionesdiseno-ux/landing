<?php

declare(strict_types=1);

namespace Centrica\Agenda\Acciones;

use Centrica\Agenda\Aplicacion;
use Centrica\Agenda\Calendario;
use Centrica\Agenda\Fechas;
use Centrica\Agenda\HoraOcupada;
use Centrica\Agenda\Invitacion;
use Centrica\Agenda\PlantillaCorreo;
use Centrica\Agenda\Reglas;
use Centrica\Agenda\Solicitudes;
use Centrica\Agenda\Texto;

/**
 * /api/agenda/gestionar.php — página del gerente (enlace del correo de aviso):
 * elegir la hora y aprobar la cita, o rechazar la solicitud. El GET no cambia nada.
 */
final class GestionarSolicitud
{
    private const ACCION = '/api/agenda/gestionar.php';
    private const NOTA_JITSI = 'Jitsi pide que la primera persona en entrar a la sala inicie sesión (con GitHub, Facebook o Google). '
        . 'Entra unos minutos antes para abrirla; el cliente entra sin cuenta.';
    private const HORA_NO_DISPONIBLE = 'Esa hora ya no está disponible';
    private const RESPONDE_PARA_COORDINAR = 'Responde este correo y con gusto coordinamos otra fecha.';

    /** @var array<string, mixed> */
    private array $solicitud = [];
    private string $token = '';

    public function __construct(private readonly Aplicacion $app)
    {
    }

    public function atender(): never
    {
        $peticion = $this->app->peticion;
        if (!in_array($peticion->metodo(), ['GET', 'POST'], true)) {
            $this->app->respuesta->metodoNoPermitido('GET', 'POST');
        }
        $solicitud = $this->app->solicitudes()->porTokenGestion($peticion->token());
        if ($solicitud === null || $solicitud['estado'] === Solicitudes::POR_CONFIRMAR) {
            $this->app->respuesta->pagina('Enlace no válido', '<p>Este enlace no existe o la solicitud ya se borró.</p>', 404);
        }
        // Un enlace con datos personales no puede servir para siempre (p. ej. si el correo se reenvía)
        if ($solicitud['confirmada_en'] < Fechas::utc(Reglas::DIAS_ENLACE_GERENTE * 86400)) {
            $this->app->respuesta->pagina('Enlace vencido', '<p>Por seguridad, este enlace venció. Los datos de la solicitud están en el correo de aviso.</p>', 410);
        }
        $this->solicitud = $solicitud;
        $this->token = (string) $peticion->token();

        match ($peticion->esPost() ? $peticion->campo('accion') : 'ver') {
            'ver' => $this->mostrar(),
            'aprobar' => $this->aprobar($peticion->campo('inicio')),
            'rechazar' => $this->rechazar(Texto::limpiar($peticion->campo('mensaje'), 500, true)),
            default => $this->app->respuesta->pagina('Acción no válida', '<p><a href="' . Texto::html($this->enlacePagina()) . '">Volver a la solicitud</a></p>', 400),
        };
    }

    // ---------- Ver ----------

    private function mostrar(): never
    {
        if ($this->solicitud['estado'] !== Solicitudes::POR_APROBAR) {
            $this->mostrarResuelta();
        }
        if ($this->solicitud['fecha'] < Fechas::hoy()->format('Y-m-d')) {
            $this->app->respuesta->pagina(
                'La fecha pedida ya pasó',
                '<p>Responde el correo de aviso para coordinar otra fecha con el cliente, o rechaza la solicitud.</p>' . $this->detalle() . $this->formularioRechazo()
            );
        }
        $libres = $this->app->calendario()->espaciosLibres($this->solicitud['fecha'], $this->solicitud['franja']);
        if ($libres['espacios'] === []) {
            $motivo = $libres['motivo'] === Calendario::FESTIVO ? 'Ese día es festivo.' : 'No quedan horas libres ese día.';
            $this->app->respuesta->pagina(
                'Solicitud por aprobar',
                '<p class="aviso">' . $motivo . ' Responde el correo de aviso para proponerle otra fecha al cliente, o rechaza la solicitud.</p>'
                . $this->detalle() . $this->formularioRechazo()
            );
        }
        $this->app->respuesta->pagina('Solicitud por aprobar', $this->detalle() . $this->formularioAprobacion($libres['espacios']) . $this->formularioRechazo());
    }

    private function mostrarResuelta(string $aviso = ''): never
    {
        $solicitud = $this->solicitud;
        if ($solicitud['estado'] !== Solicitudes::AGENDADA) {
            $this->app->respuesta->pagina('Solicitud rechazada', '<p>Ya rechazaste esta solicitud y le avisamos al cliente.</p>' . $this->detalle());
        }
        $this->app->respuesta->pagina(
            'Reunión agendada',
            ($aviso !== '' ? '<p class="aviso">' . Texto::html($aviso) . '</p>' : '')
            . '<p>Quedó para el <strong>' . Texto::html(Fechas::legible($solicitud['inicio'], true)) . '</strong> (hora de Colombia). '
            . 'La invitación de calendario les llegó a ti y al cliente.</p>'
            . '<p><a class="boton" href="' . Texto::html($solicitud['enlace']) . '" target="_blank" rel="noopener noreferrer">Abrir la videollamada</a></p>'
            . '<p class="nota">' . Texto::html(self::NOTA_JITSI) . '</p>'
            . $this->detalle()
        );
    }

    // ---------- Aprobar ----------

    private function aprobar(mixed $inicio): never
    {
        if ($this->solicitud['estado'] !== Solicitudes::POR_APROBAR) {
            $this->mostrarResuelta();
        }
        $libres = array_column($this->app->calendario()->espaciosLibres($this->solicitud['fecha'], $this->solicitud['franja'])['espacios'], 'inicio');
        if (!is_string($inicio) || !in_array($inicio, $libres, true)) {
            $this->horaNoDisponible('Elige otra de las horas libres.');
        }
        try {
            $agendada = $this->app->solicitudes()->agendar((int) $this->solicitud['id'], $inicio, Invitacion::enlaceVideollamada());
        } catch (HoraOcupada) {
            $this->horaNoDisponible('Otra cita acaba de quedar a esa hora.');
        }
        $this->recargar();
        if ($agendada) {
            $enviado = $this->enviarInvitaciones();
            $this->mostrarResuelta($enviado ? '' : "La cita quedó agendada, pero no pudimos enviarle el correo al cliente. Escríbele a {$this->solicitud['correo']} con el enlace de la videollamada.");
        }
        $this->mostrarResuelta();
    }

    private function horaNoDisponible(string $detalle): never
    {
        $this->app->respuesta->pagina(
            self::HORA_NO_DISPONIBLE,
            '<p>' . Texto::html($detalle) . '</p><p><a class="boton" href="' . Texto::html($this->enlacePagina()) . '">Elegir otra hora</a></p>',
            409
        );
    }

    /** Correo con la invitación .ics al cliente y al gerente. Falso si el del cliente no salió. */
    private function enviarInvitaciones(): bool
    {
        $cita = $this->solicitud;
        $ics = $this->app->invitacion()->generar($cita);
        $fechaHora = Fechas::legible($cita['inicio'], true);
        $resumen = "Nos vemos el $fechaHora (hora de Colombia), " . Reglas::DURACION_MIN . ' minutos por videollamada.';
        $cambiar = '¿Necesitas cambiar la fecha? Responde este correo.';

        $alCliente = $this->app->correo()->enviar(
            para: $cita['correo'],
            asunto: 'Tu reunión con Céntrica quedó agendada · ' . $fechaHora,
            html: PlantillaCorreo::html(
                '¡Tu reunión quedó agendada!',
                PlantillaCorreo::parrafo('Nuestro gerente comercial aprobó tu solicitud. ' . Texto::html($resumen))
                . PlantillaCorreo::parrafo('Adjuntamos la invitación para que la agregues a tu calendario. Para entrar no necesitas cuenta: solo abre el enlace a la hora de la reunión.'),
                ['Entrar a la videollamada', $cita['enlace']],
                $cambiar
            ),
            texto: "Nuestro gerente comercial aprobó tu solicitud. $resumen\nEnlace: {$cita['enlace']}\n\n$cambiar",
            responderA: $this->app->correoGerente(),
            ics: $ics
        );

        $this->app->correo()->enviar(
            para: $this->app->correoGerente(),
            asunto: "Cita agendada: {$cita['nombre']} ({$cita['empresa']}) · $fechaHora",
            html: PlantillaCorreo::html(
                'Cita agendada',
                PlantillaCorreo::parrafo('Quedó para el <b>' . Texto::html($fechaHora) . '</b> (hora de Colombia). Abre el archivo adjunto para agregarla a tu calendario.')
                . PlantillaCorreo::tabla(['Cliente' => "{$cita['nombre']} · {$cita['empresa']}", 'Correo' => $cita['correo'], 'Motivo' => $cita['mensaje']]),
                ['Abrir la videollamada', $cita['enlace']],
                self::NOTA_JITSI
            ),
            texto: "Cita agendada para el $fechaHora (hora de Colombia) con {$cita['nombre']} ({$cita['empresa']}).\nVideollamada: {$cita['enlace']}\n\n" . self::NOTA_JITSI,
            responderA: $cita['correo'],
            ics: $ics
        );
        return $alCliente;
    }

    // ---------- Rechazar ----------

    private function rechazar(string $mensaje): never
    {
        if (!$this->app->solicitudes()->rechazar((int) $this->solicitud['id'])) {
            $this->recargar();
            $this->mostrarResuelta();
        }
        $intro = 'Gracias por tu interés en Céntrica. No podremos reunirnos el ' . Fechas::legible($this->solicitud['fecha']) . ', como pediste.';
        $this->app->correo()->enviar(
            para: $this->solicitud['correo'],
            asunto: 'Sobre tu solicitud de reunión con Céntrica',
            html: PlantillaCorreo::html(
                'Sobre tu solicitud de reunión',
                PlantillaCorreo::parrafo(Texto::html($intro))
                . ($mensaje !== '' ? PlantillaCorreo::parrafo(nl2br(Texto::html($mensaje))) : '')
                . PlantillaCorreo::parrafo(self::RESPONDE_PARA_COORDINAR)
            ),
            texto: $intro . ($mensaje !== '' ? "\n\n$mensaje" : '') . "\n\n" . self::RESPONDE_PARA_COORDINAR,
            responderA: $this->app->correoGerente()
        );
        $this->app->respuesta->pagina('Solicitud rechazada', '<p>Le avisamos al cliente por correo.</p>' . $this->detalle());
    }

    // ---------- Piezas de la página ----------

    private function recargar(): void
    {
        $this->solicitud = $this->app->solicitudes()->porTokenGestion($this->token) ?? $this->solicitud;
    }

    private function enlacePagina(): string
    {
        return self::ACCION . '?t=' . rawurlencode($this->token);
    }

    private function detalle(): string
    {
        $s = $this->solicitud;
        $filas = [
            'Cliente' => $s['nombre'] . ' · ' . $s['empresa'] . ($s['cargo'] ? ' (' . $s['cargo'] . ')' : ''),
            'Correo' => $s['correo'],
            'Servicio' => $s['servicio'] ?: '—',
            'Fecha pedida' => Fechas::legible($s['fecha']) . ' · ' . Reglas::FRANJAS[$s['franja']],
            'Motivo' => $s['mensaje'],
        ];
        $html = '';
        foreach ($filas as $etiqueta => $valor) {
            $html .= '<dt>' . Texto::html($etiqueta) . '</dt><dd>' . nl2br(Texto::html($valor)) . '</dd>';
        }
        return '<dl class="detalle">' . $html . '</dl>';
    }

    private function campoToken(string $accion): string
    {
        return '<input type="hidden" name="t" value="' . Texto::html($this->token) . '">'
            . '<input type="hidden" name="accion" value="' . $accion . '">';
    }

    /** @param list<array{inicio: string, enFranja: bool}> $espacios */
    private function formularioAprobacion(array $espacios): string
    {
        $opciones = '';
        foreach ($espacios as $i => $espacio) {
            $opciones .= '<label class="hora"><input type="radio" name="inicio" value="' . Texto::html($espacio['inicio']) . '"' . ($i === 0 ? ' checked' : '') . '> '
                . Texto::html(Fechas::hora($espacio['inicio'])) . ($espacio['enFranja'] ? ' <small>franja pedida</small>' : '') . '</label>';
        }
        return '<form method="post" action="' . self::ACCION . '">' . $this->campoToken('aprobar')
            . '<fieldset><legend>Hora de la reunión (' . Texto::html(Fechas::legible($this->solicitud['fecha'])) . ', ' . Reglas::DURACION_MIN . ' min)</legend>'
            . '<div class="horas">' . $opciones . '</div>'
            . '<p class="nota">Aquí no aparecen las horas que ya tienen otra cita del sitio. Revisa también tu agenda personal antes de aprobar.</p></fieldset>'
            . '<button class="boton" type="submit">Aprobar y enviar invitación</button>'
            . '</form>';
    }

    private function formularioRechazo(): string
    {
        return '<details class="rechazo"><summary>Rechazar la solicitud</summary>'
            . '<form method="post" action="' . self::ACCION . '">' . $this->campoToken('rechazar')
            . '<label for="mensaje">Mensaje para el cliente (opcional)</label>'
            . '<textarea id="mensaje" name="mensaje" rows="4" maxlength="500" placeholder="Ej: Esa semana no tenemos agenda; ¿te sirve la próxima?"></textarea>'
            . '<button class="boton boton-peligro" type="submit">Rechazar y avisar al cliente</button>'
            . '</form></details>';
    }
}
