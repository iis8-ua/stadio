# Requisitos del sistema: *STADIO*

Documento de requisitos funcionales y no funcionales derivado de `docs/especificaciones.md`.

## Convenciones

- Cada requisito tiene un ID correlativo: **RF-xx** (requisito funcional) o **RNF-xx** (requisito no funcional), una descripción breve y su prioridad.
- Prioridades según **MoSCoW**:
  - **Must**: imprescindible para la primera versión funcional.
  - **Should**: importante, pero puede posponerse tras lo imprescindible.
  - **Could**: deseable, se implementa si hay margen.

---

# I. Requisitos funcionales

## 1. Autenticación y usuarios

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-01 | El usuario puede iniciar sesión con email y contraseña. | Must |
| RF-02 | El usuario puede cerrar sesión. | Must |
| RF-03 | La sesión se redirige al espacio correspondiente según el rol (cliente, entrenador, administrador). | Must |
| RF-04 | Solo el administrador puede dar de alta clientes y empleados (no hay auto-registro). | Must |
| RF-05 | Las rutas y el menú se restringen según el rol; un cliente no accede a rutas de entrenador o admin. | Must |
| RF-06 | El usuario puede recuperar su contraseña por email. | Should |
| RF-07 | El usuario puede cambiar su contraseña desde su perfil. | Should |
| RF-08 | El usuario puede editar su perfil (nombre, teléfono, dirección, foto de perfil —subir o quitar—, datos bancarios). | Should |
| RF-09 | La sesión expira tras un periodo de inactividad. | Should |

## 2. Gestión de clientes

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-10 | El administrador puede crear un cliente con sus datos personales. | Must |
| RF-11 | El administrador puede editar los datos de un cliente. | Must |
| RF-12 | El administrador puede desactivar y reactivar un cliente. | Must |
| RF-13 | El listado de clientes permite buscar, filtrar y ordenar. | Must |
| RF-14 | El administrador puede ver la ficha del cliente con su historial (actividad, accesos, reservas, entrenamientos, cuotas). | Must |
| RF-15 | El administrador puede asignar el identificador de pulsera NFC de un cliente. | Must |
| RF-16 | El entrenador puede consultar la ficha y el progreso de sus clientes asignados. | Should |

## 3. Gestión de empleados (entrenadores)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-17 | El administrador puede crear, editar y desactivar empleados. | Must |
| RF-18 | El listado de empleados muestra rol, horario, estado y clases asignadas. | Should |
| RF-19 | Se puede asignar horario y disponibilidad a un entrenador. | Could |
| RF-20 | El administrador puede asignar clases a un entrenador. | Must |

## 4. Clases

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-21 | El administrador puede crear una clase (nombre, fecha/hora, duración, capacidad, sala, entrenador). | Must |
| RF-22 | El administrador puede editar o eliminar una clase. | Must |
| RF-23 | El calendario de clases es visible para cliente, entrenador y administrador. | Must |
| RF-24 | Cada clase respeta su capacidad máxima de plazas. | Must |
| RF-25 | El entrenador puede ver sus clases con asistentes y capacidad. | Should |

## 5. Reservas

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-26 | Un cliente puede reservar una clase con plazas disponibles. | Must |
| RF-27 | Un cliente puede cancelar su propia reserva. | Must |
| RF-28 | No se puede reservar una clase completa (se muestra "Clase completa"; sin lista de espera). | Must |
| RF-29 | No puede haber dos reservas activas del mismo cliente en la misma clase. | Must |
| RF-30 | El cliente ve sus próximas reservas y su historial de reservas (las reservas pasadas se muestran como "Finalizada"). | Must |
| RF-31 | El administrador puede consultar las reservas y la ocupación por clase. | Should |

## 6. Rutinas y ejercicios

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-32 | La biblioteca de ejercicios está organizada por grupo muscular. | Must |
| RF-33 | Se puede buscar un ejercicio por nombre. | Must |
| RF-34 | El entrenador puede crear y editar una rutina (nombre, objetivo, días por semana, ejercicios con **series individuales**: cada serie con su propio peso, repeticiones, descanso, RIR y RPE). | Must |
| RF-35 | El entrenador puede planificar las rutinas de un cliente en un **calendario semanal**, asignando una rutina a días concretos. | Must |
| RF-36 | El cliente puede ver su rutina asignada. | Must |
| RF-37 | El entrenador puede añadir nuevos ejercicios a la biblioteca. | Should |
| RF-38 | El entrenador puede eliminar una rutina. | Should |

