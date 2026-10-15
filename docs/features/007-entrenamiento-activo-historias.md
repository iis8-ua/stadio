# Feature 007 — Entrenamiento activo

## Descripción

Esta funcionalidad permite al cliente realizar un entrenamiento a partir de su rutina, registrar cada serie y consultar el resumen y el historial posterior.

---

## HU-01 — Iniciar un entrenamiento

**Prioridad:** Must
**Requisito relacionado:** RF-39

### Historia de usuario

> Como cliente,
> quiero iniciar un entrenamiento desde mi rutina,
> para comenzar a registrar la sesión que voy a realizar.

### Criterios de aceptación

* El cliente puede iniciar un entrenamiento desde su rutina asignada.
* El sistema identifica la rutina utilizada.
* El entrenamiento queda iniciado.
* El cliente puede comenzar a registrar sus series.

---

## HU-02 — Registrar una serie

**Prioridad:** Must
**Requisito relacionado:** RF-40

### Historia de usuario

> Como cliente,
> quiero registrar los datos de cada serie que realizo,
> para guardar mi actividad de entrenamiento.

### Criterios de aceptación

* El cliente puede registrar el peso.
* Puede registrar las repeticiones.
* Puede registrar RIR y RPE.
* Puede registrar el descanso.
* Puede añadir notas.
* Los datos quedan asociados al ejercicio y al entrenamiento correspondiente.

---

## HU-03 — Avanzar entre ejercicios

**Prioridad:** Must
**Requisito relacionado:** RF-41

### Historia de usuario

> Como cliente,
> quiero avanzar entre los ejercicios de mi entrenamiento,
> para completar la rutina de forma ordenada.

### Criterios de aceptación

* El cliente puede consultar el ejercicio actual.
* Puede pasar al siguiente ejercicio.
* Puede volver a ejercicios anteriores cuando sea necesario.
* Los datos registrados se conservan al cambiar de ejercicio.

---

## HU-04 — Finalizar un entrenamiento

**Prioridad:** Must
**Requisito relacionado:** RF-41

### Historia de usuario

> Como cliente,
> quiero finalizar mi entrenamiento cuando haya terminado todos los ejercicios,
> para cerrar la sesión y guardar sus resultados.

### Criterios de aceptación

* El cliente puede finalizar el entrenamiento.
* El sistema registra que el entrenamiento ha terminado.
* Los datos registrados durante la sesión se conservan.
* Tras finalizar se muestra el resumen del entrenamiento.

---

## HU-05 — Consultar el resumen del entrenamiento

**Prioridad:** Must
**Requisito relacionado:** RF-42

### Historia de usuario

> Como cliente,
> quiero consultar un resumen al finalizar mi entrenamiento,
> para conocer los resultados de la sesión realizada.

### Criterios de aceptación

* Se muestran los ejercicios realizados.
* Se muestran las series realizadas.
* Se muestra la duración del entrenamiento.
* Se muestra el volumen total.
* El resumen corresponde exclusivamente al entrenamiento finalizado.

---

## HU-06 — Guardar el entrenamiento en el historial

**Prioridad:** Must
**Requisito relacionado:** RF-43

### Historia de usuario

> Como cliente,
> quiero que mis entrenamientos finalizados queden guardados,
> para poder consultar mi actividad anterior.

### Criterios de aceptación

* Cada entrenamiento finalizado queda asociado al cliente.
* Se conserva la información registrada durante el entrenamiento.
* El entrenamiento aparece posteriormente en el historial.
* No se pierde la información registrada al finalizar la sesión.

---

## HU-07 — Utilizar el temporizador de descanso

**Prioridad:** Should
**Requisito relacionado:** RF-44

### Historia de usuario

> Como cliente,
> quiero utilizar un temporizador durante los descansos,
> para controlar el tiempo entre series.

### Criterios de aceptación

* El cliente puede iniciar el temporizador.
* Puede consultar el tiempo restante.
* El temporizador continúa durante el descanso.
* El sistema informa cuando finaliza el tiempo establecido.
