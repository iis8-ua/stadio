# API REST — Referencia de endpoints

Contrato de diseño de la API REST. Describe la finalidad de cada endpoint, los permisos previstos, los principales datos de entrada y las respuestas esperadas.

- **Base URL**: `/api`
- **Formato**: JSON
- **Autenticación**: **cookie de sesión** (flujo SPA de Laravel Sanctum). El navegador obtiene primero la cookie CSRF con `GET /sanctum/csrf-cookie` y después inicia sesión; las peticiones posteriores viajan con la cookie de sesión (`HttpOnly`) y la cabecera `X-XSRF-TOKEN`. No se usan tokens en el navegador. Los tornos/NFC se autentican aparte con un **token de dispositivo** (ver *Dispositivos (tornos / NFC)*).
- **Nota**: `GET /sanctum/csrf-cookie` se sirve en la **raíz** (fuera de `/api`); el resto de endpoints cuelgan de `/api`.
- **Paginación**: `?page=n` → `{ data, current_page, last_page, per_page, total }`
- **Errores**: `{ "message": "...", "errors": { "campo": [ "..." ] } }`. El objeto `errors` puede omitirse cuando no haya errores de validación por campo.

**Códigos habituales**: `200` operación correcta · `201` recurso creado · `202` solicitud aceptada para procesamiento · `204` operación correcta sin cuerpo de respuesta · `401` no autenticado · `403` sin permisos · `404` recurso no encontrado · `409` conflicto · `422` datos de entrada no válidos. Cada endpoint devolverá solo los códigos que correspondan a su comportamiento.

**Roles**: `cliente`, `entrenador` (con perfil **entrenador personal** o **monitor/instructor**) y `administrador`.

---

## Autenticación y usuarios

### `GET /sanctum/csrf-cookie` — Obtener cookie CSRF
- **Qué hace**: emite la cookie `XSRF-TOKEN` necesaria para las peticiones de sesión. Lo proporciona Laravel Sanctum.
- **Quién**: público.
- **Respuesta**: `204`. El frontend debe leer el valor de la cookie y enviarlo en la cabecera `X-XSRF-TOKEN` de las peticiones de escritura.

### `POST /auth/login` — Iniciar sesión
- **Qué hace**: valida email y contraseña y **abre una sesión** (cookie), devolviendo el **rol** y, si el usuario es entrenador, el **perfil profesional**.
- **Quién**: público.
- **Cuerpo**: `{ "email", "password" }`.
- **Respuesta `200`**: `{ "role", "trainer_profile", "user" }`. `401` credenciales incorrectas, `422` datos inválidos.
- **2FA (administrador)**: si el usuario es **administrador** y tiene 2FA activa (RF-96), la respuesta es `202` con un desafío de segundo factor; el código TOTP (o uno de recuperación) se envía en una segunda llamada a este mismo endpoint con `{ "email", "password", "codigo" }`.

### `POST /auth/logout` — Cerrar sesión
- **Qué hace**: cierra la sesión actual (invalida la sesión en el servidor y descarta la cookie).
- **Quién**: usuario autenticado.
- **Respuesta**: `204`.

### `POST /auth/forgot-password` — Recuperar contraseña
- **Qué hace**: envía por **email** un enlace de restablecimiento (Password Broker de Laravel).
- **Quién**: público.
- **Cuerpo**: `{ "email" }`. **Respuesta**: `204` (no revela si el correo existe).

### `POST /auth/reset-password` — Restablecer contraseña
- **Qué hace**: cambia la contraseña usando el token recibido por email.
- **Quién**: público.
- **Cuerpo**: `{ "email", "token", "password", "password_confirmation" }`. **Respuesta**: `204` / `422`.

### `GET /me` — Usuario autenticado
- **Qué hace**: devuelve los datos del usuario de la sesión, incluyendo **rol** y **perfil**.
- **Quién**: autenticado. **Respuesta `200`**: objeto usuario.

### `PATCH /me` — Editar mi perfil
- **Qué hace**: actualiza los campos de perfil que el usuario tenga permitido modificar (por ejemplo, nombre, teléfono, dirección, avatar o **email**; el cambio de email requiere **re-verificación**, RF-97). Los campos sensibles, como el rol y el estado de la cuenta, no se modifican desde esta ruta.
- **Quién**: usuario autenticado.
- **Cuerpo**: objeto JSON con los campos editables que se desean cambiar.
- **Respuesta `200`**: usuario actualizado. `422` si los datos no son válidos.

