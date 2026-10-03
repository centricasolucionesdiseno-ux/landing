<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/** Valida y normaliza los datos del formulario (el servidor nunca confía en el navegador). */
final class Validador
{
    /**
     * @param array<string, mixed> $entrada
     * @return array{0: array<string, string>, 1: string} datos limpios y primer error ('' si no hay)
     */
    public function validar(array $entrada): array
    {
        $datos = [
            'nombre' => Texto::limpiar($entrada['nombre'] ?? '', 80),
            'correo' => mb_strtolower(Texto::limpiar($entrada['correo'] ?? '', 120)),
            'empresa' => Texto::limpiar($entrada['empresa'] ?? '', 100),
            'cargo' => Texto::limpiar($entrada['cargo'] ?? '', 40),
            'servicio' => Texto::limpiar($entrada['servicio'] ?? '', 60),
            'mensaje' => Texto::limpiar($entrada['mensaje'] ?? '', 1000, true),
            'fecha' => Texto::limpiar($entrada['fecha'] ?? '', 10),
            'franja' => Texto::limpiar($entrada['franja'] ?? '', 12),
        ];
        return [$datos, $this->primerError($datos, ($entrada['acepta'] ?? false) === true)];
    }

    /** @param array<string, string> $d */
    private function primerError(array $d, bool $acepta): string
    {
        return match (true) {
            mb_strlen($d['nombre']) < 2 => 'Escribe tu nombre completo.',
            !filter_var($d['correo'], FILTER_VALIDATE_EMAIL) => 'El correo no es válido.',
            mb_strlen($d['empresa']) < 2 => 'Escribe el nombre de tu empresa.',
            !self::enLista($d['cargo'], Reglas::CARGOS) => 'Elige un cargo de la lista.',
            !self::enLista($d['servicio'], Reglas::SERVICIOS) => 'Elige un servicio de la lista.',
            mb_strlen($d['mensaje']) < 10 => 'Cuéntanos el motivo de la cita (mínimo 10 caracteres).',
            !array_key_exists($d['franja'], Reglas::FRANJAS) => 'Elige una franja horaria.',
            !$acepta => 'Debes aceptar el tratamiento de datos personales.',
            default => $this->errorFecha($d['fecha']),
        };
    }

    /** Día hábil (lunes a viernes) entre mañana y MAX_DIAS_ADELANTE */
    private function errorFecha(string $fecha): string
    {
        $dia = Fechas::local($fecha);
        $hoy = Fechas::hoy();
        return match (true) {
            $dia === null => 'Elige la fecha de la cita.',
            $dia <= $hoy => 'Elige una fecha a partir de mañana.',
            $dia > $hoy->modify('+' . Reglas::MAX_DIAS_ADELANTE . ' days') => 'Solo se puede agendar hasta ' . Reglas::MAX_DIAS_ADELANTE . ' días adelante.',
            (int) $dia->format('N') > 5 => 'Elige un día de lunes a viernes.',
            default => '',
        };
    }

    /** Campo opcional: vacío o uno de los valores permitidos */
    private static function enLista(string $valor, array $permitidos): bool
    {
        return $valor === '' || in_array($valor, $permitidos, true);
    }
}
