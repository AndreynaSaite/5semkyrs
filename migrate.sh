#!/bin/bash

# Загружаем переменные из .env
set -a
source .env
set +a

# SQL-команда
SQL="
CREATE TABLE IF NOT EXISTS users_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(254) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL
);
"

echo "🔄 Контейнер: $PGS_CONTAINER"
echo "🔄 Подключение: БД=$PGS_DB, USER=$PGS_USER"

# Выполнение SQL внутри контейнера
docker exec -i "$PGS_CONTAINER" psql \
    -U "$PGS_USER" \
    -d "$PGS_DB" \
    -c "$SQL"

echo "✅ Таблица users_user успешно создана!"
