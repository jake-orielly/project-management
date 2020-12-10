import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Dashboard from './views/Dashboard.vue';
import MyForms from './views/MyForms.vue';
import TeamWorkload from './views/TeamWorkload.vue';
import TeamManagement from './views/TeamManagement.vue';
import Forms from './views/Forms.vue';

import Keycloak from "keycloak-js";
import store from "./store";

Vue.use(VueRouter)

Vue.config.productionTip = false;

const routes = [
  {path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/my-forms', component: MyForms },
  { path: '/team-workload', component: TeamWorkload },
  { path: '/team-management', component: TeamManagement },
  { path: '/forms/:user/:formId', component: Forms}
];

const router = new VueRouter({
  routes
});

let initOptions = {
  url: 'http://23.254.164.217:8090/auth', realm: 'buzzbeam', clientId: 'buzzbeam-client', onLoad: 'login-required'
};

let keycloak = Keycloak(initOptions);
keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    Vue.$log.info("Authenticated");

    new Vue({
      render: h => h(App),
      store,
      router
    }).$mount('#app')    
  }

  //Token Refresh
  setInterval(() => {
    keycloak.updateToken(70).then((refreshed) => {
      if (refreshed) {
        Vue.$log.info('Token refreshed' + refreshed);
      } else {
        Vue.$log.warn('Token not refreshed, valid for '
          + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
      }
    }).catch(() => {
      Vue.$log.error('Failed to refresh token');
    });
  }, 6000)

}).catch(() => {
  Vue.$log.error("Authenticated Failed");
});