FROM python:3.12
RUN pip install poetry==1.7.1

WORKDIR /t_service
COPY . /t_service/

RUN poetry install

EXPOSE 8086

CMD poetry run python -m t_service
