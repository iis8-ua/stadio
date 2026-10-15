# Arquitectura del sistema: *STADIO*

## 1. Visión general

STADIO es una **aplicación web** compuesta por frontend (SPA) que consume una **API REST** (backend propio) con **MySQL** como base de datos, orquestada con **Docker**. La comunicación entre el navegador y la API utiliza JSON. En producción debe protegerse mediante HTTPS; en desarrollo local puede utilizarse HTTP.

| Capa | Tecnología |
|------|------------|
| Presentación (SPA) | React 19 + TypeScript + Vite + Tailwind CSS |
| Aplicación (API REST) | Laravel 13 (PHP 8.3) |
| Datos | MySQL 8.0 |
| Infraestructura | Docker Compose (PHP-FPM + Nginx + MySQL) + GitHub Actions |

## 2. Estilo arquitectónico

- **Cliente–servidor**: el frontend SPA y la API tienen responsabilidades separadas, aunque pueden desplegarse en la misma infraestructura.
- **Arquitectura en capas** en el backend: **Controlador → Servicio → acceso a datos** (Eloquent y, cuando aporte valor, repositorio). La lógica de negocio se centraliza en servicios y los modelos Eloquent se centran en datos y relaciones. 
- **API-first**: el contrato de la API se define antes de implementar.
- **Multi-rol**: un único backend sirve a los tres roles (**cliente**, **entrenador** —con perfiles *entrenador personal* y *monitor/instructor*— y **administrador**) mediante autorización por rol/perfil.
- **Integraciones encapsuladas**: pagos, acceso NFC y catálogo de ejercicios se aíslan tras contratos cuando sea útil sustituirlos o simularlos en pruebas.

## 3. Componentes

### 3.1 Frontend (SPA)

- Vistas por rol (cliente, entrenador, administrador) con rutas protegidas por rol y perfil.
- Consumo de la API REST. El frontend gestiona presentación y estado de interfaz; las reglas de negocio y los permisos se validan siempre en el backend. El prototipo actual puede utilizar datos de ejemplo.
- Estados comunes: carga, vacío, error y éxito; modo claro/oscuro; responsive.
- Autenticación por cookie de sesión: las peticiones se envían con credenciales (`withCredentials`) y el frontend nunca almacena tokens. Ante un `419` (CSRF caducado) se refresca la cookie con `/sanctum/csrf-cookie` y se reintenta la petición una sola vez; solo si vuelve a fallar se redirige al login. Ante un `401` se redirige al login directamente. En el prototipo actual (sin backend), la **sesión simulada** (rol y perfil) puede persistirse en `localStorage` para sobrevivir a la recarga; esto nunca aplica a tokens ni a credenciales reales.

### 3.2 Backend (API REST Laravel)

Arquitectura en capas: los servicios coordinan las reglas de negocio. Se utiliza Eloquent para persistencia y se introducen repositorios solo cuando aporten una separación útil (consultas complejas, reutilizadas o que convenga abstraer). Los DTOs se usan cuando ayudan a definir contratos entre capas; no hace falta uno por operación.

**Responsabilidades por capa**

| Capa | Responsabilidad | No debe contener |
|------|-----------------|------------------|
| **Controller** (presentación) | Recibir HTTP, validar (*Form Request*), autorizar (*Policy/Gate* según rol y perfil docente), delegar en el servicio y responder con un `Resource` y el código correcto (`201`, `204`, `409`…) | Lógica de negocio, consultas, transacciones |
| **Service** (aplicación) | **Lógica de negocio** y transacciones | Detalles de HTTP |
| **Acceso a datos** | Consultas y persistencia con Eloquent o repositorios justificados | Reglas de negocio |
| **Model** (Eloquent) | Datos, relaciones, casts y *scopes* sencillos | Orquestación de casos de uso complejos |
| **DTO** (si se necesita) | Transportar datos tipados en límites concretos | Lógica de negocio |

Los controladores por cada recurso exponen `index`, `show`, `store`, `update` y `destroy`, más acciones propias (p. ej. `POST /cuotas/{id}/pagar`).

**Flujo habitual de una petición:** `Request → Controller (validación + autorización) → Service → Eloquent/repositorio → BD → Resource → JSON`.

