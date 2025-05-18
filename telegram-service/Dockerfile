FROM python:3.13.3-alpine

WORKDIR /app/telegram-service

# need curl command for healthcheck
RUN apk add --no-cache curl

COPY ./telegram-service/requirements.txt .

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r requirements.txt

COPY ./telegram-service .

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/telegram-service/src

CMD ["gunicorn", "--bind", "0.0.0.0:5099", "src.main:create_app()"]