## 7. Entrenamiento activo

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-39 | El cliente puede iniciar un entrenamiento desde su rutina. | Must |
| RF-40 | El cliente puede registrar cada serie con peso, repeticiones, RIR, RPE, descanso y notas. | Must |
| RF-41 | El sistema navega entre ejercicios y permite finalizar el entrenamiento. | Must |
| RF-42 | Al finalizar se muestra un resumen (ejercicios, series, duración y volumen total). | Must |
| RF-43 | Cada entrenamiento queda guardado en el historial del cliente. | Must |
| RF-44 | Durante el entrenamiento corre un temporizador de descanso. | Should |

## 8. Progreso

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-45 | Se muestra la evolución de cargas por ejercicio en gráfica. | Should |
| RF-46 | Se muestran métricas de frecuencia, volumen y peso corporal. | Should |
| RF-47 | Las gráficas se pueden filtrar por semana, mes, 3 meses, 6 meses y año. | Should |
| RF-48 | Se pueden hacer comparativas entre periodos. | Could |

## 9. Control de accesos

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-49 | El torno registra la entrada y la salida del cliente mediante su pulsera NFC. | Must |
| RF-50 | Cada acceso se asocia al usuario por el identificador de su pulsera. | Must |
| RF-51 | El cliente puede ver su historial de accesos (fecha, entrada, salida, duración). | Must |
| RF-52 | El aforo en tiempo real muestra personas dentro, capacidad y porcentaje de ocupación. | Must |
| RF-53 | Un acceso sin salida registrada se muestra como "salida no registrada" (sin inventar datos). | Should |

> Nota: el acceso al gimnasio es **exclusivamente con la pulsera NFC** leída en el torno (pulsera = torno). **No existe registro manual** de accesos. El campo `metodo` se mantiene por si en el futuro se incorpora otro método.

## 10. Cuotas y pagos

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-55 | Existe una única cuota mensual para todos los clientes (sin planes diferenciados). | Must |
| RF-56 | El cliente puede pagar su cuota con tarjeta mediante la pasarela de pago (Stripe u otra). | Must |
| RF-57 | Si el perfil tiene la cuenta bancaria del cliente, el cobro se realiza automáticamente el día del vencimiento. | Must |
| RF-58 | El sistema registra el estado de la cuota de cada mes (pagada/pendiente) con su fecha de pago. | Must |
| RF-59 | No puede haber cuotas duplicadas del mismo cliente y periodo. | Must |
| RF-60 | El cliente ve el estado de su cuota y su historial de pagos. | Must |
| RF-61 | El administrador consulta cuotas pagadas/pendientes, ingresos y fechas de pago. | Must |
| RF-62 | El sistema notifica al cliente el vencimiento de la cuota. | Should |
| RF-63 | El administrador puede marcar manualmente una cuota como pagada. | Could |

## 11. Instalaciones

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-64 | El administrador gestiona las salas del gimnasio. | Should |
| RF-65 | El administrador gestiona los equipos por sala. | Should |
| RF-66 | Cada equipo tiene estado: disponible, mantenimiento o fuera de servicio. | Should |
| RF-67 | Se pueden registrar incidencias y mantenimientos de equipos. | Should |

## 12. Analítica (administrador)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-68 | El dashboard muestra KPIs: total de clientes, clases de hoy, ingresos del mes y accesos de hoy, con variación respecto al mes anterior. | Should |
| RF-69 | Se muestran gráficas de ingresos y ocupación. | Should |
| RF-70 | Se muestran horas punta, clases más demandadas, evolución de usuarios y retención. | Should |
| RF-71 | La analítica se puede filtrar por semana, mes, 3 meses, 6 meses y año. | Should |
| RF-72 | Se puede exportar un informe de datos. | Could |

## 13. Inteligencia artificial (análisis heurístico)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-73 | El sistema analiza el historial del cliente y detecta estancamientos de carga, baja frecuencia por grupo muscular y señales de sobreentrenamiento. | Should |
| RF-74 | El cliente recibe recomendaciones de progresión y planificación de entrenamiento. | Should |
| RF-75 | El administrador recibe insights de negocio (ocupación, horas punta, clases demandadas, patrones de afluencia). | Should |

## 14. Chatbot (asistente virtual)

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-76 | El cliente dispone de un chatbot para resolver dudas sobre el gimnasio (horarios, clases, reservas, cuota, accesos, instalaciones). | Should |
| RF-77 | El chatbot responde con la información real configurada del gimnasio. | Should |

## 15. Configuración

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-78 | El administrador edita los datos generales del gimnasio (nombre, capacidad, horarios). | Must |
| RF-79 | El importe de la cuota mensual es configurable. | Must |
| RF-80 | Se pueden gestionar integraciones (tornos, pasarela de pago) desde la configuración. | Should |
| RF-81 | Se pueden gestionar roles y permisos. | Should |
| RF-82 | Se pueden configurar notificaciones. | Could |

