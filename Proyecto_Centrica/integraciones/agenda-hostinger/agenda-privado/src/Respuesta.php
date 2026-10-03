<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Respuestas HTTP: JSON para el formulario y páginas HTML para los enlaces de
 * los correos. Nunca se guardan en caché ni se indexan.
 */
final class Respuesta
{
    private const HOJA_ESTILOS = '/api/agenda/estilo.css';

    public function __construct(private readonly bool $esApi)
    {
    }

    /** @param array<string, mixed> $datos */
    public function json(array $datos, int $codigo = 200): never
    {
        self::cabeceras($codigo, 'application/json');
        echo json_encode($datos, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /** Error del formulario con el formato que espera el sitio: { ok: false, codigo, mensaje } */
    public function error(string $codigo, string $mensaje, int $estadoHttp): never
    {
        $this->json(['ok' => false, 'codigo' => $codigo, 'mensaje' => $mensaje], $estadoHttp);
    }

    /**
     * Sin estilos ni scripts en línea: la CSP del sitio (.htaccess) los bloquea.
     * @param string $contenidoHtml HTML ya escapado
     */
    public function pagina(string $titulo, string $contenidoHtml, int $codigo = 200): never
    {
        self::cabeceras($codigo, 'text/html');
        echo '<!doctype html><html lang="es"><head><meta charset="utf-8">'
            . '<meta name="viewport" content="width=device-width, initial-scale=1">'
            . '<meta name="robots" content="noindex, nofollow">'
            . '<title>' . Texto::html($titulo) . ' · Céntrica</title>'
            . '<link rel="stylesheet" href="' . self::HOJA_ESTILOS . '">'
            . '</head><body><main class="caja">'
            . '<a class="marca" href="/">Céntrica</a>'
            . '<h1>' . Texto::html($titulo) . '</h1>'
            . $contenidoHtml
            . '</main></body></html>';
        exit;
    }

    /** Error inesperado: mensaje genérico (el detalle queda en el log) */
    public function errorInterno(): never
    {
        if ($this->esApi) {
            $this->error('error', 'No pudimos procesar la solicitud en este momento.', 500);
        }
        $this->pagina('Algo salió mal', '<p>No pudimos procesar tu solicitud en este momento. Inténtalo de nuevo en unos minutos.</p>', 500);
    }

    public function metodoNoPermitido(string ...$permitidos): never
    {
        header('Allow: ' . implode(', ', $permitidos));
        self::cabeceras(405, 'text/plain');
        exit;
    }

    private static function cabeceras(int $codigo, string $tipo): void
    {
        http_response_code($codigo);
        header("Content-Type: $tipo; charset=utf-8");
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow');
        header('Referrer-Policy: no-referrer');
    }
}
