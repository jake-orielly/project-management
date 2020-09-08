<template>
    <div id="top-level-container">
        <font-awesome-icon icon="times" @click="closeView" class="clickable"/>
        <p>{{task.fields.description}}</p>
        <p>{{'Due: ' + task.fields.due_date}}</p>
        <p v-for="field in Object.keys(task.fields.fields)" v-bind:key="field">
            {{fromLabel(field) + ': ' + task.fields.fields[field]}}
        </p>
        <button @click="setMode('assign')">Re-Assign</button>
        <button @click="setMode('estimate')">Estimate</button>
        <button @click="setMode('pushBack')">Push Back</button>
        <div v-if="mode == 'estimate'">
            <p><input type="number" id="estimate-input"> Hours</p>
        </div>
        <div class="team-container" v-if="mode == 'assign'">
            <div v-for="user in myTeam" v-bind:key="user.name" class="user-container">
                <p @click="toggleSelect(user)" class="clickable" :class="{ 'selected' : user.selected }">
                    {{user.name}}
                </p>
                <div v-if="!user.expanded">
                    <p class="clickable" @click="toggleExpand(user)">
                        <i class="fa fa-plus"></i>
                    </p>
                </div>
                <p v-if="user.expanded" class="clickable" @click="toggleExpand(user)">
                    <i class="fa fa-minus"></i>
                </p>
                <div v-if="user.expanded" class="user-info" :key="user.name + '-task-list-container'">
                    <TaskList ref="taskList" v-bind:user="user.name" v-bind:mine="false" :key="user.name + '-task-list'"></TaskList>
                </div>
            </div>
        </div>
        <div v-if="mode == 'pushBack'">
            <p>Reason for pushback:</p>
            <textarea id="pushback-comment"></textarea>
        </div>
        <p v-if="mode">
            <button @click="confirm">Confirm</button>
        </p>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';
    import TaskList from '../components/TaskList.vue';

    export default {
        props: {
            task: {
                type: Object,
                required: true
            },
        },
        components: {
            FontAwesomeIcon,
            TaskList
        },
        data() {
            return {
                myTeam: [],
                mode: undefined
            }
        },
        created() {
            requests.getUser(this.$store.state.user).then(
                response => {
                    // Todo: allow for multiple teams
                    let team = JSON.parse(response.responseText).teams[0];
                    requests.getTeamMembers(team).then( 
                        teamResponse => {
                            let teamMembers = JSON.parse(teamResponse.responseText).members;
                            for (let name of teamMembers)
                                if (name != this.$store.state.user)
                                    this.myTeam.push(new TeamMate(name));
                        }
                    )
                }
            )
        },
        methods: {
            setMode(mode) {
                this.mode = mode;
            },
            toggleExpand(user) {
                user.expanded = !user.expanded;
            },
            confirm() {
                if (this.mode == 'estimate') {
                    let estimateVal = parseFloat(document.getElementById("estimate-input").value);
                    requests.submitEstimate(this.$store.state.user,this.viewing.fields.hash,estimateVal).then(
                        () => {
                            this.closeView();
                    })
                }
                else if (this.mode == 'assign') {
                    let user = this.myTeam.filter(user => user.selected)[0];
                    requests.assignTask(this.$store.state.user,user.name,this.viewing.fields.hash, new Date()).then(
                        () => {
                            this.closeView();
                    })
                }
                else if (this.mode == 'pushBack') {
                    let comment = document.getElementById("pushback-comment").value;
                    requests.returnTask(this.$store.state.user,this.viewing.fields.hash,comment).then(
                        () => {
                            this.closeView();
                    })
                }
            },
            closeView() {
                this.$parent.viewing = undefined;
                this.mode = undefined;
                //this.$parent.$parent.$refs.taskList.updateTaskList();
                for (let user of this.myTeam) {
                    user.expanded = false;
                    user.selected = false;
                }
            },
            toggleSelect(givenUser) {
                for (let user of this.myTeam)
                    user.selected = false;
                givenUser.selected = true;
            },
            fromLabel(s) {
                s = s.replace(/_/g,' ')
                s = s.split(' ');
                for (let i = 0; i < s.length; i++)
                    s[i] = s[i].substr(0,1).toUpperCase() + s[i].substr(1)
                return s.join(' ');
            },
        }
    }

    class TeamMate {
        constructor(name) {
            this.name = name;
            this.selected = false;
            this.expanded = false;
        }
    }
</script>
<style lang="scss" scoped>
    @import "../scss/_variables.scss";

    #top-level-container {
        display: inline-block;
        position: relative;
    }

    .team-container {
        font-size: 1.25rem;
    }

    .selected {
        color: #2C666E;
        text-decoration: underline;
    }

    .user-container {
        & * {
            display: inline-block;
        }

        & p {
            margin-right: 1rem;
        }

        & .user-info {
            display: block;
        }
    }

    #pushback-comment {
        font-size: 1.5rem;
        font-family: 'Poppins', sans-serif;
        color: #313638;
        width: 30rem;
        height: 10rem;
    }
</style>