<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * IP real del visitante cuando el sitio está detrás de Cloudflare (protección
 * DDoS). Solo se cree la cabecera CF-Connecting-IP si la conexión viene de
 * verdad de Cloudflare: cualquiera puede inventarse esa cabecera.
 */
final class ProxyConfiable
{
    // Rangos oficiales de Cloudflare: archivo de datos para actualizarlos sin tocar el código
    private const ARCHIVO_RANGOS = __DIR__ . '/../cloudflare-ips.txt';

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    /** @param array<string, mixed> $servidor $_SERVER */
    public static function ipDelVisitante(array $servidor, bool $usaCloudflare): string
    {
        $remota = (string) ($servidor['REMOTE_ADDR'] ?? '');
        $declarada = (string) ($servidor['HTTP_CF_CONNECTING_IP'] ?? '');
        $confiar = $usaCloudflare && self::esDeCloudflare($remota) && filter_var($declarada, FILTER_VALIDATE_IP) !== false;
        return $confiar ? $declarada : $remota;
    }

    private static function esDeCloudflare(string $ip): bool
    {
        foreach (self::rangos() as $rango) {
            if (self::enRango($ip, $rango)) {
                return true;
            }
        }
        return false;
    }

    /** @return list<string> rangos CIDR (las líneas vacías y los comentarios se ignoran) */
    private static function rangos(): array
    {
        static $rangos = null;
        if ($rangos === null) {
            $lineas = is_file(self::ARCHIVO_RANGOS) ? file(self::ARCHIVO_RANGOS, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
            $rangos = array_values(array_filter(array_map('trim', $lineas ?: []), static fn(string $linea) => $linea !== '' && $linea[0] !== '#'));
        }
        return $rangos;
    }

    private static function enRango(string $ip, string $rango): bool
    {
        [$red, $bits] = explode('/', $rango) + [1 => '0'];
        $binIp = inet_pton($ip);
        $binRed = inet_pton($red);
        $comparables = $binIp !== false && $binRed !== false && strlen($binIp) === strlen($binRed);
        return $comparables && self::mismoPrefijo($binIp, $binRed, (int) $bits);
    }

    /** ¿Las dos direcciones (binarias) comparten los primeros $bits bits? */
    private static function mismoPrefijo(string $a, string $b, int $bits): bool
    {
        $bytesCompletos = intdiv($bits, 8);
        $resto = $bits % 8;
        $mascara = (0xFF << (8 - $resto)) & 0xFF;
        return strncmp($a, $b, $bytesCompletos) === 0
            && ($resto === 0 || (ord($a[$bytesCompletos]) & $mascara) === (ord($b[$bytesCompletos]) & $mascara));
    }
}
