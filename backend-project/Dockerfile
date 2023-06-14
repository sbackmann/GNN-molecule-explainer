FROM python:3.9-slim

COPY ./ /srv/backend-app

WORKDIR /srv/backend-app
RUN apt-get update && apt-get install -y g++
RUN pip3 install --no-cache-dir .
RUN pip3 install torch-sparse==0.6.13 torch-scatter

CMD [ "start-server", "--host", "0.0.0.0"]