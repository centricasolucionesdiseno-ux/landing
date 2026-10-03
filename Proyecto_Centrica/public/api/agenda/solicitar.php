<?php

// Recibe el formulario "Agenda tu cita" y envía el correo de confirmación.
// La lógica está en agenda-privado/src/Acciones/SolicitarCita.php (fuera de public_html).

declare(strict_types=1);

use Centrica\Agenda\Acciones\SolicitarCita;
use Centrica\Agenda\Aplicacion;

require_once (getenv('AGENDA_PRIVADO') ?: dirname(__DIR__, 3) . '/agenda-privado') . '/autoload.php';

(new SolicitarCita(Aplicacion::iniciar(esApi: true)))->atender();
