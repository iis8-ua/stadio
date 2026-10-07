Feature 006 — Rutinas y ejercicios
Descripción

Esta funcionalidad permite gestionar la biblioteca de ejercicios y las rutinas de entrenamiento, así como asignarlas a los clientes.

HU-01 — Consultar la biblioteca de ejercicios

Como entrenador,
quiero consultar los ejercicios disponibles organizados por grupo muscular,
para poder seleccionar los ejercicios adecuados para crear rutinas.

Requisito: RF-32
Prioridad: Must

Criterios de aceptación:

Los ejercicios están organizados por grupo muscular.
El entrenador puede consultar los ejercicios disponibles.
Cada ejercicio muestra su información relevante.
La información se muestra de forma clara y diferenciada por grupo muscular.
HU-02 — Buscar un ejercicio

Como entrenador,
quiero buscar un ejercicio por su nombre,
para localizarlo rápidamente dentro de la biblioteca.

Requisito: RF-33
Prioridad: Must

Criterios de aceptación:

El entrenador puede introducir el nombre del ejercicio.
El sistema muestra los ejercicios que coinciden con la búsqueda.
Si no existen coincidencias, se informa de que no hay resultados.
La búsqueda no modifica ni elimina los ejercicios existentes.
HU-03 — Crear una rutina

Como entrenador,
quiero crear una rutina indicando su objetivo, frecuencia y ejercicios,
para preparar un plan de entrenamiento para mis clientes.

Requisito: RF-34
Prioridad: Must

Criterios de aceptación:

El entrenador puede indicar el nombre de la rutina.
Puede indicar el objetivo y los días por semana.
Puede añadir ejercicios de la biblioteca.
Puede establecer series, repeticiones, peso, descanso y RIR/RPE.
La rutina se guarda cuando los datos son válidos.
Una rutina creada queda disponible para su posterior asignación o edición.
HU-04 — Editar una rutina

Como entrenador,
quiero editar una rutina existente,
para adaptar el entrenamiento a las necesidades del cliente.

Requisito: RF-34
Prioridad: Must

Criterios de aceptación:

El entrenador puede modificar los datos generales de la rutina.
Puede modificar los ejercicios incluidos.
Puede modificar las series, repeticiones, peso, descanso y RIR/RPE.
Los cambios quedan guardados cuando son válidos.
HU-05 — Asignar una rutina a un cliente

Como entrenador,
quiero asignar una rutina a un cliente,
para que pueda seguir el entrenamiento que le corresponde.

Requisito: RF-35
Prioridad: Must

Criterios de aceptación:

El entrenador puede seleccionar un cliente.
Puede seleccionar una rutina.
La rutina queda asociada al cliente.
El cliente puede consultar posteriormente la rutina asignada.
HU-06 — Cambiar la rutina de un cliente

Como entrenador,
quiero cambiar la rutina asignada a un cliente,
para adaptar su entrenamiento a su evolución y objetivos.

Requisito: RF-35
Prioridad: Must

Criterios de aceptación:

El entrenador puede consultar la rutina actualmente asignada.
Puede seleccionar una nueva rutina.
La nueva rutina sustituye a la anterior como rutina activa.
El cambio queda reflejado para el cliente.
HU-07 — Consultar mi rutina asignada

Como cliente,
quiero consultar mi rutina asignada,
para saber qué ejercicios debo realizar y cómo realizarlos.

Requisito: RF-36
Prioridad: Must

Criterios de aceptación:

El cliente puede consultar su rutina activa.
Puede ver el objetivo y los días por semana.
Puede consultar los ejercicios incluidos.
Puede consultar series, repeticiones, peso, descanso y RIR/RPE cuando estén definidos.
HU-08 — Añadir un ejercicio a la biblioteca

Como entrenador,
quiero añadir nuevos ejercicios a la biblioteca,
para disponer de ejercicios que todavía no estén registrados.

Requisito: RF-37
Prioridad: Should

Criterios de aceptación:

El entrenador puede crear un nuevo ejercicio.
Puede indicar su nombre y grupo muscular.
El ejercicio se incorpora a la biblioteca cuando los datos son válidos.
El nuevo ejercicio puede utilizarse posteriormente en una rutina.
HU-09 — Eliminar una rutina

Como entrenador,
quiero eliminar una rutina que ya no necesito,
para mantener organizada la gestión de rutinas.

Requisito: RF-38
Prioridad: Should

Criterios de aceptación:

El entrenador puede seleccionar una rutina.
El sistema solicita confirmación antes de eliminarla.
Una vez confirmada, la rutina deja de estar disponible como rutina gestionable.
El sistema informa del resultado de la operación.
