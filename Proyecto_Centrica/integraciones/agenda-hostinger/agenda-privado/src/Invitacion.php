<?php

declare(strict_types=1);

namespace Centrica\Agenda;

use DateTimeImmutable;

/**
 * Invitación de calendario (.ics, RFC 5545) que Outlook, Gmail, Apple Calendar,
 * Thunderbird o el celular agregan con un clic.
 */
final class Invitacion
{
    private const FORMATO = 'Ymd\THis\Z';
    private const MAX_BYTES_LINEA = 75;

    public function __construct(private readonly Configuracion $config)
    {
    }

    /** Sala de Jitsi Meet única y difícil de adivinar para cada cita */
    public static function enlaceVideollamada(): string
    {
        return 'https://meet.jit.si/Centrica-' . bin2hex(random_bytes(8));
    }

    /** @param array<string, mixed> $cita fila de la solicitud ya agendada */
    public function generar(array $cita): string
    {
        $inicio = new DateTimeImmutable($cita['inicio']);
        $fin = $inicio->modify('+' . Reglas::DURACION_MIN . ' minutes');
        $titulo = $cita['servicio'] ? 'Reunión con Céntrica · ' . $cita['servicio'] : 'Reunión con Céntrica';
        $dominio = (string) parse_url($this->config->texto('sitio'), PHP_URL_HOST);
        $lineas = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Centrica Soluciones//Agenda//ES',
            'CALSCALE:GREGORIAN',
            'METHOD:REQUEST',
            'BEGIN:VEVENT',
            "UID:{$cita['publico']}@$dominio",
            'DTSTAMP:' . gmdate(self::FORMATO),
            'DTSTART:' . $inicio->format(self::FORMATO),
            'DTEND:' . $fin->format(self::FORMATO),
            'SUMMARY:' . self::texto($titulo),
            'DESCRIPTION:' . self::texto("Reunión virtual con el equipo comercial de Céntrica.\nEnlace de la videollamada: {$cita['enlace']}"),
            'LOCATION:' . self::texto($cita['enlace']),
            'URL:' . $cita['enlace'],
            'ORGANIZER;CN=' . self::parametro($this->config->texto('remitente_nombre')) . ':mailto:' . $this->config->texto('smtp_usuario'),
            'ATTENDEE;CN=' . self::parametro($cita['nombre']) . ';ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' . $cita['correo'],
            'ATTENDEE;CN="Gerencia comercial";ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED:mailto:' . $this->config->texto('correo_gerente'),
            'SEQUENCE:0',
            'STATUS:CONFIRMED',
            'BEGIN:VALARM',
            'ACTION:DISPLAY',
            'DESCRIPTION:' . self::texto($titulo),
            'TRIGGER:-PT15M',
            'END:VALARM',
            'END:VEVENT',
            'END:VCALENDAR',
        ];
        $ics = '';
        foreach ($lineas as $linea) {
            $ics .= self::plegar($linea);
        }
        return $ics;
    }

    /** Valor de texto: escapa barra invertida, punto y coma, coma y saltos de línea */
    private static function texto(string $valor): string
    {
        return str_replace(['\\', ';', ',', "\r\n", "\n"], ['\\\\', '\\;', '\\,', '\\n', '\\n'], $valor);
    }

    /** Valor de parámetro (CN=...): entre comillas y sin comillas internas */
    private static function parametro(string $valor): string
    {
        return '"' . str_replace('"', '', $valor) . '"';
    }

    /** Las líneas no pueden pasar de 75 bytes: se parten sin cortar caracteres UTF-8 */
    private static function plegar(string $linea): string
    {
        $salida = '';
        while (strlen($linea) > self::MAX_BYTES_LINEA) {
            $corte = self::MAX_BYTES_LINEA;
            while ($corte > 0 && (ord($linea[$corte]) & 0xC0) === 0x80) {
                $corte--;
            }
            $salida .= substr($linea, 0, $corte) . "\r\n ";
            $linea = substr($linea, $corte);
        }
        return $salida . $linea . "\r\n";
    }
}
