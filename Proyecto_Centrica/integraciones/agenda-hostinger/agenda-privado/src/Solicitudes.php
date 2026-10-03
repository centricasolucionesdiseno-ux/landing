<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use PDO;
use PDOException;

/**
 * Acceso a la tabla agenda_solicitudes. Estados:
 * por_confirmar -> por_aprobar -> agendada | rechazada
 */
final class Solicitudes
{
    public const POR_CONFIRMAR = 'por_confirmar';
    public const POR_APROBAR = 'por_aprobar';
    public const AGENDADA = 'agendada';
    public const RECHAZADA = 'rechazada';
    private const VIOLACION_UNICA = '23000';

    public function __construct(private readonly BaseDatos $bd)
    {
    }

    /** @param array<string, string> $datos datos ya validados del formulario */
    public function crear(array $datos, string $hashConfirmar, string $ipHash): int
    {
        $this->bd->consulta(
            'INSERT INTO agenda_solicitudes (publico, estado, token_confirmar, token_gestion, nombre, correo, empresa, cargo,
             servicio, mensaje, fecha, franja, ip_hash, creada_en) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                bin2hex(random_bytes(16)), self::POR_CONFIRMAR, $hashConfirmar, Token::hash(Token::nuevo()),
                $datos['nombre'], $datos['correo'], $datos['empresa'], $datos['cargo'], $datos['servicio'],
                $datos['mensaje'], $datos['fecha'], $datos['franja'], $ipHash, Fechas::utc(),
            ]
        );
        return $this->bd->ultimoId();
    }

    public function borrar(int $id): void
    {
        $this->bd->consulta('DELETE FROM agenda_solicitudes WHERE id = ?', [$id]);
    }

    /** @return array<string, mixed>|null */
    public function porTokenConfirmar(mixed $token): ?array
    {
        return $this->porToken('token_confirmar', $token);
    }

    /** @return array<string, mixed>|null */
    public function porTokenGestion(mixed $token): ?array
    {
        return $this->porToken('token_gestion', $token);
    }

    public function contarCreadasDesde(string $desde): int
    {
        return $this->contar('creada_en >= ?', [$desde]);
    }

    public function contarPorIpDesde(string $ipHash, string $desde): int
    {
        return $this->contar('ip_hash = ? AND creada_en >= ?', [$ipHash, $desde]);
    }

    public function contarPorCorreoDesde(string $correo, string $desde): int
    {
        return $this->contar('correo = ? AND creada_en >= ?', [$correo, $desde]);
    }

    public function borrarSinConfirmarAntesDe(string $fecha): void
    {
        $this->bd->consulta('DELETE FROM agenda_solicitudes WHERE estado = ? AND creada_en < ?', [self::POR_CONFIRMAR, $fecha]);
    }

    /** Pasa a 'por_aprobar' con un nuevo token para el gerente. Falso si ya estaba confirmada. */
    public function confirmar(int $id, string $hashGestion): bool
    {
        return $this->cambiarEstado(
            'estado = ?, confirmada_en = ?, token_gestion = ?',
            [self::POR_APROBAR, Fechas::utc(), $hashGestion],
            $id,
            self::POR_CONFIRMAR
        );
    }

    public function deshacerConfirmacion(int $id): void
    {
        $this->bd->consulta('UPDATE agenda_solicitudes SET estado = ?, confirmada_en = NULL WHERE id = ?', [self::POR_CONFIRMAR, $id]);
    }

    public function rechazar(int $id): bool
    {
        return $this->cambiarEstado('estado = ?, resuelta_en = ?', [self::RECHAZADA, Fechas::utc()], $id, self::POR_APROBAR);
    }

    /** @throws HoraOcupada si otra cita ya tiene esa hora */
    public function agendar(int $id, string $inicio, string $enlace): bool
    {
        try {
            return $this->cambiarEstado(
                'estado = ?, inicio = ?, enlace = ?, resuelta_en = ?',
                [self::AGENDADA, $inicio, $enlace, Fechas::utc()],
                $id,
                self::POR_APROBAR
            );
        } catch (PDOException $error) {
            if ($error->getCode() === self::VIOLACION_UNICA) {
                throw new HoraOcupada('La hora ya tiene otra cita', 0, $error);
            }
            throw $error;
        }
    }

    /** @return list<string> inicios (ISO, UTC) de las citas agendadas en el rango */
    public function iniciosAgendados(string $desde, string $hasta): array
    {
        return $this->bd->consulta(
            'SELECT inicio FROM agenda_solicitudes WHERE estado = ? AND inicio >= ? AND inicio < ?',
            [self::AGENDADA, $desde, $hasta]
        )->fetchAll(PDO::FETCH_COLUMN);
    }

    /** @return array<string, mixed>|null */
    private function porToken(string $columna, mixed $token): ?array
    {
        if (!Token::esValido($token)) {
            return null;
        }
        $fila = $this->bd->consulta("SELECT * FROM agenda_solicitudes WHERE $columna = ?", [Token::hash($token)])->fetch();
        return $fila ?: null;
    }

    /** @param list<mixed> $parametros */
    private function contar(string $condicion, array $parametros): int
    {
        return (int) $this->bd->consulta("SELECT COUNT(*) FROM agenda_solicitudes WHERE $condicion", $parametros)->fetchColumn();
    }

    /**
     * Cambia la fila solo si sigue en el estado esperado: un doble clic o dos
     * pestañas abiertas no aplican el mismo cambio dos veces.
     * @param list<mixed> $valores
     */
    private function cambiarEstado(string $asignaciones, array $valores, int $id, string $estadoActual): bool
    {
        return $this->bd->consulta(
            "UPDATE agenda_solicitudes SET $asignaciones WHERE id = ? AND estado = ?",
            [...$valores, $id, $estadoActual]
        )->rowCount() === 1;
    }
}
