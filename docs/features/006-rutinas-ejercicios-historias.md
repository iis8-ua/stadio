# Feature 006 — Rutinas y ejercicios

## Descripción

Esta funcionalidad permite gestionar la biblioteca de ejercicios y las rutinas de entrenamiento, así como planificarlas para los clientes. La biblioteca de ejercicios se nutre del catálogo importado de la API externa de **wger**, entre cuyos ejercicios se elige al crear o editar una rutina.

---

## HU-01 — Consultar la biblioteca de ejercicios

**Prioridad:** Must
**Requisito relacionado:** RF-32

### Historia de usuario

> Como entrenador personal,
> quiero consultar los ejercicios disponibles organizados por grupo muscular,
> para poder seleccionar los ejercicios adecuados para crear rutinas.

### Criterios de aceptación

* Los ejercicios están organizados por grupo muscular.
* El entrenador personal puede consultar los ejercicios disponibles.
* Cada ejercicio muestra su información relevante (grupo muscular, descripción, instrucciones, equipamiento e imagen).
* La información se muestra de forma clara y diferenciada por grupo muscular.
* La biblioteca incluye los ejercicios importados desde la API externa (ver «Origen de la biblioteca de ejercicios»).

---

## HU-02 — Buscar un ejercicio

**Prioridad:** Must
**Requisito relacionado:** RF-33

### Historia de usuario

> Como entrenador personal,
> quiero buscar un ejercicio por su nombre,
> para localizarlo rápidamente dentro de la biblioteca.

### Criterios de aceptación

* El entrenador personal puede introducir el nombre del ejercicio.
* El sistema muestra los ejercicios que coinciden con la búsqueda.
* Si no existen coincidencias, se informa de que no hay resultados.
* La búsqueda no modifica ni elimina los ejercicios existentes.

---

## HU-03 — Crear una rutina

**Prioridad:** Must
**Requisito relacionado:** RF-34

### Historia de usuario

> Como entrenador personal,
> quiero crear una rutina indicando su objetivo, frecuencia y ejercicios,
> para preparar un plan de entrenamiento para mis clientes.

### Criterios de aceptación

* El entrenador personal puede indicar el nombre de la rutina.
* Puede indicar el objetivo y los días por semana.
* Puede añadir ejercicios de la biblioteca.
* Puede establecer series individuales, cada una con su propio peso, repeticiones, descanso y RIR/RPE.
* La rutina se guarda cuando los datos son válidos.
* Una rutina creada queda disponible en la biblioteca para su posterior planificación o edición.

---

## HU-04 — Editar una rutina

**Prioridad:** Must
**Requisito relacionado:** RF-34

### Historia de usuario

> Como entrenador personal,
> quiero editar una rutina existente,
> para adaptar el entrenamiento a las necesidades del cliente.

### Criterios de aceptación

* El entrenador personal puede modificar los datos generales de la rutina.
* Puede modificar los ejercicios incluidos.
* Puede modificar las series individuales de cada ejercicio (peso, repeticiones, descanso y RIR/RPE).
* Los cambios quedan guardados cuando son válidos.

---

## HU-05 — Planificar la rutina de un cliente por días

**Prioridad:** Must
**Requisito relacionado:** RF-35

### Historia de usuario

> Como entrenador personal,
> quiero planificar las rutinas de un cliente en un calendario semanal, asignando una rutina a días concretos,
> para que el cliente entrene la rutina que corresponde a cada día.

### Criterios de aceptación

* El entrenador personal puede seleccionar un cliente.
* Puede seleccionar una rutina de su biblioteca.
* Puede asignar esa rutina a un día concreto en un calendario semanal.
* Cada día puede tener una rutina asignada o quedar libre.
* El cliente puede consultar posteriormente su planificación.

---

## HU-06 — Cambiar la rutina de un día

**Prioridad:** Must
**Requisito relacionado:** RF-35

### Historia de usuario

> Como entrenador personal,
> quiero cambiar o quitar la rutina asignada a un día concreto,
> para adaptar el entrenamiento del cliente a su evolución y objetivos.

### Criterios de aceptación

* El entrenador personal puede consultar la planificación de la semana.
* Puede cambiar la rutina de un día por otra de su biblioteca.
* Puede dejar un día sin rutina.
* El cambio queda reflejado para el cliente.

---

## HU-07 — Consultar mi rutina asignada

**Prioridad:** Must
**Requisito relacionado:** RF-36

### Historia de usuario

> Como cliente,
> quiero consultar mi rutina asignada,
> para saber qué ejercicios debo realizar y cómo realizarlos.

### Criterios de aceptación

* El cliente puede consultar su rutina activa.
* Puede ver la planificación de los días con rutina asignada.
* Puede consultar los ejercicios incluidos.
* Puede consultar cada serie con su propio peso, repeticiones, descanso y RIR/RPE.

---

## HU-08 — Eliminar una rutina

**Prioridad:** Should
**Requisito relacionado:** RF-38

### Historia de usuario

> Como entrenador personal,
> quiero eliminar una rutina que ya no necesito,
> para mantener organizada la gestión de rutinas.

### Criterios de aceptación

* El entrenador personal puede seleccionar una rutina.
* El sistema solicita confirmación antes de eliminarla.
* Una vez confirmada, la rutina deja de estar disponible como rutina gestionable.
* El sistema informa del resultado de la operación.

---

## Origen de la biblioteca de ejercicios

La biblioteca de ejercicios no es una sección propia de la interfaz: se consulta desde el selector al crear o editar una rutina. Su contenido procede del catálogo de **wger** (`https://wger.de/api/v2`), cargado por un proceso del sistema (no es una pantalla de usuario).

**Requisito relacionado:** RF-93

* El proceso obtiene los ejercicios de la API externa de wger.
* Cada ejercicio incluye nombre, grupo muscular, descripción, instrucciones, equipamiento e imagen.
* Las imágenes se descargan y almacenan localmente.
* El proceso es idempotente: volver a ejecutarlo no duplica los ejercicios ya existentes, que se identifican por su identificador externo.
* Los ejercicios quedan disponibles en el selector para crear y editar rutinas.
* Si la API externa no responde, se informa del error y no se altera la biblioteca existente.

---

## HU-09 — Crear mi propia rutina

**Prioridad:** Should
**Requisito relacionado:** RF-94

### Historia de usuario

> Como cliente,
> quiero crear y editar mi propia rutina seleccionando ejercicios de la biblioteca,
> para organizar mi entrenamiento según mis objetivos.

### Criterios de aceptación

* El cliente puede crear una rutina indicando nombre, objetivo y días por semana.
* Puede añadir ejercicios desde la biblioteca, con búsqueda por nombre y filtro por grupo muscular.
* Puede consultar el detalle de cada ejercicio (imagen, descripción, instrucciones y equipamiento).
* Puede establecer las series de cada ejercicio (peso, repeticiones, descanso y RIR/RPE).
* La rutina se guarda cuando los datos son válidos y queda disponible para el cliente.
