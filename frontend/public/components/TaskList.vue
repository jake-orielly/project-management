<template>
    <div id="taskList">
        <p class="title">My Tasks</p>
        <ul>
            <li v-for="task in $store.state.taskList.filter(task => task.status == 'In Progress')" v-bind:key="task.name">
                <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                    <div class="task-name">
                        <span class="clickable" @click="taskClick(task)">
                            {{task.description}}
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
        data() {
            return {
            }
        },
        methods: {
            updateTaskList() {
                let taskList = [];
                requests.getTasks(this.user).then(
                    response => {
                        let responseData = JSON.parse(JSON.parse(response.responseText).data);
                        for (let response of responseData) {
                            taskList.push({
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
                        this.$store.commit("setTaskList", taskList);
                        this.$parent.$refs.calendar.updateWorkload();
                    }
                )
            },
            taskClick(task) {
                this.$parent.$refs.calendar.dayHighlighted = {};
                for (let i = 0; i < this.$parent.$refs.calendar.workload.length; i++)
                    if (this.$parent.$refs.calendar.workload[i].tasks.filter(item => item.name == task.description).length)
                        this.$parent.$refs.calendar.dayHighlighted[i] = true;
            },
            setStatus(task,status) {
                this.$parent.$refs.taskStatusModal.show(task,status);
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
</style>