# Especificaciones del proyecto: *STADIO*

*Aplicación web inteligente para la gestión de gimnasios*

## 1. Descripción y alcance

STADIO es una aplicacion web integral para la gestión de un gimnasio. Centraliza la operativa completa del centro y el día a día de sus usuarios: clientes, empleados, clases, reservas, entrenamientos, rutinas, seguimiento del progreso, control de accesos, cuotas mensuales, instalaciones, analítica y un conjunto de funcionalidades inteligentes.

La aplicación se organiza en torno a tres roles con interfaces y permisos diferenciados:

- **Cliente**: consume las actividades del gimnasio (clases, entrenamientos, acceso, cuota) y consulta su progreso.
- **Entrenador**: gestiona sus clientes, crea y asigna rutinas, imparte clases y hace seguimiento del progreso.
- **Administrador**: controla la operativa completa del negocio (personas, ingresos, instalaciones, análisis).

Quedan fuera del alcance las funcionalidades que no forman parte de la gestión de un gimnasio con esta estructura de roles: redes sociales, marketplace o contenido comunitario.

## 2. Roles y tipos de usuario

**Cliente.** Usuario con una única cuota mensual. Accede al gimnasio mediante pulsera NFC. Puede reservar clases, seguir su rutina, registrar entrenamientos, consultar su progreso y análisis inteligente, revisar accesos y cuotas, y hacer preguntas al asistente virtual.

**Entrenador.** Empleado del gimnasio con clientes asignados. Crea rutinas personalizadas a partir de una biblioteca de ejercicios, registra y gestiona clases, consulta horarios y hace seguimiento del progreso de sus clientes.

**Administrador.** Gestiona clientes, empleados, clases, reservas, cuotas, accesos, instalaciones y la configuración del gimnasio. Dispone de analítica avanzada, insights inteligentes de negocio y control de todos los módulos.

La autenticación y la gestión de sesiones son comunes; cada rol determina las rutas, menús y permisos visibles.

## 3. Funcionalidades del frontend

### Comunes

- Inicio de sesión, cierre de sesión y recuperación de contraseña (el alta de usuarios la realiza el administrador; no hay autorregistro).
- Gestión del perfil (foto de perfil —subir o quitar—, nombre, email, preferencias).
- Aplicación real de modo claro/oscuro, conmutable desde configuración.
- Diseño responsive (390 px a 1440 px) con sidebar en escritorio y menú lateral en móvil.
- Estados visuales completos: carga, vacío, error, éxito, deshabilitado, modal y confirmación.

### Cliente

- **Dashboard / Inicio**: entrenamiento de hoy, próxima clase, estado del gimnasio (abierto/cerrado, personas dentro, ocupación).
- **Entrenar**: vista de la rutina asignada (objetivo, frecuencia) con los ejercicios y **sus series individuales**, cada una con su propio peso, repeticiones, descanso, RIR y RPE.
- **Entrenamiento activo**: registro serie a serie con peso, repeticiones, RIR, RPE, temporizador de descanso y resumen final (volumen, series, duración).
- **Progreso**: evolución de cargas por ejercicio, volumen, frecuencia y peso corporal, con gráficas intercambiables (semana, mes, 3 meses, 6 meses, año).
- **IA del cliente**: análisis inteligente de su historial (progreso, puntos fuertes, aspectos a mejorar, recomendaciones).
- **Reservas**: calendario por día/semana de clases, reserva y cancelación, mis reservas (próximas e historial). Sin lista de espera: si la clase está llena se muestra como "Clase completa" (estado por color y leyenda en el calendario). Las reservas ya pasadas se muestran como "Finalizada".
- **Accesos**: historial de entradas/salidas del mes y estado del aforo.
- **Cuota**: estado de la cuota del mes (pagada/pendiente) e historial de cuotas.
- **Chatbot**: asistente virtual para resolver dudas sobre el gimnasio.

### Entrenador

