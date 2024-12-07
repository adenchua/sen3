FROM python:3.13.1-slim-bullseye

WORKDIR /telegram-service

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

CMD [ "python3", "-m" , "flask", "--app", "./src/flaskr", "run", "--host=0.0.0.0"]