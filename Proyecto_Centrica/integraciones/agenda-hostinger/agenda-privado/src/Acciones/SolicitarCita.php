<?php

declare(strict_types=1);

namespace Centrica\Agenda\Acciones;

use Centrica\Agenda\Aplicacion;
use Centrica\Agenda\Fechas;
use Centrica\Agenda\Limites;
use Centrica\Agenda\PlantillaCorreo;
use Centrica\Agenda\Reglas;
use Centrica\Agenda\Solicitudes;
use Centrica\Agenda\Texto;
use Centrica\Agenda\Token;
use Centrica\Agenda\Validador;

/**
 * POST /api/agenda/solicitar.php — recibe el formulario y envía al visitante
 * el enlace para confirmar su correo. El gerente solo se entera si confirma.
 */
final class SolicitarCita
{
    public function __construct(private readonly Aplicacion $app)
    {
    }

    public function atender(): never
    {
        $respuesta = $this->app->respuesta;
        $entrada = EntradaFormulario::leer($this->app);

        // Bots: se responde con éxito para no darles pistas
        if (EntradaFormulario::esBot($entrada)) {
            $respuesta->json(['ok' => true, 'estado' => Solicitudes::POR_CONFIRMAR]);
        }
        if (EntradaFormulario::demasiadoRapido($entrada)) {
            $respuesta->error(EntradaFormulario::DATOS_INVALIDOS, 'Revisa los datos y vuelve a enviar el formulario.', 422);
        }
        [$datos, $error] = (new Validador())->validar($entrada);
        if ($error !== '') {
            $respuesta->error(EntradaFormulario::DATOS_INVALIDOS, $error, 422);
        }

        $antiabuso = $this->app->antiabuso();
        if (!$antiabuso->esHumano($entrada['turnstile'] ?? null, $this->app->peticion->ip())) {
            $respuesta->error('verificacion', 'No pudimos verificar que la solicitud la envía una persona. Recarga la página e inténtalo de nuevo.', 403);
        }
        $solicitudes = $this->app->solicitudes();
        $solicitudes->borrarSinConfirmarAntesDe(Fechas::utc(Reglas::DIAS_BORRAR_SIN_CONFIRMAR * 86400));
        $ipHash = $antiabuso->hashIp($this->app->peticion->ip());
        $token = Token::nuevo();

        // Contar y registrar es atómico: peticiones simultáneas no pueden saltarse el límite
        [$limite, $id] = $this->app->bloqueo()->conCandado('agenda', static function () use ($antiabuso, $solicitudes, $datos, $ipHash, $token) {
            $limite = $antiabuso->limiteSuperado($solicitudes, Limites::agenda(), $datos['correo'], $ipHash);
            return $limite !== '' ? [$limite, 0] : ['', $solicitudes->crear($datos, Token::hash($token), $ipHash)];
        });
        if ($limite !== '') {
            $respuesta->error('limite', $limite, 429);
        }
        $this->enviarYResponder($datos, $token, $id);
    }

    /** @param array<string, string> $datos */
    private function enviarYResponder(array $datos, string $token, int $id): never
    {
        if (!$this->enviarConfirmacion($datos, $token)) {
            // Sin correo de confirmación la solicitud no sirve: se borra para que pueda reintentar
            $this->app->solicitudes()->borrar($id);
            $this->app->respuesta->error('correo', 'No pudimos enviarte el correo de confirmación.', 502);
        }
        $this->app->respuesta->json(['ok' => true, 'estado' => Solicitudes::POR_CONFIRMAR, 'venceHoras' => Reglas::HORAS_CONFIRMAR]);
    }

    /**
     * El correo lo recibe la dirección que escribió el visitante, que podría no
     * ser suya: lleva solo texto fijo y valores de listas, nunca texto libre.
     * @param array<string, string> $datos
     */
    private function enviarConfirmacion(array $datos, string $token): bool
    {
        $cuando = Fechas::legible($datos['fecha']) . ' · ' . Reglas::FRANJAS[$datos['franja']];
        $enlace = $this->app->url('/api/agenda/confirmar.php?t=' . $token);
        $intro = "Recibimos una solicitud de reunión virtual con Céntrica hecha con este correo para el $cuando (hora de Colombia).";
        $vigencia = 'El enlace vence en ' . Reglas::HORAS_CONFIRMAR . ' horas.';
        $siNoFuiste = 'Si no fuiste tú, ignora este correo: la solicitud no se enviará y sus datos se borrarán automáticamente.';

        return $this->app->correo()->enviar(
            para: $datos['correo'],
            asunto: 'Confirma tu solicitud de reunión con Céntrica',
            html: PlantillaCorreo::html(
                'Confirma tu solicitud de reunión',
                PlantillaCorreo::parrafo(Texto::html($intro))
                . PlantillaCorreo::parrafo('Para enviarla a nuestro gerente comercial, confírmala con el botón. ' . Texto::html($vigencia)),
                ['Confirmar mi solicitud', $enlace],
                $siNoFuiste
            ),
            texto: "$intro\n\nPara enviarla a nuestro gerente comercial, confírmala en este enlace. $vigencia\n$enlace\n\n$siNoFuiste"
        );
    }
}
