# TED
## запуск приложения 
docker-compose up -d
## Настройки приложения
docker-compose exec web python manage.py makemigrations

docker-compose exec web python manage.py migrate

docker-compose exec -it web bash

python manage.py createsuperuser

python manage.py collectstatic --noinput




8090 get: /events