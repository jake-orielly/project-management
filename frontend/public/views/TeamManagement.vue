<!-- eslint-disable -->
<template>
    <div>
        <Banner></Banner>
    </div>
</template>

<script>
    import '../css/style.css'

    import '@fortawesome/fontawesome-free/css/all.css'
    import '@fortawesome/fontawesome-free/js/all.js'

    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';

    export default {
        components: {
            Banner
        },
        data () {
            return {
            }
        },
        mounted () {
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
</style>