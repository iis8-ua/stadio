# Feature 014 — Chatbot

## Descripción

Esta funcionalidad proporciona al cliente un asistente virtual para resolver dudas relacionadas con el funcionamiento del gimnasio utilizando la información configurada en STADIO.

---

## HU-01 — Consultar dudas sobre el gimnasio

**Prioridad:** Should
**Requisito relacionado:** RF-76

### Historia de usuario

> Como cliente,
> quiero realizar preguntas mediante un chatbot,
> para resolver dudas sobre el funcionamiento del gimnasio.

### Criterios de aceptación

* El cliente puede abrir el chatbot.
* Puede escribir una pregunta.
* El sistema muestra una respuesta.
* El chatbot permite consultar información relacionada con horarios, clases, reservas, cuota, accesos e instalaciones.

---

## HU-02 — Obtener información real del gimnasio

**Prioridad:** Should
**Requisito relacionado:** RF-77

### Historia de usuario

> Como cliente,
> quiero que el chatbot utilice la información configurada del gimnasio,
> para recibir respuestas relacionadas con la situación real del centro.

### Criterios de aceptación

* Las respuestas utilizan la información configurada en STADIO.
* La información sobre horarios corresponde a la configuración del gimnasio.
* La información sobre clases, cuota, accesos e instalaciones se basa en los datos disponibles.
* El chatbot no debe presentar como información del gimnasio datos que no estén configurados.
