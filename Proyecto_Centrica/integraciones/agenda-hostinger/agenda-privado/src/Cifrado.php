<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Cifrado de los datos personales en la base de datos (AES-256-GCM).
 *
 * - Cada cliente tiene su propia clave, derivada de la clave maestra con HKDF
 *   y el identificador público de su solicitud: descifrar a un cliente no
 *   sirve para descifrar a otro.
 * - Cada valor lleva un IV aleatorio y su etiqueta de autenticación: si alguien
 *   altera el texto cifrado, el descifrado falla en vez de devolver basura.
 * - Los datos adicionales autenticados (campo + cliente) impiden mover un
 *   valor cifrado a otro campo u otra fila.
 * - El correo no se puede buscar cifrado: para los límites se guarda su
 *   huella HMAC (no reversible), nunca el correo en claro.
 *
 * La clave maestra vive solo en config.php (fuera de public_html): una copia
 * de la base de datos por sí sola no expone ningún dato personal.
 */
final class Cifrado
{
    private const ALGORITMO = 'aes-256-gcm';
    private const VERSION = 'v1';
    private const LARGO_IV = 12;
    private const LARGO_ETIQUETA = 16;
    private const CONTEXTO_CLIENTE = 'centrica-agenda-cliente-v1';
    private const CONTEXTO_HUELLA = 'centrica-agenda-huella-correo-v1';

    private readonly string $maestra;

    public function __construct(string $claveHex)
    {
        if (!preg_match('/^[0-9a-f]{64}$/i', $claveHex)) {
            throw new ConfiguracionInvalida("Falta 'clave_cifrado' en config.php (64 caracteres hexadecimales: openssl rand -hex 32)");
        }
        $this->maestra = (string) hex2bin($claveHex);
    }

    /** "v1:" + base64(IV + etiqueta + texto cifrado) */
    public function cifrar(string $texto, string $campo, string $cliente): string
    {
        $iv = random_bytes(self::LARGO_IV);
        $etiqueta = '';
        $cifrado = openssl_encrypt(
            $texto,
            self::ALGORITMO,
            $this->claveDe($cliente),
            OPENSSL_RAW_DATA,
            $iv,
            $etiqueta,
            self::aad($campo, $cliente),
            self::LARGO_ETIQUETA
        );
        if ($cifrado === false) {
            throw new ErrorDeCifrado('No se pudo cifrar el dato');
        }
        return self::VERSION . ':' . base64_encode($iv . $etiqueta . $cifrado);
    }

    public function descifrar(string $valor, string $campo, string $cliente): string
    {
        $binario = str_starts_with($valor, self::VERSION . ':') ? base64_decode(substr($valor, 3), true) : false;
        if ($binario === false || strlen($binario) < self::LARGO_IV + self::LARGO_ETIQUETA) {
            throw new ErrorDeCifrado('Dato cifrado con formato inválido');
        }
        $texto = openssl_decrypt(
            substr($binario, self::LARGO_IV + self::LARGO_ETIQUETA),
            self::ALGORITMO,
            $this->claveDe($cliente),
            OPENSSL_RAW_DATA,
            substr($binario, 0, self::LARGO_IV),
            substr($binario, self::LARGO_IV, self::LARGO_ETIQUETA),
            self::aad($campo, $cliente)
        );
        if ($texto === false) {
            throw new ErrorDeCifrado('Dato cifrado alterado o clave incorrecta');
        }
        return $texto;
    }

    /** Huella del correo para contar envíos sin guardarlo en claro */
    public function huellaCorreo(string $correo): string
    {
        $clave = hash_hkdf('sha256', $this->maestra, 32, self::CONTEXTO_HUELLA);
        return hash_hmac('sha256', mb_strtolower(trim($correo)), $clave);
    }

    private function claveDe(string $cliente): string
    {
        return hash_hkdf('sha256', $this->maestra, 32, self::CONTEXTO_CLIENTE, $cliente);
    }

    private static function aad(string $campo, string $cliente): string
    {
        return $campo . '|' . $cliente;
    }
}
