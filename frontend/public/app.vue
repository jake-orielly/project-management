<template>
    <div id="app">
        <login></login>
    </div>
</template>

<script src="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&display=swap" rel="stylesheet"></script>
<script type="text/javascript" src="./js/config.js"></script>

<script>
    import './css/style.css'
    import login from './login.vue';

    export default {
    components: {
        login
    }
}
</script>