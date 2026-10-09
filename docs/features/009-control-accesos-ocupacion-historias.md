# Feature 009 — Control de accesos y ocupación

## Descripción

Esta funcionalidad permite registrar las entradas y salidas mediante pulsera NFC y consultar el historial y el aforo del gimnasio.

---

## HU-01 — Registrar una entrada mediante NFC

**Prioridad:** Must
**Requisito relacionado:** RF-49

### Historia de usuario

> Como cliente,
> quiero acceder al gimnasio utilizando mi pulsera NFC,
> para registrar mi entrada.

### Criterios de aceptación

* El torno identifica la pulsera NFC.
* El acceso se registra como entrada.
* La entrada queda asociada al usuario correspondiente.
* El registro contiene la fecha y hora del acceso.

---

## HU-02 — Registrar una salida mediante NFC

**Prioridad:** Must
**Requisito relacionado:** RF-49

### Historia de usuario

> Como cliente,
> quiero registrar mi salida utilizando mi pulsera NFC,
> para que el sistema conozca cuándo he abandonado el gimnasio.

### Criterios de aceptación

* El torno identifica la pulsera NFC.
* El acceso se registra como salida.
* La salida queda asociada al usuario correspondiente.
* El registro contiene la fecha y hora del acceso.

---

## HU-03 — Asociar una pulsera NFC a un usuario

**Prioridad:** Must
**Requisito relacionado:** RF-50

### Historia de usuario

> Como administrador,
> quiero asociar el identificador de una pulsera NFC a un cliente,
> para que sus accesos queden correctamente identificados.

### Criterios de aceptación

* El administrador puede seleccionar un cliente.
* Puede registrar su identificador de pulsera.
* Los accesos realizados con esa pulsera quedan asociados al cliente.
* El sistema evita asociaciones incorrectas o ambiguas.

---

## HU-04 — Consultar mi historial de accesos

**Prioridad:** Must
**Requisito relacionado:** RF-51

### Historia de usuario

> Como cliente,
> quiero consultar mi historial de entradas y salidas,
> para conocer cuándo he accedido al gimnasio y cuánto tiempo he permanecido dentro.

### Criterios de aceptación

* Se muestra la fecha del acceso.
* Se muestra la entrada.
* Se muestra la salida cuando está registrada.
* Se muestra la duración cuando puede determinarse.

---

## HU-05 — Consultar el aforo en tiempo real

**Prioridad:** Must
**Requisito relacionado:** RF-52

### Historia de usuario

> Como administrador,
> quiero consultar las personas que se encuentran actualmente en el gimnasio,
> para conocer el nivel de ocupación.

### Criterios de aceptación

* Se muestra el número de personas dentro.
* Se muestra la capacidad máxima.
* Se muestra el porcentaje de ocupación.
* La información se actualiza después de los accesos registrados.

---

## HU-06 — Identificar una salida no registrada

**Prioridad:** Should
**Requisito relacionado:** RF-53

### Historia de usuario

> Como administrador,
> quiero identificar los accesos que no tienen una salida registrada,
> para diferenciar los datos conocidos de los que no están disponibles.

### Criterios de aceptación

* Un acceso sin salida se identifica como «salida no registrada».
* El sistema no inventa una hora de salida.
* El acceso continúa disponible en el historial.

---

> **Nota:** el acceso al gimnasio es exclusivamente con pulsera NFC leída en el torno (pulsera = torno). No existe registro manual de accesos (RF-54 eliminado). El campo de método se mantiene por si en el futuro se incorpora otro tipo.
