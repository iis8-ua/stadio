# Feature 002 — Gestión de clientes

## Descripción

Esta feature comprende las funcionalidades que permiten al administrador gestionar los clientes del gimnasio y consultar su información, así como las funcionalidades que permiten al entrenador consultar la información y progreso de los clientes que tiene asignados.

---

## HU-01 — Crear un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-10

### Historia de usuario

> Como administrador,
> quiero crear un nuevo cliente introduciendo sus datos personales,
> para registrar a los clientes del gimnasio en STADIO.

### Criterios de aceptación

* El administrador puede acceder a la creación de un nuevo cliente.
* El administrador puede introducir los datos personales necesarios del cliente.
* El sistema valida los datos introducidos antes de crear el cliente.
* Si los datos son válidos, el cliente queda registrado en el sistema.
* El nuevo cliente aparece posteriormente en el listado de clientes.
* Un usuario que no sea administrador no puede crear clientes.

---

## HU-02 — Editar los datos de un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-11

### Historia de usuario

> Como administrador,
> quiero editar los datos de un cliente,
> para mantener actualizada su información en el sistema.

### Criterios de aceptación

* El administrador puede acceder a la información de un cliente.
* El administrador puede modificar sus datos.
* El sistema valida los datos modificados.
* Si los datos son válidos, los cambios quedan guardados.
* La información actualizada se muestra posteriormente en la ficha del cliente.
* Un usuario que no sea administrador no puede modificar los datos administrativos de un cliente.

---

## HU-03 — Desactivar y reactivar un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-12

### Historia de usuario

> Como administrador,
> quiero desactivar o reactivar un cliente,
> para controlar si un cliente se encuentra actualmente activo en el gimnasio sin eliminar su información.

### Criterios de aceptación

* El administrador puede desactivar un cliente activo.
* Un cliente desactivado queda identificado como tal en el sistema.
* El administrador puede reactivar un cliente desactivado.
* Un cliente reactivado vuelve a aparecer como activo.
* La desactivación no elimina el historial ni los datos del cliente.
* Un usuario que no sea administrador no puede cambiar el estado de un cliente.

---

## HU-04 — Buscar, filtrar y ordenar clientes

**Prioridad:** Must
**Requisito relacionado:** RF-13

### Historia de usuario

> Como administrador,
> quiero buscar, filtrar y ordenar el listado de clientes,
> para localizar rápidamente a los clientes que necesito gestionar.

### Criterios de aceptación

* El administrador puede buscar clientes en el listado.
* El administrador puede aplicar filtros al listado.
* El administrador puede ordenar los resultados.
* El sistema muestra únicamente los clientes que cumplen los criterios de búsqueda o filtrado.
* El administrador puede modificar o eliminar los criterios aplicados para consultar nuevamente el listado.

---

## HU-05 — Consultar la ficha e historial de un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-14

### Historia de usuario

> Como administrador,
> quiero consultar la ficha de un cliente y su historial,
> para disponer de una visión completa de su actividad dentro del gimnasio.

### Criterios de aceptación

* El administrador puede acceder a la ficha de un cliente.
* La ficha muestra la información del cliente disponible para el administrador.
* El administrador puede consultar el historial de actividad del cliente.
* El historial incluye sus accesos al gimnasio.
* El historial incluye sus reservas.
* El historial incluye sus entrenamientos.
* El historial incluye sus cuotas.
* La información consultada corresponde al cliente seleccionado.

---

## HU-06 — Asignar una pulsera NFC a un cliente

**Prioridad:** Must
**Requisito relacionado:** RF-15

### Historia de usuario

> Como administrador,
> quiero asignar el identificador de una pulsera NFC a un cliente,
> para asociar la pulsera del gimnasio con su cuenta y permitir su identificación mediante el sistema de acceso.

### Criterios de aceptación

* El administrador puede asignar un identificador de pulsera NFC a un cliente.
* El identificador queda asociado al cliente correspondiente.
* El sistema permite consultar qué identificador NFC está asociado a un cliente.
* La asociación se realiza sobre el cliente seleccionado.
* Un usuario que no sea administrador no puede realizar esta asignación.

---

## HU-07 — Consultar la información y progreso de clientes asignados

**Prioridad:** Should
**Requisito relacionado:** RF-16

### Historia de usuario

> Como entrenador,
> quiero consultar la ficha y el progreso de los clientes que tengo asignados,
> para poder realizar un seguimiento de su evolución.

### Criterios de aceptación

* El entrenador puede consultar los clientes que tiene asignados.
* El entrenador puede acceder a la ficha de un cliente asignado.
* El entrenador puede consultar la información disponible del cliente.
* El entrenador puede consultar su progreso.
* El entrenador no puede consultar mediante esta funcionalidad clientes que no tenga asignados.

---

## Relación entre historias y requisitos

| Historia                                                          | Requisitos | Prioridad |
| ----------------------------------------------------------------- | ---------- | --------- |
| HU-01 — Crear un cliente                                          | RF-10      | Must      |
| HU-02 — Editar los datos de un cliente                            | RF-11      | Must      |
| HU-03 — Desactivar y reactivar un cliente                         | RF-12      | Must      |
| HU-04 — Buscar, filtrar y ordenar clientes                        | RF-13      | Must      |
| HU-05 — Consultar la ficha e historial de un cliente              | RF-14      | Must      |
| HU-06 — Asignar una pulsera NFC a un cliente                      | RF-15      | Must      |
| HU-07 — Consultar la información y progreso de clientes asignados | RF-16      | Should    |
