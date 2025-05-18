FROM python:3.13.3-alpine

WORKDIR /app

COPY ./telegram-bot-runner/requirements.txt ./telegram-bot-runner/requirements.txt

WORKDIR /app/telegram-bot-runner
RUN pip3 install -r requirements.txt

COPY ./telegram-bot-runner .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "./main.py"]