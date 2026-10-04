<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use Throwable;

/**
 * Punto de arranque y contenedor de servicios: crea cada servicio una sola vez
 * y solo cuando se necesita (una página que no consulta la base de datos no
 * abre conexión).
 */
final class Aplicacion
{
    private ?BaseDatos $bd = null;
    private ?Solicitudes $solicitudes = null;
    private ?Correo $correo = null;
    private ?Cifrado $cifrado = null;

    private function __construct(
        public readonly Configuracion $config,
        public readonly Peticion $peticion,
        public readonly Respuesta $respuesta
    ) {
    }

    /** @param bool $esApi true para el formulario (responde JSON), false para páginas */
    public static function iniciar(bool $esApi = false): self
    {
        // Ningún error se muestra al visitante, y las trazas nunca incluyen
        // argumentos (podrían contener contraseñas o datos personales)
        ini_set('display_errors', '0');
        ini_set('zend.exception_ignore_args', '1');
        ini_set('expose_php', '0');
        $config = Configuracion::desdeArchivo(dirname(__DIR__) . '/config.php');
        $app = new self($config, Peticion::actual((bool) $config->valor('detras_de_cloudflare', false)), new Respuesta($esApi));
        set_exception_handler($app->manejarError(...));
        return $app;
    }

    /**
     * Error inesperado: se registra solo el tipo, el mensaje y el lugar (sin
     * traza ni datos de la petición) y el visitante recibe un mensaje genérico.
     */
    public function manejarError(Throwable $error): never
    {
        error_log(sprintf('agenda: %s: %s (%s:%d)', $error::class, $error->getMessage(), basename($error->getFile()), $error->getLine()));
        $this->respuesta->errorInterno();
    }

    public function solicitudes(): Solicitudes
    {
        return $this->solicitudes ??= new Solicitudes($this->baseDatos(), $this->cifrado());
    }

    public function mensajes(): Mensajes
    {
        return new Mensajes($this->baseDatos(), $this->cifrado());
    }

    /** Candados entre peticiones simultáneas (en la carpeta privada, fuera de public_html) */
    public function bloqueo(): Bloqueo
    {
        return new Bloqueo(dirname(__DIR__));
    }

    private function cifrado(): Cifrado
    {
        return $this->cifrado ??= new Cifrado($this->config->texto('clave_cifrado'));
    }

    private function baseDatos(): BaseDatos
    {
        return $this->bd ??= new BaseDatos($this->config);
    }

    public function correo(): Correo
    {
        return $this->correo ??= new Correo($this->config);
    }

    public function calendario(): Calendario
    {
        return new Calendario($this->solicitudes());
    }

    public function antiabuso(): Antiabuso
    {
        return new Antiabuso($this->config, new ClienteHttp());
    }

    public function invitacion(): Invitacion
    {
        return new Invitacion($this->config);
    }

    public function correoGerente(): string
    {
        return $this->config->texto('correo_gerente');
    }

    /** URL absoluta del sitio para los enlaces de los correos */
    public function url(string $ruta): string
    {
        return rtrim($this->config->texto('sitio'), '/') . $ruta;
    }
}
