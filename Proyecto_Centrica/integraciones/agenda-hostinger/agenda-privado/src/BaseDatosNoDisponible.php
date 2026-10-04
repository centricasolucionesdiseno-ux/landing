<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use RuntimeException;

/** No hay conexión con la base de datos. El mensaje nunca incluye credenciales. */
final class BaseDatosNoDisponible extends RuntimeException
{
}
