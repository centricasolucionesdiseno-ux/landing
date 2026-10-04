# Seguridad de la agenda y de Nebulina

Controles de seguridad del backend en Hostinger (agenda de citas y mensajes
del chat de Nebulina) y del frontend. Cada control indica dónde está
implementado para poder revisarlo.

## Datos personales

| Control | Dónde |
| --- | --- |
| Datos personales cifrados en la base con AES-256-GCM (nombre, correo, empresa, cargo, mensaje) | `Cifrado`, `Solicitudes` |
| Una clave por cliente, derivada con HKDF de la clave maestra y el identificador de su solicitud | `Cifrado::claveDe()` |
| IV aleatorio por valor y etiqueta de autenticación: un dato alterado se rechaza | `Cifrado` |
| Datos adicionales autenticados (campo + cliente): un valor cifrado no se puede mover a otra fila | `Cifrado::aad()` |
| El correo se busca por su huella HMAC, nunca en claro; la tabla del chat no guarda ningún dato personal | `Cifrado::huellaCorreo()`, `Mensajes` |
| Tokens de los enlaces aleatorios de 256 bits; en la base solo su hash SHA-256 | `Token` |
| El enlace del gerente vence a los 30 días; las solicitudes no confirmadas se borran a los 7 días y el registro del chat a los 30 | `Reglas`, `GestionarSolicitud` |
| En el navegador, el borrador del formulario y la conversación con Nebulina viven en `sessionStorage`: se borran al cerrar la pestaña | `AgendaForm`, `memoria.js` |
| La conversación con Nebulina no sale del navegador; solo el mensaje que el visitante decide enviar al gerente | `MensajeGerente` |
| Todo el tráfico va por HTTPS con HSTS; el correo sale por SMTP con TLS (puerto 465) | `.htaccess`, `Correo` |

**La clave maestra** (`clave_cifrado`) vive solo en `config.php`, fuera de
`public_html`. Una copia de la base de datos sin esa clave no expone ningún
dato personal.

## Errores y registros

- El visitante nunca ve detalles de un error: recibe un mensaje genérico.
- El registro de errores guarda solo el tipo, el mensaje y el archivo, sin
  trazas ni argumentos (`zend.exception_ignore_args`). Un fallo de conexión a
  MySQL no deja usuario ni contraseña en el log (`BaseDatos`).

## Abuso y ataques de denegación de servicio

| Capa | Control |
| --- | --- |
| Apache | `public/api/.htaccess`: cuerpo máximo de 16 KB, solo GET y POST, solo los archivos esperados |
| Origen | Solo peticiones del propio dominio (`Origin`) y no marcadas por el navegador como de otro sitio (`Sec-Fetch-Site`) |
| Formato | Cuerpo máximo de 8 KB, JSON con profundidad limitada, tipos estrictos |
| Bots | Cloudflare Turnstile obligatorio (falla cerrado), campo trampa, tiempo mínimo de llenado |
| Frecuencia | Límites por IP, por correo y diarios; contar y registrar es atómico (`Bloqueo`), así que peticiones simultáneas no se saltan el límite |
| Orden | Las comprobaciones baratas van primero: una petición inválida se rechaza sin tocar la base de datos |
| Cabeceras | Cada respuesta trae su propia CSP, `nosniff`, `X-Frame-Options` y `no-store` |

### Protección DDoS (recomendado en producción)

Un ataque volumétrico se frena antes de llegar al hosting:

1. Poner el dominio detrás de **Cloudflare** (plan gratuito, modo proxy) y
   activar *Bot Fight Mode*.
2. En Cloudflare, crear una regla de **limitación de frecuencia** para
   `/api/*` (por ejemplo, 20 peticiones por minuto por IP).
3. En `config.php`, poner `'detras_de_cloudflare' => true`. Los límites usan
   entonces la IP real del visitante, que solo se acepta si la conexión viene
   de un rango oficial de Cloudflare (`cloudflare-ips.txt`, `ProxyConfiable`).

## Operación

- Activar la verificación en dos pasos en hPanel y en el buzón del gerente.
- Hacer copias de seguridad de la base de datos y, por separado, de
  `clave_cifrado`.
- Mantener PHP actualizado (8.1 o superior) y revisar de vez en cuando
  `cloudflare-ips.txt` contra la lista oficial.

## Riesgos residuales

- **Correos del gerente:** la notificación que recibe el gerente contiene los
  datos del cliente y queda en su buzón, protegida por la seguridad de la
  cuenta de correo.
- **Registros de acceso:** el servidor web registra la URL de los enlaces del
  gerente (con el token). Lo mitigan el vencimiento a 30 días, que en la base
  solo exista el hash y que esos registros solo los vea el dueño de la cuenta.
- **Navegador:** cualquier dato que esté en la página es visible para quien
  use ese navegador mientras la pestaña esté abierta. Por eso nada se guarda
  más allá de la sesión.
