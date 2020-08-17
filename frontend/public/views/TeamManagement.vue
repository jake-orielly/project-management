<!-- eslint-disable -->
<template>
    <div>
        <Banner></Banner>
        <div id="main-container">
            <p class="title">My Team</p>
            <p v-for="user in myTeam">
                {{user.name}}
                <i class="fa fa-user-minus"></i>
            </p>
        </div>
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
                myTeam:[]
            }
        },
        mounted () {
            requests.getUser(this.$store.state.user).then(
                response => {
                    for (let i of JSON.parse(response.responseText).team)
                        this.myTeam.push({
                            name:i,
                            open:false
                        });
                }
            )
        },
        methods: {
        }
    }
</script>

<style lang="scss" scoped>
    #main-container {
        padding: 2rem;
    }

    .title {
        font-weight: bold;
        text-decoration: underline;
    }
</style>