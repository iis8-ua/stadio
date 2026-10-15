# Feature 017 — Notificaciones

## Descripción

Esta funcionalidad permite al usuario recibir avisos en la aplicación (campana) y notificaciones push, según los canales que configure el gimnasio.

---

## HU-01 — Recibir notificaciones en la aplicación

**Prioridad:** Should
**Requisito relacionado:** RF-95

### Historia de usuario

> Como usuario,
> quiero recibir avisos en la aplicación mediante una campana,
> para estar al tanto de lo que ocurre sin salir de STADIO.

### Criterios de aceptación

* El usuario dispone de una campana con sus notificaciones.
* Cada notificación muestra su título y su detalle.
* Cada notificación indica su tipo (info, aviso, éxito o error).
* El usuario puede marcarlas como leídas.
* Se distingue visualmente entre notificaciones leídas y no leídas.

---

## HU-02 — Recibir notificaciones push

**Prioridad:** Should
**Requisito relacionado:** RF-98

### Historia de usuario

> Como usuario,
> quiero recibir notificaciones push,
> para enterarme de avisos relevantes aunque no tenga la aplicación abierta.

### Criterios de aceptación

* El usuario recibe avisos push (FCM) cuando lo permite.
* Los avisos push respetan los canales configurados en el gimnasio.
* El usuario puede desactivar las notificaciones push.

---

## HU-03 — Recibir el aviso de vencimiento de la cuota

**Prioridad:** Should
**Requisito relacionado:** RF-62

### Historia de usuario

> Como cliente,
> quiero recibir un aviso cuando se aproxime el vencimiento de mi cuota,
> para recordar que debo pagarla.

### Criterios de aceptación

* El sistema identifica las cuotas próximas a vencer.
* El cliente recibe el recordatorio por los canales configurados (campana, correo y/o push).
* La notificación indica que la cuota está próxima a vencer.

---

## Relación entre historias y requisitos

| Historia                                        | Requisitos | Prioridad |
| ----------------------------------------------- | ---------- | --------- |
| HU-01 — Recibir notificaciones en la aplicación | RF-95      | Should    |
| HU-02 — Recibir notificaciones push             | RF-98      | Should    |
| HU-03 — Aviso de vencimiento de la cuota        | RF-62      | Should    |
