# Feature 012 — Analítica

## Descripción

Esta funcionalidad proporciona al administrador información agregada sobre clientes, clases, ingresos, ocupación y actividad del gimnasio.

---

## HU-01 — Consultar los principales indicadores del gimnasio

**Prioridad:** Should
**Requisito relacionado:** RF-68

### Historia de usuario

> Como administrador,
> quiero consultar los principales indicadores del gimnasio,
> para conocer su situación actual.

### Criterios de aceptación

* Se muestra el total de clientes.
* Se muestran las clases del día.
* Se muestran los ingresos del mes.
* Se muestran los accesos del día.
* Se muestra la variación respecto al mes anterior.

---

## HU-02 — Consultar ingresos y ocupación

**Prioridad:** Should
**Requisito relacionado:** RF-69

### Historia de usuario

> Como administrador,
> quiero consultar gráficas de ingresos y ocupación,
> para analizar la evolución de la actividad del gimnasio.

### Criterios de aceptación

* Se muestra una gráfica de ingresos.
* Se muestra una gráfica de ocupación.
* Los datos representados corresponden a información registrada.
* Las gráficas permiten interpretar la evolución de los datos.

---

## HU-03 — Consultar las horas punta y clases más demandadas

**Prioridad:** Should
**Requisito relacionado:** RF-70

### Historia de usuario

> Como administrador,
> quiero conocer las horas punta y las clases más demandadas,
> para analizar los patrones de asistencia del gimnasio.

### Criterios de aceptación

* Se muestran las horas con mayor afluencia.
* Se muestran las clases con mayor demanda.
* Los resultados se obtienen a partir de los datos registrados.

---

## HU-04 — Consultar la evolución y retención de usuarios

**Prioridad:** Should
**Requisito relacionado:** RF-70

### Historia de usuario

> Como administrador,
> quiero consultar la evolución de usuarios y la retención,
> para analizar el comportamiento de los clientes a lo largo del tiempo.

### Criterios de aceptación

* Se muestra la evolución de usuarios.
* Se muestra información sobre retención.
* Los datos corresponden al periodo consultado.

---

## HU-05 — Filtrar la analítica por periodo

**Prioridad:** Should
**Requisito relacionado:** RF-71

### Historia de usuario

> Como administrador,
> quiero filtrar la información analítica por diferentes periodos,
> para analizar los datos según el intervalo temporal que me interese.

### Criterios de aceptación

* Se puede seleccionar semana.
* Se puede seleccionar mes.
* Se pueden seleccionar 3 meses.
* Se pueden seleccionar 6 meses.
* Se puede seleccionar año.
* Los indicadores y gráficas se actualizan según el periodo seleccionado.

---

## HU-06 — Exportar un informe

**Prioridad:** Could
**Requisito relacionado:** RF-72

### Historia de usuario

> Como administrador,
> quiero exportar un informe de los datos analíticos,
> para poder utilizar la información fuera de STADIO.

### Criterios de aceptación

* El administrador puede solicitar la exportación.
* El informe contiene los datos correspondientes al periodo seleccionado.
* La exportación se completa correctamente cuando existen datos disponibles.
