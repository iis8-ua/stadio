#!/bin/bash
set -e

BACKEND_DIR="backend/stadio"
FRONTEND_DIR="frontend/stadio"

cleanup() {
  echo ""
  echo "== Parando frontend =="
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup INT TERM

echo "== Levantando backend (Docker) =="
(
  cd "$BACKEND_DIR"

  docker compose up -d --build

  echo "== Esperando a que MySQL esté listo =="
  until docker compose exec mysql mysqladmin ping -h "127.0.0.1" --silent; do
    echo "MySQL aún no está listo, esperando..."
    sleep 2
  done

  echo "== Ajustando permisos de storage y cache =="
  docker compose exec app chmod -R 775 storage bootstrap/cache
  docker compose exec app chown -R www-data:www-data storage bootstrap/cache

  echo "== Generando APP_KEY (si hace falta) =="
  docker compose exec app php artisan key:generate

  echo "== Ejecutando migraciones =="
  docker compose exec app php artisan migrate --force
)

echo "== Backend listo en http://localhost:8000 =="

echo "== Levantando frontend (npm) =="
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
  echo "== Instalando dependencias del frontend (primera vez) =="
  npm install
fi

npm run dev &
FRONTEND_PID=$!

echo "== Todo arriba =="
echo "Backend:  http://localhost:8000"
echo "Frontend: revisa la URL que muestre 'npm run dev' arriba (normalmente http://localhost:5173)"
echo ""
echo "Pulsa Ctrl+C para parar el frontend (el backend sigue en Docker; usa 'docker compose down' dentro de $BACKEND_DIR para pararlo)"

wait "$FRONTEND_PID"