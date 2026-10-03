<?php

// Página del gerente para aprobar o rechazar una solicitud.
// La lógica está en agenda-privado/src/Acciones/GestionarSolicitud.php (fuera de public_html).

declare(strict_types=1);

use Centrica\Agenda\Acciones\GestionarSolicitud;
use Centrica\Agenda\Aplicacion;

require_once (getenv('AGENDA_PRIVADO') ?: dirname(__DIR__, 3) . '/agenda-privado') . '/autoload.php';

(new GestionarSolicitud(Aplicacion::iniciar()))->atender();
