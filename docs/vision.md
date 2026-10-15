# Contexto del proyecto: *STADIO*

## 1. Contexto y problema

De manera general, la gestión diaria de un gimnasio comprende numerosos procesos relacionados con la administración de clientes, la planificación de clases, las reservas, el cobro de cuotas, el control de accesos, la gestión de instalaciones y el seguimiento del entrenamiento de los clientes.

En este proyecto he identificado un problema real que he visto. En este gimnasio he visto como todas las tecnologias que usan estan desfasadas o se hace todo de una manera manual como puede ser el conteo de los usuarios que usan un tipo de sala en concreto, o la planificación de entrenamientos personales para el cliente se hacen a papel o en pizarras, es por eso que como usuario de este gimnasio me veo casi en la obligacion de actualizar estas tecnologias muy antiguas de su aplicacion actual y mejorar la experiencia de los clientes, además es solo para los clientes asi que hay otra para la gestion del gimnasio, y de reducir la intervención humana para llevar a cabo una gestion eficiente.

Tras una serie de investigaciones y análisis he llegado a la conclusión de estos problemas por parte del gimnasio al que voy:

- **Fragmentación de la información**: ausencia de una visión unificada de los clientes, las clases, las reservas, las cuotas y los accesos.
- **No hay seguimiento del entrenamiento**: no hay integrado nada para elaborar las rutinas, registrar las sesiones y analizar la evolución de los clientes.
- **Procesos manuales**: dependencia de tareas repetitivas para gestionar reservas, planificar entrenamientos y controlar determinadas instalaciones.
- **Control del aforo**: dificultad para conocer en tiempo real la ocupación del centro o de salas específicas cuando el control se realiza manualmente.
- **Limitaciones en la toma de decisiones**: falta de información consolidada y de herramientas de análisis que ayuden a evaluar la actividad del gimnasio.
- **Experiencia digital mejorable**: utilización de herramientas que no ofrecen una experiencia integrada para los clientes y el personal del centro.


Como solucion propuesta, **STADIO** propone una aplicación web integral que centralice la operativa del gimnasio en una única plataforma, con interfaces y permisos diferenciados según el perfil de usuario.

La solución combinará la gestión administrativa con las funcionalidades destinadas a los clientes y al personal técnico. Asimismo, incorporará integraciones con servicios externos y dispositivos de control de acceso, junto con herramientas inteligentes basadas en reglas y heurísticas.

El objetivo no es únicamente digitalizar los procesos existentes, sino también mejorar la coherencia de la información, reducir las tareas repetitivas y facilitar el seguimiento de la actividad del gimnasio.

---

## 2. Objetivos

### Objetivo general

Diseñar y desarrollar una **aplicación web inteligente e integral para la gestión de un gimnasio**, capaz de centralizar la operativa del centro y las actividades de sus usuarios mediante una API REST propia, integraciones con servicios externos y funcionalidades de análisis y asistencia.

### Objetivos específicos

1. Identificar, definir y priorizar los requisitos funcionales y no funcionales del sistema.
2. Implementar la autenticación, la gestión de roles y los permisos de acceso para clientes, entrenadores y administradores.
3. Desarrollar los **módulos de gestión** de clientes, empleados, clases, reservas y cuotas, incluyendo la integración con una pasarela de pago.
4. Implementar la **gestión de rutinas**, la consulta de una biblioteca de ejercicios y el registro de entrenamientos con seguimiento de la evolución del cliente.
5. Integrar el **control de accesos** mediante pulseras NFC y desarrollar un mecanismo de cálculo de la **ocupación del centro y de sus salas**.
6. Incorporar **funcionalidades inteligentes** basadas en reglas y heurísticas para ofrecer análisis y recomendaciones a clientes, entrenadores y administradores, además de un chatbot de asistencia.
7. Preparar un **entorno reproducible de desarrollo y despliegue** mediante Docker Compose e incorporar mecanismos de integración continua.
8. Verificar la calidad del software mediante **pruebas**.

---

## 3. Alcance de la solución

**Dentro del alcance:**

- **Usuarios y seguridad**: autenticación, recuperación de contraseña, gestión de perfiles, roles y permisos.
- **Gestión de personas**: administración de clientes y empleados, incluidos entrenadores personales y monitores.
- **Clases y reservas**: planificación de clases, consulta del calendario, gestión de plazas, reservas y materiales necesarios.
- **Entrenamiento**: creación y asignación de rutinas, biblioteca de ejercicios, registro de sesiones y seguimiento del progreso.
- **Control de accesos**: identificación mediante NFC, registro de entradas y salidas, historial de accesos y cálculo de ocupación.
- **Cuotas y pagos**: gestión de una cuota mensual única, registro de pagos e integración con Stripe (tarjeta y domiciliación).
- **Instalaciones**: gestión de salas y equipamiento, mantenimiento e incidencias.
- **Análisis inteligente**: generación de indicadores, detección de situaciones relevantes y recomendaciones basadas en reglas y heurísticas.
- **Asistencia conversacional**: chatbot orientado a resolver dudas sobre el gimnasio (horarios, clases, reservas, cuota, accesos e instalaciones).
- **Notificaciones**: avisos dentro de la aplicación (campana), notificaciones por correo electrónico y notificaciones **push** (FCM), según los canales que configure el gimnasio.
- **Administración y analítica**: configuración del gimnasio, paneles de indicadores y herramientas de seguimiento de la actividad.

**Alcance técnico**

La solución se plantea con una arquitectura cliente-servidor y una separación clara entre la interfaz web y la lógica de negocio.