- **Dashboard**: clases del día, clientes asignados, rutinas pendientes de asignar en la semana, próxima clase y asistencia a clases.
- **Clientes**: listado de clientes asignados con filtros (nombre, objetivo, orden por progreso) y ficha con datos del perfil (objetivo, peso actual/objetivo, datos personales), historial, gráficas de carga/volumen/peso, coaching (ritmo y recomendaciones) y planificación de rutinas.
- **Entrenador personal**: recibe clientes que han contratado el servicio de entrenador personal (solicitud del cliente y asignación por el administrador); solo ve los clientes asignados a él.
- **Rutinas**: biblioteca propia y creación/edición de rutinas (nombre, objetivo, días por semana, ejercicios con **series individuales**: cada serie con su propio peso, repeticiones, descanso, RIR y RPE). Planificación semanal: asignar una rutina a días concretos en un calendario.
- **Biblioteca de ejercicios**: ejercicios organizados por grupo muscular, con búsqueda y alta de nuevos.
- **Clases**: calendario semanal con clase, hora, sala, asistentes y capacidad; permite editar los materiales/equipamiento de cada clase.
- **Horarios**: agenda semanal propia (calendario por días) con el turno de trabajo asignado por el administrador y las actividades planificadas (clases y otras).
- **IA del entrenador**: análisis de sus clases colectivas y sesiones personales, y coaching por cliente (adherencia/ritmo y recomendaciones de mejora).

### Administrador

- **Dashboard**: KPIs (total de clientes, clases de hoy, ingresos del mes, accesos de hoy) con variación, gráficas de ingresos y ocupación, clases del día y altas recientes.
- **Clientes**: tabla con búsqueda, filtros (estado, cuota, entrenador), ordenación y acciones (crear, editar, desactivar, ver). Incluye asignar el identificador de pulsera NFC y gestionar el **entrenador personal** (asignar/cambiar/quitar; el cliente lo contrata desde su perfil).
- **Empleados**: gestión de personal (rol, horario, estado, clases asignadas) con alta, edición y baja.
- **Clases**: calendario administrativo con creación, edición, eliminación, asignación de entrenador, capacidad, sala y materiales/equipamiento de cada clase.
- **Reservas**: reservas, ocupación por clase e historial.
- **Accesos**: personas dentro, capacidad y ocupación en tiempo real, detalle de entradas/salidas.
- **Cuotas**: pagadas, pendientes, ingresos, fecha de pago y gráficas. Una única cuota mensual.
- **Instalaciones**: máquinas, equipamiento, salas, mantenimiento e incidencias, con estados (disponible, mantenimiento, fuera de servicio).
- **Analítica**: evolución de usuarios, usuarios activos, ocupación, horas punta, clases populares, reservas, ingresos, accesos y retención, con filtros temporales.
- **IA**: insights inteligentes de negocio (ocupación, clases más demandadas, patrones de afluencia).
- **Configuración**: datos del gimnasio, usuarios, roles y permisos, horarios, clases, cuota mensual, notificaciones, integraciones, seguridad y preferencias.

## 4. Tipo de backend

Backend propio con **Laravel (PHP) y una API REST**, con **MySQL** como base de datos, orquestado con Docker. El frontend es una SPA con **React, TypeScript y Vite**, con Tailwind CSS.

La comunicación entre frontend y backend se realiza mediante una API REST en JSON. El control de accesos (tornos con pulsera NFC) y la pasarela de pago (Stripe) se integran desde el backend mediante sus respectivas interfaces.

## 5. Responsabilidades del backend

- Gestionar el registro, la autenticación, las sesiones y la recuperación de contraseñas.
- Almacenar y servir todos los datos del dominio: usuarios, rutinas, ejercicios, entrenamientos, clases, reservas, accesos, cuotas, instalaciones e incidencias.
- Aplicar el modelo de permisos por rol: un cliente solo accede a sus propios datos; un entrenador solo a sus clientes y a sus clases; el administrador al conjunto del gimnasio.
- Gestionar reservas con control de aforo: impedir reservar una clase completa y evitar duplicados por cliente.
- Gestionar la cuota mensual única: evitar pagos duplicados, registrar el estado (pagada/pendiente) y actualizar el historial.
- Registrar entradas y salidas procedentes de los tornos/pulseras y calcular el aforo en tiempo real.
- Garantizar la integridad de los registros de entrenamiento (series pertenecientes a un entrenamiento del propio cliente).
- Validar los datos de entrada en todas las operaciones de escritura.
- Sostener el motor de análisis basado en reglas/heurísticas y el chatbot.

## 6. Integraciones externas

