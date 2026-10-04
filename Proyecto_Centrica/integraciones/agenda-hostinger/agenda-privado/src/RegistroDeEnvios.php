<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Envíos que cuentan para los límites anti-abuso (solicitudes de cita, mensajes del chat). */
interface RegistroDeEnvios
{
    public function contarCreadasDesde(string $desde): int;

    public function contarPorIpDesde(string $ipHash, string $desde): int;

    public function contarPorCorreoDesde(string $correo, string $desde): int;
}
