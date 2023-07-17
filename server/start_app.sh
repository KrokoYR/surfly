#!/bin/sh

set -e

echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

python manage.py migrate

exec bash -c "gunicorn surfly.asgi:application -k uvicorn.workers.UvicornWorker -w 3 --bind 0.0.0.0:8000"