- **Frontend**: aplicación web SPA desarrollada con React, TypeScript y Vite.
- **Backend**: API REST desarrollada con Laravel y PHP.
- **Base de datos**: MySQL.
- **Entorno de ejecución**: contenedores Docker y orquestación mediante Docker Compose.
- **Integraciones externas**: Stripe para pagos, wger para consultar ejercicios y un dispositivo compatible con NFC para el control de accesos.
- **Calidad y automatización**: pruebas automatizadas e integración continua mediante **GitHub Actions**.

**Fuera del alcance:**

- Redes sociales, marketplace o contenido comunitario.
- Aplicaciones móviles nativas (la interfaz es web responsive).
- Pasarelas de pago distintas de la elegida (no hay planes de cuota diferenciados: una única cuota mensual).

---

## 4. Actores interesados

| Actor | Interés |
|-------|---------|
| **Gimnasio** | Centralizar la gestión, reducir tareas manuales y disponer de información para mejorar la operativa |
| **Cliente** | Consultar y registrar sus entrenamientos, reservar clases, gestionar su cuota y utilizar el control de acceso |
| **Entrenador personal** | Gestionar los clientes asignados, diseñar rutinas y realizar un seguimiento de su evolución |
| **Monitor / instructor** | Consultar las clases asignadas, gestionar su planificación y disponer de los materiales necesarios |
| **Administración** | Gestionar personas, clases, cuotas, instalaciones, accesos e indicadores del negocio |

---

## 5. Perfil de usuario y propuesta de valor

STADIO se organiza en torno a **tres roles** con interfaces y permisos diferenciados:

**Cliente**
El cliente va a poder hacer:

- Consultar su actividad y sus entrenamientos.
- Acceder a sus rutinas y registrar sesiones.
- Consultar su progreso y recibir recomendaciones.
- Reservar clases y consultar sus reservas.
- Gestionar su información personal y su cuota.
- Consultar su historial de accesos y la información de ocupación disponible para los clientes.
- Consultar sus dudas con el asistente virtual (chatbot).

**Entrenador**
Este va a tener dos tipos de perfiles:

- **Entrenador personal**: gestionará los clientes que tenga asignados, creará y modificará sus rutinas y consultará su evolución.
- **Monitor o instructor**: gestionará la información de las clases que tenga asignadas, consultará los asistentes de esas clases y preparará los materiales necesarios.
- Ambos perfiles dispondrán de un **análisis inteligente y coaching** (clases colectivas, sesiones personales y ritmo de sus clientes).

**Administrador**
El administrador va a poder realizar:

- Gestionar clientes, empleados y permisos.
- Configurar clases, reservas, cuotas e instalaciones.
- Supervisar los pagos y los accesos.
- Consultar la ocupación del centro y de sus salas.
- Revisar indicadores operativos y económicos.
- Consultar los resultados del análisis inteligente y gestionar la configuración general.

**Propuesta de valor**: *una única plataforma* que cubre la operativa completa del gimnasio, con seguimiento real del cliente y toma de decisiones basada en datos.

---

## 6. Supuestos y restricciones

Este desarrollo va a tener estos supuestos y restricciones que se van a tener en cuenta:

- **Dedicación**: aproximadamente 20 horas semanales, compatibilizando el proyecto con otros estudios y responsabilidades.
- **Duración**: el alcance deberá ajustarse al calendario académico y a las fechas acordadas con la tutoría.
- **Hardware NFC**: se requiere disponer de un lector o dispositivo compatible para validar la integración física. Su disponibilidad y compatibilidad deberán comprobarse.
- **Pagos**: Stripe se utilizará inicialmente en un entorno de pruebas. No se considerará acreditado el funcionamiento de cobros reales hasta disponer de una configuración y autorización adecuadas.
- **Catálogo de ejercicios**: se utilizará la API de wger, sujeta a la disponibilidad del servicio, sus condiciones de uso y sus limitaciones.
- **Funciones inteligentes**: las recomendaciones se basarán inicialmente en reglas y heurísticas definidas explícitamente, sin depender de modelos de lenguaje.
- **Interfaz**: la aplicación será responsive y se diseñará para navegadores actuales de escritorio y dispositivos móviles.
- **Protección de datos**: el diseño deberá considerar el RGPD, la minimización de datos, el control de acceso y la protección de la información personal.
- **Despliegue**: el entorno deberá poder reproducirse mediante Docker Compose.
- **Calidad**: las funcionalidades principales deberán contar con pruebas apropiadas y criterios verificables de aceptación.

---

## 7. Criterios de éxito

Para que el proyecto se considere que ha cumplido con todos los objetivos que se han tenido en mente cuando se cumplan los siguientes criterios:

1. Los requisitos clasificados como Must estén implementados y verificados mediante pruebas.
2. Los flujos esenciales de autenticación, gestión de personas, entrenamiento, reservas, cuotas y administración funcionen correctamente.
3. Las integraciones incluidas en el alcance se hayan validado de extremo a extremo dentro de las condiciones acordadas. En particular, Stripe se validará en pruebas y el NFC dependerá de la disponibilidad del hardware compatible.
4. El sistema pueda desplegarse de forma reproducible mediante Docker Compose.
5. La aplicación aplique correctamente los permisos por rol y proteja la información de los usuarios.
6. Las funcionalidades inteligentes produzcan resultados coherentes con las reglas definidas y puedan verificarse mediante pruebas.
7. La documentación técnica y metodológica sea coherente con la implementación final.