Otros componentes del backend: **autorización** con *Policies*/*Gates* + middleware; **migraciones**; **notificaciones** (canales `database`, `mail`, push FCM) con **colas** y **scheduler**; **Jobs** para tareas asíncronas (recordatorios, cobros, importaciones).

### 3.3 Datos y almacenamiento

- **MySQL 8.0**.
- **Almacenamiento local** para las imágenes de los ejercicios (`storage/app/public`, `storage:link`).
- Imágenes del catálogo importadas desde **wger**.

### 3.4 Infraestructura

- **Docker Compose**: PHP-FPM + Nginx + MySQL. Nginx aplica las cabeceras de seguridad HTTP.
- **GitHub Actions**: lint + tests (CI).
- Script de arranque `run/dev.sh`.

## 4. Seguridad y autorización

- **Autenticación**: **Laravel Sanctum** con dos mecanismos según el tipo de cliente:
  - **SPA (cliente, entrenador, administrador)**: **autenticación por cookie de sesión** (flujo SPA de Sanctum). El navegador obtiene la cookie CSRF (`/sanctum/csrf-cookie`), inicia sesión y las peticiones posteriores van con la cookie de sesión (`HttpOnly`, `Secure` en producción, `SameSite=Lax`). No se almacenan tokens en el navegador (`localStorage`/`sessionStorage`), lo que reduce el impacto de un posible XSS.
  - **Máquinas (tornos/NFC)**: **tokens de acceso personal de Sanctum** asociados a un modelo `Dispositivo` (no a un usuario), con *abilities* mínimas (p. ej. `acceso:registrar`), caducidad configurada, posibilidad de revocación y rotación. Solo pueden usar las rutas del grupo `/api/dispositivos/*`.
- **Autorización en dos niveles**:
  1. **Rol de acceso** (cliente / entrenador / administrador) → permisos.
  2. **Perfil del personal docente** (entrenador personal / monitor/instructor) → restringe las opciones del portal de entrenador.
- **Separación de superficies (con comprobación explícita)**: las rutas de usuario (sesión) y las de dispositivo (token) van en grupos distintos, y la separación se refuerza con un middleware propio, porque `auth:sanctum` por sí solo no distingue el tipo de autenticable:
  - Rutas de usuario: `auth:sanctum` + comprobación de que `$request->user() instanceof User`.
  - Rutas de dispositivo: `auth:sanctum` + `abilities:acceso:registrar` + comprobación de que `$request->user() instanceof Dispositivo`.

  Así, un token de torno no puede usar endpoints de usuario, y una sesión de usuario no puede usar los de dispositivo.
- **Verificación de email**: obligatoria para clientes antes de acceder a las funciones de reserva y pago.
- **Autenticación en dos pasos (2FA)**: obligatoria para el rol administrador (TOTP, p. ej. con Laravel Fortify) y opcional para el resto de roles. Al activarla se generan **códigos de recuperación de un solo uso** que el administrador debe guardar en un lugar seguro; permiten acceder si se pierde el dispositivo de autenticación. Además, debe existir un procedimiento de recuperación de emergencia (p. ej. un comando artisan que desactive el 2FA de un administrador, ejecutable solo con acceso al servidor) para el caso de perder también los códigos.
- **Validación y autorización** en el servidor; consultas parametrizadas/Eloquent para reducir el riesgo de inyección; escape de salida y tratamiento seguro del contenido para mitigar XSS.
- **CSRF**: protección obligatoria en las rutas de sesión (cookie `XSRF-TOKEN` + cabecera `X-XSRF-TOKEN`). Las rutas de dispositivo con token no usan cookies, por lo que no están sujetas a CSRF.
- **Hash** de contraseñas; HTTPS; los **datos de tarjeta no se almacenan** (los gestiona la pasarela) y el **IBAN** de la cuenta bancaria se guarda **cifrado**, nunca en claro. Los tokens de dispositivo se guardan hasheados en BD y solo se muestran una vez al crearlos.
- **Limitación de peticiones** (*rate limiting*) en el login y en los endpoints de dispositivo.
- **Cabeceras de seguridad HTTP**: se configuran en Nginx (o con `spatie/laravel-csp` en Laravel para la CSP):
  - `Content-Security-Policy` (con `frame-ancestors 'self'`) para restringir orígenes de scripts y evitar que se incruste la aplicación en otros sitios.
  - `X-Content-Type-Options: nosniff`.
  - `X-Frame-Options: SAMEORIGIN` (compatibilidad con navegadores que no soporten `frame-ancestors`).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Strict-Transport-Security` en producción (HTTPS).

## 5. Integraciones externas

| Integración | Mecanismo |
|-------------|-----------|
| **Tornos / NFC** | Interfaz del dispositivo autenticada con **token de Sanctum** (modelo `Dispositivo`, *ability* `acceso:registrar`): identificador de pulsera por lectura y eventos de paso; cálculo de aforo. Los eventos deben ser idempotentes. |
| **Stripe** | Pasarela de pago (modo test): cobros con **tarjeta** (Checkout) y por **domiciliación**/SEPA, y validación de **webhooks**. |
| **wger** | Importación puntual del catálogo de ejercicios (idempotente); datos e imágenes locales. |
| **Notificaciones** | Correo (Resend/SMTP) y push (FCM) con Laravel Notifications; campana in-app. |

## 6. Requisitos no funcionales

