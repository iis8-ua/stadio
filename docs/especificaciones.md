# Especificaciones del proyecto: *STADIO*

## 1. Descripción y alcance

STADIO es una aplicacion web integral para la gestión de un gimnasio. Centraliza la operativa completa del centro y el día a día de sus usuarios: clientes, empleados, clases, reservas, entrenamientos, rutinas, seguimiento del progreso, control de accesos, cuotas mensuales, instalaciones, analítica y un conjunto de funcionalidades inteligentes.

La aplicación se organiza en torno a tres roles con interfaces y permisos diferenciados:

- **Cliente**: consume las actividades del gimnasio (clases, entrenamientos, acceso, cuota) y consulta su progreso.
- **Entrenador**: gestiona sus clientes, crea y asigna rutinas, imparte clases y hace seguimiento del progreso.
- **Administrador**: controla la operativa completa del negocio (personas, ingresos, instalaciones, análisis).

## 2. Roles y tipos de usuario

**Cliente.** Usuario con una única cuota mensual. Accede al gimnasio mediante pulsera NFC. Puede reservar clases, seguir su rutina, registrar entrenamientos, consultar su progreso y análisis inteligente, revisar accesos y cuotas, y hacer preguntas al asistente virtual.

**Entrenador.** Acceso del personal docente del gimnasio. Agrupa dos perfiles de empleado que comparten el mismo espacio de trabajo, mostrando cada uno únicamente las opciones de su perfil:

- **Entrenador personal**: tiene clientes asignados, crea rutinas personalizadas a partir de una biblioteca de ejercicios y hace seguimiento de su progreso.
- **Monitor/instructor**: imparte clases colectivas y gestiona sus horarios y el material/equipamiento de cada clase.

**Administrador.** Gestiona clientes, empleados, clases, reservas, cuotas, accesos, instalaciones y la configuración del gimnasio. Dispone de analítica avanzada, insights inteligentes de negocio y control de todos los módulos.

La autenticación y la gestión de sesiones son comunes; cada rol determina las rutas, menús y permisos visibles. Además del rol de acceso, el personal docente tiene un **perfil** (entrenador personal / monitor/instructor), derivado de su rol de empleado, que restringe las opciones del portal de entrenador. El perfil docente es **único por empleado**: si un empleado acumulara varios roles docentes, se define uno como perfil principal y el portal muestra únicamente sus opciones. En el prototipo, la conmutación de perfil que aparece en la interfaz es solo una **ayuda de demostración**.

## 3. Funcionalidades del frontend

### Comunes

- Inicio de sesión, cierre de sesión y recuperación de contraseña (el alta de usuarios la realiza el administrador; no hay autorregistro).
- Autenticación en dos pasos (2FA/TOTP) obligatoria para el administrador (RF-96).
- Verificación del correo electrónico del cliente antes de poder reservar o pagar (RF-97).
- Gestión del perfil (foto de perfil —subir o quitar—, nombre, email, preferencias).
- Aplicación real de modo claro/oscuro, conmutable desde configuración.
- Diseño responsive (390 px a 1440 px) con sidebar en escritorio y menú lateral en móvil.
- Estados visuales completos: carga, vacío, error, éxito, deshabilitado, modal y confirmación.

### Cliente

- **Dashboard / Inicio**: entrenamiento de hoy, próxima clase, estado del gimnasio (abierto/cerrado, personas dentro, ocupación).
- **Entrenar**: vista de la rutina asignada (objetivo, frecuencia) con los ejercicios y **sus series individuales**, cada una con su propio peso, repeticiones, descanso, RIR y RPE.
- **Entrenamiento activo**: registro serie a serie con peso, repeticiones, RIR, RPE, temporizador de descanso y resumen final (volumen, series, duración).
- **Mi rutina**: el cliente puede crear y editar su propia rutina seleccionando ejercicios de la biblioteca (búsqueda por nombre y filtro por grupo muscular).
- **Progreso**: evolución de cargas por ejercicio, volumen, frecuencia y peso corporal, con gráficas intercambiables (semana, mes, 3 meses, 6 meses, año).
- **IA del cliente**: análisis inteligente de su historial (progreso, puntos fuertes, aspectos a mejorar, recomendaciones).
- **Reservas**: calendario por día/semana de clases, reserva y cancelación, mis reservas (próximas e historial). Sin lista de espera: si la clase está llena se muestra como "Clase completa" (estado por color y leyenda en el calendario). Las reservas ya pasadas se muestran como "Finalizada".
- **Accesos**: historial de entradas/salidas del mes y estado del aforo.
- **Cuota**: estado de la cuota del mes (pagada/pendiente), historial de cuotas y **datos bancarios** para activar la domiciliación.
- **Chatbot**: asistente virtual para resolver dudas sobre el gimnasio.

