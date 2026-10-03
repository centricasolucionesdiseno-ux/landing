<?php

// Enlace del correo de confirmación del visitante.
// La lógica está en agenda-privado/src/Acciones/ConfirmarSolicitud.php (fuera de public_html).

declare(strict_types=1);

use Centrica\Agenda\Acciones\ConfirmarSolicitud;
use Centrica\Agenda\Aplicacion;

require_once (getenv('AGENDA_PRIVADO') ?: dirname(__DIR__, 3) . '/agenda-privado') . '/autoload.php';

(new ConfirmarSolicitud(Aplicacion::iniciar()))->atender();
