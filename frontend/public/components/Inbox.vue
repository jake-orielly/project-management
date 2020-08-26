<template>
    <div id="inbox" :class="{'focused':viewing}">
        <div v-if="viewing" class="close-icon-container" @click="closeView">
            <i class="fa fa-times clickable"></i>
        </div>
        <div v-if="viewing == undefined">
            <p class="title">Inbox</p>
            <ul>
                <li v-for="item in $parent.inbox" v-bind:key="$parent.inbox.indexOf(item)">
                    <div class="dashboard-card">
                        <p @click="openInboxItem(item)">{{item.description}}: {{item.title}}</p>
                    </div>
                </li>
            </ul>
        </div>
        <div id="estimate-container" v-if="viewing != undefined">
            <p>{{viewing.fields.description}}</p>
            <p>{{'Due: ' + viewing.fields.due_date}}</p>
            <p v-for="field in Object.keys(viewing.fields.fields)" v-bind:key="field">
                {{fromLabel(field) + ': ' + viewing.fields.fields[field]}}
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
    </div>
</template>

<script>
    import requests from '../services/requests.js';
    import TaskList from '../components/TaskList.vue';

    export default {
        components: {
            TaskList
        },
        data() {
            return {
                viewing: undefined,
                mode: undefined,
                myTeam:[]
            }
        },
        mounted() {
            /* What is this doing here?
            requests.getUserTeam(this.$store.state.user).then(
                response => {
                    for (let i of JSON.parse(response.responseText))
                        this.myTeam.push({
                            name:i,
                            open:false,
                            selected:false,
                            expanded:false
                        });
                }
            )
            */
        },
        methods: {
            openInboxItem(item) {
                this.viewing = item;
                console.log(item)
            },
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
                this.viewing = undefined;
                this.mode = undefined;
                this.$parent.updateInbox();
                this.$parent.$refs.taskList.updateTaskList();
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
            }
        }
    }
</script>
<style lang="scss" scoped>
    .team-container {
        font-size: 1.25rem;
    }

    .selected {
        color: #2C666E;
        text-decoration: underline;
    }

    #inbox.focused {
        position: absolute;
        background: white;
        z-index: 100;
        width: 90%;
        height: 90%;
    }

    .close-icon-container {
        text-align: right;
        margin: 1rem;
        font-size: 1.5rem;
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