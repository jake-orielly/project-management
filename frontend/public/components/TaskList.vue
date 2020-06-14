<template>
    <div id="taskList" :class="{'no-border' : !mine}">
        <p class="title" v-if="mine">My Tasks</p>
        <ul>
            <li v-for="task in this.taskList.filter(task => task.status == 'In Progress')" v-bind:key="task.name">
                <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                    <div class="task-name">
                        <span class="clickable" @click="taskClick(task)">
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
            if (!this.$parent.$refs.calendar)
                this.calendar = undefined;
            else
                this.calendar = (
                    this.$parent.$refs.calendar.length ?
                    this.$parent.$refs.calendar.filter(item => item.user == this.user)[0] :
                    this.$parent.$refs.calendar
                )
            this.updateTaskList();
        },
        data: () => {
            return {
                calendar: undefined,
                taskList: []
            }
        },
        methods: {
            updateTaskList() {
                this.taskList = [];
                requests.getTasks(this.user).then(
                    response => {
                        let responseData = JSON.parse(JSON.parse(response.responseText).data);
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
                        if (this.calendar)
                            this.calendar.updateWorkload();
                    }
                )
            },
            taskClick(task) {
                if (this.calendar) {
                    this.calendar.dayHighlighted = {};
                    for (let i = 0; i < this.calendar.workload.length; i++)
                        if (this.calendar.workload[i].tasks.filter(item => item.name == task.description).length)
                            this.calendar.dayHighlighted[i] = true;
                }
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
    }

    .task-icon {
        float: right;
        margin-left: 0.25rem;
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