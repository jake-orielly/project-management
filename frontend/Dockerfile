FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @vue/cli @vue/cli-service-global
RUN npm install sass-loader
RUN npm install keycloak-js

COPY . .

EXPOSE 8080
CMD [ "npm", "run", "serve" ]
