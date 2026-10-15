# Feature 015 — Configuración

## Descripción

Esta funcionalidad permite al administrador configurar los principales datos y preferencias del gimnasio y gestionar sus integraciones y permisos.

---

## HU-01 — Configurar los datos generales del gimnasio

**Prioridad:** Must
**Requisito relacionado:** RF-78

### Historia de usuario

> Como administrador,
> quiero editar los datos generales del gimnasio,
> para mantener actualizada la información del centro.

### Criterios de aceptación

* El administrador puede modificar el nombre del gimnasio.
* Puede modificar la capacidad.
* Puede modificar los horarios.
* Los cambios quedan guardados cuando son válidos.
* La información actualizada queda disponible para las funcionalidades que la utilizan.

---

## HU-02 — Configurar el importe de la cuota

**Prioridad:** Must
**Requisito relacionado:** RF-79

### Historia de usuario

> Como administrador,
> quiero configurar el importe de la cuota mensual,
> para adaptar el precio de la cuota a la configuración actual del gimnasio.

### Criterios de aceptación

* El administrador puede consultar el importe actual.
* Puede modificarlo.
* El sistema valida el nuevo importe.
* El nuevo importe queda configurado para las cuotas correspondientes.

---

## HU-03 — Gestionar las integraciones

**Prioridad:** Should
**Requisito relacionado:** RF-80

### Historia de usuario

> Como administrador,
> quiero gestionar las integraciones del gimnasio,
> para configurar los servicios externos utilizados por STADIO.

### Criterios de aceptación

* El administrador puede consultar las integraciones disponibles.
* Puede gestionar la integración con los tornos.
* Puede gestionar la integración con la pasarela de pago.
* El sistema muestra el estado de la configuración cuando corresponda.

---

## HU-04 — Gestionar roles y permisos

**Prioridad:** Should
**Requisito relacionado:** RF-81

### Historia de usuario

> Como administrador,
> quiero gestionar los roles de acceso y sus permisos,
> para controlar qué funcionalidades puede utilizar cada tipo de usuario.

### Criterios de aceptación

* El administrador puede consultar los roles de acceso (cliente, entrenador, administrador).
* Puede consultar y gestionar los permisos asociados a cada rol.
* Los permisos configurados se aplican al acceso a las funcionalidades.

> Nota: el **perfil del personal docente** (entrenador personal / monitor/instructor) deriva del rol de empleado (`EmpleadoRol`) y no se configura en esta pantalla; restringe las opciones dentro del portal de entrenador.

---

## HU-05 — Configurar las notificaciones

**Prioridad:** Could
**Requisito relacionado:** RF-82

### Historia de usuario

> Como administrador,
> quiero configurar las notificaciones del sistema,
> para adaptar los avisos que reciben los usuarios.

### Criterios de aceptación

* El administrador puede consultar las opciones de notificación (recordatorio de cuota, recordatorio de clases, resumen semanal).
* Puede activar o desactivar cada aviso.
* Puede elegir el canal de envío (email y/o push).
* Los cambios quedan guardados.
* Las notificaciones utilizan la configuración actual.