### Entrenador

Las opciones visibles dependen del perfil del empleado: el **entrenador personal** trabaja con clientes y rutinas; el **monitor/instructor**, con clases y materiales.

- **Dashboard** *(según perfil)*: el entrenador personal ve clientes asignados y rutinas pendientes de asignar en la semana; el monitor/instructor, las clases del día, la próxima clase y la asistencia a clases.
- **Clientes** *(entrenador personal)*: listado de clientes asignados con filtros (nombre, objetivo, orden por progreso) y ficha con datos del perfil (objetivo, peso actual/objetivo, datos personales), historial, gráficas de carga/volumen/peso, coaching (ritmo y recomendaciones) y planificación de rutinas.
- **Entrenador personal**: recibe clientes que han contratado el servicio de entrenador personal (solicitud del cliente y asignación por el administrador); solo ve los clientes asignados a él.
- **Rutinas** *(entrenador personal)*: biblioteca propia y creación/edición de rutinas (nombre, objetivo, días por semana, ejercicios con **series individuales**: cada serie con su propio peso, repeticiones, descanso, RIR y RPE). Planificación semanal: asignar una rutina a días concretos en un calendario.
- **Biblioteca de ejercicios** *(entrenador personal)*: el entrenador la consulta al crear o editar rutinas, con búsqueda por nombre y filtro por grupo muscular. El catálogo se nutre del importado desde la API externa de wger.
- **Clases** *(monitor/instructor)*: calendario semanal con clase, hora, sala, asistentes y capacidad; permite editar los materiales/equipamiento de cada clase.
- **Horarios**: agenda semanal propia (calendario por días) con el turno de trabajo asignado por el administrador y las actividades planificadas (clases y otras).
- **IA del personal docente**: análisis de sus clases colectivas y sesiones personales, y coaching por cliente (adherencia/ritmo y recomendaciones de mejora).

### Administrador

- **Dashboard**: KPIs (total de clientes, clases de hoy, ingresos del mes, accesos de hoy) con variación, gráficas de ingresos y ocupación, clases del día y altas recientes.
- **Clientes**: tabla con búsqueda, filtros (estado, cuota, entrenador personal), ordenación y acciones (crear, editar, desactivar, ver). Incluye asignar el identificador de pulsera NFC y gestionar el **entrenador personal** (asignar/cambiar/quitar; el cliente lo contrata desde su perfil).
- **Empleados**: gestión de personal (rol, horario, estado, clases asignadas) con alta, edición y baja.
- **Clases**: calendario administrativo con creación, edición, eliminación, asignación de monitor/instructor, capacidad, sala y materiales/equipamiento de cada clase.
- **Reservas**: reservas, ocupación por clase e historial.
- **Accesos**: personas dentro, capacidad y ocupación en tiempo real, detalle de entradas/salidas.
- **Cuotas**: pagadas, pendientes, ingresos, fecha de pago y gráficas. Una única cuota mensual.
- **Instalaciones**: máquinas, equipamiento, salas, mantenimiento e incidencias, con estados (disponible, mantenimiento, fuera de servicio).
- **Analítica**: evolución de usuarios, usuarios activos, ocupación, horas punta, clases populares, reservas, ingresos, accesos y retención, con filtros temporales.
- **IA**: insights inteligentes de negocio (ocupación, clases más demandadas, patrones de afluencia).
- **Configuración**: datos del gimnasio, usuarios, roles y permisos, horarios, clases, cuota mensual, notificaciones, integraciones y **dispositivos** (tornos/NFC), seguridad y preferencias.

## 4. Tipo de backend

Backend propio con **Laravel (PHP) y una API REST**, con **MySQL 8.0** como base de datos, orquestado con Docker. El frontend es una SPA con **React, TypeScript y Vite**, con Tailwind CSS.

La autenticación usa **Laravel Sanctum** (cookie de sesión para la SPA), con **2FA/TOTP (Laravel Fortify)** obligatoria para el administrador (RF-96) y **verificación de email** del cliente (RF-97).

