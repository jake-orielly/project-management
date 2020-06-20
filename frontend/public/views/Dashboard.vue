<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner></Banner>
        <div v-if="currTab == 'dashboard'" id="dashboard">
            <Inbox></Inbox>
            <Calendar ref="calendar" v-bind:user="$store.state.user"></Calendar>
            <TaskList ref="taskList" v-bind:user="$store.state.user" v-bind:mine="true"></TaskList>
            <TaskStatusModal ref="taskStatusModal"></TaskStatusModal>
            <History></History>
        </div>
        <div v-if="currTab == 'myForms' && !formPreview" id="form-creation">
            <FormList ref="FormList" v-bind:targetUser="$store.state.user"></FormList>
            <FormResponses ref="formResponses"></FormResponses>
            <FieldAdd></FieldAdd>
            <FormCreation></FormCreation>
        </div>
        <div v-if="currTab == 'myTeam' && !formPreview" id="myTeam">
            <MyTeam></MyTeam>
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
    import MyTeam from '../components/MyTeam.vue';
    import FormResponses from '../components/FormResponses.vue';

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
            History,
            MyTeam,
            FormResponses
        },
        data () {
            return {
                currTab: "dashboard",
                fields: [
                    ],
                inbox: [],
                formTitle: "",
                formPreview: false,
                formSaved: true,
                draggingPos: undefined,
                draggingField: undefined,
                modalTint: false,
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
                        let responseData = JSON.parse(JSON.parse(response.responseText).data);
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