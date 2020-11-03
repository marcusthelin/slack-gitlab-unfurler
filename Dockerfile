FROM node:14

WORKDIR /app

RUN npm install -g nodemon

COPY package.json .

RUN npm install

# COPY src /app/src

ENTRYPOINT [ "nodemon", "src/app.js" ]