### `PUT /me/password` — Cambiar contraseña
- **Qué hace**: cambia la contraseña del usuario autenticado (RF-07).
- **Quién**: usuario autenticado.
- **Cuerpo**: `{ "password_actual", "password", "password_confirmation" }`. **Respuesta `204`**. `401` si la contraseña actual no es correcta; `422` si los datos no son válidos.

### `POST /me/2fa` — Iniciar la activación de 2FA
- **Qué hace**: genera el **secreto TOTP** y la URL `otpauth` para configurar la app de autenticación (RF-96). Obligatorio para el rol administrador.
- **Quién**: usuario autenticado. **Respuesta `200`**: `{ "secret", "otpauth_url" }`.

### `POST /me/2fa/confirmar` — Confirmar la activación de 2FA
- **Qué hace**: confirma el segundo factor con un código TOTP y devuelve los **códigos de recuperación** (de un solo uso).
- **Quién**: usuario autenticado. **Cuerpo**: `{ "codigo" }`. **Respuesta `200`**: `{ "recovery_codes": [...] }`. `422` si el código no es válido.

### `DELETE /me/2fa` — Desactivar 2FA
- **Qué hace**: desactiva el segundo factor. **Quién**: usuario autenticado. **Cuerpo**: `{ "codigo" }`. **Respuesta `204`**.

### `POST /auth/verificar-email` — Verificar el correo electrónico
- **Qué hace**: verifica el correo del cliente con el código recibido (RF-97).
- **Quién**: usuario autenticado. **Cuerpo**: `{ "codigo" }`. **Respuesta `204`** / `422`.

### `POST /auth/reenviar-verificacion` — Reenviar la verificación de email
- **Qué hace**: reenvía el correo de verificación (RF-97). **Quién**: usuario autenticado. **Respuesta `204`**.

---

## Clientes

### `GET /clientes` — Listar clientes
- **Qué hace**: devuelve el listado de clientes con **búsqueda, filtros y orden**.
- **Quién**: administrador; entrenador personal, limitado a los clientes que tenga asignados.
- **Query**: `search`, `estado`, `cuota`, `entrenador` (id del entrenador personal), `page`.
- **Respuesta `200`**: listado paginado de clientes.

### `POST /clientes` — Crear cliente
- **Qué hace**: da de alta un cliente. **Quién**: administrador.
- **Cuerpo**: `{ nombre, email, telefono?, objetivo?, peso?, peso_objetivo?, frecuencia? }`. **Respuesta `201`**: cliente creado.

### `GET /clientes/{id}` — Ficha del cliente
- **Qué hace**: ficha con datos, **historial** (actividad, accesos, reservas, entrenamientos, cuotas) y **progreso**. El detalle de progreso y de entrenamientos se consulta en `GET /clientes/{id}/progreso` y `GET /clientes/{id}/entrenamientos`.
- **Quién**: administrador o entrenador personal asignado al cliente. El cliente no puede consultar esta ficha administrativa mediante esta ruta. **Respuesta `200`**: ficha del cliente.

### `GET /clientes/{id}/progreso` — Progreso de un cliente
- **Qué hace**: métricas de progreso de un cliente (evolución de cargas, volumen, frecuencia y peso corporal, RF-45..48).
- **Quién**: administrador o entrenador personal asignado al cliente. **Query**: `ejercicio`, `desde`, `hasta`. **Respuesta `200`**: métricas del periodo.

### `GET /clientes/{id}/entrenamientos` — Historial de un cliente
- **Qué hace**: entrenamientos registrados de un cliente (RF-43).
- **Quién**: administrador o entrenador personal asignado al cliente. **Respuesta `200`**: listado de entrenamientos.

### `PATCH /clientes/{id}` — Editar cliente
- **Qué hace**: actualiza los datos administrativos del cliente. **Quién**: administrador. **Cuerpo**: objeto JSON con los campos editables. **Respuesta `200`**: cliente actualizado. `404` si no existe.

### `DELETE /clientes/{id}` — Desactivar cliente
- **Qué hace**: desactiva (no borra) al cliente, conservando su histórico. **Quién**: administrador. **Respuesta**: `204`.

### `GET /clientes/export` — Exportar clientes
- **Qué hace**: exporta el listado de clientes en **CSV o JSON** (RNF-27). **Quién**: administrador. **Query**: `formato` (`csv|json`). **Respuesta `200`**: fichero o JSON.

