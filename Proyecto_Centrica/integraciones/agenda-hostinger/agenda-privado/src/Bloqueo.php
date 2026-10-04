<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Exclusión mutua entre peticiones simultáneas (flock sobre un archivo fuera
 * de public_html). Hace atómico "contar envíos + registrar el nuevo": sin
 * esto, muchas peticiones a la vez pasarían el límite antes de que se
 * registrara la primera.
 */
final class Bloqueo
{
    private const CARPETA = 'bloqueos';

    public function __construct(private readonly string $carpetaBase)
    {
    }

    /**
     * Ejecuta $tarea con el candado tomado y lo suelta siempre, aunque falle.
     * @template T
     * @param callable(): T $tarea
     * @return T
     */
    public function conCandado(string $nombre, callable $tarea): mixed
    {
        $archivo = fopen($this->ruta($nombre), 'c');
        if ($archivo === false || !flock($archivo, LOCK_EX)) {
            throw new BaseDatosNoDisponible('No se pudo tomar el candado de envíos');
        }
        try {
            return $tarea();
        } finally {
            flock($archivo, LOCK_UN);
            fclose($archivo);
        }
    }

    private function ruta(string $nombre): string
    {
        $carpeta = rtrim($this->carpetaBase, '/') . '/' . self::CARPETA;
        if (!is_dir($carpeta) && !mkdir($carpeta, 0700, true) && !is_dir($carpeta)) {
            throw new BaseDatosNoDisponible('No se pudo crear la carpeta de candados');
        }
        return $carpeta . '/' . preg_replace('/[^a-z0-9_-]/', '', $nombre) . '.lock';
    }
}
