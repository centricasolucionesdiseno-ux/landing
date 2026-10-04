<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Registro mínimo de los mensajes enviados desde el chat: solo lo necesario
 * para aplicar los límites (el contenido viaja únicamente por correo al gerente).
 */
final class Mensajes implements RegistroDeEnvios
{
    public function __construct(private readonly BaseDatos $bd)
    {
    }

    public function registrar(string $correo, string $ipHash): void
    {
        $this->bd->consulta('INSERT INTO nebulina_mensajes (correo, ip_hash, creada_en) VALUES (?, ?, ?)', [$correo, $ipHash, Fechas::utc()]);
    }

    public function borrarAntesDe(string $fecha): void
    {
        $this->bd->consulta('DELETE FROM nebulina_mensajes WHERE creada_en < ?', [$fecha]);
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

    /** @param list<string> $parametros */
    private function contar(string $condicion, array $parametros): int
    {
        return (int) $this->bd->consulta("SELECT COUNT(*) FROM nebulina_mensajes WHERE $condicion", $parametros)->fetchColumn();
    }
}