### `PATCH /clientes/{id}/pulsera` — Asignar pulsera NFC
- **Qué hace**: asigna el **identificador de pulsera** (único). **Quién**: administrador.
- **Cuerpo**: `{ "identificador_pulsera" }`. **Respuesta `200`**: cliente actualizado. `409` si la pulsera ya está asignada.

### `PATCH /clientes/{id}/entrenador` — Gestionar entrenador personal
- **Qué hace**: asigna, cambia o quita el **entrenador personal** del cliente (RF-89).
- **Quién**: administrador. **Cuerpo**: `{ "entrenador_id": <id|null> }`. **Respuesta `200`**: relación actualizada.

### `POST /me/entrenador-personal` — Solicitar entrenador personal
- **Qué hace**: el cliente **solicita (contrata)** el servicio de entrenador personal (RF-89). Queda pendiente de que el administrador le asigne un entrenador.
- **Quién**: cliente (su propia cuenta). **Respuesta `201`**: solicitud registrada. `409` si ya tiene una solicitud activa o un entrenador asignado.

### `DELETE /me/entrenador-personal` — Darse de baja del entrenador personal
- **Qué hace**: el cliente **cancela** el servicio de entrenador personal (RF-89). **Quién**: cliente (el suyo). **Respuesta**: `204`.

---

## Empleados

### `GET /empleados` — Listar empleados
- **Qué hace**: listado paginado de empleados con **rol, horario, estado y clases asignadas**.
- **Quién**: administrador.
- **Query**: `search` y `page`, si se implementan búsqueda y paginación.
- **Respuesta `200`**: listado paginado.

### `POST /empleados` — Crear empleado
- **Qué hace**: alta de personal (incluye **roles** de empleado y clases). **Quién**: administrador.
- **Cuerpo**: `{ nombre, email, roles[], horario?, clases[]? }`. La contraseña o el mecanismo de invitación/alta de credenciales debe definirse según el flujo de autenticación elegido. **Respuesta `201`**: empleado creado. `422` si los datos no son válidos.

### `GET /empleados/{id}` — Ficha del empleado
- **Qué hace**: detalle del empleado. **Quién**: administrador. **Respuesta `200`**: empleado.

### `PATCH /empleados/{id}` — Editar empleado
- **Qué hace**: actualiza datos, rol, horario o clases. **Quién**: administrador. **Respuesta `200`**: empleado.

### `DELETE /empleados/{id}` — Desactivar empleado
- **Qué hace**: desactiva al empleado conservando su histórico. **Quién**: administrador. **Respuesta**: `204`.

---

## Agenda del personal docente

### `GET /agenda` — Mi agenda semanal
- **Qué hace**: devuelve la **agenda semanal** del personal docente autenticado (turno asignado por el administrador y sus actividades planificadas, RF-91).
- **Quién**: personal docente (sus propias entradas). **Query**: `desde`, `hasta`. **Respuesta `200`**: listado de actividades.

### `GET /empleados/{id}/agenda` — Agenda de un empleado
- **Qué hace**: agenda semanal de un empleado concreto. **Quién**: administrador. **Query**: `desde`, `hasta`. **Respuesta `200`**: listado de actividades.

### `POST /agenda` — Crear entrada de agenda
- **Qué hace**: crea una **actividad** en la agenda (RF-91). El personal docente crea sus propias actividades; el administrador puede crear entradas (incluido el **turno**) para cualquier empleado.
- **Quién**: personal docente (solo para sí mismo) o administrador.
- **Cuerpo**: `{ fecha, hora_inicio, hora_fin, titulo, sala_id?, empleado_id? }` (`empleado_id` solo lo usa el administrador; por defecto, el propio empleado). **Respuesta `201`**: entrada creada. `422` si los datos no son válidos.

### `PATCH /agenda/{id}` — Editar entrada de agenda
- **Qué hace**: modifica una entrada de la agenda. **Quién**: el personal docente propietario de la actividad o el administrador. **Respuesta `200`**: entrada actualizada. `403` si no es suya.

### `DELETE /agenda/{id}` — Eliminar entrada de agenda
- **Qué hace**: elimina una entrada de la agenda. **Quién**: el personal docente propietario de la actividad o el administrador. **Respuesta**: `204`. `403` si no es suya.

---

## Clases

