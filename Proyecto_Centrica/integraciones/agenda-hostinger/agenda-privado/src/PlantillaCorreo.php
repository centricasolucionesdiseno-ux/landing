<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** HTML de los correos, con estilos en línea (los clientes de correo ignoran <style>). */
final class PlantillaCorreo
{
    private const FUENTE = 'font-family:Arial,Helvetica,sans-serif';
    private const COLOR_MARCA = '#0b3d91';

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    /** @param array{0: string, 1: string}|null $boton [texto, url] */
    public static function html(string $titulo, string $cuerpoHtml, ?array $boton = null, string $nota = ''): string
    {
        return '<!doctype html><html lang="es"><body style="margin:0;padding:24px;background:#f4f6fa">'
            . '<div style="max-width:560px;margin:0 auto;padding:32px;border-radius:12px;background:#ffffff;' . self::FUENTE . ';font-size:15px;line-height:1.6;color:#1f2933">'
            . '<p style="margin:0 0 16px;font-size:20px;font-weight:bold;color:' . self::COLOR_MARCA . '">Céntrica</p>'
            . '<h1 style="margin:0 0 16px;font-size:22px;color:#1f2933">' . Texto::html($titulo) . '</h1>'
            . $cuerpoHtml
            . ($boton ? self::boton($boton[0], $boton[1]) : '')
            . ($nota !== '' ? '<p style="margin:0;font-size:13px;color:#52606d">' . Texto::html($nota) . '</p>' : '')
            . '<p style="margin:32px 0 0;font-size:12px;color:#7b8794">Céntrica Soluciones · centricasoluciones.com</p>'
            . '</div></body></html>';
    }

    /** @param array<string, string> $filas etiqueta => valor */
    public static function tabla(array $filas): string
    {
        $html = '<table style="border-collapse:collapse;' . self::FUENTE . ';font-size:14px">';
        foreach ($filas as $etiqueta => $valor) {
            $html .= '<tr><td style="padding:6px 12px 6px 0;color:#52606d;vertical-align:top"><b>' . Texto::html($etiqueta) . '</b></td>'
                . '<td style="padding:6px 0">' . nl2br(Texto::html($valor)) . '</td></tr>';
        }
        return $html . '</table>';
    }

    public static function parrafo(string $html): string
    {
        return '<p>' . $html . '</p>';
    }

    private static function boton(string $texto, string $url): string
    {
        return '<p style="margin:28px 0"><a href="' . Texto::html($url) . '" style="display:inline-block;padding:14px 28px;border-radius:8px;background:'
            . self::COLOR_MARCA . ';color:#ffffff;' . self::FUENTE . ';font-size:16px;font-weight:bold;text-decoration:none">' . Texto::html($texto) . '</a></p>';
    }
}
