<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Topes de envíos por IP, por correo y en total por día. */
final class Limites
{
    public function __construct(
        public readonly int $porIpHora,
        public readonly int $porIpDia,
        public readonly int $porCorreoDia,
        public readonly int $globalDia
    ) {
    }

    /** Solicitudes de cita */
    public static function agenda(): self
    {
        return new self(porIpHora: 3, porIpDia: 6, porCorreoDia: 3, globalDia: 30);
    }

    /** Mensajes al gerente desde el chat de Nebulina */
    public static function chat(): self
    {
        return new self(porIpHora: 3, porIpDia: 6, porCorreoDia: 3, globalDia: 40);
    }
}