### `GET /clases` — Calendario de clases
- **Qué hace**: devuelve las clases de un **rango de fechas**, incluyendo ocupación y capacidad.
- **Quién**: usuario autenticado con rol de cliente, entrenador o administrador. Si se desea permitir consulta pública, deberá definirse expresamente qué datos se exponen sin iniciar sesión.
- **Query**: `desde`, `hasta`, `tipo`, `page` (si se pagina el resultado).
- **Respuesta `200`**: listado de clases.

### `POST /clases` — Crear clase
- **Qué hace**: crea una clase con fecha, hora, duración, capacidad, sala, monitor y materiales.
- **Quién**: administrador.
- **Cuerpo**: objeto JSON con los campos de la clase; como mínimo, los campos obligatorios definidos en el modelo de dominio (tipo/nombre, fecha y hora, duración y capacidad).
- **Respuesta `201`**: clase creada. `422` si los datos no son válidos.

### `GET /clases/{id}` — Detalle de la clase
- **Qué hace**: devuelve el detalle de una clase, incluidos los datos de ocupación y materiales. La lista de asistentes solo se incluirá para roles autorizados.
- **Quién**: usuario autenticado.
- **Respuesta `200`**: detalle de la clase. `404` si no existe.

### `GET /clases/{id}/asistentes` — Asistentes de la clase
- **Qué hace**: devuelve la lista de clientes con reserva en la clase (nombre y estado de la reserva).
- **Quién**: administrador; el **monitor/instructor** de esa clase (únicamente sus propias clases).
- **Respuesta `200`**: listado de asistentes. `403` si el monitor no imparte esa clase; `404` si la clase no existe.

### `PATCH /clases/{id}` — Editar clase / materiales
- **Qué hace**: actualiza datos de la clase o sus **materiales** (equipamiento).
- **Quién**: administrador; el **monitor/instructor** puede modificar únicamente los materiales de las clases que tiene asignadas (RF-90).
- **Cuerpo**: objeto JSON con los campos que el rol puede modificar.
- **Respuesta `200`**: clase actualizada. `403` si no tiene permisos y `422` si los datos no son válidos.

### `DELETE /clases/{id}` — Eliminar clase
- **Qué hace**: elimina la clase del calendario. Si la clase ya tiene reservas o actividad asociada, debe definirse si se bloquea la eliminación o se utiliza un estado de cancelación para conservar el histórico.
- **Quién**: administrador. **Respuesta**: `204`. `404` si no existe.

---

## Reservas

### `GET /reservas` — Mis reservas
- **Qué hace**: devuelve las **próximas reservas y el historial**.
- **Quién**: cliente (solo las suyas), administrador (todas). El personal docente no accede al listado global de reservas; el monitor/instructor consulta los asistentes de **sus propias clases** en `GET /clases/{id}/asistentes`.
- **Query**: filtros de estado/fecha y `page`, si se implementan.
- **Respuesta `200`**: listado de reservas.

### `POST /reservas` — Reservar una clase
- **Qué hace**: reserva una plaza aplicando **control de aforo** (no permite clase completa ni duplicados).
- **Quién**: cliente, con el **email verificado** (RF-97). **Cuerpo**: `{ "clase_id" }`. **Respuesta `201`**: reserva. `403` si el email no está verificado; `409` clase completa o reserva duplicada.

### `DELETE /reservas/{id}` — Cancelar reserva
- **Qué hace**: cancela la reserva propia y libera la plaza. **Quién**: cliente (la suya). **Respuesta**: `204`.

---

## Ejercicios

### `GET /ejercicios` — Biblioteca de ejercicios
- **Qué hace**: devuelve el catálogo (importado de **wger**) con **búsqueda** y **filtro por grupo muscular**.
- **Quién**: entrenador personal, cliente. **Query**: `search`, `grupo_muscular`, `page`.
- **Respuesta `200`**: listado paginado de ejercicios (nombre, grupo, descripción, instrucciones, equipamiento, imagen).

### `GET /ejercicios/{id}` — Detalle del ejercicio
- **Qué hace**: detalle completo del ejercicio. **Quién**: entrenador personal, cliente.
- **Respuesta `200`**: ejercicio. `404` si no existe.

---

## Rutinas

### `GET /rutinas` — Listar rutinas
- **Qué hace**: devuelve las rutinas de la biblioteca del entrenador personal o las rutinas propias/asignadas del cliente, según el rol y la relación con el recurso.
- **Quién**: entrenador personal y cliente, con acceso limitado a las rutinas que les correspondan.
- **Respuesta `200`**: listado de rutinas.

