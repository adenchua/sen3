FROM python:3.13.3-alpine

WORKDIR /app/scripts

COPY ./scripts/requirements.txt .

RUN pip3 install --upgrade pip && \
    pip3 install --no-cache-dir -r requirements.txt

COPY ./scripts .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "main.py"]