- **Control de accesos**: el gimnasio dispone de tornos de entrada a los que los clientes acceden con una pulsera NFC. El backend integra el lector/torno para registrar automáticamente entradas y salidas, identificando al usuario mediante el identificador de su pulsera. Sobre estos datos se calculan el historial de accesos y el aforo en tiempo real. La integración se especifica mediante la interfaz del dispositivo (identificador de pulsera por lectura y eventos de paso recibidos desde el sistema de tornos).
- **Pasarela de pago**: las cuotas mensuales se cobran a través de una pasarela de pago del tipo Stripe. El backend orquesta el cobro de la cuota del mes, valida la confirmación de la pasarela y actualiza el estado de la cuota y el historial de pagos.

Ambas integraciones se implementan de forma real contra el entorno correspondiente (hardware de acceso y entorno de pruebas de la pasarela).

## 7. Inteligencia artificial

La aplicación incorpora dos subsistemas diferenciados, ambos basados en reglas y heurísticas sobre los datos registrados:

**Análisis inteligente** Analiza el historial del cliente y los datos del gimnasio para generar recomendaciones e insights:

- Para el cliente: detección de estancamientos de cargas, grupos musculares con menor frecuencia, equilibrio del entrenamiento según el objetivo, señales de sobreentrenamiento o falta de recuperación, y recomendaciones de progresión de peso y planificación semanal.
- Para el administrador: patrones de ocupación y horas punta, clases más demandadas, días de mayor afluencia y recomendaciones de gestión.
- Para el entrenador: análisis de sus clases colectivas y sesiones personales, y coaching por cliente (ritmo/adherencia y qué ajustar en su entrenamiento).

**Chatbot** Módulo destinado al cliente para resolver dudas sobre el gimnasio (horarios, clases, reservas, cuota, acceso e instalaciones) mediante reglas sobre la información del centro. Es un subsistema distinto del análisis inteligente.

## 8. Modelo de datos

Entidades de dominio principales, con sus campos más relevantes:

