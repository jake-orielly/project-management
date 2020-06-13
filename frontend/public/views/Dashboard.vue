<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner v-bind:user="'Ann Perkins'"></Banner>
        <div v-if="currTab == 'dashboard'" id="dashboard">
            <Inbox></Inbox>
            <Calendar ref="calendar"></Calendar>
            <TaskList ref="taskList"></TaskList>
            <TaskStatusModal ref="taskStatusModal"></TaskStatusModal>
            <History></History>
        </div>
        <div v-if="currTab == 'myForms' && !formPreview" id="form-creation">
            <FormList v-bind:targetUser="'ann_perkins'" ref="FormList"></FormList>
            <FieldAdd></FieldAdd>
            <FormCreation></FormCreation>
        </div>
        <FormDisplay v-bind:preview="true"></FormDisplay>
    </div>
</template>

<script>
    import '../css/style.css'
    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';
    import Calendar from '../components/Calendar.vue';
    import Inbox from '../components/Inbox.vue';
    import TaskList from '../components/TaskList.vue';
    import FieldAdd from '../components/FieldAdd.vue';
    import FormCreation from '../components/FormCreation.vue';
    import FormDisplay from '../components/FormDisplay.vue';
    import FormList from '../components/FormList.vue';
    import TaskStatusModal from '../components/TaskStatusModal.vue';
    import History from '../components/History.vue';

    export default {
        components: {
            Banner,
            Calendar,
            Inbox,
            TaskList,
            FieldAdd,
            FormCreation,
            FormDisplay,
            FormList,
            TaskStatusModal,
            History
        },
        data () {
            return {
                currTab: "dashboard",
                fields: [
                    ],
                inbox: [],
                taskList: [],
                today: new Date(),
                workload: [],
                formTitle: "",
                formPreview: false,
                formSaved: true,
                dayHighlighted: {},
                dayHighlightedClass: 'cell-highlighted',
                draggingPos: undefined,
                draggingField: undefined,
                modalTint: false
            }
        },
        mounted() {
            this.updateWorkload();
            this.updateInbox();
            this.updateTaskList();
        },
        methods: {
            updateWorkload() {
                let workload = [];
                let taskList = this.taskList.slice();
                let currTask;
                let currDay = this.today.getDate();
                let availibleHours;
                taskList = taskList.sort(
                    (a,b) => a.due < b.due ? -1 : 1
                )
                for (let i = 0; i < this.$refs.calendar.monthLength; i++)  
                    workload.push({remaining:8,tasks:[]});
                for (let i of taskList) {
                    currTask = Object.assign({}, i);
                    i.danger = false;
                    while (currTask.estimate > 0) {
                        if (this.$refs.calendar.isWeekend(currDay)) {
                            currDay++;
                        }
                        else if (workload[currDay].remaining > currTask.estimate) {
                            workload[currDay].tasks.push({name:currTask.description, time:parseInt(currTask.estimate)});
                            workload[currDay].remaining -= currTask.estimate;
                            currTask.estimate = 0;
                        }
                        else if (currTask.due.getDate() + 1 > currDay) {
                            if (workload[currDay].remaining) {
                                workload[currDay].tasks.push({name:currTask.description, time:parseInt(workload[currDay].remaining - 1)});
                                currTask.estimate -= (workload[currDay].remaining - 1);
                                workload[currDay].remaining = 1;
                            }
                            currDay++;
                        }
                        else {
                            for (let j = currDay; j >= this.today.getDate(); j--) {
                                if (this.$refs.calendar.isWeekend(j)) {
                                    j--;
                                }
                                else if (currTask.due.getDate() + 1 == currDay) {
                                    workload[currDay].tasks.push({name:currTask.description, time:parseInt(currTask.estimate)});
                                    workload[j].remaining -= currTask.estimate;
                                    i.danger = true;
                                    currTask.estimate = 0;
                                    break;
                                }
                                else if (workload[j].remaining > 0) {
                                    availibleHours = workload[j].remaining;
                                    workload[currDay].tasks.push({name:currTask.description, time:availibleHours});
                                    workload[j].remaining = Math.max(0, workload[j].remaining - currTask.estimate);
                                    currTask.estimate -= availibleHours;
                                    if (currTask.estimate <= 0)
                                        break;
                                }
                            }
                            currDay++;
                        }
                    }
                }
                this.workload = workload;
            },
            updateInbox() {
                this.inbox = [];
                requests.getInbox("ann.perkins").then(
                    response => {
                        let responseData = JSON.parse(JSON.parse(response.responseText).data);
                        for (let response of responseData) {
                            this.inbox.push({
                                "description": "Give Estimate",
                                "from": "Leslie Knope",
                                "title":response.form_title,
                                "fields":response
                            })
                        }
                    }
                )
            },
            updateTaskList() {
                this.taskList = [];
                requests.getTasks("ann.perkins").then(
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
                    }
                )
            },
            newTask(item) {
                this.taskList.push(new TaskListItem(item))
            },
            caps: function(text) {
                if (!text)
                    return text;
                return text[0].toUpperCase() + text.substr(1);
            }
        }
    }

    class TaskListItem {
        constructor(item) {
            this.description = item.description;
            this.fields = item.fields;
            this.assigner = "TODO: assigner";
            this.due = new Date(item.due_date);
            this.estimate = item.estimate;
            this.status = item.status;
            this.danger = false;
        }
    }
</script>

<style lang="scss" scoped>
    #dashboard {
        height: 90vh;
    
        & div {
            margin-top: 1rem;
        }
    }

    #modal-tint {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #00000066;
        z-index: 1;
    }
</style>