FROM python:3.13.3-alpine

WORKDIR /app

COPY ./telegram-service/requirements.txt ./telegram-service/requirements.txt

WORKDIR /app/telegram-service
RUN pip3 install -r requirements.txt

COPY ./telegram-service .
COPY ./.env .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "./src/main.py"]