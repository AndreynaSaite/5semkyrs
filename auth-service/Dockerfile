FROM python:3.12
RUN pip install poetry==1.7.1

WORKDIR /auth_service
COPY . /auth_service

RUN poetry install

EXPOSE 8085

CMD poetry run python -m auth_service
