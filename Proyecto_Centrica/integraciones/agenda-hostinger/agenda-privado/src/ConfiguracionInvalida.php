<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use RuntimeException;

/** Falta config.php o no tiene el formato esperado. */
final class ConfiguracionInvalida extends RuntimeException
{
}
