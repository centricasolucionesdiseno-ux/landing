<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Tokens aleatorios de los enlaces de los correos. En la base de datos solo se
 * guarda su hash: quien la lea no puede confirmar ni aprobar solicitudes.
 */
final class Token
{
    private const FORMATO_RE = '/^[A-Za-z0-9_-]{43}$/';

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    public static function nuevo(): string
    {
        return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
    }

    public static function hash(string $token): string
    {
        return hash('sha256', $token);
    }

    public static function esValido(mixed $token): bool
    {
        return is_string($token) && preg_match(self::FORMATO_RE, $token) === 1;
    }
}
