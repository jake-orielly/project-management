<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script src="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></script>
<script type="text/javascript" src="./js/config.js"></script>

<script>
    import './css/style.css'
    import Login from './components/login.vue';
    import Foo from './components/foo.vue';

    import Vue from 'vue'
    import VueRouter from 'vue-router'

    Vue.use(VueRouter)

    const routes = [
        { path: '/', component: Login },
        { path: '/foo', component: Foo }
    ];

    const router = new VueRouter({routes});
    export default {
        name: 'app',
        router,
        components: {Login,Foo},
    };
</script>