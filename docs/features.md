# STADIO — Features del Backend

Documento de organización de las funcionalidades del backend de STADIO a partir de los requisitos funcionales y no funcionales del proyecto.

## Convenciones

- **Must**: imprescindible para la primera versión funcional.
- **Should**: importante, pero puede posponerse tras lo imprescindible.
- **Could**: deseable, se implementa si hay margen.
- Los requisitos **RNF** son transversales y no pertenecen exclusivamente a una feature. Se indican en una sección específica al final.

---

## 001 — Autenticación y autorización

**Prioridad:** Must / Should

**Requisitos:**
- RF-01 — Inicio de sesión con email y contraseña — **Must**
- RF-02 — Cierre de sesión — **Must**
- RF-03 — Redirección según rol — **Must**
- RF-04 — Alta de clientes y empleados únicamente por administrador — **Must**
- RF-05 — Restricción de rutas y permisos según rol — **Must**
- RF-06 — Recuperación de contraseña por email — **Should**
- RF-07 — Cambio de contraseña — **Should**
- RF-08 — Edición de perfil — **Should**
- RF-09 — Expiración de sesión por inactividad — **Should**

---

## 002 — Gestión de clientes

**Prioridad:** Must / Should

**Requisitos:**
- RF-10 — Crear cliente — **Must**
- RF-11 — Editar datos de cliente — **Must**
- RF-12 — Desactivar y reactivar cliente — **Must**
- RF-13 — Buscar, filtrar y ordenar clientes — **Must**
- RF-14 — Consultar ficha e historial del cliente — **Must**
- RF-15 — Asignar identificador de pulsera NFC — **Must**
- RF-16 — Entrenador consulta ficha y progreso de sus clientes — **Should**

---

## 003 — Gestión de empleados y entrenadores

**Prioridad:** Must / Should / Could

**Requisitos:**
- RF-17 — Crear, editar y desactivar empleados — **Must**
- RF-18 — Consultar rol, horario, estado y clases asignadas — **Should**
- RF-19 — Asignar horario y disponibilidad — **Could**
- RF-20 — Asignar clases a un entrenador — **Must**
- RF-89 — Contratar el servicio de entrenador personal (cliente) y asignarlo (administrador) — **Must**
- RF-91 — Agenda semanal del entrenador (turno + actividades) — **Should**

---

## 004 — Clases y horarios

**Prioridad:** Must / Should

**Requisitos:**
- RF-21 — Crear una clase — **Must**
- RF-22 — Editar o eliminar una clase — **Must**
- RF-23 — Calendario visible para cliente, entrenador y administrador — **Must**
- RF-24 — Control de capacidad máxima de la clase — **Must**
- RF-25 — Entrenador consulta clases, asistentes y capacidad — **Should**
- RF-90 — Editar los materiales/equipamiento de una clase — **Should**

---

## 005 — Reservas

**Prioridad:** Must / Should

**Requisitos:**
- RF-26 — Reservar una clase con plazas disponibles — **Must**
- RF-27 — Cancelar una reserva propia — **Must**
- RF-28 — Impedir reservas cuando la clase está completa — **Must**
- RF-29 — Impedir reservas duplicadas del mismo cliente — **Must**
- RF-30 — Consultar próximas reservas e historial — **Must**
- RF-31 — Administrador consulta reservas y ocupación por clase — **Should**

---

## 006 — Rutinas y ejercicios

**Prioridad:** Must / Should

**Requisitos:**
- RF-32 — Biblioteca de ejercicios organizada por grupo muscular — **Must**
- RF-33 — Buscar ejercicios por nombre — **Must**
- RF-34 — Crear y editar rutinas con series individuales (cada serie con su peso, repeticiones, descanso, RIR y RPE) — **Must**
- RF-35 — Planificar las rutinas de un cliente en un calendario semanal (asignar rutina a días) — **Must**
- RF-36 — Cliente consulta su rutina asignada — **Must**
- RF-37 — Añadir ejercicios a la biblioteca — **Should**
- RF-38 — Eliminar una rutina — **Should**

