# Feature 006 — Rutinas y ejercicios

## Descripción

Esta funcionalidad permite gestionar la biblioteca de ejercicios y las rutinas de entrenamiento, así como planificarlas para los clientes.

---

## HU-01 — Consultar la biblioteca de ejercicios

**Prioridad:** Must
**Requisito relacionado:** RF-32

### Historia de usuario

> Como entrenador,
> quiero consultar los ejercicios disponibles organizados por grupo muscular,
> para poder seleccionar los ejercicios adecuados para crear rutinas.

### Criterios de aceptación

* Los ejercicios están organizados por grupo muscular.
* El entrenador puede consultar los ejercicios disponibles.
* Cada ejercicio muestra su información relevante.
* La información se muestra de forma clara y diferenciada por grupo muscular.

---

## HU-02 — Buscar un ejercicio

**Prioridad:** Must
**Requisito relacionado:** RF-33

### Historia de usuario

> Como entrenador,
> quiero buscar un ejercicio por su nombre,
> para localizarlo rápidamente dentro de la biblioteca.

### Criterios de aceptación

* El entrenador puede introducir el nombre del ejercicio.
* El sistema muestra los ejercicios que coinciden con la búsqueda.
* Si no existen coincidencias, se informa de que no hay resultados.
* La búsqueda no modifica ni elimina los ejercicios existentes.

---

## HU-03 — Crear una rutina

**Prioridad:** Must
**Requisito relacionado:** RF-34

### Historia de usuario

> Como entrenador,
> quiero crear una rutina indicando su objetivo, frecuencia y ejercicios,
> para preparar un plan de entrenamiento para mis clientes.

### Criterios de aceptación

* El entrenador puede indicar el nombre de la rutina.
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

> Como entrenador,
> quiero editar una rutina existente,
> para adaptar el entrenamiento a las necesidades del cliente.

### Criterios de aceptación

* El entrenador puede modificar los datos generales de la rutina.
* Puede modificar los ejercicios incluidos.
* Puede modificar las series individuales de cada ejercicio (peso, repeticiones, descanso y RIR/RPE).
* Los cambios quedan guardados cuando son válidos.

---

## HU-05 — Planificar la rutina de un cliente por días

**Prioridad:** Must
**Requisito relacionado:** RF-35

### Historia de usuario

> Como entrenador,
> quiero planificar las rutinas de un cliente en un calendario semanal, asignando una rutina a días concretos,
> para que el cliente entrene la rutina que corresponde a cada día.

### Criterios de aceptación

* El entrenador puede seleccionar un cliente.
* Puede seleccionar una rutina de su biblioteca.
* Puede asignar esa rutina a un día concreto en un calendario semanal.
* Cada día puede tener una rutina asignada o quedar libre.
* El cliente puede consultar posteriormente su planificación.

---

## HU-06 — Cambiar la rutina de un día

**Prioridad:** Must
**Requisito relacionado:** RF-35

### Historia de usuario

> Como entrenador,
> quiero cambiar o quitar la rutina asignada a un día concreto,
> para adaptar el entrenamiento del cliente a su evolución y objetivos.

### Criterios de aceptación

* El entrenador puede consultar la planificación de la semana.
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

## HU-08 — Añadir un ejercicio a la biblioteca

**Prioridad:** Should
**Requisito relacionado:** RF-37

### Historia de usuario

> Como entrenador,
> quiero añadir nuevos ejercicios a la biblioteca,
> para disponer de ejercicios que todavía no estén registrados.

### Criterios de aceptación

* El entrenador puede crear un nuevo ejercicio.
* Puede indicar su nombre y grupo muscular.
* El ejercicio se incorpora a la biblioteca cuando los datos son válidos.
* El nuevo ejercicio puede utilizarse posteriormente en una rutina.

---

## HU-09 — Eliminar una rutina

**Prioridad:** Should
**Requisito relacionado:** RF-38

### Historia de usuario

> Como entrenador,
> quiero eliminar una rutina que ya no necesito,
> para mantener organizada la gestión de rutinas.

### Criterios de aceptación

* El entrenador puede seleccionar una rutina.
* El sistema solicita confirmación antes de eliminarla.
* Una vez confirmada, la rutina deja de estar disponible como rutina gestionable.
* El sistema informa del resultado de la operación.
