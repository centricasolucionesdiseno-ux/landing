<?php

/**
 * Carga automática de clases (PSR-4) sin Composer:
 *   Centrica\Agenda\*     -> src/
 *   PHPMailer\PHPMailer\* -> PHPMailer/
 */

declare(strict_types=1);

spl_autoload_register(static function (string $clase): void {
    $prefijos = [
        'Centrica\\Agenda\\' => __DIR__ . '/src/',
        'PHPMailer\\PHPMailer\\' => __DIR__ . '/PHPMailer/',
    ];
    foreach ($prefijos as $prefijo => $carpeta) {
        if (!str_starts_with($clase, $prefijo)) {
            continue;
        }
        $archivo = $carpeta . str_replace('\\', '/', substr($clase, strlen($prefijo))) . '.php';
        if (is_file($archivo)) {
            require_once $archivo;
        }
        return;
    }
});
