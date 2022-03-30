FROM node:17.8-alpine

COPY . /srv

WORKDIR /srv
RUN ls -lisa

RUN npm install

RUN npm run build

CMD ["serve", "-s", "build", "-l", "3000"]