La comunicación entre frontend y backend se realiza mediante una API REST en JSON. El control de accesos (tornos con pulsera NFC) y la pasarela de pago (Stripe) se integran desde el backend mediante sus respectivas interfaces.

## 5. Responsabilidades del backend

- Gestionar el registro, la autenticación, las sesiones y la recuperación de contraseñas.
- Almacenar y servir todos los datos del dominio: usuarios, rutinas, ejercicios, entrenamientos, clases, reservas, accesos, cuotas, instalaciones e incidencias.
- Aplicar el modelo de permisos por rol y perfil: un cliente solo accede a sus propios datos; el personal docente, a sus clientes y clases según su perfil; el administrador al conjunto del gimnasio.
- Gestionar reservas con control de aforo: impedir reservar una clase completa y evitar duplicados por cliente.
- Gestionar la cuota mensual única: evitar pagos duplicados, registrar el estado (pagada/pendiente) y actualizar el historial.
- Registrar entradas y salidas procedentes de los tornos/pulseras y calcular el aforo en tiempo real.
- Garantizar la integridad de los registros de entrenamiento (series pertenecientes a un entrenamiento del propio cliente).
- Validar los datos de entrada en todas las operaciones de escritura.
- Sostener el motor de análisis basado en reglas/heurísticas y el chatbot.
- Enviar notificaciones por correo y push (restablecimiento de contraseña, recordatorios de cuota y de clases, resumen semanal) de forma asíncrona y programada.

## 6. Integraciones externas

- **Control de accesos**: el gimnasio dispone de tornos de entrada a los que los clientes acceden con una pulsera NFC. El backend integra el lector/torno para registrar automáticamente entradas y salidas, identificando al usuario mediante el identificador de su pulsera. Sobre estos datos se calculan el historial de accesos y el aforo en tiempo real. La integración se especifica mediante la interfaz del dispositivo (identificador de pulsera por lectura y eventos de paso recibidos desde el sistema de tornos).
- **Pasarela de pago**: las cuotas mensuales se cobran a través de una pasarela de pago del tipo Stripe, con **tarjeta** o por **domiciliación bancaria** (cuenta del cliente, con el IBAN almacenado cifrado). El backend orquesta el cobro de la cuota del mes, valida la confirmación de la pasarela y actualiza el estado de la cuota y el historial de pagos.
- **Biblioteca de ejercicios**: la biblioteca se nutre del catálogo de **wger** (`https://wger.de/api/v2`), una API REST abierta de ejercicios. El backend importa los datos (nombre, grupo muscular, descripción, instrucciones, equipamiento e imagen), descarga las imágenes y los almacena en la base de datos, de modo que la aplicación no depende de la API en tiempo de ejecución.
- **Notificaciones (correo y push)**: el backend envía avisos por **correo** (proveedor transaccional tipo Resend o SMTP propio) y **push** (Firebase Cloud Messaging) mediante el sistema de notificaciones de Laravel, de forma **asíncrona** (colas) y **programada** (scheduler) para recordatorios de cuota, clases y resumen semanal; los canales activos (email/push) se configuran en la configuración del gimnasio. El detalle del stack está en `docs/tecnologias.md`.

Las integraciones de hardware y pago se implementan de forma real contra el entorno correspondiente (hardware de acceso y entorno de pruebas de la pasarela); la biblioteca de ejercicios se importa desde la API pública de wger.

## 7. Inteligencia artificial

La aplicación incorpora dos subsistemas diferenciados, ambos basados en reglas y heurísticas sobre los datos registrados:

**Análisis inteligente** Analiza el historial del cliente y los datos del gimnasio para generar recomendaciones e insights:

- Para el cliente: detección de estancamientos de cargas, grupos musculares con menor frecuencia, equilibrio del entrenamiento según el objetivo, señales de sobreentrenamiento o falta de recuperación, y recomendaciones de progresión de peso y planificación semanal.
- Para el administrador: patrones de ocupación y horas punta, clases más demandadas, días de mayor afluencia y recomendaciones de gestión.
- Para el personal docente: análisis de sus clases colectivas y sesiones personales, y coaching por cliente (ritmo/adherencia y qué ajustar en su entrenamiento).

**Chatbot** Módulo destinado al cliente para resolver dudas sobre el gimnasio (horarios, clases, reservas, cuota, acceso e instalaciones) mediante reglas sobre la información del centro. Es un subsistema distinto del análisis inteligente.


