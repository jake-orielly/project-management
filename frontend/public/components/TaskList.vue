<template>
    <div id="taskList">
        <p class="title">My Tasks</p>
        <ul>
            <li v-for="task in $parent.taskList" @click="taskClick(task)" v-bind:key="task.name">
                <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                    <p>{{task.description}}</p>
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
                this.$parent.dayHighlighted = {};
                for (let i = 0; i < this.$parent.workload.length; i++)
                    if (this.$parent.workload[i].tasks.filter(item => item.name == task.description).length)
                        this.$parent.dayHighlighted[i] = true;
            },
        }
    }
</script>