### `POST /rutinas` — Crear rutina
- **Qué hace**: crea una rutina con nombre, objetivo, días por semana y ejercicios con **series individuales**.
- **Quién**: entrenador personal; cliente, únicamente para crear una rutina propia (RF-94).
- **Cuerpo**: objeto JSON con los datos de la rutina y sus ejercicios/series.
- **Respuesta `201`**: rutina creada. `422` si los datos no son válidos.

### `GET /rutinas/{id}` — Detalle de rutina
- **Qué hace**: rutina con sus ejercicios y **series** (peso, reps, descanso, RIR/RPE). **Quién**: entrenador personal, cliente. **Respuesta `200`**: rutina.

### `PATCH /rutinas/{id}` — Editar rutina
- **Qué hace**: modifica los datos, ejercicios y series de una rutina.
- **Quién**: entrenador personal sobre las rutinas que gestiona; cliente únicamente sobre sus propias rutinas. Una rutina asignada por un entrenador no debe poder modificarse por el cliente salvo que esa capacidad se defina expresamente.
- **Cuerpo**: objeto JSON con los campos que se desean modificar.
- **Respuesta `200`**: rutina actualizada. `403` si no tiene permisos.

### `DELETE /rutinas/{id}` — Eliminar rutina
- **Qué hace**: elimina una rutina propia o gestionada por el entrenador. La confirmación previa es responsabilidad de la interfaz de usuario, no de este endpoint.
- **Quién**: entrenador personal sobre las rutinas que gestiona; cliente sobre sus propias rutinas.
- **Respuesta**: `204`. `403` si no tiene permisos. Si existen asignaciones o entrenamientos históricos, debe definirse si se bloquea la eliminación o se conserva el registro mediante baja lógica.

### `POST /rutinas/{id}/asignaciones` — Planificar rutina por días
- **Qué hace**: asigna una rutina a un **cliente** para una **fecha** concreta (calendario semanal, RF-35).
- **Quién**: entrenador personal asignado o autorizado para gestionar al cliente.
- **Cuerpo**: `{ "cliente_id": 123, "fecha": "AAAA-MM-DD" }`.
- **Respuesta `201`**: asignación creada. `404` si la rutina o el cliente no existen; `422` si la fecha no es válida.

---

## Entrenamientos

### `GET /entrenamientos` — Historial de entrenamientos
- **Qué hace**: devuelve el historial de entrenamientos (fecha, volumen, duración y series).
- **Quién**: cliente (solo los suyos). El entrenador personal y el administrador consultan los de un cliente en `GET /clientes/{id}/entrenamientos`.
- **Respuesta `200`**: listado de entrenamientos.

### `POST /entrenamientos` — Iniciar entrenamiento
- **Qué hace**: inicia una sesión a partir de una **rutina**. **Quién**: cliente.
- **Cuerpo**: `{ "rutina_id" }`. **Respuesta `201`**: entrenamiento en curso.

### `GET /entrenamientos/{id}` — Detalle del entrenamiento
- **Qué hace**: sesión con sus **series**, volumen total y duración. **Quién**: cliente propietario. **Respuesta `200`**: entrenamiento.

### `PATCH /entrenamientos/{id}` — Finalizar entrenamiento
- **Qué hace**: cambia el estado del entrenamiento a **finalizado** y calcula el resumen (volumen, número de series y duración).
- **Quién**: cliente propietario.
- **Cuerpo**: no requiere datos adicionales si solo se finaliza la sesión; si se admiten otros campos, deberán enumerarse expresamente.
- **Respuesta `200`**: entrenamiento finalizado. `404` si no existe o no pertenece al cliente.

### `POST /entrenamientos/{id}/series` — Registrar serie
- **Qué hace**: añade una serie (peso, reps, descanso, RIR/RPE, notas). **Quién**: cliente propietario.
- **Cuerpo**: `{ ejercicio_id, numero_serie, peso, repeticiones, descanso, rir?, rpe?, notas? }`. **Respuesta `201`**: serie.

---

## Progreso

### `GET /progreso` — Métricas de progreso
- **Qué hace**: devuelve la evolución de cargas por ejercicio, el volumen, la frecuencia y el peso corporal (RF-45..47).
- **Quién**: cliente (el suyo). El entrenador personal y el administrador usan `GET /clientes/{id}/progreso`.
- **Query**: `ejercicio`, `desde`, `hasta`. **Respuesta `200`**: métricas y series del periodo.

