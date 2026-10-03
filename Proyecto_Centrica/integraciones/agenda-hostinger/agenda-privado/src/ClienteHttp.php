<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Peticiones POST salientes (solo HTTPS) con tiempo límite. */
final class ClienteHttp
{
    /**
     * @param array<string, string> $campos
     * @return array{0: int, 1: string} código HTTP (0 si no hubo conexión) y cuerpo
     */
    public function post(string $url, array $campos, int $segundos = 15): array
    {
        $curl = curl_init($url);
        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($campos),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS,
            CURLOPT_TIMEOUT => $segundos,
            CURLOPT_CONNECTTIMEOUT => 5,
        ]);
        $respuesta = curl_exec($curl);
        if ($respuesta === false) {
            error_log('agenda http: ' . curl_error($curl));
            return [0, ''];
        }
        return [(int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE), (string) $respuesta];
    }
}
