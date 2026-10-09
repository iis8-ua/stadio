# Feature 003 — Gestión de empleados y entrenadores

## Descripción

Esta feature comprende la gestión de los empleados del gimnasio, especialmente los entrenadores, incluyendo su creación, modificación, desactivación, consulta y asignación de clases.

---

## HU-01 — Crear un empleado

**Prioridad:** Must
**Requisito relacionado:** RF-17

### Historia de usuario

> Como administrador,
> quiero crear un nuevo empleado indicando sus datos y rol,
> para registrar a los empleados del gimnasio en STADIO.

### Criterios de aceptación

* El administrador puede acceder a la creación de un empleado.
* El administrador puede introducir los datos necesarios del empleado.
* El administrador puede indicar el rol del empleado.
* El sistema valida los datos introducidos.
* Si los datos son válidos, el empleado queda registrado.
* Un usuario que no sea administrador no puede crear empleados.

---

## HU-02 — Editar los datos de un empleado

**Prioridad:** Must
**Requisito relacionado:** RF-17

### Historia de usuario

> Como administrador,
> quiero editar los datos de un empleado,
> para mantener actualizada su información.

### Criterios de aceptación

* El administrador puede seleccionar un empleado.
* El administrador puede modificar sus datos.
* El sistema valida los datos modificados.
* Los cambios se guardan correctamente.
* La información actualizada se muestra posteriormente.
* Un usuario que no sea administrador no puede modificar estos datos.

---

## HU-03 — Desactivar un empleado

**Prioridad:** Must
**Requisito relacionado:** RF-17

### Historia de usuario

> Como administrador,
> quiero desactivar un empleado,
> para impedir que siga siendo considerado un empleado activo sin eliminar su información.

### Criterios de aceptación

* El administrador puede desactivar un empleado.
* El empleado queda identificado como inactivo.
* La información del empleado se conserva.
* El empleado puede seguir apareciendo en los registros históricos correspondientes.
* Un usuario que no sea administrador no puede desactivar empleados.

---

## HU-04 — Consultar el listado de empleados

**Prioridad:** Should
**Requisito relacionado:** RF-18

### Historia de usuario

> Como administrador,
> quiero consultar un listado de empleados con su información relevante,
> para conocer su situación y organización dentro del gimnasio.

### Criterios de aceptación

* El administrador puede consultar el listado de empleados.
* El listado muestra el rol del empleado.
* El listado muestra su horario cuando exista.
* El listado muestra su estado.
* El listado muestra las clases que tiene asignadas cuando corresponda.

---

## HU-05 — Gestionar el horario y disponibilidad de un entrenador

**Prioridad:** Could
**Requisito relacionado:** RF-19

### Historia de usuario

> Como administrador,
> quiero asignar el horario y la disponibilidad de un entrenador,
> para definir cuándo puede desarrollar sus actividades en el gimnasio.

### Criterios de aceptación

* El sistema permite establecer el horario de un entrenador.
* El sistema permite indicar su disponibilidad.
* La información queda asociada al entrenador correspondiente.
* La información puede consultarse posteriormente.

---

## HU-06 — Asignar clases a un entrenador

**Prioridad:** Must
**Requisito relacionado:** RF-20

### Historia de usuario

> Como administrador,
> quiero asignar clases a un entrenador,
> para determinar qué clases son responsabilidad de cada entrenador.

### Criterios de aceptación

* El administrador puede seleccionar un entrenador.
* El administrador puede seleccionar una clase.
* El administrador puede asignar la clase al entrenador.
* La asignación queda registrada.
* La clase aparece posteriormente entre las clases asignadas al entrenador.

---

## HU-07 — Asignar un entrenador personal a un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-89

### Historia de usuario

> Como administrador,
> quiero asignar, cambiar o quitar el entrenador personal de un cliente que ha contratado el servicio,
> para que el entrenador correspondiente haga su seguimiento.

### Criterios de aceptación

* El cliente puede solicitar (contratar) el servicio de entrenador personal desde su perfil y darse de baja cuando quiera.
* El administrador ve en la ficha del cliente si ha solicitado entrenador personal.
* El administrador puede asignar un entrenador (empleado con rol de entrenador personal), cambiarlo o quitarlo.
* El cliente ve los datos del entrenador asignado.
* El entrenador solo ve los clientes que tiene asignados.

---

## Relación entre historias y requisitos

| Historia                                                       | Requisitos | Prioridad |
| -------------------------------------------------------------- | ---------- | --------- |
| HU-01 — Crear un empleado                                      | RF-17      | Must      |
| HU-02 — Editar los datos de un empleado                        | RF-17      | Must      |
| HU-03 — Desactivar un empleado                                 | RF-17      | Must      |
| HU-04 — Consultar el listado de empleados                      | RF-18      | Should    |
| HU-05 — Gestionar el horario y disponibilidad de un entrenador | RF-19      | Could     |
| HU-06 — Asignar clases a un entrenador                         | RF-20      | Must      |
| HU-07 — Asignar un entrenador personal a un cliente            | RF-89      | Must      |
