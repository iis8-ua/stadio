# Análisis de riesgos: *STADIO*

## 1. Objetivo y metodología

El objetivo de este documento es identificar, evaluar y gestionar los principales riesgos que pueden afectar al desarrollo de STADIO. El análisis contempla riesgos relacionados con la planificación, el alcance, la tecnología, las integraciones externas, la seguridad y la calidad del software.

***Criterios de evaluación***

Cada riesgo se valora con dos dimensiones:

- **Probabilidad (P)**: Baja / Media / Alta.
- **Impacto (I)**: Bajo / Medio / Alto.

---

## 2. Registro de riesgos

| ID | Riesgo | Categoría | P | I |
|----|--------|-----------|---|---|
| R-01 |Plazo insuficiente para completar el proyecto con una dedicación aproximada de 20 h/semana | Gestión | Alta | Alto |
| R-02 | Alcance excesivo por el número de módulos e integraciones previstos | Alcance | Alta | Alto |
| R-03 | Incompatibilidad o dificultad de integración con tornos y pulseras NFC reales | Técnico/Externo | Media | Alto |
| R-04 | Errores en la integración de Stripe y en la gestión del ciclo de vida de los pagos | Externo | Media | Medio |
| R-05 | Indisponibilidad, limitaciones funcionales o restricciones de licencia de la API wger | Externo | Media | Bajo |
| R-06 | Inconsistencias por concurrencia en reservas, cuotas, entrenamientos o registros de acceso | Técnico | Media | Alto |
| R-07 | Curva de aprendizaje de Laravel, Docker y las herramientas de integración continua | Técnico | Media | Medio |
| R-08 | Resultados poco útiles o incoherentes de las funcionalidades inteligentes basadas en reglas | Técnico | Media | Bajo |
| R-09 | Incumplimiento de obligaciones de protección de datos o exposición de información personal | Legal | Baja | Alto |
| R-10 | Pérdida de código, documentación o historial de trabajo | Gestión | Baja | Alto | 
| R-11 | Entorno de ejecución no reproducible o fallos en la integración continua | Técnico | Baja | Medio |
| R-12 | Cambios en los requisitos, el calendario o los criterios acordados con la tutoría. | Gestión | Baja | Medio |

---

## 3. Planes de contingencia

| ID | Solucion |
|----|--------|
| R-01 | reducir o posponer funcionalidades no esenciales, empezando por los requisitos Could y, si fuera necesario, algunos Should, previa revisión del alcance con la tutoría |
| R-02 | congelar temporalmente la incorporación de nuevas funcionalidades y concentrar el esfuerzo en completar y verificar lo esencial | 
| R-03 | utilizar la simulación de la integración (prototipo / simulador de tornos) para completar y verificar la lógica de negocio. La integración física se documentará como limitación si no puede validarse con hardware real |
| R-04 | registrar los errores, permitir la reconciliación de estados y mantener una gestión de pagos desacoplada del resto de los módulos |
| R-05 | utilizar los ejercicios ya almacenados y permitir que la aplicación siga funcionando sin acceso temporal a la API. Si las condiciones de licencia no resultan adecuadas, limitar la importación o sustituir la fuente | 
| R-06 | corregir la operación dentro de una transacción cuando sea posible, registrar la incidencia y habilitar un procedimiento de reconciliación de los datos afectados | 
| R-07 | reducir temporalmente la complejidad de la solución y priorizar una implementación sencilla que cumpla los requisitos esenciales | 
| R-08 | desactivar las reglas problemáticas, conservar las funcionalidades básicas de consulta y registro y limitar el análisis a los casos que puedan verificarse | 
| R-09 | bloquear el acceso afectado, revocar credenciales comprometidas, investigar el incidente y aplicar las medidas correctivas y de notificación que correspondan | 
| R-10 | recuperar la última versión remota o copia disponible y reconstruir los cambios perdidos a partir del historial de versiones | 
| R-11 | corregir la configuración del entorno, documentar los pasos necesarios y bloquear la integración de cambios que impidan ejecutar las pruebas esenciales | 
| R-12 | revisar el alcance y el calendario con la tutoría, renegociar prioridades (MoSCoW) y ajustar la planificación |

## 4. Mecanismos de seguimiento y control

Para realizar el seguimiento y control del proyecto se utilizarán **GitHub, Trello y GanttProject**, asignando a cada herramienta una función específica dentro de la planificación, la organización del trabajo y el control del desarrollo.

**GanttProject** se utilizará para elaborar y mantener la planificación temporal del proyecto. Permitirá organizar las tareas y los hitos de las distintas fases del Proceso Unificado (UP), establecer sus dependencias y consultar la duración prevista de las actividades. De esta forma, será posible detectar desviaciones respecto al calendario inicial y ajustar la planificación cuando resulte necesario. En este se establece ya que no se puede poner una tarea a un numero no entero, que 1 dia en este gantt es 0.25 dias reales. 

**Trello** se empleará para organizar visualmente las tareas pendientes y realizar un seguimiento de su estado. Mediante un tablero con listas que representen las distintas etapas del trabajo, se podrá identificar qué actividades están pendientes, en curso, bloqueadas o completadas, facilitando la priorización y el control del trabajo de cada iteración.

**GitHub** será la herramienta principal para el control de versiones y el seguimiento técnico del desarrollo. Se utilizará Git para registrar los cambios mediante commits y trabajar con GitHub Flow + pull requests con rama develop, desarrollando las nuevas funcionalidades en ramas independientes. Los cambios se integrarán en la rama principal y en la de desarrollo como ya se ha dicho mediante *pull requests*, que permitirán revisar las modificaciones antes de incorporarlas. Asimismo, GitHub Issues servirá para registrar y gestionar tareas, errores e incidencias (además tendré un tablero para gestionar el bugtracking para estos issues), mientras que GitHub Projects facilitará la organización y visualización del trabajo. Por último, GitHub Actions permitirá automatizar comprobaciones y pruebas para detectar errores durante el desarrollo y permitir con facilidad las nuevas releases siguiendo el sistema de versionado clasico.

La combinación de estas herramientas permitirá mantener la trazabilidad entre la planificación temporal, las tareas realizadas y los cambios incorporados al código, facilitando la detección temprana de problemas y la adaptación del proyecto a la disponibilidad de tiempo y a los objetivos establecidos.
