<template>
    <div id="inbox" :class="{'focused':viewing}">
        <div v-if="viewing" class="close-icon-container">
            <font-awesome-icon icon="times" @click="closeView" class="clickable"/>
        </div>
        <div id="tab-container">
            <p v-for="tab in tabs" v-bind:key="tab" @click="setTab(tab)" class="clickable">
                {{tab}}
                <span v-if="$parent.inbox.length" class="tab-badge" :class="{'hidden' : tab != 'New'}">
                    {{$parent.inbox.length}}
                </span>
            </p>
        </div>
        <div id="inbox-inner" v-if="viewing == undefined">
            <table v-if="$parent.inbox.length" id="inbox-table">
                <tbody>
                    <tr>
                        <th v-for="header in Object.keys(cols)" v-bind:key="header" @click="changeSort(header)" class="clickable">
                            {{header}}
                            <font-awesome-icon v-if="sortBy == header && sortOrder == 'descending'" icon="caret-down"/>
                            <font-awesome-icon v-if="sortBy == header && sortOrder == 'ascending'" icon="caret-up"/>
                        </th>
                    </tr>
                    <tr v-for="item in inbox" v-bind:key="inbox.indexOf(item)" @click="openInboxItem(item)">
                        <td v-for="col in Object.values(cols)" v-bind:key="col">
                            {{item[col]}}
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!$parent.inbox.length">
                No {{currTab.toLowerCase()}} items
            </p>
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
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';
    import TaskList from '../components/TaskList.vue';

    export default {
        components: {
            FontAwesomeIcon,
            TaskList
        },
        data() {
            return {
                viewing: undefined,
                mode: undefined,
                myTeam:[],
                tabs: ["New","In Progress","Blocked","Complete"],
                cols: {
                    "Project":"title",
                    "Task":"description",
                    "Requester":"from",
                    "Due Date":"due_date"
                },
                sortBy:"Project",
                sortOrder:"descending",
                currTab: "New"
            }
        },
        computed: {
            inbox: function() {
                let sorted = this.$parent.inbox.concat()
                let app = this;
                sorted.sort(function(a, b) {
                    let val = (app.sortOrder == "ascending" ? -1 : 1);
                    let key = app.cols[app.sortBy];

                    if (a[key] > b[key])
                        return 1 * val;
                    if (b[key] > a[key])
                        return -1 * val;
                    else
                        return 0;
                });
                return sorted;
            }
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
            changeSort(header){
                if (header == this.sortBy)
                    this.sortOrder = (this.sortOrder == 'ascending' ? 'descending' : 'ascending') 
                else 
                    this.sortBy = header   
                console.log(this.sortBy,this.sortOrder)
            },
            fromLabel(s) {
                s = s.replace(/_/g,' ')
                s = s.split(' ');
                for (let i = 0; i < s.length; i++)
                    s[i] = s[i].substr(0,1).toUpperCase() + s[i].substr(1)
                return s.join(' ');
            },
            setTab(tab) {
                this.currTab = tab;
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../scss/_variables.scss";

    #inbox-inner {
        border: 3px solid $buzz-blue;
        border-radius: 1em;
        padding: 3rem;
    }

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

    #tab-container {
        margin: 0;

        p {
            display: inline-block;
            padding: 0.75rem 3rem;;
            margin: 0;
            border-radius: 1rem 1rem 0px 0px;
        }

        p:first-child {
            background: $buzz-grey;
            margin-left: 1rem;
            font-weight: bold;
            color: #445E93;
            text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        }
        p:nth-child(2){
            background: $buzz-light-yellow;
        }
        p:nth-child(3){
            background: $buzz-light-orange;
        }
        p:nth-child(4){
            background: $buzz-light-teal;
        }
    }

    #inbox-table {
        border-collapse: collapse;
        width: 100%;
    }

    #inbox-table td, #inbox-table th {
        border: 1px solid $buzz-grey;
        padding: 8px;
    }

    #inbox-table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    #inbox-table tr:hover {
        background-color: #ddd;
    }

    #inbox-table th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: $buzz-light-grey;
    }

    .tab-badge {
        display: inline-block;
        background: #445E93;
        color: #FFFFFF;
        font-weight: 400;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 0.75rem;
        text-align: center;

        &.hidden {
            background: none;
            color: transparent;
        }
    }

    .up *{
        transform: rotate(180deg);
    }
</style>