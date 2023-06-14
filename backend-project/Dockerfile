FROM python:3.9-slim

COPY ./ /srv/backend-app

WORKDIR /srv/backend-app
RUN apt-get update && apt-get install -y g++
RUN pip3 install rdkit
RUN pip3 install --no-cache-dir .
RUN pip3 install --no-index torch-scatter -f https://pytorch-geometric.com/whl/torch-1.11.0+cpu.html
RUN pip3 install --no-index torch-sparse -f https://pytorch-geometric.com/whl/torch-1.11.0+cpu.html
RUN pip3 install --no-index torch-cluster -f https://pytorch-geometric.com/whl/torch-1.11.0+cpu.html
RUN pip3 install --no-index torch-spline-conv -f https://pytorch-geometric.com/whl/torch-1.11.0+cpu.html
RUN pip3 install torch-geometric

CMD [ "start-server", "--host", "0.0.0.0"]