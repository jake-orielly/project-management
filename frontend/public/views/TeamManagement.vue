<!-- eslint-disable -->
<template>
    <div>
        <Banner></Banner>
        <div id="main-container">
            <p class="title">My Teams</p>
            <div v-for="team in myTeams" class="team-container">
                <p>
                    {{team.name}}
                </p>
                <div v-for="user in team.members" class="member-container">
                    <p>
                        {{user}}
                    </p>
                    <div @click="removeTeamMember">
                        <i class="fa fa-user-minus"></i>
                    </div>
                </div>
            </div>
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
                myTeams:[]
            }
        },
        mounted () {
            requests.getUser(this.$store.state.user).then(
                response => {
                    let teams = JSON.parse(response.responseText).teams;
                    for (let team of teams) {
                        requests.getTeamMembers(team).then(
                            response => {
                                this.myTeams.push(
                                    {
                                        name:team,
                                        members:JSON.parse(response.responseText).members
                                    }
                                );
                            }
                        );
                    }
                }
            )
        },
        methods: {
            removeTeamMember() {
                console.log(1)
            }
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

    .team-container, .member-container{
        padding: 0rem 2rem;
    }

    .member-container * {
        display: inline-block;
        padding-right: 0.5rem;
    }
</style>