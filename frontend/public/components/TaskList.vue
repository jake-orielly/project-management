<template>
    <div id="taskList">
        <p class="title">My Tasks</p>
        <ul>
            <li v-for="task in $parent.taskList" v-bind:key="task.name">
                <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                    <div class="task-name">
                        <span class="clickable" @click="taskClick(task)">
                            {{task.description}}
                        </span>
                        <div class="task-icon" @click="setStatus(task,'Blocked')">
                            <i class="fa fa-ban clickable"></i>
                        </div>
                        <div class="task-icon" @click="setStatus(task,'Completed')">
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
        data() {
            return {
            }
        },
        methods: {
            taskClick(task) {
                this.$parent.dayHighlighted = {};
                for (let i = 0; i < this.$parent.workload.length; i++)
                    if (this.$parent.workload[i].tasks.filter(item => item.name == task.description).length)
                        this.$parent.dayHighlighted[i] = true;
            },
            setStatus(task,status) {
                task.status = status;
                requests.updateTask("ann.perkins",task);
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