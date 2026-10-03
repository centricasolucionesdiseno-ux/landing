<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use RuntimeException;

/** Otra cita ya quedó agendada a esa hora (índice único sobre 'inicio'). */
final class HoraOcupada extends RuntimeException
{
}