### `GET /progreso/comparar` — Comparar periodos
- **Qué hace**: compara las métricas entre dos periodos (RF-48).
- **Quién**: cliente (el suyo). **Query**: `desde1`, `hasta1`, `desde2`, `hasta2`. **Respuesta `200`**: comparativa de ambos periodos.

---

## Accesos y aforo

### `GET /accesos` — Historial de accesos
- **Qué hace**: devuelve entradas/salidas (del cliente o del gimnasio, según rol).
- **Quién**: cliente (los suyos), administrador (todos). **Query**: `desde`, `hasta`. **Respuesta `200`**: array de accesos.

### `GET /accesos/export` — Exportar accesos
- **Qué hace**: exporta el historial de accesos en **CSV o JSON** (RNF-27). **Quién**: administrador. **Query**: `desde`, `hasta`, `formato` (`csv|json`). **Respuesta `200`**: fichero o JSON.

### `GET /aforo` — Aforo en tiempo real
- **Qué hace**: personas dentro, capacidad y % de ocupación (diferencia entradas − salidas).
- **Quién**: autenticado. **Respuesta `200`**: `{ dentro, capacidad, ocupacion }`.

---

## Dispositivos (tornos / NFC)

Las rutas de este grupo van en una **superficie separada** de las de usuario: se autentican con un **token de acceso personal de Sanctum** asociado a un modelo `Dispositivo` (no a un usuario), con la *ability* mínima `acceso:registrar`, caducidad configurada y posibilidad de revocación y rotación. Un token de dispositivo **no** puede usar los endpoints de usuario y una sesión de usuario **no** puede usar los de dispositivo (la separación se refuerza con middleware propio). La **gestión** de dispositivos (alta, listado y revocación) sí se realiza desde la sesión del administrador.

### `POST /dispositivos/eventos` — Evento del torno (NFC)
- **Qué hace**: registra una **entrada o salida** al leer una pulsera en el torno. Lo invoca el controlador del torno, no el cliente web.
- **Quién**: servicio de tornos autenticado con **token de `Dispositivo`** (*ability* `acceso:registrar`).
- **Cuerpo**: `{ "identificador_pulsera": "...", "tipo": "entrada|salida", "timestamp": "ISO-8601 opcional", "evento_id": "identificador único recomendado" }`.
- **Respuesta `202`**: evento aceptado para registro. `404` si la pulsera no está reconocida; `401` si el token no es válido; `403` si falta la *ability*. Debe ser **idempotente** (un mismo `evento_id` no se aplica dos veces) y contemplar lecturas fuera de secuencia para evitar errores de aforo.

### `GET /dispositivos` — Listar dispositivos
- **Qué hace**: listado de tornos/lectores registrados con su estado y última conexión.
- **Quién**: administrador (sesión de usuario). **Respuesta `200`**: listado de dispositivos.

### `POST /dispositivos` — Registrar dispositivo
- **Qué hace**: da de alta un torno y **emite su token** de Sanctum (con *ability* `acceso:registrar`). El token **solo se muestra una vez**; se guarda hasheado.
- **Quién**: administrador. **Cuerpo**: `{ "nombre", "ubicacion" }`. **Respuesta `201`**: `{ dispositivo, token }`.

### `DELETE /dispositivos/{id}` — Revocar dispositivo
- **Qué hace**: desactiva el dispositivo y **revoca su token** (para sustituir o retirar un torno).
- **Quién**: administrador. **Respuesta**: `204`.

---

## Cuotas

### `GET /cuotas` — Consultar cuotas
- **Qué hace**: devuelve las cuotas con su estado, periodo y fecha de pago.
- **Quién**: cliente (solo las suyas), administrador (todas).
- **Respuesta `200`**: listado de cuotas.

### `GET /cuotas/export` — Exportar cuotas
- **Qué hace**: exporta las cuotas en **CSV o JSON** (RNF-27). **Quién**: administrador. **Query**: `formato` (`csv|json`). **Respuesta `200`**: fichero o JSON.

### `PATCH /cuotas/{id}` — Marcar cuota como pagada
- **Qué hace**: marca manualmente una cuota como **pagada** (RF-63), registrando la fecha de pago. Pensado para pagos realizados por otro medio.
- **Quién**: administrador. **Cuerpo**: `{ "estado": "pagada" }`. **Respuesta `200`**: cuota actualizada.

