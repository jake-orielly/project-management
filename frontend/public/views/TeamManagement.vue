<!-- eslint-disable -->
<template>
    <div>
        <Banner></Banner>
        <div id="main-container">
            <p class="title">My Teams</p>
            <div v-for="team in myTeams" class="team-container">
                <div>
                    <p class="team-header">
                        {{team.name}}
                    </p>
                    <div class="team-header clickable" @click="openAddTeamModal(team)">
                        <i class="fa fa-user-plus"></i>
                    </div>
                </div>
                <div v-for="user in team.members" class="member-container">
                    <p>
                        {{user}}
                    </p>
                    <div class="clickable" @click="removeTeamMember(team.name,user)" v-if="user != $store.state.user">
                        <i class="fa fa-user-minus"></i>
                    </div>
                </div>
            </div>
        </div>
        <div id="modal-container">
            <div id="team-member-modal">
                <p>
                    Add team member to 
                    <span>team</span>
                </p>
                <div class="team-header">
                    <input type="text" v-model="addUserName">
                </div>
                <div class="team-header clickable" @click="addTeamMember()">
                    <i class="fa fa-user-plus"></i>
                </div>
                <div @click="closeAddTeamModal" class="close-container">
                    <i class="fa fa-times clickable"></i>
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
                myTeams:[],
                addUserName:"",
                modalTeam: "Buzzbeam Creators"
            }
        },
        mounted () {
            requests.getUser(this.$store.state.user).then(
                response => {
                    let teams = JSON.parse(response.responseText).teams;
                    for (let team of teams) {
                        this.retrieveTeam(team);
                    }
                }
            )
        },
        methods: {
            closeAddTeamModal() {
                console.log(2)
            },
            addTeamMember() {
                requests.addTeamMember(this.modalTeam,this.addUserName).then(
                    () => {
                        this.retrieveTeam(this.modalTeam)
                    }
                );
            },
            removeTeamMember(team,member) {
                requests.removeTeamMember(team,member).then(
                    () => {
                        this.retrieveTeam(team)
                    }
                );
            },
            retrieveTeam(team) {
                requests.getTeamMembers(team).then(
                    response => {
                        let newTeam = {
                            name:team,
                            members:JSON.parse(response.responseText).members
                        }
                        for (let i = 0; i < this.myTeams.length; i++)
                            if (this.myTeams[i].name == team) {
                                this.myTeams.splice(i, 1, newTeam);
                                return
                            }
                        this.myTeams.push(newTeam);
                    }
                );
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

    .member-container *, .team-header {
        display: inline-block;
        padding-right: 0.5rem;
    }

    #modal-container {
        position: absolute;
        width: 100%;
        top: 20%;
        display: flex;
        justify-content: center;
    }

    #team-member-modal {
        position: relative;
        display: inline-block;
        background-color: white;
        border: 1px solid black;
        border-radius: 1rem;
        padding: 2rem 3rem;
    }

    .fa-times {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        font-size: 1.2rem;
    }
</style>