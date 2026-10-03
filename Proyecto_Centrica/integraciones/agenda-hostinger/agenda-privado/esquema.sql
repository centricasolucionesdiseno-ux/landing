-- Tabla de solicitudes de cita. Ejecutar una vez en phpMyAdmin (hPanel ->
-- Bases de datos -> phpMyAdmin -> pestaña SQL).
-- Los tokens de los enlaces se guardan como hash SHA-256: quien lea la base de
-- datos no puede confirmar ni aprobar solicitudes.

CREATE TABLE IF NOT EXISTS agenda_solicitudes (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  publico CHAR(32) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  token_confirmar CHAR(64) NOT NULL,
  token_gestion CHAR(64) NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  correo VARCHAR(120) NOT NULL,
  empresa VARCHAR(100) NOT NULL,
  cargo VARCHAR(40) NOT NULL DEFAULT '',
  servicio VARCHAR(60) NOT NULL DEFAULT '',
  mensaje TEXT NOT NULL,
  fecha DATE NOT NULL,
  franja VARCHAR(12) NOT NULL,
  ip_hash CHAR(64) NOT NULL,
  creada_en DATETIME NOT NULL,
  confirmada_en DATETIME NULL,
  resuelta_en DATETIME NULL,
  inicio VARCHAR(30) NULL,
  enlace VARCHAR(200) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_publico (publico),
  -- Dos citas no pueden quedar a la misma hora (el calendario es esta tabla)
  UNIQUE KEY uk_inicio (inicio),
  KEY ix_token_confirmar (token_confirmar),
  KEY ix_token_gestion (token_gestion),
  KEY ix_correo (correo, creada_en),
  KEY ix_ip (ip_hash, creada_en),
  KEY ix_creada (creada_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
