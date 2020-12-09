<!-- eslint-disable -->
<template>
    <div>
        <TopBanner active="team-management"></TopBanner>
        <div id="main-container">
            <p class="title">My Teams</p>
            <div v-for="team in myTeams" class="team-container">
                <div>
                    <p class="team-header">
                        {{team.name}}
                    </p>
                    <font-awesome-icon icon="user-plus" @click="openAddTeamModal(team)" class="team-header clickable"/>
                </div>
                <div v-for="user in team.members" class="member-container">
                    <p>
                        {{user}}
                    </p>
                    <font-awesome-icon icon="user-minus" 
                    v-if="user != $store.state.user" @click="removeTeamMember(team.name,user)" 
                    class="clickable"/>
                </div>
            </div>
        </div>
        <div id="modal-container" v-if="showingModal">
            <div id="team-member-modal">
                <p>
                    Add team member to 
                    <span>team</span>
                </p>
                <div class="team-header">
                    <AutocompleteInput :suggestions="orgMembers"></AutocompleteInput>
                </div>
                <font-awesome-icon icon="user-plus" @click="addTeamMember()" class="team-header clickable"/>
                <font-awesome-icon icon="times" @click="closeAddTeamModal" class="team-header clickable"/>
            </div>
        </div>
        <div v-if="showingModal" id="modal-tint">
        </div>
    </div>
</template>

<script>
    import '../css/style.css'

    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';
    import AutocompleteInput from '../components/AutocompleteInput.vue';
    import TopBanner from '../components/TopBanner.vue';

    export default {
        components: {
            FontAwesomeIcon,
            AutocompleteInput,
            TopBanner
        },
        data () {
            return {
                myTeams:[],
                showingModal: false,
                autocompleteVal:"",
                modalTeam: "",
                orgMembers: []
            }
        },
        mounted () {
            requests.getUser(this.$store.state.user).then(
                response => {
                    let responseText = JSON.parse(response.responseText)
                    for (let team of responseText.teams) {
                        this.retrieveTeam(team);
                    }
                    requests.getOrginization(responseText.orginization).then(
                        response => {
                            this.orgMembers = JSON.parse(response.responseText).members.filter(
                                user => user != this.$store.state.user
                            );
                        }
                    )
                }
            )
        },
        methods: {
            openAddTeamModal(team) {
                this.modalTeam = team;
                this.showingModal = true;
            },
            closeAddTeamModal() {
                this.showingModal = false;
            },
            addTeamMember() {
                requests.addTeamMember(this.modalTeam.name,this.autocompleteVal).then(
                    () => {
                        this.retrieveTeam(this.modalTeam.name)
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

    #team-member-modal .team-header {
        float: left;
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
        font-size: 1.25rem;
        padding: 2rem 3rem;
        z-index: 2;
    }

    .fa-times {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        font-size: 1.2rem;
    }

    #modal-tint {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #00000066;
        z-index: 1;
    }
</style>