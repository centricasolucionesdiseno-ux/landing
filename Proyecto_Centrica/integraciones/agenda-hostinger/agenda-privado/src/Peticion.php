<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Datos de la petición HTTP actual (aísla las variables globales de PHP). */
final class Peticion
{
    /**
     * @param array<string, mixed> $consulta  parámetros de la URL ($_GET)
     * @param array<string, mixed> $formulario campos enviados por POST ($_POST)
     * @param array<string, mixed> $servidor  $_SERVER
     */
    public function __construct(
        private readonly array $consulta,
        private readonly array $formulario,
        private readonly array $servidor
    ) {
    }

    public static function actual(): self
    {
        return new self($_GET, $_POST, $_SERVER);
    }

    public function metodo(): string
    {
        return (string) ($this->servidor['REQUEST_METHOD'] ?? '');
    }

    public function esPost(): bool
    {
        return $this->metodo() === 'POST';
    }

    public function campo(string $nombre): mixed
    {
        return $this->formulario[$nombre] ?? null;
    }

    /** Token del enlace: en la URL (GET) o en el formulario de la página (POST) */
    public function token(): mixed
    {
        return $this->esPost() ? $this->campo('t') : ($this->consulta['t'] ?? null);
    }

    public function origen(): string
    {
        return (string) ($this->servidor['HTTP_ORIGIN'] ?? '');
    }

    public function ip(): string
    {
        return (string) ($this->servidor['REMOTE_ADDR'] ?? '');
    }

    /** Cuerpo crudo, leyendo como máximo $maximo + 1 bytes para detectar si se pasa */
    public function cuerpo(int $maximo): string
    {
        return (string) file_get_contents('php://input', false, null, 0, $maximo + 1);
    }
}
