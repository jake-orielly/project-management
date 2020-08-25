<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner></Banner>
        <div id="dashboard">
            <Inbox></Inbox>
            <Calendar ref="calendar" v-bind:user="$store.state.user"></Calendar>
            <TaskList ref="taskList" v-bind:user="$store.state.user" v-bind:mine="true"></TaskList>
            <TaskStatusModal ref="taskStatusModal"></TaskStatusModal>
            <History></History>
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
                modalTint: false
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
    #dashboard {
        height: 90vh;
        display: grid;
        grid-template-columns: 2fr 1fr;
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