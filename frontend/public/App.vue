<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script type="text/javascript" src="./js/config.js"></script>

<script>
    import './css/style.css'
    import Login from './views/Login.vue';
    import Dashboard from './views/Dashboard.vue';
    import MyTeam from './views/MyTeam.vue';

    import Vue from 'vue'
    import VueRouter from 'vue-router'

    Vue.use(VueRouter)

    const routes = [
        { path: '/', component: Login },
        { path: '/dashboard', component: Dashboard },
        { path: '/my-team', component: MyTeam }
    ];

    const router = new VueRouter({routes});
    export default {
        name: 'app',
        router,
        components: {Login,Dashboard,MyTeam},
    };
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap');
</style>