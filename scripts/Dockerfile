FROM python:3.13.3-alpine

WORKDIR /app

COPY ./scripts/requirements.txt ./scripts/requirements.txt

WORKDIR /app/scripts
RUN pip3 install -r requirements.txt

COPY ./scripts .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "main.py"]