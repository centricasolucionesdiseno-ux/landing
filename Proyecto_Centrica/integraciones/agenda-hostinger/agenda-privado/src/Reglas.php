<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Reglas de negocio de la agenda. Las listas y límites que ve el visitante
 * deben coincidir con src/config/agenda.js del sitio.
 */
final class Reglas
{
    public const SERVICIOS = [
        'Fábrica de software', 'Nebula ERP', 'Sicovi', 'Soluciones de IA',
        'Evaluaciones de calidad', 'Consultoría digital', 'Otro',
    ];
    public const CARGOS = ['CEO', 'CTO', 'Director TI', 'Gerente', 'Otro'];
    public const FRANJAS = [
        'manana' => 'Mañana (8:00 a 12:00 m.)',
        'tarde' => 'Tarde (2:00 a 6:00 p. m.)',
        'cualquiera' => 'Cualquier hora',
    ];

    /** Horario de atención por franja, lunes a viernes: [hora inicio, hora fin) */
    public const HORARIO = ['manana' => [8, 12], 'tarde' => [14, 18]];
    public const DURACION_MIN = 30;
    public const PASO_MIN = 30;
    /** Al aprobar, la cita debe empezar al menos dentro de este tiempo */
    public const ANTELACION_MIN = 60;
    public const MAX_DIAS_ADELANTE = 90;
    /** Plazo de respuesta que se le comunica al visitante */
    public const RESPUESTA_DIAS_HABILES = 2;
    /** Vigencia del enlace de confirmación */
    public const HORAS_CONFIRMAR = 24;
    /** Las solicitudes no confirmadas se borran pasado este tiempo (minimización de datos) */
    public const DIAS_BORRAR_SIN_CONFIRMAR = 7;

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }
}
