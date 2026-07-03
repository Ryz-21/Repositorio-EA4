#!/bin/sh

if [ ! -f .env ]; then
    cp .env.example .env
    touch database/database.sqlite
    php artisan key:generate
fi

php artisan migrate --seed --force

apache2-foreground
