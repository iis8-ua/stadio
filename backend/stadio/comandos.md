# Cheatsheet: Laravel + Docker — comandos del día a día

Todos los comandos se ejecutan desde la raíz del proyecto (`stadio/`), donde está tu `docker-compose.yml`. La idea es siempre anteponer `docker compose exec app` a cualquier comando `php artisan` o `composer`, ya que el código corre dentro del contenedor, no en tu máquina.

---

## Modelos

**Crear un modelo simple:**
```bash
docker compose exec app php artisan make:model Reserva
```

**Crear modelo + migración a la vez (lo más habitual):**
```bash
docker compose exec app php artisan make:model Reserva -m
```

**Crear modelo + migración + controlador + factory + seeder, todo junto:**
```bash
docker compose exec app php artisan make:model Reserva -mcrfs
```
(`-m` migración, `-c` controlador, `-r` resource controller, `-f` factory, `-s` seeder)

Después de crear el modelo, edita `app/Models/Reserva.php` para añadir:
- `$fillable` con los campos que se pueden asignar masivamente
- Relaciones (`belongsTo`, `hasMany`, etc.)

---

## Migraciones

**Crear una migración suelta (sin modelo, ej. para modificar una tabla existente):**
```bash
docker compose exec app php artisan make:migration add_estado_pago_to_users_table --table=users
```

**Ejecutar migraciones pendientes:**
```bash
docker compose exec app php artisan migrate
```

**Deshacer la última tanda de migraciones:**
```bash
docker compose exec app php artisan migrate:rollback
```

**Borrar todas las tablas y volver a migrar desde cero:**
```bash
docker compose exec app php artisan migrate:fresh
```

**Igual que arriba pero ejecutando también los seeders después:**
```bash
docker compose exec app php artisan migrate:fresh --seed
```

Recuerda: después de crear la migración, edita el archivo en `database/migrations/` para definir las columnas antes de ejecutar `migrate`.

---

## Seeders

**Crear un seeder:**
```bash
docker compose exec app php artisan make:seeder ReservaSeeder
```

**Ejecutar un seeder concreto:**
```bash
docker compose exec app php artisan db:seed --class=ReservaSeeder
```

**Ejecutar todos los seeders (los que estén registrados en `DatabaseSeeder.php`):**
```bash
docker compose exec app php artisan db:seed
```

Importante: para que un seeder se ejecute con `db:seed` a secas, tienes que añadirlo dentro de `database/seeders/DatabaseSeeder.php`:
```php
public function run(): void
{
    $this->call([
        ReservaSeeder::class,
    ]);
}
```

---

## Controladores

**Controlador vacío:**
```bash
docker compose exec app php artisan make:controller ReservaController
```

**Controlador tipo API (con los 5 métodos REST: index, store, show, update, destroy — sin create/edit, que son para vistas):**
```bash
docker compose exec app php artisan make:controller ReservaController --api
```

**Controlador API ya vinculado a un modelo (usa route model binding):**
```bash
docker compose exec app php artisan make:controller ReservaController --api --model=Reserva
```

---

## Rutas

Las rutas de API van en `routes/api.php`. Ejemplo típico para un CRUD completo:

```php
use App\Http\Controllers\ReservaController;

Route::apiResource('reservas', ReservaController::class);
```

Esto genera automáticamente:
| Verbo  | URI                    | Acción   |
|--------|------------------------|----------|
| GET    | /api/reservas          | index    |
| POST   | /api/reservas          | store    |
| GET    | /api/reservas/{id}     | show     |
| PUT    | /api/reservas/{id}     | update   |
| DELETE | /api/reservas/{id}     | destroy  |

**Ver todas las rutas registradas (muy útil para comprobar que no hay typos):**
```bash
docker compose exec app php artisan route:list
```

---

## Flujo típico completo (ejemplo con "Reserva")

```bash
# 1. Modelo + migración + controlador + seeder
docker compose exec app php artisan make:model Reserva -mcrfs

# 2. Edita database/migrations/xxxx_create_reservas_table.php (añade columnas)
# 3. Edita app/Models/Reserva.php (fillable, relaciones)
# 4. Edita app/Http/Controllers/ReservaController.php (lógica)
# 5. Edita database/seeders/ReservaSeeder.php (datos de prueba)
# 6. Añade en database/seeders/DatabaseSeeder.php: $this->call([ReservaSeeder::class]);
# 7. Añade la ruta en routes/api.php: Route::apiResource('reservas', ReservaController::class);

# 8. Migrar y sembrar
docker compose exec app php artisan migrate --seed

# 9. Comprobar que la ruta existe
docker compose exec app php artisan route:list --path=reservas
```

---

## Otros comandos útiles

```bash
# Entrar directamente a una shell dentro del contenedor (para no repetir "docker compose exec app" en cada comando)
docker compose exec app bash

# Una vez dentro, ya puedes usar los comandos artisan directamente:
php artisan make:model Clase -m
exit   # para salir de la shell del contenedor

# Limpiar cachés de Laravel (útil si algo raro no se refleja)
docker compose exec app php artisan config:clear
docker compose exec app php artisan cache:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear

# Ver logs de Laravel en tiempo real
docker compose exec app tail -f storage/logs/laravel.log

# Tinker (consola interactiva para probar modelos/queries)
docker compose exec app php artisan tinker
```

---

## Consejo

Si te cansas de escribir `docker compose exec app php artisan ...` todo el rato, entra a la shell del contenedor una vez con `docker compose exec app bash` y desde ahí ejecuta los `php artisan ...` directamente sin el prefijo, hasta que salgas con `exit`.