## 16. Dashboards y experiencia común

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-83 | Dashboard de cliente: entrenamiento de hoy, próxima clase y estado del gimnasio. | Must |
| RF-84 | Dashboard de entrenador: clases del día, clientes asignados y rutinas pendientes. | Must |
| RF-85 | Dashboard de administrador: KPIs y resumen operativo del día. | Must |
| RF-86 | Existe un modo claro/oscuro conmutable desde la configuración. | Should |
| RF-87 | Toda vista muestra estados de carga, vacío, error y éxito. | Should |
| RF-88 | Las acciones de escritura confirman su resultado (toast o confirmación). | Should |

## 17. Ampliaciones de la versión actual

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RF-89 | El cliente puede contratar (solicitar) y darse de baja del servicio de entrenador personal; el administrador asigna, cambia o quita el entrenador concreto; el entrenador solo ve los clientes que tiene asignados. | Must |
| RF-90 | El empleado/entrenador puede editar los materiales/equipamiento que se van a usar en una clase (eligiéndolos de los equipos del gimnasio). | Should |
| RF-91 | El entrenador dispone de una agenda semanal con el turno de trabajo asignado por el administrador y sus actividades planificadas (clases y otras tareas). | Should |
| RF-92 | El entrenador dispone de un análisis inteligente de sus clases colectivas y sesiones personales y de un coaching por cliente (ritmo/adherencia y recomendaciones de mejora). | Should |

---

# II. Requisitos no funcionales

## Rendimiento

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-01 | Las respuestas de la API se sirven en menos de 2 s en condiciones normales de uso. | Must |
| RNF-02 | El aforo en tiempo real se actualiza con latencia mínima tras cada acceso. | Should |
| RNF-03 | El sistema soporta el uso concurrente de clientes, entrenadores y administrador sin degradación apreciable. | Should |

## Seguridad

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-04 | Las contraseñas se almacenan con hash y todo el tráfico viaja por HTTPS. | Must |
| RNF-05 | Cada endpoint valida la autenticación y el permiso del rol que lo invoca. | Must |
| RNF-06 | Cumplimiento RGPD: minimización de datos y derechos de acceso, rectificación y supresión. | Must |
| RNF-07 | Validación y saneado de todas las entradas; protección frente a inyección, CSRF y XSS. | Must |
| RNF-08 | Los datos de tarjeta y bancarios no se almacenan en bruto (se manejan a través de la pasarela). | Should |

## Compatibilidad y responsive

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-09 | Diseño responsive con punto de partida móvil de 390×844 px hasta escritorio de 1440 px. | Must |
| RNF-10 | Funciona en los navegadores de escritorio y móvil actuales (Chrome, Firefox, Edge, Safari). | Must |
| RNF-11 | Los modos claro y oscuro son visualmente coherentes en todas las pantallas. | Should |

## Disponibilidad

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-12 | El servicio mantiene una disponibilidad ≥ 95 % en horario de uso. | Should |
| RNF-13 | Los servicios se recuperan automáticamente ante fallos (reinicio de contenedores). | Should |
| RNF-14 | Se realizan copias de seguridad periódicas de la base de datos. | Should |

## Accesibilidad

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-15 | Cumplimiento de WCAG 2.1 nivel AA en contraste y etiquetado de campos. | Should |
| RNF-16 | Navegación completa por teclado con estados de foco visibles. | Should |
| RNF-17 | Objetivos táctiles de tamaño adecuado en la interfaz móvil. | Should |

## Usabilidad

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-18 | Toda vista de datos incluye estados de carga, vacío, error y éxito identificables. | Must |
| RNF-19 | Toda acción del usuario recibe feedback inmediato (confirmación o error). | Must |
| RNF-20 | La interfaz mantiene consistencia visual y de navegación entre los tres roles. | Should |

## Despliegue y mantenimiento

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-21 | El sistema se despliega de forma reproducible con Docker Compose. | Must |
| RNF-22 | Un proceso de CI ejecuta lint y tests automáticos en cada integración. | Should |
| RNF-23 | Los errores quedan registrados en logs consultables. | Should |
| RNF-24 | Existencia de datos de prueba (seeders) para demostrar la aplicación. | Should |

## Portabilidad

| ID | Requisito | Prioridad |
|----|-----------|-----------|
| RNF-25 | El sistema se ejecuta en cualquier sistema operativo con Docker instalado. | Should |
| RNF-26 | El esquema de base de datos es migrable mediante migraciones versionadas. | Should |
| RNF-27 | Los datos principales (clientes, cuotas, accesos) se pueden exportar en CSV/JSON. | Could |

---


