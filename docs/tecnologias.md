# Tecnologías del proyecto

## Frontend

- **React 19** con **TypeScript**: SPA con componentes reutilizables y tipado.
- **Vite**: bundler y servidor de desarrollo.
- **Tailwind CSS**: estilos y diseño responsive.
- **React Router**: navegación entre los espacios de cliente, entrenador y administrador.
- **Recharts**: gráficas de progreso y analítica.
- **Lucide Icons**: iconografía.
- **Inter**: tipografía principal.

## Backend

- **Laravel 13 (PHP 8.3)**: API REST con autenticación, reglas de negocio, permisos por rol y validación.
- **Autenticación**: **Laravel Sanctum** (cookie de sesión para la SPA y tokens para dispositivos); **2FA/TOTP con Laravel Fortify** (RF-96) y **verificación de email** con el sistema de Laravel (RF-97).
- **MySQL 8.0**: base de datos
- **Docker + docker-compose**: contenedores para el backend (PHP-FPM + Nginx + MySQL) y despliegue reproducible.

## Integraciones externas

- **Stripe**: pasarela de pago para el cobro de la cuota mensual, con **tarjeta** (Checkout) y **domiciliación bancaria** (SEPA).
- **Tornos con pulsera NFC**: interfaz del sistema de control de accesos para registrar entradas/salidas.
- **wger** (`https://wger.de/api/v2`): API REST abierta de ejercicios desde la que se importa la biblioteca (nombre, grupo muscular, descripción, instrucciones, equipamiento e imagen). La importación se realiza una sola vez y los datos quedan almacenados en MySQL; las imágenes se descargan y se sirven localmente.
- **Correo transaccional** (tipo Resend, o SMTP propio) y **push (Firebase Cloud Messaging)**: servicios de envío de notificaciones (ver *Notificaciones*).

## Notificaciones

- **Mecanismo:** sistema de **notificaciones de Laravel** (una notificación con varios canales: `database`, `mail` y push), **encoladas** (`ShouldQueue`) para no bloquear las peticiones y lanzadas por el **scheduler** (`php artisan schedule`) para los avisos recurrentes.
- **Correo:** proveedor transaccional tipo **Resend** (alternativas: Mailgun, Postmark, Amazon SES o **SMTP propio**). En desarrollo se capturan los correos con **Mailpit**. Se usa para el **restablecimiento de contraseña** (Password Broker de Laravel, RF-06) y para avisos: recordatorio de vencimiento de cuota (RF-62), recordatorio de clases, resumen semanal y recibos.
- **Push:** **Firebase Cloud Messaging (FCM)** para avisos al navegador/app; alternativa *Web Push con VAPID*. Requiere un *service worker* en el frontend y el permiso del usuario.
- **Canales configurables:** la configuración del gimnasio decide qué avisos se envían y por qué canal (email y/o push) (RF-82).
- **In-app:** las notificaciones de la campana se guardan en el modelo `Notificacion` (canal `database`) y se rigen por RF-95.
- **Credenciales** (SMTP, FCM) se guardan cifradas en el backend y se configuran desde *Configuración → Integraciones*; nunca en el frontend ni en el repositorio.

## Entorno

- **Git + GitHub Actions**: control de versiones e integración continua (CI).
- **Script `run/dev.sh`**: levanta backend (Docker) y frontend (npm) en desarrollo.
