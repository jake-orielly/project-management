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

import store from "./store";

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  {path: '/', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },
  { path: '/my-forms', component: MyForms },
  { path: '/team-workload', component: TeamWorkload },
  { path: '/team-management', component: TeamManagement },
  { path: '/forms/:user/:formId', component: Forms}
]

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
