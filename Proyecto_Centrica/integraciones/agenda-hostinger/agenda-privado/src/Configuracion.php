<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Valores de config.php (credenciales y datos del entorno). */
final class Configuracion
{
    /** @param array<string, mixed> $valores */
    public function __construct(private readonly array $valores)
    {
    }

    public static function desdeArchivo(string $ruta): self
    {
        if (!is_file($ruta)) {
            throw new ConfiguracionInvalida("Falta el archivo de configuración: $ruta");
        }
        $valores = require_once $ruta;
        if (!is_array($valores)) {
            throw new ConfiguracionInvalida("config.php debe devolver un arreglo: $ruta");
        }
        return new self($valores);
    }

    public function valor(string $clave, mixed $porDefecto = null): mixed
    {
        return $this->valores[$clave] ?? $porDefecto;
    }

    public function texto(string $clave): string
    {
        return (string) $this->valor($clave, '');
    }

    /** @return list<string> */
    public function lista(string $clave): array
    {
        return array_values((array) $this->valor($clave, []));
    }
}
