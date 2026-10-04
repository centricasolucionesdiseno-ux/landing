<?php

declare(strict_types=1);

namespace Centrica\Agenda;

/**
 * Registro mínimo de los mensajes enviados desde el chat: solo lo necesario
 * para aplicar los límites (el contenido viaja únicamente por correo al
 * gerente, cifrado en tránsito con TLS).
 */
final class Mensajes implements RegistroDeEnvios
{
    public function __construct(private readonly BaseDatos $bd, private readonly Cifrado $cifrado)
    {
    }

    /** Solo la huella del correo (no reversible): aquí no se guarda ningún dato personal */
    public function registrar(string $correo, string $ipHash): int
    {
        $this->bd->consulta(
            'INSERT INTO nebulina_mensajes (correo_huella, ip_hash, creada_en) VALUES (?, ?, ?)',
            [$this->cifrado->huellaCorreo($correo), $ipHash, Fechas::utc()]
        );
        return $this->bd->ultimoId();
    }

    public function borrar(int $id): void
    {
        $this->bd->consulta('DELETE FROM nebulina_mensajes WHERE id = ?', [$id]);
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
        return $this->contar('correo_huella = ? AND creada_en >= ?', [$this->cifrado->huellaCorreo($correo), $desde]);
    }

    /** @param list<string> $parametros */
    private function contar(string $condicion, array $parametros): int
    {
        return (int) $this->bd->consulta("SELECT COUNT(*) FROM nebulina_mensajes WHERE $condicion", $parametros)->fetchColumn();
    }
}