---

## 007 — Entrenamiento activo

**Prioridad:** Must / Should

**Requisitos:**
- RF-39 — Iniciar entrenamiento desde la rutina — **Must**
- RF-40 — Registrar cada serie — **Must**
- RF-41 — Navegar entre ejercicios y finalizar entrenamiento — **Must**
- RF-42 — Mostrar resumen del entrenamiento — **Must**
- RF-43 — Guardar entrenamiento en el historial — **Must**
- RF-44 — Temporizador de descanso — **Should**

---

## 008 — Progreso

**Prioridad:** Should / Could

**Requisitos:**
- RF-45 — Evolución de cargas por ejercicio — **Should**
- RF-46 — Métricas de frecuencia, volumen y peso corporal — **Should**
- RF-47 — Filtros temporales de las gráficas — **Should**
- RF-48 — Comparativas entre periodos — **Could**

---

## 009 — Control de accesos y aforo

**Prioridad:** Must / Should / Could

**Requisitos:**
- RF-49 — Registrar entrada y salida mediante pulsera NFC — **Must**
- RF-50 — Asociar acceso al usuario mediante identificador NFC — **Must**
- RF-51 — Consultar historial de accesos — **Must**
- RF-52 — Calcular y mostrar aforo en tiempo real — **Must**
- RF-53 — Mostrar accesos sin salida registrada — **Should**
- RF-54 — Registrar accesos manualmente — **Could**

---

## 010 — Cuotas y pagos

**Prioridad:** Must / Should / Could

**Requisitos:**
- RF-55 — Una única cuota mensual para todos los clientes — **Must**
- RF-56 — Pago mediante pasarela de pago — **Must**
- RF-57 — Cobro automático en la fecha de vencimiento — **Must**
- RF-58 — Registrar estado mensual y fecha de pago — **Must**
- RF-59 — Impedir cuotas duplicadas — **Must**
- RF-60 — Cliente consulta cuota e historial de pagos — **Must**
- RF-61 — Administrador consulta cuotas, ingresos y fechas — **Must**
- RF-62 — Notificar vencimiento de cuota — **Should**
- RF-63 — Marcar cuota manualmente como pagada — **Could**

---

## 011 — Instalaciones y mantenimiento

**Prioridad:** Should

**Requisitos:**
- RF-64 — Gestionar salas — **Should**
- RF-65 — Gestionar equipos por sala — **Should**
- RF-66 — Gestionar estado de equipos — **Should**
- RF-67 — Registrar incidencias y mantenimientos — **Should**

---

## 012 — Analítica

**Prioridad:** Should / Could

**Requisitos:**
- RF-68 — KPIs de clientes, clases, ingresos y accesos — **Should**
- RF-69 — Gráficas de ingresos y ocupación — **Should**
- RF-70 — Horas punta, clases demandadas, usuarios y retención — **Should**
- RF-71 — Filtros temporales — **Should**
- RF-72 — Exportación de informes — **Could**

---

## 013 — Análisis inteligente

**Prioridad:** Should

**Requisitos:**
- RF-73 — Detectar estancamientos, baja frecuencia y señales de sobreentrenamiento — **Should**
- RF-74 — Recomendaciones de progresión y planificación — **Should**
- RF-75 — Insights de negocio para el administrador — **Should**
- RF-92 — Análisis y coaching para el entrenador (clases, sesiones personales y ritmo de sus clientes) — **Should**

---

## 014 — Chatbot

**Prioridad:** Should

**Requisitos:**
- RF-76 — Chatbot para dudas sobre el gimnasio — **Should**
- RF-77 — Respuestas basadas en la información real configurada — **Should**

---

## 015 — Configuración del gimnasio

**Prioridad:** Must / Should / Could

