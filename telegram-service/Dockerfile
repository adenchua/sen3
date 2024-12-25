FROM python:3.13.1-alpine

WORKDIR /telegram-service

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD [ "python3", "-m" , "flask", "--app", "./src/flaskr", "run", "--host=0.0.0.0"]