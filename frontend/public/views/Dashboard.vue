<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner active="dashboard"></Banner>
        <div id="dashboard-container">
            <div id="focus-container">
                <p class="title">{{$store.state.user + "'s Dashboard"}}</p>
                <p v-for="option in focusOptions" v-bind:key="option" 
                    :class="{'focused':focused == optionMap[option]}" class="clickable"
                    @click="focused = optionMap[option]"
                >
                    {{option}}
                </p>
            </div>
            <div id="dashboard">
                <Inbox v-if="focused == 'inbox'"></Inbox>
                <History v-if="focused == 'history'"></History>
                <Calendar v-if="focused == 'calendar'" ref="calendar" v-bind:user="$store.state.user"></Calendar>
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
    import Calendar from '../components/Calendar.vue';
    import Inbox from '../components/Inbox.vue';
    import TaskList from '../components/TaskList.vue';
    import TaskStatusModal from '../components/TaskStatusModal.vue';
    import History from '../components/History.vue';

    export default {
        components: {
            Banner,
            Calendar,
            Inbox,
            TaskList,
            TaskStatusModal,
            History
        },
        data () {
            return {
                currTab: "dashboard",
                inbox: [],
                modalTint: false,
                focusOptions: ["Inbox","Reporting","My Calendar","Team Calendar"],
                focused: "inbox",
                optionMap: {
                    "Inbox":"inbox",
                    "Reporting":"history",
                    "My Calendar":"calendar"
                }
            }
        },
        mounted() {
            this.updateInbox();
            let app = this;
            setInterval(
                () => {app.updateInbox()},
                2500
            )
        },
        methods: {
            updateInbox() {
                requests.getInbox(this.$store.state.user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        this.inbox = [];
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

    .focused {
        font-weight: bold;
        color: #445E93;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
</style>