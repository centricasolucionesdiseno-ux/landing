<?php

// Recibe el mensaje para el gerente desde el chat de Nebulina y lo envía a su correo.
// La lógica está en agenda-privado/src/Acciones/EnviarMensaje.php (fuera de public_html).

declare(strict_types=1);

use Centrica\Agenda\Acciones\EnviarMensaje;
use Centrica\Agenda\Aplicacion;

require_once (getenv('AGENDA_PRIVADO') ?: dirname(__DIR__, 3) . '/agenda-privado') . '/autoload.php';

(new EnviarMensaje(Aplicacion::iniciar(esApi: true)))->atender();
