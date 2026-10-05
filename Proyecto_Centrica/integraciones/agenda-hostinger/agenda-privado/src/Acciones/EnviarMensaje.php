<?php

declare(strict_types=1);

namespace Centrica\Agenda\Acciones;

use Centrica\Agenda\Aplicacion;
use Centrica\Agenda\Fechas;
use Centrica\Agenda\Limites;
use Centrica\Agenda\PlantillaCorreo;
use Centrica\Agenda\Reglas;
use Centrica\Agenda\Texto;

/**
 * POST /api/nebulina/mensaje.php — mensaje para el gerente desde el chat de
 * Nebulina. Solo se envía al correo del gerente (con "responder a" del
 * visitante): al visitante no se le envía nada, así no sirve para mandar
 * correos a terceros.
 */
final class EnviarMensaje
{
    private const DIAS_CONSERVAR = 30;
    private const RUTA_RE = '#^/[a-z0-9/-]{0,60}$#';
    private const TEMA_RE = '/^[a-z_]{1,40}$/';
    private const MAX_TEMAS = 10;

    /**
     * Diagnóstico de Nebulina: únicas respuestas aceptadas y cómo se leen en
     * el correo. Deben coincidir con PERFIL en src/config/nebulina/ventas.js.
     */
    private const PERFIL = [
        'organizacion' => [
            'titulo' => 'Tipo de organización',
            'opciones' => [
                'privada' => 'Empresa privada',
                'publica' => 'Entidad pública',
                'emprendimiento' => 'Emprendimiento o startup',
                'otra' => 'Otra organización',
            ],
        ],
        'necesidad' => [
            'titulo' => 'Necesidad principal',
            'opciones' => [
                'medida' => 'Crear o modernizar un sistema',
                'erp' => 'Ordenar finanzas, nómina o inventarios',
                'legislativa' => 'Gestionar un Concejo o una Asamblea',
                'ia' => 'Automatizar con inteligencia artificial',
                'calidad' => 'Probar y asegurar su software',
                'asesoria' => 'Aún no lo tiene claro',
            ],
        ],
        'urgencia' => [
            'titulo' => 'Urgencia',
            'opciones' => [
                'ya' => 'Lo antes posible',
                'pronto' => 'En 1 a 3 meses',
                'explorando' => 'Solo está explorando',
            ],
        ],
    ];

    public function __construct(private readonly Aplicacion $app)
    {
    }

    public function atender(): never
    {
        $respuesta = $this->app->respuesta;
        $entrada = EntradaFormulario::leer($this->app);
        if (EntradaFormulario::esBot($entrada)) {
            $respuesta->json(['ok' => true]);
        }
        if (EntradaFormulario::demasiadoRapido($entrada)) {
            $respuesta->error(EntradaFormulario::DATOS_INVALIDOS, 'Revisa los datos y vuelve a intentarlo.', 422);
        }
        $datos = self::limpiar($entrada);
        $error = self::primerError($datos, ($entrada['acepta'] ?? false) === true);
        if ($error !== '') {
            $respuesta->error(EntradaFormulario::DATOS_INVALIDOS, $error, 422);
        }

        $antiabuso = $this->app->antiabuso();
        if (!$antiabuso->esHumano($entrada['turnstile'] ?? null, $this->app->peticion->ip())) {
            $respuesta->error('verificacion', 'No pudimos verificar que el mensaje lo envía una persona. Recarga la página e inténtalo de nuevo.', 403);
        }
        $mensajes = $this->app->mensajes();
        $mensajes->borrarAntesDe(Fechas::utc(self::DIAS_CONSERVAR * 86400));
        $ipHash = $antiabuso->hashIp($this->app->peticion->ip());

        // Contar y registrar es atómico (y el registro va antes del envío):
        // peticiones simultáneas no pueden saltarse el límite
        [$limite, $id] = $this->app->bloqueo()->conCandado('chat', static function () use ($antiabuso, $mensajes, $datos, $ipHash) {
            $limite = $antiabuso->limiteSuperado($mensajes, Limites::chat(), $datos['correo'], $ipHash);
            return $limite !== '' ? [$limite, 0] : ['', $mensajes->registrar($datos['correo'], $ipHash)];
        });
        if ($limite !== '') {
            $respuesta->error('limite', $limite, 429);
        }

        if (!$this->avisarGerente($datos)) {
            // El envío falló: el registro se quita para que pueda reintentar
            $mensajes->borrar($id);
            $respuesta->error('correo', 'No pudimos enviar tu mensaje en este momento.', 502);
        }
        $respuesta->json(['ok' => true]);
    }

