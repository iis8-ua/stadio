# Feature 005 — Reservas

## Descripción

Esta feature comprende la reserva y cancelación de clases por parte de los clientes, las reglas que impiden reservas inválidas y la consulta y gestión de las reservas.

---

## HU-01 — Reservar una clase

**Prioridad:** Must
**Requisito relacionado:** RF-26

### Historia de usuario

> Como cliente,
> quiero reservar una clase que tenga plazas disponibles,
> para asegurar mi asistencia a la actividad.

### Criterios de aceptación

* El cliente puede consultar una clase disponible.
* El cliente puede solicitar una reserva.
* El sistema comprueba que existen plazas disponibles.
* Si existen plazas, la reserva queda registrada a nombre del cliente.
* La clase refleja correctamente la nueva ocupación.

---

## HU-02 — Cancelar una reserva

**Prioridad:** Must
**Requisito relacionado:** RF-27

### Historia de usuario

> Como cliente,
> quiero cancelar una reserva que haya realizado,
> para liberar mi plaza cuando finalmente no pueda asistir a la clase.

### Criterios de aceptación

* El cliente puede consultar sus reservas.
* El cliente puede cancelar una reserva propia.
* La reserva queda cancelada correctamente.
* La plaza liberada vuelve a estar disponible para la clase cuando corresponda.
* El cliente no puede cancelar una reserva perteneciente a otro cliente.

---

## HU-03 — Impedir reservas cuando una clase está completa

**Prioridad:** Must
**Requisito relacionado:** RF-28

### Historia de usuario

> Como cliente,
> quiero que el sistema me indique cuando una clase está completa,
> para saber que no puedo realizar una reserva para esa clase.

### Criterios de aceptación

* El sistema comprueba la capacidad de la clase antes de registrar una reserva.
* Si se ha alcanzado la capacidad máxima, el cliente no puede realizar una nueva reserva.
* El sistema informa al cliente de que la clase está completa.
* El sistema no crea ninguna reserva cuando no existen plazas.
* No se genera una lista de espera.

---

## HU-04 — Impedir reservas duplicadas

**Prioridad:** Must
**Requisito relacionado:** RF-29

### Historia de usuario

> Como cliente,
> quiero que el sistema impida reservar dos veces la misma clase,
> para evitar tener reservas duplicadas.

### Criterios de aceptación

* El sistema comprueba si el cliente ya tiene una reserva activa para la clase.
* Si existe una reserva activa, no se registra una segunda reserva.
* El sistema informa al cliente de que ya tiene una reserva para esa clase.
* Una reserva cancelada no se considera una reserva activa a efectos de esta restricción.

---

## HU-05 — Consultar mis reservas

**Prioridad:** Must
**Requisito relacionado:** RF-30

### Historia de usuario

> Como cliente,
> quiero consultar mis próximas reservas y mi historial de reservas,
> para conocer las clases a las que estoy inscrito y consultar mis reservas anteriores.

### Criterios de aceptación

* El cliente puede consultar sus próximas reservas.
* El cliente puede consultar su historial de reservas.
* Las próximas reservas se muestran diferenciadas de las reservas anteriores.
* La información corresponde exclusivamente a las reservas del cliente autenticado.

---

## HU-06 — Consultar las reservas y ocupación de una clase

**Prioridad:** Should
**Requisito relacionado:** RF-31

### Historia de usuario

> Como administrador,
> quiero consultar las reservas y la ocupación de las clases,
> para conocer el nivel de asistencia previsto en cada actividad.

### Criterios de aceptación

* El administrador puede consultar las reservas de una clase.
* El administrador puede consultar el número de plazas ocupadas.
* El administrador puede consultar la capacidad máxima de la clase.
* La ocupación mostrada se corresponde con las reservas activas.
* El administrador puede consultar esta información para las clases disponibles en el sistema.

---

## Relación entre historias y requisitos

| Historia                                                | Requisitos | Prioridad |
| ------------------------------------------------------- | ---------- | --------- |
| HU-01 — Reservar una clase                              | RF-26      | Must      |
| HU-02 — Cancelar una reserva                            | RF-27      | Must      |
| HU-03 — Impedir reservas cuando una clase está completa | RF-28      | Must      |
| HU-04 — Impedir reservas duplicadas                     | RF-29      | Must      |
| HU-05 — Consultar mis reservas                          | RF-30      | Must      |
| HU-06 — Consultar las reservas y ocupación de una clase | RF-31      | Should    |
