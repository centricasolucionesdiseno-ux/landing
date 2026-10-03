<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Limpieza de texto recibido y escape para HTML. */
final class Texto
{
    /**
     * Caracteres de control, invisibles (zero-width) y de dirección de texto
     * (bidi): sirven para ocultar o disfrazar contenido en correos y asuntos.
     */
    private const INVISIBLES_RE = '/[\x{0000}-\x{0008}\x{000B}\x{000C}\x{000E}-\x{001F}\x{007F}\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{2066}-\x{2069}\x{FEFF}]/u';

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    /** Texto de una sola línea (o multilínea), sin invisibles y con longitud máxima */
    public static function limpiar(mixed $valor, int $maximo, bool $multilinea = false): string
    {
        if (!is_string($valor) || !mb_check_encoding($valor, 'UTF-8')) {
            return '';
        }
        $limpio = $multilinea ? preg_replace('/\r\n?/', "\n", $valor) : preg_replace('/[\r\n\t]+/', ' ', $valor);
        $limpio = preg_replace(self::INVISIBLES_RE, '', (string) $limpio);
        return mb_substr(trim((string) $limpio), 0, $maximo);
    }

    public static function html(?string $valor): string
    {
        return htmlspecialchars((string) $valor, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
