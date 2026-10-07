# Feature 004 — Clases y horarios

## Descripción

Esta feature comprende la creación y gestión de las clases del gimnasio, su disponibilidad en el calendario, la asignación de una capacidad máxima y la consulta de las clases por parte de los diferentes roles.

---

## HU-01 — Crear una clase

**Prioridad:** Must
**Requisito relacionado:** RF-21

### Historia de usuario

> Como administrador,
> quiero crear una clase indicando su información,
> para incorporar nuevas actividades al calendario del gimnasio.

### Criterios de aceptación

* El administrador puede crear una nueva clase.
* El administrador puede introducir la información necesaria de la clase.
* El sistema valida los datos introducidos.
* La clase se registra correctamente cuando los datos son válidos.
* La nueva clase aparece en el calendario correspondiente.

---

## HU-02 — Editar una clase

**Prioridad:** Must
**Requisito relacionado:** RF-22

### Historia de usuario

> Como administrador,
> quiero editar la información de una clase,
> para corregir o actualizar sus datos cuando sea necesario.

### Criterios de aceptación

* El administrador puede seleccionar una clase existente.
* El administrador puede modificar sus datos.
* El sistema valida los datos modificados.
* Los cambios quedan guardados.
* La información actualizada se refleja en el calendario.

---

## HU-03 — Eliminar una clase

**Prioridad:** Must
**Requisito relacionado:** RF-22

### Historia de usuario

> Como administrador,
> quiero eliminar una clase,
> para retirar del calendario las clases que ya no se vayan a realizar.

### Criterios de aceptación

* El administrador puede seleccionar una clase existente.
* El administrador puede solicitar su eliminación.
* El sistema elimina la clase del calendario cuando la operación es válida.
* La clase deja de estar disponible para nuevas operaciones posteriores a su eliminación.

---

## HU-04 — Consultar el calendario de clases

**Prioridad:** Must
**Requisito relacionado:** RF-23

### Historia de usuario

> Como usuario de STADIO,
> quiero consultar el calendario de clases,
> para conocer las actividades disponibles en el gimnasio.

### Criterios de aceptación

* El cliente puede consultar el calendario.
* El entrenador puede consultar el calendario.
* El administrador puede consultar el calendario.
* El calendario muestra las clases disponibles.
* La información mostrada corresponde a las clases registradas en el sistema.

---

## HU-05 — Establecer la capacidad máxima de una clase

**Prioridad:** Must
**Requisito relacionado:** RF-24

### Historia de usuario

> Como administrador,
> quiero establecer una capacidad máxima para cada clase,
> para controlar el número de personas que pueden asistir.

### Criterios de aceptación

* El administrador puede establecer la capacidad máxima de una clase.
* La capacidad máxima queda asociada a la clase.
* El sistema utiliza dicha capacidad para determinar cuándo una clase está completa.
* No se permite superar la capacidad máxima establecida.

---

## HU-06 — Consultar las clases y asistentes como entrenador

**Prioridad:** Should
**Requisito relacionado:** RF-25

### Historia de usuario

> Como entrenador,
> quiero consultar mis clases, sus asistentes y la capacidad disponible,
> para conocer la planificación de mis actividades y las personas que asistirán.

### Criterios de aceptación

* El entrenador puede consultar sus clases.
* El entrenador puede consultar las personas inscritas en sus clases.
* El entrenador puede consultar la capacidad de cada clase.
* La información mostrada corresponde a sus clases asignadas.

---

## Relación entre historias y requisitos

| Historia                                                  | Requisitos | Prioridad |
| --------------------------------------------------------- | ---------- | --------- |
| HU-01 — Crear una clase                                   | RF-21      | Must      |
| HU-02 — Editar una clase                                  | RF-22      | Must      |
| HU-03 — Eliminar una clase                                | RF-22      | Must      |
| HU-04 — Consultar el calendario de clases                 | RF-23      | Must      |
| HU-05 — Establecer la capacidad máxima de una clase       | RF-24      | Must      |
| HU-06 — Consultar las clases y asistentes como entrenador | RF-25      | Should    |
