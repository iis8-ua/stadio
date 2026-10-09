# Feature 013 — Análisis inteligente

## Descripción

Esta funcionalidad analiza los datos disponibles del gimnasio y de los clientes para detectar patrones y proporcionar recomendaciones o información útil.

---

## HU-01 — Detectar estancamientos en el entrenamiento

**Prioridad:** Should
**Requisito relacionado:** RF-73

### Historia de usuario

> Como cliente,
> quiero que el sistema analice mi historial de entrenamiento,
> para detectar posibles estancamientos en la evolución de mis cargas.

### Criterios de aceptación

* El sistema analiza el historial disponible.
* Puede detectar posibles estancamientos de carga.
* Los resultados se basan en los datos registrados.
* Si no existen suficientes datos, el sistema no presenta una conclusión como cierta.

---

## HU-02 — Detectar baja frecuencia de entrenamiento

**Prioridad:** Should
**Requisito relacionado:** RF-73

### Historia de usuario

> Como cliente,
> quiero que el sistema analice mi frecuencia de entrenamiento por grupo muscular,
> para identificar posibles grupos musculares con poca frecuencia de trabajo.

### Criterios de aceptación

* El sistema analiza los entrenamientos registrados.
* Tiene en cuenta los grupos musculares trabajados.
* Identifica posibles frecuencias bajas según los datos disponibles.
* El resultado se muestra como información basada en el historial.

---

## HU-03 — Detectar señales de sobreentrenamiento

**Prioridad:** Should
**Requisito relacionado:** RF-73

### Historia de usuario

> Como cliente,
> quiero que el sistema analice mi actividad de entrenamiento,
> para identificar posibles señales relacionadas con un exceso de entrenamiento.

### Criterios de aceptación

* El sistema utiliza la información disponible del historial.
* Puede detectar patrones asociados a señales de sobreentrenamiento.
* Los resultados se presentan como señales o indicios, no como diagnósticos.
* Si no existen datos suficientes, se informa de ello.

---

## HU-04 — Recibir recomendaciones de progresión

**Prioridad:** Should
**Requisito relacionado:** RF-74

### Historia de usuario

> Como cliente,
> quiero recibir recomendaciones de progresión basadas en mi historial,
> para disponer de información que me ayude a planificar mis entrenamientos.

### Criterios de aceptación

* Las recomendaciones utilizan los datos disponibles del cliente.
* Se muestran recomendaciones relacionadas con la progresión.
* Las recomendaciones son comprensibles para el cliente.
* No se presentan como resultados médicos ni como certezas cuando los datos no son suficientes.

---

## HU-05 — Recibir recomendaciones de planificación

**Prioridad:** Should
**Requisito relacionado:** RF-74

### Historia de usuario

> Como cliente,
> quiero recibir recomendaciones relacionadas con la planificación de mis entrenamientos,
> para organizar mejor mi actividad.

### Criterios de aceptación

* El sistema analiza la información disponible.
* Genera recomendaciones relacionadas con la planificación.
* Las recomendaciones están relacionadas con el historial del cliente.

---

## HU-06 — Consultar insights de negocio

**Prioridad:** Should
**Requisito relacionado:** RF-75

### Historia de usuario

> Como administrador,
> quiero recibir información inteligente sobre ocupación, demanda y afluencia,
> para identificar patrones relevantes en la actividad del gimnasio.

### Criterios de aceptación

* Se analiza la información disponible del gimnasio.
* Se muestran patrones relacionados con la ocupación.
* Se muestran patrones relacionados con las clases demandadas.
* Se muestran patrones de afluencia.
* Los insights se basan en datos registrados.

---

## HU-07 — Consultar el análisis y coaching del entrenador

**Prioridad:** Should
**Requisito relacionado:** RF-92

### Historia de usuario

> Como entrenador,
> quiero un análisis de mis clases colectivas y sesiones personales y un coaching por cliente,
> para saber cómo van mis clientes y qué ajustar en su entrenamiento.

### Criterios de aceptación

* Se analiza la ocupación de las clases colectivas que imparte el entrenador.
* Se muestran sus entrenamientos personales y los clientes atendidos.
* Se calcula el ritmo/adherencia de cada cliente.
* Se generan recomendaciones por cliente (qué cambiar en su entrenamiento para mejorar).
* El resumen del entrenador refleja su actividad (clientes, clases, ocupación y rutinas).
