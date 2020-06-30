FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @vue/cli @vue/cli-service-global
RUN npm install vue-router
RUN npm install sass-loader
RUN npm install @fortawesome/fontawesome-free
RUN npm install vuex
RUN npm install chart.js

COPY . .

EXPOSE 8080

RUN npm run sass

WORKDIR /usr/src/app/public

CMD [ "vue", "serve" ]
