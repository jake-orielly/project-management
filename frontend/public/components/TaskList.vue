<template>
    <div id="taskList" :class="{'no-border' : !mine}">
        <p class="title" v-if="mine">My Tasks</p>
        <ul>
            <li v-for="task in this.taskList.filter(task => task.status == 'In Progress')" v-bind:key="task.name">
                <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                    <div class="task-name">
                        <span class="clickable">
                            {{task.description + ': ' + task.estimate + ' hours, due: ' + formatDate(task.due_date)}}
                        </span>
                        <div v-if="mine" class="task-icon" @click="setStatus(task,'Blocked')">
                            <i class="fa fa-ban clickable"></i>
                        </div>
                        <div v-if="mine" class="task-icon" @click="setStatus(task,'Completed')">
                            <i class="fa fa-check clickable"></i>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <p v-if="!this.taskList.length">No tasks</p>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        props: {
            user: {
                type: String,
                required: true
            },
            mine: {
                type: Boolean,
                required: true
            }
        },
        mounted() {
            this.updateTaskList();
        },
        data: () => {
            return {
                taskList: []
            }
        },
        methods: {
            updateTaskList() {
                this.taskList = [];
                requests.getTasks(this.user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        for (let response of responseData) {
                            this.taskList.push({
                                "description": response.description,
                                "from": response.assigner,
                                "title":response.form_title,
                                "fields":response.fields,
                                "estimate":response.estimate,
                                "due_date":response.due_date,
                                "hash":response.hash,
                                "status":response.status,
                                "history":response.history
                            })
                        }
                        if (this.mine)
                            this.$store.commit("setTaskList", this.taskList);
                    }
                )
            },
            setStatus(task,status) {
                this.$parent.$refs.taskStatusModal.show(task,status);
            },
            formatDate(date) {
                let dateSplit = date.split('-');
                return dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-name {
        padding: 0.75rem 1rem;

        span {
            margin-right: 1rem;
        }
    }

    .task-icon {
        float: right;
        margin-left: 0.5rem;
    }

    #taskList.no-border {
        border: none;
        width: 50%;
    }

    li {
        & .dashboard-card {
            width: auto;
        }
    }
</style>