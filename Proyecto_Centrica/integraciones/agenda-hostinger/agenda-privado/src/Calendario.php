<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use DateTimeImmutable;
use DateTimeZone;

/**
 * Calendario propio: las citas agendadas en MySQL. Calcula las horas libres de
 * un día dentro del horario de atención, sin fines de semana ni festivos.
 */
final class Calendario
{
    public const SIN_ATENCION = 'no_habil';
    public const FESTIVO = 'festivo';
    public const OCUPADO = 'ocupado';

    public function __construct(private readonly Solicitudes $solicitudes)
    {
    }

    /**
     * Horas libres del día, primero las de la franja que pidió el cliente.
     * @return array{motivo: string, espacios: list<array{inicio: string, enFranja: bool}>}
     */
    public function espaciosLibres(string $fecha, string $franja): array
    {
        $dia = Fechas::local($fecha);
        $motivo = match (true) {
            $dia === null || (int) $dia->format('N') > 5 => self::SIN_ATENCION,
            Festivos::esFestivo($fecha) => self::FESTIVO,
            default => '',
        };
        $espacios = $motivo === '' ? $this->horasLibres($dia, $franja) : [];
        if ($motivo === '' && $espacios === []) {
            $motivo = self::OCUPADO;
        }
        return ['motivo' => $motivo, 'espacios' => $espacios];
    }

    /** @return list<array{inicio: string, enFranja: bool}> */
    private function horasLibres(DateTimeImmutable $dia, string $franjaPedida): array
    {
        $ocupados = $this->iniciosOcupados($dia);
        $minimo = time() + Reglas::ANTELACION_MIN * 60;
        $espacios = [];
        foreach (Reglas::HORARIO as $franja => [$horaInicio, $horaFin]) {
            foreach ($this->iniciosPosibles($dia, $horaInicio, $horaFin) as $inicio) {
                if ($inicio >= $minimo && !self::choca($inicio, $ocupados)) {
                    $espacios[] = [
                        'inicio' => Fechas::iso($inicio),
                        'enFranja' => $franjaPedida === 'cualquiera' || $franjaPedida === $franja,
                    ];
                }
            }
        }
        usort($espacios, static fn(array $a, array $b) => [!$a['enFranja'], $a['inicio']] <=> [!$b['enFranja'], $b['inicio']]);
        return $espacios;
    }

    /** @return list<int> marcas de tiempo de inicio cada PASO_MIN dentro de la franja */
    private function iniciosPosibles(DateTimeImmutable $dia, int $horaInicio, int $horaFin): array
    {
        $primero = $dia->setTime($horaInicio, 0)->getTimestamp();
        $ultimo = $dia->setTime($horaFin, 0)->getTimestamp() - Reglas::DURACION_MIN * 60;
        return range($primero, $ultimo, Reglas::PASO_MIN * 60);
    }

    /** @return list<int> */
    private function iniciosOcupados(DateTimeImmutable $dia): array
    {
        $utc = new DateTimeZone('UTC');
        $desde = $dia->setTimezone($utc)->format(Fechas::FORMATO_ISO);
        $hasta = $dia->modify('+1 day')->setTimezone($utc)->format(Fechas::FORMATO_ISO);
        return array_map(
            static fn(string $iso) => (new DateTimeImmutable($iso))->getTimestamp(),
            $this->solicitudes->iniciosAgendados($desde, $hasta)
        );
    }

    /** @param list<int> $ocupados */
    private static function choca(int $inicio, array $ocupados): bool
    {
        $duracion = Reglas::DURACION_MIN * 60;
        foreach ($ocupados as $otro) {
            if ($inicio < $otro + $duracion && $inicio + $duracion > $otro) {
                return true;
            }
        }
        return false;
    }
}
