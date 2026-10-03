<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use PDO;
use PDOStatement;

/** Conexión PDO (MySQL en Hostinger, SQLite en pruebas locales) con consultas preparadas. */
final class BaseDatos
{
    private readonly PDO $pdo;

    public function __construct(Configuracion $config)
    {
        $this->pdo = new PDO($config->texto('db_dsn'), $config->valor('db_usuario'), $config->valor('db_clave'), [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    /** @param list<mixed> $parametros */
    public function consulta(string $sql, array $parametros = []): PDOStatement
    {
        $sentencia = $this->pdo->prepare($sql);
        $sentencia->execute($parametros);
        return $sentencia;
    }

    public function ultimoId(): int
    {
        return (int) $this->pdo->lastInsertId();
    }
}
