FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @vue/cli @vue/cli-service-global
RUN npm install vue-router

COPY . .

EXPOSE 8080

RUN npm run sass
CMD [ "npm", "start" ]
