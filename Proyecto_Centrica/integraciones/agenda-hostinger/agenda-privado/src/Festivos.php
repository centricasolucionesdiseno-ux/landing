<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use DateTimeImmutable;

/** Festivos de Colombia para cualquier año (Ley 51 de 1983, "Ley Emiliani"). */
final class Festivos
{
    /** Fechas que no se trasladan */
    private const FIJOS = ['01-01', '05-01', '07-20', '08-07', '12-08', '12-25'];
    /** Se trasladan al lunes siguiente si no caen en lunes */
    private const TRASLADABLES = ['01-06', '03-19', '06-29', '08-15', '10-12', '11-01', '11-11'];
    /** Días respecto al Domingo de Pascua: Jueves y Viernes Santo, Ascensión, Corpus Christi y Sagrado Corazón (ya trasladados a lunes) */
    private const DESDE_PASCUA = [-3, -2, 43, 64, 71];

    /** @var array<int, list<string>> */
    private static array $cache = [];

    private function __construct()
    {
        // Solo métodos estáticos: no se instancia
    }

    public static function esFestivo(string $fecha): bool
    {
        return in_array($fecha, self::delAnio((int) substr($fecha, 0, 4)), true);
    }

    /** @return list<string> fechas 'Y-m-d' */
    public static function delAnio(int $anio): array
    {
        if (!isset(self::$cache[$anio])) {
            $fecha = static fn(string $mesDia) => new DateTimeImmutable("$anio-$mesDia", Fechas::zona());
            $alLunes = static fn(DateTimeImmutable $dia) => $dia->format('N') === '1' ? $dia : $dia->modify('next monday');
            $pascua = self::pascua($anio);

            $dias = [
                ...array_map($fecha, self::FIJOS),
                ...array_map(static fn(string $mesDia) => $alLunes($fecha($mesDia)), self::TRASLADABLES),
                ...array_map(static fn(int $dias) => $pascua->modify("$dias days"), self::DESDE_PASCUA),
            ];
            self::$cache[$anio] = array_map(static fn(DateTimeImmutable $dia) => $dia->format('Y-m-d'), $dias);
        }
        return self::$cache[$anio];
    }

    /** Domingo de Pascua (algoritmo de Meeus/Jones/Butcher, calendario gregoriano) */
    private static function pascua(int $anio): DateTimeImmutable
    {
        $a = $anio % 19;
        $b = intdiv($anio, 100);
        $c = $anio % 100;
        $d = intdiv($b, 4);
        $e = $b % 4;
        $f = intdiv($b + 8, 25);
        $g = intdiv($b - $f + 1, 3);
        $h = (19 * $a + $b - $d - $g + 15) % 30;
        $i = intdiv($c, 4);
        $k = $c % 4;
        $l = (32 + 2 * $e + 2 * $i - $h - $k) % 7;
        $m = intdiv($a + 11 * $h + 22 * $l, 451);
        $mes = intdiv($h + $l - 7 * $m + 114, 31);
        $dia = (($h + $l - 7 * $m + 114) % 31) + 1;
        return new DateTimeImmutable(sprintf('%04d-%02d-%02d', $anio, $mes, $dia), Fechas::zona());
    }
}
