<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner active="dashboard"></Banner>
        <div id="dashboard-container">
            <div id="focus-container">
                <p class="title">{{$store.state.user + "'s Dashboard"}}</p>
                <p v-for="option in focusOptions" v-bind:key="option" 
                    :class="{'buzz-bold':focused == optionMap[option]}" class="clickable"
                    @click="focused = optionMap[option]"
                >
                    {{option}}
                </p>
            </div>
            <div id="dashboard">
                <Inbox v-if="focused == 'inbox'"></Inbox>
                <TaskList v-if="focused == 'task-list'" ref="taskList" v-bind:user="$store.state.user" v-bind:mine="true"></TaskList>
                <TaskStatusModal ref="taskStatusModal"></TaskStatusModal>
            </div>
        </div>
    </div>
</template>

<script>
    import '../css/style.css'
    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';
    import Inbox from '../components/Inbox.vue';
    import TaskList from '../components/TaskList.vue';
    import TaskStatusModal from '../components/TaskStatusModal.vue';

    export default {
        components: {
            Banner,
            Inbox,
            TaskList,
            TaskStatusModal,
        },
        data () {
            return {
                currTab: "dashboard",
                taskList: [],
                modalTint: false,
                focusOptions: ["Inbox","Reporting"],
                focused: "inbox",
                optionMap: {
                    "Inbox":"inbox",
                }
            }
        },
        mounted() {
            this.updateTaskList();
            let app = this;
            setInterval(
                () => {app.updateTaskList()},
                2500
            )
        },
        methods: {
            updateTaskList() {
                requests.getTasks(this.$store.state.user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        this.taskList = [];
                        for (let response of responseData) {
                            this.taskList.push({
                                "description": "Give Estimate",
                                "from": "Leslie Knope",
                                "title":response.form_title,
                                "due_date":response.due_date,
                                "fields":response
                            })
                        }
                    }
                )
            },
            showForm(formName) {
                this.$refs.formResponses.loadForm(formName);
            },
            caps: function(text) {
                if (!text)
                    return text;
                return text[0].toUpperCase() + text.substr(1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #dashboard-container {
        display: grid;
        grid-template-columns: 15% 70%;
    }

    #focus-container {
        margin-left: 3rem;
        margin-top: 3rem;

        .title {
            font-weight: bold;
        }
    }

    #dashboard {
        margin-left: 2em;
        margin-right: 2rem;
    
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