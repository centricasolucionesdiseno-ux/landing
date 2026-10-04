<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Filtros para que al gerente solo le lleguen solicitudes reales: origen,
 * límites de frecuencia y verificación humana (Cloudflare Turnstile).
 */
final class Antiabuso
{
    public const MAX_BYTES = 8000;           // una solicitud legítima pesa ~1 KB
    public const MIN_MS_FORMULARIO = 3000;   // nadie llena el formulario en menos de 3 s
    private const URL_TURNSTILE = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    private const MAX_TOKEN = 2048;
    private const HORA = 3600;
    private const DIA = 86400;

    public function __construct(
        private readonly Configuracion $config,
        private readonly ClienteHttp $http
    ) {
    }

    /** Los navegadores siempre envían Origin en un POST: debe ser el propio sitio */
    public function origenPermitido(string $origen): bool
    {
        $partes = parse_url($origen);
        if (!is_array($partes) || empty($partes['host'])) {
            return false;
        }
        $host = strtolower($partes['host']) . (isset($partes['port']) ? ':' . $partes['port'] : '');
        return in_array($host, $this->config->lista('dominios'), true);
    }

    /** La IP se guarda anonimizada: solo sirve para contar solicitudes */
    public function hashIp(string $ip): string
    {
        return hash_hmac('sha256', $ip, $this->config->texto('sal_ip'));
    }

    /** Mensaje para el visitante si supera algún límite; vacío si puede continuar */
    public function limiteSuperado(RegistroDeEnvios $registro, Limites $limites, string $correo, string $ipHash): string
    {
        $haceUnaHora = Fechas::utc(self::HORA);
        $haceUnDia = Fechas::utc(self::DIA);
        $sitioSaturado = $registro->contarCreadasDesde($haceUnDia) >= $limites->globalDia;
        $ipExcedida = $registro->contarPorIpDesde($ipHash, $haceUnaHora) >= $limites->porIpHora
            || $registro->contarPorIpDesde($ipHash, $haceUnDia) >= $limites->porIpDia;
        $correoExcedido = $registro->contarPorCorreoDesde($correo, $haceUnDia) >= $limites->porCorreoDia;

        return match (true) {
            $sitioSaturado => 'En este momento estamos recibiendo muchas solicitudes. Inténtalo más tarde o escríbenos por correo.',
            $ipExcedida => 'Ya recibimos varios envíos desde tu conexión. Inténtalo más tarde.',
            $correoExcedido => 'Ya recibimos varios envíos con este correo hoy. Te responderemos pronto; revisa también la carpeta de spam.',
            default => '',
        };
    }

    /** Cloudflare Turnstile. Falla cerrado: cualquier error rechaza la solicitud. */
    public function esHumano(mixed $token, string $ip): bool
    {
        $secreto = $this->config->texto('turnstile_secreto');
        if ($secreto === '') {
            return (bool) $this->config->valor('permitir_sin_turnstile', false);
        }
        if (!is_string($token) || $token === '' || strlen($token) > self::MAX_TOKEN) {
            return false;
        }
        [$codigo, $cuerpo] = $this->http->post(self::URL_TURNSTILE, ['secret' => $secreto, 'response' => $token, 'remoteip' => $ip]);
        $resultado = json_decode($cuerpo, true);
        return $codigo === 200 && is_array($resultado) && ($resultado['success'] ?? false) === true
            && in_array($resultado['hostname'] ?? '', $this->config->lista('dominios'), true);
    }
}
