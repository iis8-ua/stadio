# Feature 011 — Instalaciones y mantenimiento

## Descripción

Esta funcionalidad permite gestionar las salas, los equipos y las incidencias o mantenimientos asociados.

---

## HU-01 — Gestionar las salas

**Prioridad:** Should
**Requisito relacionado:** RF-64

### Historia de usuario

> Como administrador,
> quiero gestionar las salas del gimnasio,
> para mantener actualizada la distribución de las instalaciones.

### Criterios de aceptación

* El administrador puede consultar las salas.
* Puede crear una sala.
* Puede modificar sus datos.
* La información de las salas queda disponible para otras funcionalidades que las utilizan.

---

## HU-02 — Gestionar los equipos de una sala

**Prioridad:** Should
**Requisito relacionado:** RF-65

### Historia de usuario

> Como administrador,
> quiero gestionar los equipos de cada sala,
> para conocer qué equipamiento existe en cada espacio.

### Criterios de aceptación

* El administrador puede consultar los equipos de una sala.
* Puede registrar nuevos equipos.
* Puede modificar la información de un equipo.
* Cada equipo queda asociado a una sala.

---

## HU-03 — Gestionar el estado de un equipo

**Prioridad:** Should
**Requisito relacionado:** RF-66

### Historia de usuario

> Como administrador,
> quiero indicar el estado de cada equipo,
> para conocer si puede utilizarse o necesita atención.

### Criterios de aceptación

* Un equipo puede estar disponible.
* Un equipo puede estar en mantenimiento.
* Un equipo puede estar fuera de servicio.
* El estado actual se muestra al consultar el equipo.

---

## HU-04 — Registrar una incidencia de un equipo

**Prioridad:** Should
**Requisito relacionado:** RF-67

### Historia de usuario

> Como administrador,
> quiero registrar una incidencia relacionada con un equipo,
> para mantener un registro de los problemas detectados.

### Criterios de aceptación

* El administrador puede seleccionar el equipo afectado.
* Puede describir la incidencia.
* Puede registrar el tipo correspondiente.
* La incidencia queda asociada al equipo.

---

## HU-05 — Registrar un mantenimiento

**Prioridad:** Should
**Requisito relacionado:** RF-67

### Historia de usuario

> Como administrador,
> quiero registrar los mantenimientos realizados sobre los equipos,
> para mantener un historial de mantenimiento.

### Criterios de aceptación

* El mantenimiento queda asociado al equipo.
* Se registra la información correspondiente.
* El historial permite identificar que se ha realizado un mantenimiento.
