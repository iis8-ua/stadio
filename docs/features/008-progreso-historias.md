# Feature 008 — Progreso

## Descripción

Esta funcionalidad permite al cliente consultar la evolución de sus entrenamientos mediante métricas y gráficas.

---

## HU-01 — Consultar la evolución de las cargas

**Prioridad:** Should
**Requisito relacionado:** RF-45

### Historia de usuario

> Como cliente,
> quiero consultar la evolución de mis cargas por ejercicio mediante una gráfica,
> para conocer cómo ha progresado mi rendimiento.

### Criterios de aceptación

* El cliente puede seleccionar un ejercicio.
* Se muestra la evolución de la carga registrada.
* La gráfica utiliza los datos disponibles en el historial.
* Si no existen datos suficientes, se informa de ello.

---

## HU-02 — Consultar mis métricas de progreso

**Prioridad:** Should
**Requisito relacionado:** RF-46

### Historia de usuario

> Como cliente,
> quiero consultar mi frecuencia de entrenamiento, volumen y peso corporal,
> para conocer mi evolución.

### Criterios de aceptación

* Se muestra la frecuencia de entrenamiento.
* Se muestra el volumen registrado.
* Se muestra la evolución del peso corporal cuando existen datos.
* Las métricas corresponden al periodo consultado.

---

## HU-03 — Filtrar el progreso por periodo

**Prioridad:** Should
**Requisito relacionado:** RF-47

### Historia de usuario

> Como cliente,
> quiero seleccionar un periodo de tiempo para consultar mi progreso,
> para analizar mi evolución en diferentes intervalos.

### Criterios de aceptación

* Se puede seleccionar semana.
* Se puede seleccionar mes.
* Se pueden seleccionar 3 meses.
* Se pueden seleccionar 6 meses.
* Se puede seleccionar año.
* Las gráficas y métricas se actualizan según el periodo seleccionado.

---

## HU-04 — Comparar periodos de progreso

**Prioridad:** Could
**Requisito relacionado:** RF-48

### Historia de usuario

> Como cliente,
> quiero comparar mis resultados entre diferentes periodos,
> para identificar cambios en mi evolución.

### Criterios de aceptación

* El cliente puede seleccionar los periodos que quiere comparar.
* El sistema muestra los datos correspondientes a cada periodo.
* La comparación utiliza datos registrados.
* Si no existen datos suficientes, se informa al cliente.