    /** @return array{nombre: string, correo: string, mensaje: string, pagina: string, temas: string, perfil: array<string, string>} */
    private static function limpiar(array $entrada): array
    {
        $pagina = Texto::limpiar($entrada['pagina'] ?? '', 61);
        return [
            'nombre' => Texto::limpiar($entrada['nombre'] ?? '', 80),
            'correo' => mb_strtolower(Texto::limpiar($entrada['correo'] ?? '', 120)),
            'mensaje' => Texto::limpiar($entrada['mensaje'] ?? '', 1000, true),
            // Página y temas solo se aceptan con su formato: nada más llega al correo
            'pagina' => preg_match(self::RUTA_RE, $pagina) === 1 ? $pagina : '/',
            'temas' => self::temas($entrada['temas'] ?? []),
            'perfil' => self::perfil($entrada['perfil'] ?? []),
        ];
    }

    /**
     * Respuestas del diagnóstico, ya en texto legible. Solo se aceptan valores
     * de la lista: lo demás se descarta sin error (el mensaje sigue siendo válido).
     *
     * @return array<string, string> título => respuesta
     */
    private static function perfil(mixed $perfil): array
    {
        if (!is_array($perfil)) {
            return [];
        }
        $legible = [];
        foreach (self::PERFIL as $campo => ['titulo' => $titulo, 'opciones' => $opciones]) {
            $valor = $perfil[$campo] ?? null;
            if (is_string($valor) && isset($opciones[$valor])) {
                $legible[$titulo] = $opciones[$valor];
            }
        }
        return $legible;
    }

    /** Temas consultados en el chat ("nebula_dian" -> "nebula dian"), separados por comas */
    private static function temas(mixed $temas): string
    {
        if (!is_array($temas)) {
            return '';
        }
        $validos = array_filter($temas, static fn($tema) => is_string($tema) && preg_match(self::TEMA_RE, $tema) === 1);
        $legibles = array_map(static fn(string $tema) => str_replace('_', ' ', $tema), array_slice(array_values($validos), 0, self::MAX_TEMAS));
        return implode(', ', array_unique($legibles));
    }

    /**
     * Si el cliente dijo que lo necesita cuanto antes, el asunto lo destaca
     * para que el gerente lo atienda primero.
     *
     * @param array<string, string> $perfil
     */
    private static function prefijoAsunto(array $perfil): string
    {
        $urgente = self::PERFIL['urgencia']['opciones']['ya'];
        return ($perfil[self::PERFIL['urgencia']['titulo']] ?? '') === $urgente ? 'Prioritario · ' : '';
    }

    /** @param array{nombre: string, correo: string, mensaje: string} $datos */
    private static function primerError(array $datos, bool $acepta): string
    {
        return match (true) {
            mb_strlen($datos['nombre']) < 2 => 'Escribe tu nombre.',
            !filter_var($datos['correo'], FILTER_VALIDATE_EMAIL) => 'El correo no es válido.',
            mb_strlen($datos['mensaje']) < 10 => 'Cuéntanos un poco más (mínimo 10 caracteres).',
            !$acepta => 'Debes aceptar el tratamiento de datos personales.',
            default => '',
        };
    }

    /** @param array{nombre: string, correo: string, mensaje: string, pagina: string, temas: string, perfil: array<string, string>} $datos */
    private function avisarGerente(array $datos): bool
    {
        $pagina = $this->app->url($datos['pagina']);
        $filas = [
            'Nombre' => $datos['nombre'],
            'Correo' => $datos['correo'],
            'Desde la página' => $pagina,
            ...$datos['perfil'],
            'Temas consultados en el chat' => $datos['temas'] !== '' ? $datos['temas'] : '—',
            'Mensaje' => $datos['mensaje'],
        ];
        $textoPlano = '';
        foreach ($filas as $etiqueta => $valor) {
            $textoPlano .= "$etiqueta: $valor\n";
        }
        $nota = 'Responde este correo para escribirle directamente. Plazo comunicado al cliente: máximo '
            . Reglas::RESPUESTA_DIAS_HABILES . ' días hábiles.';

        return $this->app->correo()->enviar(
            para: $this->app->correoGerente(),
            asunto: self::prefijoAsunto($datos['perfil']) . "Mensaje de {$datos['nombre']} desde el chat de Nebulina",
            html: PlantillaCorreo::html(
                'Nuevo mensaje desde el chat',
                PlantillaCorreo::parrafo(Texto::html($datos['nombre']) . ' te dejó un mensaje desde el chat de Nebulina en el sitio web.')
                . PlantillaCorreo::tabla($filas),
                null,
                $nota
            ),
            texto: $textoPlano . "\n" . $nota,
            responderA: $datos['correo']
        );
    }
}
