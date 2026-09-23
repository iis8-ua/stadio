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
- **MySQL**: base de datos (con `.sqlite` disponible para pruebas locales).
- **Docker + docker-compose**: contenedores para el backend (PHP-FPM + Nginx + MySQL) y despliegue reproducible.

## Integraciones externas

- **Stripe**: pasarela de pago para el cobro de la cuota mensual.
- **Tornos con pulsera NFC**: interfaz del sistema de control de accesos para registrar entradas/salidas.

## Entorno

- **Git + GitHub Actions**: control de versiones e integración continua (CI).
- **Script `run/dev.sh`**: levanta backend (Docker) y frontend (npm) en desarrollo.