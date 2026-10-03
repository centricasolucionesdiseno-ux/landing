<?php
/**
 * Copia este archivo como config.php (en la misma carpeta, FUERA de public_html)
 * y llena los valores. config.php nunca se sube al repositorio.
 */
return [
    // URL pública del sitio (enlaces de los correos)
    'sitio' => 'https://centricasoluciones.com',
    // Dominios desde los que se acepta el formulario (cabecera Origin y Turnstile)
    'dominios' => ['centricasoluciones.com', 'www.centricasoluciones.com'],

    // Base de datos MySQL de Hostinger (hPanel -> Bases de datos -> MySQL)
    'db_dsn' => 'mysql:host=localhost;dbname=u000000000_agenda;charset=utf8mb4',
    'db_usuario' => 'u000000000_agenda',
    'db_clave' => '',

    // Correo de Hostinger (hPanel -> Correos). El buzón que envía los avisos.
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_puerto' => 465, // SSL
    'smtp_usuario' => 'agenda@centricasoluciones.com',
    'smtp_clave' => '',
    'remitente_nombre' => 'Céntrica',

    // A quién le llegan las solicitudes confirmadas para aprobar (y la invitación .ics)
    'correo_gerente' => 'gerenciacomercial@centricasoluciones.com',

    // Cloudflare Turnstile: clave SECRETA (la pública va en VITE_TURNSTILE_SITEKEY)
    'turnstile_secreto' => '',
    // Solo para pruebas locales: aceptar solicitudes sin Turnstile. En producción, false.
    'permitir_sin_turnstile' => false,

    // Clave para anonimizar las IP antes de guardarlas. openssl rand -hex 32
    'sal_ip' => '',
];
