#!/bin/bash
set -e

echo "== Levantando contenedores (build) =="
docker compose up -d --build

echo "== Ajustando permisos de storage y cache =="
docker compose exec app chmod -R 775 storage bootstrap/cache
docker compose exec app chown -R www-data:www-data storage bootstrap/cache

echo "== Esperando a que MySQL esté listo =="
until docker compose exec mysql mysqladmin ping -h "127.0.0.1" --silent; do
  echo "MySQL aún no está listo, esperando..."
  sleep 2
done

echo "== Generando APP_KEY (si hace falta) =="
docker compose exec app php artisan key:generate

echo "== Ejecutando migraciones =="
docker compose exec app php artisan migrate --force

echo "== Todo listo! =="
echo "App disponible en: http://localhost:8000"