### `POST /cuotas/{id}/pagar` — Pagar cuota
- **Qué hace**: crea el cobro de la cuota. Con `metodo = "tarjeta"` crea una sesión de pago de **Stripe** y devuelve la URL de Checkout; con `metodo = "domiciliacion"` inicia el cobro por la cuenta bancaria configurada. El estado de la cuota se actualiza tras verificar el webhook, no únicamente por la redirección del navegador.
- **Quién**: cliente propietario de la cuota, **con el email verificado** (RF-97), y con permiso para pagarla.
- **Cuerpo**: `{ "metodo": "tarjeta|domiciliacion" }`.
- **Respuesta `200`**: `{ "checkout_url": "https://..." }` cuando el pago es con tarjeta; `202` cuando el cobro por domiciliación queda en proceso. `404` si la cuota no existe; `409` si ya está pagada o no admite otro pago. La generación de las cuotas mensuales (y el cobro automático por domiciliación en la fecha de vencimiento) debe resolverse mediante un proceso interno o una tarea programada; no queda expuesta por esta ruta.

### `PUT /me/cuenta-bancaria` — Configurar cuenta bancaria (domiciliación)
- **Qué hace**: registra o actualiza la cuenta bancaria del cliente para la **domiciliación**. El IBAN se guarda **cifrado** en la base de datos y nunca se devuelve completo (se enmascara).
- **Quién**: cliente (su propia cuenta).
- **Cuerpo**: `{ "titular", "iban", "cobro_automatico" }`. **Respuesta `200`**: cuenta actualizada (IBAN enmascarado). `422` si el IBAN no es válido.

### `DELETE /me/cuenta-bancaria` — Eliminar cuenta bancaria
- **Qué hace**: elimina la cuenta bancaria del cliente y desactiva la domiciliación.
- **Quién**: cliente (la suya). **Respuesta**: `204`.

---

## Notificaciones

### `GET /notificaciones` — Notificaciones in-app
- **Qué hace**: devuelve las notificaciones de la **campana** (título, detalle, tipo, estado leído).
- **Quién**: autenticado. **Respuesta `200`**: array de notificaciones.

### `PATCH /notificaciones/{id}/leer` — Marcar como leída
- **Qué hace**: marca una notificación como leída. **Quién**: propietario. **Respuesta `200`**: notificación.

### `POST /me/dispositivos-push` — Registrar dispositivo push
- **Qué hace**: registra el **token FCM** del navegador/app del usuario para recibir notificaciones push (RF-98).
- **Quién**: autenticado. **Cuerpo**: `{ "token", "plataforma" }`. **Respuesta `201`**: registro creado.

### `DELETE /me/dispositivos-push/{id}` — Eliminar dispositivo push
- **Qué hace**: elimina un registro de dispositivo push (por ejemplo, al cerrar sesión o revocar el permiso). **Quién**: propietario. **Respuesta**: `204`.

---

## Instalaciones

### `GET /salas` — Listar salas
- **Qué hace**: devuelve las **salas** del gimnasio con su capacidad y estado (RF-64). **Quién**: administrador. **Respuesta `200`**: listado de salas.

### `POST /salas` — Crear sala
- **Qué hace**: crea una sala. **Quién**: administrador. **Cuerpo**: `{ nombre, capacidad, estado? }`. **Respuesta `201`**: sala creada.

### `PATCH /salas/{id}` — Editar sala
- **Qué hace**: actualiza una sala. **Quién**: administrador. **Respuesta `200`**: sala actualizada.

### `DELETE /salas/{id}` — Eliminar sala
- **Qué hace**: elimina una sala sin equipos ni clases asociadas. **Quién**: administrador. **Respuesta**: `204`. `409` si tiene dependencias.

### `GET /equipos` — Listar equipos
- **Qué hace**: devuelve los **equipos** del gimnasio, filtrables por sala y estado (RF-65, RF-66). **Quién**: administrador.
- **Query**: `sala`, `estado`, `page`. **Respuesta `200`**: listado paginado.

### `POST /equipos` — Crear equipo
- **Qué hace**: registra un equipo asociado a una sala. **Quién**: administrador. **Cuerpo**: `{ nombre, tipo, sala_id, estado? }`. **Respuesta `201`**: equipo creado.

### `PATCH /equipos/{id}` — Editar equipo / estado
- **Qué hace**: actualiza un equipo o su **estado** (`disponible`, `mantenimiento`, `fuera de servicio`). **Quién**: administrador. **Respuesta `200`**: equipo actualizado.

### `DELETE /equipos/{id}` — Eliminar equipo
- **Qué hace**: elimina un equipo. **Quién**: administrador. **Respuesta**: `204`.