**Requisitos:**
- RF-78 — Editar datos generales del gimnasio — **Must**
- RF-79 — Configurar importe de cuota mensual — **Must**
- RF-80 — Gestionar integraciones — **Should**
- RF-81 — Gestionar roles y permisos — **Should**
- RF-82 — Configurar notificaciones — **Could**

---

## 016 — Dashboards

**Prioridad:** Must / Should

**Requisitos:**
- RF-83 — Dashboard de cliente — **Must**
- RF-84 — Dashboard de entrenador — **Must**
- RF-85 — Dashboard de administrador — **Must**
- RF-86 — Modo claro/oscuro — **Should**
- RF-87 — Estados de carga, vacío, error y éxito — **Should**
- RF-88 — Confirmación del resultado de acciones de escritura — **Should**

---

# Requisitos no funcionales transversales

Estos requisitos afectan a varias o todas las features del backend y, por tanto, no se asignan a una única feature.

## Rendimiento

- RNF-01 — Respuestas de API inferiores a 2 s en condiciones normales — **Must**
- RNF-02 — Actualización del aforo con latencia mínima — **Should**
- RNF-03 — Soporte de uso concurrente — **Should**

## Seguridad

- RNF-04 — Hash de contraseñas y HTTPS — **Must**
- RNF-05 — Autenticación y autorización en cada endpoint — **Must**
- RNF-06 — Cumplimiento RGPD — **Must**
- RNF-07 — Validación, saneado y protección frente a inyección, CSRF y XSS — **Must**
- RNF-08 — No almacenar datos bancarios en bruto — **Should**

## Compatibilidad y responsive

- RNF-09 — Responsive de 390×844 px a 1440 px — **Must**
- RNF-10 — Compatibilidad con navegadores actuales — **Must**
- RNF-11 — Coherencia de modo claro/oscuro — **Should**

## Disponibilidad

- RNF-12 — Disponibilidad ≥ 95 % en horario de uso — **Should**
- RNF-13 — Recuperación automática ante fallos — **Should**
- RNF-14 — Copias de seguridad periódicas — **Should**

## Accesibilidad

- RNF-15 — WCAG 2.1 nivel AA — **Should**
- RNF-16 — Navegación completa por teclado — **Should**
- RNF-17 — Objetivos táctiles adecuados en móvil — **Should**

## Usabilidad

- RNF-18 — Estados de carga, vacío, error y éxito — **Must**
- RNF-19 — Feedback inmediato de las acciones — **Must**
- RNF-20 — Consistencia visual y de navegación entre roles — **Should**

## Despliegue y mantenimiento

- RNF-21 — Despliegue reproducible con Docker Compose — **Must**
- RNF-22 — CI con lint y tests automáticos — **Should**
- RNF-23 — Logs consultables — **Should**
- RNF-24 — Datos de prueba mediante seeders — **Should**

## Portabilidad

- RNF-25 — Ejecución en sistemas con Docker — **Should**
- RNF-26 — Migraciones versionadas de base de datos — **Should**
- RNF-27 — Exportación de datos principales a CSV/JSON — **Could**

---

# Orden recomendado de desarrollo

1. **001 — Autenticación y autorización**
2. **002 — Gestión de clientes**
3. **003 — Gestión de empleados y entrenadores**
4. **004 — Clases y horarios**
5. **005 — Reservas**
6. **006 — Rutinas y ejercicios**
7. **007 — Entrenamiento activo**
8. **008 — Progreso**
9. **009 — Control de accesos y aforo**
10. **010 — Cuotas y pagos**
11. **011 — Instalaciones y mantenimiento**
12. **012 — Analítica**
13. **013 — Análisis inteligente**
14. **014 — Chatbot**
15. **015 — Configuración del gimnasio**
16. **016 — Dashboards**

Los requisitos no funcionales deben aplicarse de forma transversal durante el desarrollo, especialmente los de seguridad, validación, rendimiento, logs y pruebas.
