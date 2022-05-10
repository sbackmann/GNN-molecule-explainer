FROM python:3.9-slim

COPY ./src /srv/backend-app

WORKDIR /srv/backend-app
RUN pip3 install -r requirements.txt

CMD [ "python", "main.py" ]