| RNF | Cómo se aborda |
|-----|----------------|
| Rendimiento (RNF-01) | Índices en BD, paginación de listados, cache cuando aplique. |
| Concurrencia (RNF-03) | Transacciones y **restricciones únicas** (cliente+periodo, cliente+clase). |
| Seguridad (RNF-04..08) | Sanctum, HTTPS, cabeceras de seguridad, validación, 2FA para administrador, verificación de email, RGPD, no almacenar datos de tarjeta. |
| Disponibilidad (RNF-12..14) | Contenedores reanudables, backups de BD. |
| Usabilidad (RNF-18..20) | Estados de carga/vacío/error/éxito y feedback de acciones. |
| Despliegue (RNF-21,26) | Docker Compose + migraciones versionadas + CI. |

## 7. Decisiones de arquitectura

| ID | Decisión | Alternativa descartada | Motivo |
|----|----------|------------------------|--------|
| 01 | **SPA + API REST** desacopladas | Monolito con vistas renderizadas (Blade) | Separación front/back, reutilización y despliegue independiente. |
| 02 | **Laravel** como backend | Node/Express, Django | Ecosistema maduro (ORM, auth, colas, notificaciones, tests) y stack declarado. |
| 03 | **MySQL** como BD | PostgreSQL, SQLite en producción | MySQL ya previsto y soportado por Docker; SQLite solo para tests. |
| 04 | **Sanctum** con **cookies de sesión para el SPA** y **tokens solo para dispositivos (tornos)** | Implementar JWT propio; tokens para el SPA | Integrado en Laravel. La cookie `HttpOnly` evita exponer credenciales a JavaScript; los tokens con *abilities* y revocación encajan con clientes no interactivos como los tornos. La separación usuario/dispositivo se refuerza con middleware. |
| 05 | Autorización con **Policies + rol/perfil** | Solo middleware por rol | Permite reglas finas (p. ej. entrenador solo sus clientes; perfil docente). |
| 06 | **Laravel Notifications** (canales + colas) | Envío SMTP síncrono | Asíncrono, multicanal (email/push/in-app) y mantenible. |
| 07 | **Import puntual de wger** (no runtime) | Llamar a wger en cada petición | Sin dependencia externa, sin *rate limits*; datos locales. |
| 08 | **Imágenes locales** (storage) para ejercicios | Enlazar a wger.de | Independencia del servicio externo. |
| 09 | **Docker Compose** + CI | Despliegue manual | Reproducibilidad (RNF-21) y automatización. |
| 10 | **PHPUnit** para tests | Tests solo manuales | Regresión automatizada en CI. |
| 11 | **Chatbot y recomendaciones con **heurísticas** en el backend | LLM externo | Sin coste por uso ni dependencia externa; los datos de actividad no salen del sistema; comportamiento determinista y testeable. |

## 8. Criterios de implementación

- **Transacciones y concurrencia**: las operaciones sensibles (reservas de clases, pagos, registro de accesos y cálculo de aforo) deben protegerse frente a solicitudes simultáneas. Las reglas se validan en el servicio y se refuerzan con transacciones e índices/restricciones de base de datos cuando proceda.
- **Autorización en servidor**: proteger una ruta en React mejora la navegación, pero no sustituye la comprobación de permisos en Laravel mediante middleware y Policies.
- **Secretos y configuración**: claves de Stripe, correo y otros servicios se almacenan en variables de entorno o secretos del despliegue; nunca se incluyen en el repositorio ni en respuestas de la API.
- **Integraciones externas**: las llamadas a wger, Stripe y FCM deben gestionar errores, tiempos de espera y registros. Los webhooks de Stripe deben validar la firma y ser idempotentes.
- **Sesión y dominios**: SPA y API deben compartir dominio de nivel superior (p. ej. `app.stadio.test` y `api.stadio.test`) o servirse desde el mismo origen vía Nginx. Configurar `SESSION_DOMAIN`, CORS con `supports_credentials = true` y `SANCTUM_STATEFUL_DOMAINS` incluyendo **host y puerto** de cada origen del SPA, también el servidor de desarrollo de Vite (p. ej. `localhost:5173`). Si falta, la API responde `401` aunque el login haya ido bien.
- **Tokens de dispositivo**: crear mediante un comando artisan o un panel de administración, con caducidad y *abilities* mínimas; revocar al sustituir o perder un torno.
- **Cabeceras y CSP**: aplicar la CSP estricta en producción; en desarrollo, Vite necesita permisos adicionales (HMR por WebSocket, scripts inline).
- **Servicios y duplicación**: para evitar servicios demasiado grandes y reglas duplicadas, separar los servicios por dominio y crear contratos solo donde exista una necesidad real de desacoplamiento.
- **Versiones**: fijar en `composer.json`, `package.json` y las imágenes Docker las versiones compatibles que realmente se utilicen; actualizar esta documentación si cambian.
