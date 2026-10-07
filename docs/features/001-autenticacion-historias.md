# Feature 001 — Autenticación y autorización

## Descripción

Esta feature comprende las funcionalidades relacionadas con el acceso de los usuarios al sistema STADIO, la gestión de su sesión, el control de acceso según su rol y la gestión de sus credenciales y datos de perfil.

Los roles contemplados son:

* Cliente
* Entrenador
* Administrador

---

## HU-01 — Iniciar sesión

**Prioridad:** Must
**Requisitos relacionados:** RF-01

### Historia de usuario

> Como usuario de STADIO,
> quiero iniciar sesión mediante mi correo electrónico y contraseña,
> para acceder de forma segura a mi cuenta y a las funcionalidades que me corresponden.

### Criterios de aceptación

* El usuario puede introducir su correo electrónico y contraseña.
* El sistema valida las credenciales introducidas.
* Si las credenciales son correctas, el usuario inicia sesión correctamente.
* Si las credenciales no son correctas, el sistema informa al usuario de que el acceso no ha sido posible.
* Un usuario no autenticado no puede acceder a las funcionalidades que requieren iniciar sesión.

---

## HU-02 — Cerrar sesión

**Prioridad:** Must
**Requisitos relacionados:** RF-02

### Historia de usuario

> Como usuario autenticado,
> quiero cerrar mi sesión,
> para impedir que otras personas puedan acceder a mi cuenta desde el dispositivo que estoy utilizando.

### Criterios de aceptación

* El usuario autenticado puede cerrar su sesión.
* Al cerrar sesión, la sesión del usuario deja de estar activa.
* El usuario deja de tener acceso a las funcionalidades que requieren autenticación.
* Para volver a acceder a su cuenta debe iniciar sesión nuevamente.

---

## HU-03 — Acceder al espacio correspondiente a mi rol

**Prioridad:** Must
**Requisitos relacionados:** RF-03

### Historia de usuario

> Como usuario de STADIO,
> quiero ser dirigido al espacio correspondiente a mi rol después de iniciar sesión,
> para acceder directamente a las funcionalidades destinadas a mi tipo de usuario.

### Criterios de aceptación

* Después de iniciar sesión correctamente, el sistema identifica el rol del usuario.
* Un cliente es dirigido al espacio correspondiente al cliente.
* Un entrenador es dirigido al espacio correspondiente al entrenador.
* Un administrador es dirigido al espacio correspondiente al administrador.
* El usuario no es dirigido a un espacio correspondiente a otro rol.

---

## HU-04 — Restringir el acceso según el rol

**Prioridad:** Must
**Requisitos relacionados:** RF-05

### Historia de usuario

> Como usuario de STADIO,
> quiero que el sistema limite las funcionalidades y rutas disponibles según mi rol,
> para que solamente pueda acceder a las operaciones que tengo autorizadas.

### Criterios de aceptación

* Las rutas disponibles dependen del rol del usuario autenticado.
* Las opciones del menú se muestran de acuerdo con los permisos del usuario.
* Un cliente no puede acceder a rutas destinadas al entrenador.
* Un cliente no puede acceder a rutas destinadas al administrador.
* Un entrenador no puede acceder a rutas destinadas exclusivamente al administrador.
* El sistema impide el acceso aunque el usuario intente acceder directamente a una ruta no autorizada.

---

## HU-05 — Gestionar el alta de usuarios

**Prioridad:** Must
**Requisitos relacionados:** RF-04

### Historia de usuario

> Como administrador,
> quiero dar de alta clientes y empleados desde el sistema,
> para gestionar los usuarios que forman parte del gimnasio sin permitir el auto-registro.

### Criterios de aceptación

* El administrador puede dar de alta nuevos clientes.
* El administrador puede dar de alta nuevos empleados.
* El sistema permite indicar el tipo de usuario correspondiente.
* Un usuario que no sea administrador no puede dar de alta clientes o empleados.
* El sistema no ofrece un mecanismo de auto-registro para que cualquier persona cree una cuenta por su cuenta.

---

## HU-06 — Recuperar la contraseña

**Prioridad:** Should
**Requisitos relacionados:** RF-06

### Historia de usuario

> Como usuario de STADIO que ha olvidado su contraseña,
> quiero solicitar su recuperación mediante mi correo electrónico,
> para poder volver a acceder a mi cuenta.

### Criterios de aceptación

* El usuario puede solicitar la recuperación de su contraseña indicando su correo electrónico.
* El sistema permite iniciar el proceso de recuperación mediante correo electrónico.
* El usuario puede establecer una nueva contraseña siguiendo el proceso de recuperación.
* Una vez completado correctamente el proceso, el usuario puede utilizar la nueva contraseña para iniciar sesión.
* El sistema no permite recuperar la contraseña mostrando la contraseña actual del usuario.

---

## HU-07 — Gestionar mis credenciales y perfil

**Prioridad:** Should
**Requisitos relacionados:** RF-07, RF-08

### Historia de usuario

> Como usuario autenticado,
> quiero cambiar mi contraseña y editar mis datos de perfil,
> para mantener actualizada y segura mi información personal.

### Criterios de aceptación

* El usuario puede cambiar su contraseña desde su perfil.
* El sistema solicita la información necesaria para realizar el cambio de contraseña.
* El usuario puede editar su nombre.
* El usuario puede editar su teléfono.
* El usuario puede editar su avatar.
* El usuario puede editar sus datos bancarios.
* Los cambios realizados correctamente quedan asociados a su perfil.
* Los datos modificados se muestran actualizados posteriormente.

---

## HU-08 — Expirar la sesión por inactividad

**Prioridad:** Should
**Requisitos relacionados:** RF-09

### Historia de usuario

> Como usuario autenticado,
> quiero que mi sesión expire después de un periodo de inactividad,
> para proteger mi cuenta cuando dejo de utilizar STADIO.

### Criterios de aceptación

* El sistema controla el periodo de inactividad de las sesiones autenticadas.
* Cuando se supera el periodo establecido de inactividad, la sesión deja de estar activa.
* El usuario debe volver a autenticarse para acceder a las funcionalidades protegidas.
* La expiración de la sesión no elimina los datos de la cuenta del usuario.

---

## Relación entre historias y requisitos

| Historia                                            | Requisitos   | Prioridad |
| --------------------------------------------------- | ------------ | --------- |
| HU-01 — Iniciar sesión                              | RF-01        | Must      |
| HU-02 — Cerrar sesión                               | RF-02        | Must      |
| HU-03 — Acceder al espacio correspondiente a mi rol | RF-03        | Must      |
| HU-04 — Restringir el acceso según el rol           | RF-05        | Must      |
| HU-05 — Gestionar el alta de usuarios               | RF-04        | Must      |
| HU-06 — Recuperar la contraseña                     | RF-06        | Should    |
| HU-07 — Gestionar mis credenciales y perfil         | RF-07, RF-08 | Should    |
| HU-08 — Expirar la sesión por inactividad           | RF-09        | Should    |
