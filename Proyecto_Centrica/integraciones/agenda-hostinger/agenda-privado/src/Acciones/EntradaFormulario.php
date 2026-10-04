<?php

declare(strict_types=1);

namespace Centrica\Agenda\Acciones;

use Centrica\Agenda\Antiabuso;
use Centrica\Agenda\Aplicacion;

/**
 * Lectura común de los formularios del sitio que llegan como JSON (agenda y
 * chat): origen permitido, tamaño máximo, objeto JSON válido y señales de bot.
 */
final class EntradaFormulario
{
    public const DATOS_INVALIDOS = 'datos_invalidos';
    // El formulario más complejo (lista de temas del chat) tiene 2 niveles
    private const PROFUNDIDAD_JSON = 4;
    // Lo que envía el navegador cuando la petición nace en el propio sitio
    private const MISMO_SITIO = ['', 'same-origin'];

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    /** @return array<string, mixed> cuerpo JSON (responde con error y termina si no es válido) */
    public static function leer(Aplicacion $app): array
    {
        $respuesta = $app->respuesta;
        if (!$app->peticion->esPost()) {
            $respuesta->metodoNoPermitido('POST');
        }
        $mismoSitio = in_array($app->peticion->sitioDeOrigen(), self::MISMO_SITIO, true);
        if (!$mismoSitio || !$app->antiabuso()->origenPermitido($app->peticion->origen())) {
            $respuesta->error('origen', 'Solicitud no permitida.', 403);
        }
        $cuerpo = $app->peticion->cuerpo(Antiabuso::MAX_BYTES);
        if (strlen($cuerpo) > Antiabuso::MAX_BYTES) {
            $respuesta->error(self::DATOS_INVALIDOS, 'La solicitud es demasiado grande.', 413);
        }
        $entrada = json_decode($cuerpo, true, self::PROFUNDIDAD_JSON);
        if (!is_array($entrada) || array_is_list($entrada)) {
            $respuesta->error(self::DATOS_INVALIDOS, 'Solicitud no válida.', 400);
        }
        return $entrada;
    }

    /** El campo trampa (invisible para personas) solo lo llenan los bots */
    public static function esBot(array $entrada): bool
    {
        return !empty($entrada['website']);
    }

    /** Nadie llena un formulario en menos de MIN_MS_FORMULARIO */
    public static function demasiadoRapido(array $entrada): bool
    {
        return !is_int($entrada['tiempo'] ?? null) || $entrada['tiempo'] < Antiabuso::MIN_MS_FORMULARIO;
    }
}
