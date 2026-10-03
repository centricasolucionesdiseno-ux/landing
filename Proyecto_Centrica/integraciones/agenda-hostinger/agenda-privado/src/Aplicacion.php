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
    private ?Solicitudes $solicitudes = null;
    private ?Correo $correo = null;

    private function __construct(
        public readonly Configuracion $config,
        public readonly Peticion $peticion,
        public readonly Respuesta $respuesta
    ) {
    }

    /** @param bool $esApi true para el formulario (responde JSON), false para páginas */
    public static function iniciar(bool $esApi = false): self
    {
        ini_set('display_errors', '0');
        $app = new self(Configuracion::desdeArchivo(dirname(__DIR__) . '/config.php'), Peticion::actual(), new Respuesta($esApi));
        set_exception_handler($app->manejarError(...));
        return $app;
    }

    /** Error inesperado: se registra y se responde un mensaje genérico */
    public function manejarError(Throwable $error): never
    {
        error_log('agenda: ' . $error);
        $this->respuesta->errorInterno();
    }

    public function solicitudes(): Solicitudes
    {
        return $this->solicitudes ??= new Solicitudes(new BaseDatos($this->config));
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
        return new Antiabuso($this->config, $this->solicitudes(), new ClienteHttp());
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
