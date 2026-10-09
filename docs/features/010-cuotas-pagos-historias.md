# Feature 010 — Cuotas y pagos

## Descripción

Esta funcionalidad permite gestionar la cuota mensual de los clientes, sus pagos y el seguimiento económico por parte del administrador.

---

## HU-01 — Consultar la cuota mensual

**Prioridad:** Must
**Requisito relacionado:** RF-55

### Historia de usuario

> Como cliente,
> quiero conocer el importe de mi cuota mensual,
> para saber cuánto debo pagar por mi suscripción al gimnasio.

### Criterios de aceptación

* Existe una única cuota mensual para los clientes.
* El importe de la cuota se muestra al cliente.
* No existen planes diferenciados dentro de esta funcionalidad.

---

## HU-02 — Pagar la cuota con tarjeta

**Prioridad:** Must
**Requisito relacionado:** RF-56

### Historia de usuario

> Como cliente,
> quiero pagar mi cuota mensual con tarjeta,
> para mantener mi cuota al día.

### Criterios de aceptación

* El cliente puede iniciar el pago de su cuota.
* Puede realizar el pago mediante la pasarela configurada.
* El sistema informa si el pago se ha realizado correctamente.
* La cuota queda registrada según el resultado del pago.

---

## HU-03 — Cobrar automáticamente la cuota

**Prioridad:** Must
**Requisito relacionado:** RF-57

### Historia de usuario

> Como cliente,
> quiero que mi cuota se cobre automáticamente cuando corresponda si tengo una cuenta bancaria configurada,
> para evitar tener que realizar manualmente el pago cada mes.

### Criterios de aceptación

* El sistema comprueba si existe una cuenta bancaria configurada.
* El cobro se realiza en la fecha de vencimiento.
* El resultado del cobro queda registrado.
* Si el cobro no se realiza correctamente, la cuota no se marca como pagada.

---

## HU-04 — Registrar el estado de la cuota

**Prioridad:** Must
**Requisito relacionado:** RF-58

### Historia de usuario

> Como sistema,
> quiero registrar el estado de la cuota de cada mes,
> para conocer si está pagada o pendiente.

### Criterios de aceptación

* Cada cuota tiene un periodo mensual.
* Puede estar pagada o pendiente.
* Cuando se paga, se registra la fecha de pago.
* El estado refleja el resultado real del pago.

---

## HU-05 — Evitar cuotas duplicadas

**Prioridad:** Must
**Requisito relacionado:** RF-59

### Historia de usuario

> Como sistema,
> quiero impedir que existan dos cuotas para el mismo cliente y periodo,
> para mantener la información económica consistente.

### Criterios de aceptación

* Un cliente solo puede tener una cuota por periodo.
* El sistema rechaza la creación de una cuota duplicada.
* La cuota existente no se modifica por un intento duplicado.

---

## HU-06 — Consultar el estado y el historial de pagos

**Prioridad:** Must
**Requisito relacionado:** RF-60

### Historia de usuario

> Como cliente,
> quiero consultar el estado de mi cuota y mi historial de pagos,
> para conocer mi situación económica con el gimnasio.

### Criterios de aceptación

* El cliente puede consultar el estado de la cuota actual.
* Puede consultar cuotas anteriores.
* Puede consultar las fechas de pago disponibles.
* La información pertenece exclusivamente a su cuenta.

---

## HU-07 — Consultar las cuotas e ingresos

**Prioridad:** Must
**Requisito relacionado:** RF-61

### Historia de usuario

> Como administrador,
> quiero consultar las cuotas pagadas y pendientes, los ingresos y las fechas de pago,
> para controlar la situación económica del gimnasio.

### Criterios de aceptación

* El administrador puede consultar cuotas pagadas.
* Puede consultar cuotas pendientes.
* Puede consultar los ingresos.
* Puede consultar las fechas de pago.

---

## HU-08 — Recibir una notificación de vencimiento

**Prioridad:** Should
**Requisito relacionado:** RF-62

### Historia de usuario

> Como cliente,
> quiero recibir una notificación cuando se aproxime el vencimiento de mi cuota,
> para recordar que debo realizar el pago.

### Criterios de aceptación

* El sistema identifica las cuotas próximas a vencer.
* El cliente recibe la notificación correspondiente.
* La notificación indica que la cuota está próxima a vencer.

---

## HU-09 — Marcar una cuota como pagada manualmente

**Prioridad:** Could
**Requisito relacionado:** RF-63

### Historia de usuario

> Como administrador,
> quiero marcar manualmente una cuota como pagada,
> para registrar pagos que se hayan realizado por otro medio.

### Criterios de aceptación

* El administrador puede seleccionar una cuota pendiente.
* Puede marcarla como pagada.
* Se registra la fecha correspondiente.
* El estado de la cuota pasa a pagada.
