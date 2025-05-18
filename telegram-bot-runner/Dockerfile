FROM python:3.13.3-alpine

WORKDIR /app/telegram-bot-runner

COPY ./telegram-bot-runner/requirements.txt .

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r requirements.txt

COPY ./telegram-bot-runner .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "./main.py"]