<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use DateTimeImmutable;
use DateTimeZone;

/**
 * Fechas en hora de Colombia y su formato legible en español (sin depender de
 * la extensión intl). En la base de datos las marcas de tiempo van en UTC.
 */
final class Fechas
{
    public const ZONA = 'America/Bogota';
    /** Inicio de una cita: '2026-10-05T13:00:00Z' */
    public const FORMATO_ISO = 'Y-m-d\TH:i:s\Z';
    public const ISO_RE = '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/';
    private const FORMATO_BD = 'Y-m-d H:i:s';
    private const DIAS = [1 => 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    private const MESES = [
        1 => 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
    ];

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    public static function zona(): DateTimeZone
    {
        return new DateTimeZone(self::ZONA);
    }

    public static function hoy(): DateTimeImmutable
    {
        return new DateTimeImmutable('today', self::zona());
    }

    /** 'Y-m-d' a medianoche en Colombia, o null si la fecha no existe */
    public static function local(string $fecha): ?DateTimeImmutable
    {
        $dia = DateTimeImmutable::createFromFormat('!Y-m-d', $fecha, self::zona());
        return $dia && $dia->format('Y-m-d') === $fecha ? $dia : null;
    }

    /** Marca de tiempo para la base de datos (UTC), opcionalmente en el pasado */
    public static function utc(int $segundosAtras = 0): string
    {
        return gmdate(self::FORMATO_BD, time() - $segundosAtras);
    }

    public static function iso(int $marcaDeTiempo): string
    {
        return gmdate(self::FORMATO_ISO, $marcaDeTiempo);
    }

    /** "8:30 a. m." */
    public static function hora(string $iso): string
    {
        $fecha = self::aColombia($iso);
        return $fecha->format('g:i') . ((int) $fecha->format('G') < 12 ? ' a. m.' : ' p. m.');
    }

    /** "lunes 6 de octubre" o, con hora, "lunes 6 de octubre, 9:30 a. m." */
    public static function legible(string $isoOFecha, bool $conHora = false): string
    {
        $fecha = self::aColombia($isoOFecha);
        $texto = self::DIAS[(int) $fecha->format('N')] . ' ' . $fecha->format('j') . ' de ' . self::MESES[(int) $fecha->format('n')];
        return $conHora ? $texto . ', ' . self::hora($isoOFecha) : $texto;
    }

    private static function aColombia(string $isoOFecha): DateTimeImmutable
    {
        return self::local($isoOFecha) ?? (new DateTimeImmutable($isoOFecha))->setTimezone(self::zona());
    }
}
