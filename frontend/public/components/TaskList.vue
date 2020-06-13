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
    export default {
        data() {
            return {
            }
        },
        methods: {
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