<template>
    <div id="history-container">
        <p class="title">History</p>
        <div v-if="!task">
            <div class="task-item" v-for="task in $store.state.taskList" v-bind:key="task.hash">
                <p>
                    {{task.description}}
                </p>
                <div class="clickable icon" @click="selectTask(task)">
                    <i class="fa fa-history" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <div v-if="task">
            <div class="close-icon-container" @click="deselectTask()">
                <i class="fa fa-times clickable"></i>
            </div>
            <table>
                <tr v-for="event in task.history" v-bind:key="event.time">
                    <td>
                        {{event.event}}
                    </td>
                    <td>
                        {{event.user}}
                    </td>
                    <td>
                        {{displayDate(event.time)}}
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    //import requests from '../services/requests.js';

    export default {
        data() {
            return {
                task: undefined
            }
        },
        methods: {
            selectTask(task) {
                this.task = task;
            },
            deselectTask() {
                this.task = undefined;
            },
            displayDate(date) {
                let formatted = "";
                let postFix = "";
                let dateObj = new Date(date);

                formatted += (dateObj.getMonth() + 1) + "/";
                formatted += dateObj.getDate() + "/";
                formatted += dateObj.getYear() + " ";

                let hour = dateObj.getHours();
                if (hour > 12) {
                    formatted +=  (hour - 12) + ":";
                    postFix = "PM";
                }
                else {
                    formatted +=  hour + ":";
                    postFix = "AM";
                }
                formatted += dateObj.getMinutes() + postFix;
                

                return formatted;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        text-decoration: underline;
    }

    .task-item *{
        display: inline-block;
    }

    .task-item .icon {
        margin-left: 0.5rem;
    }

    .close-icon-container {
        text-align: right;
        margin-right: 1rem;
    }

    #history-container {
        display: inline-block;
        margin-left: 2em;
        border: 3px solid #2C666E;
        border-radius: 1em;
        width: 50%;
        height: 35%;
        overflow-y: auto;
    }

    td {
        padding-left: 1.5rem;
    }
</style>