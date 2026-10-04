<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use RuntimeException;

/** No se pudo cifrar o descifrar un dato (clave incorrecta o dato alterado). */
final class ErrorDeCifrado extends RuntimeException
{
}
