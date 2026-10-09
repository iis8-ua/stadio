# Feature 016 — Dashboards y experiencia común

## Descripción

Esta funcionalidad proporciona a cada rol un dashboard adaptado a sus necesidades y establece comportamientos comunes de la interfaz.

---

## HU-01 — Consultar el dashboard de cliente

**Prioridad:** Must
**Requisito relacionado:** RF-83

### Historia de usuario

> Como cliente,
> quiero disponer de un dashboard con la información más relevante de mi actividad,
> para conocer rápidamente qué tengo previsto hacer y el estado del gimnasio.

### Criterios de aceptación

* Se muestra el entrenamiento de hoy.
* Se muestra la próxima clase.
* Se muestra el estado del gimnasio.
* La información corresponde al cliente autenticado.

---

## HU-02 — Consultar el dashboard de entrenador

**Prioridad:** Must
**Requisito relacionado:** RF-84

### Historia de usuario

> Como entrenador,
> quiero disponer de un dashboard con mi actividad profesional,
> para conocer rápidamente mis tareas y clases.

### Criterios de aceptación

* Se muestran las clases del día.
* Se muestran los clientes asignados.
* Se muestran las rutinas pendientes.
* La información corresponde al entrenador autenticado.

---

## HU-03 — Consultar el dashboard de administrador

**Prioridad:** Must
**Requisito relacionado:** RF-85

### Historia de usuario

> Como administrador,
> quiero disponer de un dashboard con los principales indicadores y el resumen operativo,
> para conocer rápidamente el estado del gimnasio.

### Criterios de aceptación

* Se muestran los principales KPIs.
* Se muestra un resumen operativo del día.
* La información corresponde a los datos actuales disponibles.

---

## HU-04 — Cambiar entre modo claro y oscuro

**Prioridad:** Should
**Requisito relacionado:** RF-86

### Historia de usuario

> Como usuario,
> quiero poder cambiar entre modo claro y oscuro,
> para utilizar la aplicación con la apariencia que prefiera.

### Criterios de aceptación

* El usuario puede seleccionar el modo claro.
* Puede seleccionar el modo oscuro.
* El cambio se aplica a la interfaz.
* Los elementos de la aplicación mantienen una apariencia coherente en ambos modos.

---

## HU-05 — Consultar estados de carga, vacío, error y éxito

**Prioridad:** Should
**Requisito relacionado:** RF-87

### Historia de usuario

> Como usuario,
> quiero recibir información visual sobre el estado de las operaciones y los datos,
> para saber qué está ocurriendo en la aplicación.

### Criterios de aceptación

* Las vistas muestran un estado de carga mientras se obtienen datos.
* Muestran un estado vacío cuando no existen datos.
* Muestran un estado de error cuando una operación falla.
* Muestran un estado de éxito cuando corresponde.
* Los estados son comprensibles para el usuario.

---

## HU-06 — Recibir confirmación de las acciones

**Prioridad:** Should
**Requisito relacionado:** RF-88

### Historia de usuario

> Como usuario,
> quiero recibir una confirmación cuando realizo una acción de escritura,
> para saber si la operación se ha realizado correctamente.

### Criterios de aceptación

* Las acciones de escritura muestran el resultado de la operación.
* Cuando la acción tiene éxito, el sistema informa al usuario.
* Cuando la acción falla, el sistema informa del error.
* El usuario puede distinguir claramente entre una operación correcta y una fallida.