```
Usuario: id, nombre, email, hash_contraseña, telefono, avatar, sexo, fecha_nacimiento, direccion,
    ciudad, codigo_postal, rol (cliente/entrenador/administrador), estado (activo/desactivado),
    fecha_alta, identificador_pulsera (NFC)

Empleado: id, roles (entrenador/monitor/instructor/personal/recepción/limpieza), horario_semanal,
    disponibilidad, salario_tipo (mensual/por horas), salario   (subconjunto de Usuario con rol de empleado)
    usuario -> Usuario (1:1)
    vacaciones -> PeriodoVacaciones (1:N)

Entrenador: id, especialidad   (subconjunto de Empleado)
    empleado -> Empleado (1:1)
    actividades -> ActividadEntrenador (1:N)

PeriodoVacaciones: id, fecha_inicio, fecha_fin
    empleado -> Empleado (N:1)

Cliente: id, objetivo, peso, peso_objetivo, frecuencia, progreso (actualizado por el seguimiento)
    usuario -> Usuario (1:1)
    cuenta_bancaria -> CuentaBancaria (1:0..1)
    asignaciones_rutina -> AsignacionRutina (1:N)   (planificación de rutinas por fechas)
    entrenador_personal -> AsignacionEntrenador (1:N)   (servicio contratado y asignado)

CuentaBancaria: id, titular, iban, cobro_automatico
    cliente -> Cliente (1:1)

Configuracion: id, nombre, direccion, ciudad, telefono, capacidad, importe_cuota, dia_cobro,
    notificaciones (recordatorio de cuota, recordatorio de clases, resumen semanal, canal email, canal push)
    horario -> HorarioGimnasio (1:N)   (un registro por día de la semana)
    festivos -> Festivo (1:N)

HorarioGimnasio: id, dia_semana, hora_apertura, hora_cierre, cerrado
Festivo: id, fecha, hora_apertura, hora_cierre, cerrado

Permiso: id, codigo, nombre, descripcion, grupo
    roles -> RolPermiso (1:N)
RolPermiso: id, rol (cliente/entrenador/administrador)
    permiso -> Permiso (N:1)

AsignacionRutina: id, fecha
    cliente -> Cliente (N:1)
    rutina -> Rutina (N:1)

AsignacionEntrenador: id, estado (solicitada/asignada/finalizada), fecha_solicitud, fecha_asignacion
    cliente -> Cliente (N:1)
    entrenador -> Entrenador (N:1)

TipoClase: id, nombre, descripcion
    clases -> Clase (1:N)
    entrenadores -> EntrenadorTipoClase (1:N)   (tipos que puede impartir cada entrenador)

Clase: id, nombre, descripcion, fecha_hora, duracion, capacidad
    tipo_clase -> TipoClase (N:1)
    sala -> Sala (N:1)
    entrenador -> Entrenador (N:1)
    materiales -> Equipo (N:M)

EntrenadorTipoClase: id
    entrenador -> Entrenador (N:1)
    tipo_clase -> TipoClase (N:1)

ActividadEntrenador: id, fecha, hora_inicio, hora_fin, titulo
    entrenador -> Entrenador (N:1)
    sala -> Sala (N:0..1)

Reserva: id, fecha, estado (confirmada/pendiente/cancelada/finalizada)
    cliente -> Cliente (N:1)
    clase -> Clase (N:1)
    (no puede haber dos reservas activas del mismo cliente para la misma clase)

Ejercicio: id, nombre, grupo_muscular, descripcion

Rutina: id, nombre, objetivo (hipertrofia/fuerza/pérdida de grasa/resistencia...), dias_semana
    creada_por -> Entrenador (N:1)
    ejercicios: rutina_ejercicio (id, notas) -> Ejercicio
        series: rutina_serie (numero_serie, peso, repeticiones, descanso, rir, rpe)   (cada serie con sus propios valores)

Entrenamiento: id, fecha, duracion, estado (en curso/finalizado), volumen_total
    cliente -> Cliente (N:1)
    rutina -> Rutina (N:1)

Serie: id, numero_serie, peso, repeticiones, rir, rpe, descanso, notas
    entrenamiento -> Entrenamiento (N:1)
    ejercicio -> Ejercicio (N:1)

Acceso: id, timestamp, tipo (entrada/salida), metodo (pulsera NFC leída en el torno; ampliable a otros métodos)
    usuario -> Usuario (N:1)
    (el acceso es solo con pulsera NFC; no hay registro manual) (todos los accesos se registran; el aforo se calcula como diferencia entre entradas y salidas)

Cuota: id, periodo (mes/año), importe, estado (pagada/pendiente), fecha_pago, metodo, ref_transaccion
    cliente -> Cliente (N:1)
    (una única cuota mensual por cliente; no puede haber duplicados de cliente+periodo)

Sala: id, nombre, capacidad, estado (disponible/no disponible)

Equipo: id, nombre, tipo, estado (disponible/mantenimiento/fuera de servicio), fecha_ultimo_mantenimiento
    sala -> Sala (N:1)

Incidencia: id, titulo, descripcion, ubicacion, tipo (mantenimiento/incidencia), estado, fecha
    equipo -> Equipo (N:0..1)
    reportada_por -> Usuario (N:1)

Notificacion: id, titulo, texto, detalle, tipo (info/aviso/éxito/error), leido, fecha
    usuario -> Usuario (N:1)

Mensaje_chatbot: id, texto_usuario, texto_respuesta, fecha
    cliente -> Cliente (N:1)
```

Relaciones principales entre las entidades de dominio (sin contar Usuario): un **cliente** tiene una **planificación de rutinas por fechas** (`AsignacionRutina`) y puede tener un **entrenador personal** asignado (`AsignacionEntrenador`); cada **rutina** agrupa **ejercicios**, y cada ejercicio agrupa **series individuales** (`RutinaSerie`) con sus propios valores; los **entrenamientos** registran **series** de ejercicios y pertenecen al cliente; un **cliente** hace **reservas** de **clases** (con sus **materiales**), que se imparten en **salas**; los **accesos** se asocian al usuario y alimentan el aforo; cada **cliente** mantiene una **cuota** mensual; el **entrenador** tiene una **agenda** propia (`ActividadEntrenador`); las **incidencias** afectan a los **equipos** ubicados en **salas**. Además, un **empleado** (con sus **periodos de vacaciones**) puede ser **entrenador**; cada **cliente** puede tener una **cuenta bancaria** para el cobro; la **configuración** del gimnasio agrupa **horarios** y **festivos**; los **roles** se asocian a **permisos**; y cada **clase** pertenece a un **tipo de clase**.


