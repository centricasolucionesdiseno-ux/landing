<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use PHPMailer\PHPMailer\PHPMailer;
use Throwable;

/** Envío de correos por el SMTP de Hostinger (PHPMailer). */
final class Correo
{
    private const PUERTO_SSL = 465;

    public function __construct(private readonly Configuracion $config)
    {
    }

    /**
     * @param string $ics invitación de calendario a adjuntar (opcional)
     * @return bool falso si el servidor de correo rechazó el envío (queda en el log)
     */
    public function enviar(string $para, string $asunto, string $html, string $texto, string $responderA = '', string $ics = ''): bool
    {
        $carpetaPruebas = $this->config->texto('correos_prueba_dir');
        if ($carpetaPruebas !== '') {
            return $this->guardarParaPruebas($carpetaPruebas, compact('para', 'asunto', 'texto', 'html', 'responderA', 'ics'));
        }
        try {
            $correo = $this->nuevoCorreo();
            $correo->addAddress($para);
            if ($responderA !== '') {
                $correo->addReplyTo($responderA);
            }
            $correo->Subject = $asunto;
            $correo->isHTML();
            $correo->Body = $html;
            $correo->AltBody = $texto;
            if ($ics !== '') {
                $correo->addStringAttachment($ics, 'invitacion.ics', PHPMailer::ENCODING_BASE64, 'text/calendar; charset=UTF-8; method=REQUEST');
            }
            return $correo->send();
        } catch (Throwable $error) {
            error_log('agenda correo: ' . $error->getMessage());
            return false;
        }
    }

    private function nuevoCorreo(): PHPMailer
    {
        $puerto = (int) $this->config->valor('smtp_puerto', self::PUERTO_SSL);
        $correo = new PHPMailer(true);
        $correo->isSMTP();
        $correo->Host = $this->config->texto('smtp_host');
        $correo->Port = $puerto;
        $correo->SMTPSecure = $puerto === self::PUERTO_SSL ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $correo->SMTPAuth = true;
        $correo->Username = $this->config->texto('smtp_usuario');
        $correo->Password = $this->config->texto('smtp_clave');
        $correo->Timeout = 15;
        $correo->CharSet = PHPMailer::CHARSET_UTF8;
        $correo->setFrom($this->config->texto('smtp_usuario'), $this->config->texto('remitente_nombre'));
        return $correo;
    }

    /** Solo en pruebas locales: el correo se guarda como JSON en vez de enviarse */
    private function guardarParaPruebas(string $carpeta, array $mensaje): bool
    {
        $archivo = rtrim($carpeta, '/') . '/' . microtime(true) . '-' . bin2hex(random_bytes(3)) . '.json';
        return file_put_contents($archivo, json_encode($mensaje, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false;
    }
}
