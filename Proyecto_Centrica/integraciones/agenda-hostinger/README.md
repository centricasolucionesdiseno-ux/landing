# Agenda de citas en Hostinger

El formulario de `/contacto` envía la solicitud a un backend PHP alojado en el
mismo hosting. Todo funciona dentro de Hostinger y **no depende de ninguna
cuenta de Google**:

| Pieza | Cómo se resuelve |
| --- | --- |
| Base de datos y calendario | MySQL de Hostinger. Las citas agendadas son el calendario: bloquean su hora y no pueden quedar dos a la misma hora. |
| Correos | SMTP de Hostinger (PHPMailer). |
| Invitación de calendario | Archivo `.ics` adjunto, que se agrega con un clic a Outlook, Apple Calendar, Thunderbird, el celular o el webmail. |
| Videollamada | [Jitsi Meet](https://meet.jit.si): una sala única por cita, generada automáticamente. Es gratis y no hay nada que instalar. |
| Festivos | Los festivos de Colombia (Ley 51 de 1983, con traslado al lunes y Semana Santa) se calculan en PHP para cualquier año. |

```text
Visitante ──▶ solicitar.php ──▶ correo "Confirma tu solicitud"
                                   │
              confirmar.php ◀──────┘  el visitante pulsa el botón
                   │
                   └──▶ correo al gerente "Cita por aprobar" (con sus horas libres)
                                   │
              gestionar.php ◀──────┘  el gerente elige la hora y aprueba
                   │
                   └──▶ cita guardada en MySQL + sala de Jitsi
                        correo con invitación .ics al cliente y al gerente
```

> [!NOTE]
> **Sobre Jitsi.** Desde 2023, meet.jit.si pide que **la primera persona en
> entrar** a la sala inicie sesión con GitHub, Facebook o Google. El gerente
> entra unos minutos antes, inicia sesión y abre la sala; el cliente entra sin
> cuenta. Para el gerente basta con una cuenta personal de GitHub o Facebook, no
> hace falta una cuenta de empresa. Los correos y la página de aprobación se lo
> recuerdan.

## Estructura del código

Uso PHP 8.1+ con `strict_types`, namespace `Centrica\Agenda` y autocarga PSR-4
(`autoload.php`, sin Composer). Cada clase tiene una sola responsabilidad:

```text
agenda-privado/
├── autoload.php            Autocarga de clases (Centrica\Agenda y PHPMailer)
├── config.ejemplo.php      Plantilla de config.php (credenciales, fuera del repositorio)
├── esquema.sql             Tabla agenda_solicitudes (MySQL)
└── src/
    ├── Aplicacion.php      Arranque y contenedor de servicios (creación diferida)
    ├── Acciones/           Un caso de uso por punto de entrada
    │   ├── SolicitarCita.php       POST del formulario
    │   ├── ConfirmarSolicitud.php  Enlace de confirmación del visitante
    │   ├── EnviarMensaje.php       Mensaje al gerente desde el chat de Nebulina
    │   └── GestionarSolicitud.php  Aprobar o rechazar (gerente)
    ├── Solicitudes.php     Repositorio: toda la SQL de la tabla
    ├── Calendario.php      Horas libres del día
    ├── Festivos.php        Festivos de Colombia (Ley 51 de 1983)
    ├── Invitacion.php      Archivo .ics y sala de Jitsi
    ├── Antiabuso.php       Origen, límites y Turnstile
    ├── Validador.php       Validación del formulario
    ├── Correo.php          SMTP (PHPMailer) · PlantillaCorreo.php: HTML de los correos
    ├── Respuesta.php       JSON y páginas HTML · Peticion.php: datos de la petición
    └── Reglas.php · Fechas.php · Texto.php · Token.php · BaseDatos.php · Configuracion.php
```

Los archivos de `public/api/agenda/*.php` (los únicos dentro de `public_html`)
solo cargan la autocarga y ejecutan su acción. El código pasa el análisis de
SonarQube/SonarLint (perfil *Sonar way*) sin incidencias.

## Protección contra abuso

| Capa | Dónde |
| --- | --- |
| Doble confirmación: el gerente solo recibe solicitudes cuyo correo se confirmó | `Acciones\ConfirmarSolicitud` |
| Cloudflare Turnstile obligatorio (falla cerrado) | `Antiabuso::esHumano()` |
| Campo trampa y tiempo mínimo de llenado (3 s) | `Acciones\SolicitarCita` |
| Solo se aceptan peticiones con `Origin` del propio dominio; 8 KB como máximo | `Antiabuso::origenPermitido()` |
| Límites: 3 por IP por hora, 6 por IP al día, 3 por correo al día, 30 en total al día | `Antiabuso::limiteSuperado()` |
| Los enlaces son tokens aleatorios; en la base de datos solo se guarda su hash | `Token` |
| Los botones de los enlaces son POST: los filtros de correo que abren enlaces no confirman ni aprueban nada | `Acciones\ConfirmarSolicitud`, `Acciones\GestionarSolicitud` |
| El correo de confirmación al visitante solo lleva texto fijo, sin nada de lo que escribió en el formulario | `Acciones\SolicitarCita` |
| Índice único sobre la hora de inicio: no puede haber dos citas a la misma hora | `esquema.sql` |
| Las solicitudes no confirmadas se borran a los 7 días | `Solicitudes::borrarSinConfirmarAntesDe()` |

## Instalación (una vez, en hPanel)

1. **PHP 8.1 o superior.** Se configura en *Avanzado → Configuración de PHP*.
2. **Base de datos.** En *Bases de datos → MySQL*, crear una base de datos con
   su usuario. Luego, en phpMyAdmin, ejecutar `agenda-privado/esquema.sql`.
3. **Buzón remitente.** En *Correos*, crear `agenda@centricasoluciones.com`
   (SMTP `smtp.hostinger.com`, puerto 465, SSL). Verificar que el dominio tenga
   **SPF, DKIM y DMARC** activos para que los correos no lleguen a spam.
4. **Clave de anonimización.** Generarla con `openssl rand -hex 32` para
   `sal_ip`.
5. **Turnstile.** En dash.cloudflare.com, abrir **Turnstile** y crear un widget
   para `centricasoluciones.com`.
   - La clave del sitio va en `VITE_TURNSTILE_SITEKEY` del `.env`, antes de `npm
     run build`.
   - La clave secreta va en `turnstile_secreto` de `config.php`.
6. **Archivos privados.** Subir la carpeta `agenda-privado/` **al lado** de
   `public_html`, no dentro:

   ```text
   domains/centricasoluciones.com/
   ├── agenda-privado/     ← autoload.php, config.php, src/, PHPMailer/
   └── public_html/        ← contenido de dist/ (incluye api/agenda/)
   ```

   Dentro de `agenda-privado/`, copiar `config.ejemplo.php` como `config.php` y
   llenarlo. `permitir_sin_turnstile` debe quedar en `false`, sin
   `correos_prueba_dir`.
7. **Sitio.** Ejecutar `npm run build` y subir el contenido de `dist/` a
   `public_html`. Los PHP de `public/api/agenda` ya van incluidos.

### Comprobar

- [ ] `https://centricasoluciones.com/api/agenda/solicitar.php` abierto en el
      navegador responde `405`, porque solo acepta POST.
- [ ] Enviar una solicitud real desde `/contacto`, confirmarla desde el correo y
      aprobarla desde el correo del gerente.
- [ ] Al cliente y al gerente les llega el correo con la invitación `.ics` y el
      enlace de Jitsi.
- [ ] Los errores quedan en *Avanzado → Registros de errores* de hPanel.
      Empiezan con `agenda:`.

## Probar en local

Usar un `config.php` con SQLite y los correos guardados en archivos (cada correo
queda en un `.json`, incluido el `.ics`):

```php
'db_dsn' => 'sqlite:/ruta/agenda.db', 'db_usuario' => null, 'db_clave' => null,
'sitio' => 'http://127.0.0.1:5173', 'dominios' => ['127.0.0.1:5173', 'localhost:5173'],
'permitir_sin_turnstile' => true, 'correos_prueba_dir' => '/ruta/correos',
```

```bash
AGENDA_PRIVADO=$PWD/integraciones/agenda-hostinger/agenda-privado php -S 127.0.0.1:8080 -t public
npm run dev   # Vite envía /api al PHP del puerto 8080
```

## Dependencias

PHPMailer 7.1.1 está incluido en `agenda-privado/PHPMailer/`, solo los archivos
`src/` y la licencia LGPL.
No hace falta Composer.
