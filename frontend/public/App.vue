<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script type="text/javascript" src="./js/config.js"></script>

<script>
    import './css/style.css'
    import Login from './views/Login.vue';
    import Register from './views/Register.vue';
    import Dashboard from './views/Dashboard.vue';
    import MyForms from './views/MyForms.vue';
    import TeamWorkload from './views/TeamWorkload.vue';
    import TeamManagement from './views/TeamManagement.vue';
    import Forms from './views/Forms.vue';

    import Vue from 'vue'
    import VueRouter from 'vue-router'

    import store from "./store";

    Vue.use(VueRouter)

    const routes = [
        { path: '/', component: Login },
        { path: '/register', component: Register },
        { path: '/dashboard', component: Dashboard },
        { path: '/my-forms', component: MyForms },
        { path: '/team-workload', component: TeamWorkload },
        { path: '/team-management', component: TeamManagement },
        { path: '/forms/:user/:formId', component: Forms}
    ];

    const router = new VueRouter({routes});
    export default {
        name: 'app',
        store: store,
        router,
        components: {Login,Dashboard,Forms},
    };
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap')
</style>