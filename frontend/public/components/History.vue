<template>
    <div id="history-container">
        <p class="title">
            Recent Responses
        </p>
        <div v-if="!task">
            <div class="task-item" v-for="task in taskList.reverse()" v-bind:key="task.hash">
                <p>
                    {{task.description}}
                </p>
                <p>
                    {{formatDate(task.history[task.history.length - 1].time)}}
                </p>
                <div class="clickable icon" @click="selectTask(task)">
                    <i class="fa fa-history" aria-hidden="true"></i>
                </div>
            </div>
        </div>
        <div v-if="task">
            <div class="close-icon-container clickable" @click="deselectTask()">
                <i class="fa fa-times"></i>
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
    import requests from '../services/requests.js';

    export default {
        mounted() {
            requests.getTasks(this.$store.state.user).then(
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
                }
            )
        },
        data() {
            return {
                task: undefined,
                taskList: [],
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
                formatted += dateObj.getFullYear() + " ";

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
            },
            formatDate(date) {
                let currDate = new Date(date);
                return currDate.getMonth() + 1 + "/" + currDate.getDate() + "/" + currDate.getFullYear()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .title {
        text-decoration: underline;
    }

    p {
        margin-right: 0.5rem;
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
        padding: 1rem;
        border: 3px solid #2C666E;
        border-radius: 1em;
        overflow-y: auto;
    }

    td {
        padding-left: 1.5rem;
    }

    .fa-plus {
        float: right;
    }
</style>