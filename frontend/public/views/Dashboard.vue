<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner></Banner>
        <div v-if="currTab == 'dashboard'" id="dashboard">
            <Inbox></Inbox>
            <Calendar ref="calendar"></Calendar>
            <TaskList ref="taskList" v-bind:user="$store.state.user" v-bind:mine="true"></TaskList>
            <TaskStatusModal ref="taskStatusModal"></TaskStatusModal>
            <History></History>
        </div>
        <div v-if="currTab == 'myForms' && !formPreview" id="form-creation">
            <FormList v-bind:targetUser="$store.state.user" ref="FormList"></FormList>
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
            MyTeam
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
                modalTint: false
            }
        },
        mounted() {
            this.updateInbox();
        },
        methods: {
            updateInbox() {
                this.inbox = [];
                requests.getInbox(this.$store.state.user).then(
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