### `GET /incidencias` — Listar incidencias y mantenimientos
- **Qué hace**: devuelve las **incidencias** y mantenimientos registrados (RF-67). **Quién**: administrador. **Query**: `estado`, `equipo`, `page`. **Respuesta `200`**: listado paginado.

### `POST /incidencias` — Registrar incidencia / mantenimiento
- **Qué hace**: registra una incidencia o un mantenimiento sobre un equipo. **Quién**: administrador.
- **Cuerpo**: `{ titulo, descripcion, ubicacion, tipo, equipo_id? }`. **Respuesta `201`**: incidencia creada.

### `PATCH /incidencias/{id}` — Editar incidencia
- **Qué hace**: actualiza el estado o los datos de una incidencia (`abierta`, `en proceso`, `resuelta`). **Quién**: administrador. **Respuesta `200`**: incidencia actualizada.

### `DELETE /incidencias/{id}` — Eliminar incidencia
- **Qué hace**: elimina una incidencia. **Quién**: administrador. **Respuesta**: `204`.

---

## Configuración

> La **integración** de tornos (URL y token del sistema) se configura aquí; el **alta, listado y revocación de los dispositivos** (tornos/NFC) se realiza en la sección *Dispositivos (tornos / NFC)*.

### `GET /configuracion` — Configuración del gimnasio
- **Qué hace**: devuelve la configuración del gimnasio, como datos del centro, horarios, cuota y preferencias de notificación. No debe exponer secretos ni credenciales de integraciones.
- **Quién**: administrador. Si se necesitan datos públicos para usuarios no autenticados, es preferible exponer solo esos campos mediante una respuesta pública específica.
- **Respuesta `200`**: configuración autorizada.

### `PATCH /configuracion` — Editar configuración
- **Qué hace**: actualiza los campos configurables del gimnasio, como datos del centro, cuota, horarios y preferencias de notificación. Los roles y permisos deben modificarse únicamente si forman parte explícita de esta configuración; las credenciales secretas no se devuelven ni se gestionan como datos ordinarios.
- **Quién**: administrador.
- **Cuerpo**: objeto JSON con los campos configurables que se desean modificar.
- **Respuesta `200`**: configuración actualizada. `422` si los datos no son válidos.

---

## Analítica

### `GET /analitica/{modulo}` — Métricas de analítica
- **Qué hace**: devuelve métricas del módulo indicado (usuarios, ocupación, horas punta, ingresos, retención…).
- **Quién**: administrador. **Path**: `modulo` (p. ej. `usuarios`, `ocupacion`, `ingresos`). **Query**: `desde`, `hasta`. **Respuesta `200`**: objeto de métricas.

### `GET /analitica/{modulo}/export` — Exportar informe
- **Qué hace**: exporta las métricas del módulo en **CSV o JSON** (RF-72).
- **Quién**: administrador. **Query**: `desde`, `hasta`, `formato` (`csv|json`). **Respuesta `200`**: fichero o JSON con los datos del periodo.

---

## Inteligencia artificial

### `GET /ia/{ambito}` — Análisis heurístico
- **Qué hace**: genera recomendaciones/insights según el ámbito (**reglas/heurísticas**, no LLM).
- **Quién**: `ambito = cliente` (el propio cliente), `entrenador` (personal docente), `admin` (administrador).
- **Respuesta `200`**: objeto con hallazgos y recomendaciones.

---

## Chatbot

### `POST /chatbot` — Asistente virtual
- **Qué hace**: responde a una duda sobre el gimnasio (horarios, clases, reservas, cuota, acceso e instalaciones) mediante **reglas** sobre la información real del centro.
- **Quién**: cliente. **Cuerpo**: `{ "mensaje" }`. **Respuesta `200`**: `{ "respuesta" }`.

---

## Webhooks

### `POST /webhooks/stripe` — Confirmación de pago
- **Qué hace**: recibe eventos de **Stripe** (pago con tarjeta y domiciliación/SEPA) y actualiza el estado de la cuota tras validar la firma del webhook. El procesamiento debe ser idempotente para que un mismo evento no se aplique dos veces.
- **Quién**: Stripe; no utiliza la autenticación ordinaria de usuario, sino la verificación de la firma del proveedor.
- **Respuesta**: `200` cuando el evento se procesa correctamente o `204` si se decide no devolver cuerpo. Los eventos no válidos deben rechazarse.

