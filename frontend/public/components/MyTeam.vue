<!-- eslint-disable -->
<template>
    <div>
        <div id="team-container" v-if="!formPreview">
            <div class="clickable">
                <div class="user-forms-container" v-for="user in myTeam" v-bind:key="user.name">
                    <p class="user-name">
                        {{user.name}}
                    </p>
                    <div v-if="!user.open" class="open-icon">
                        <span @click="toggleForms(user)">
                            <i class="fa fa-plus"></i>
                        </span>
                    </div>
                    <span v-if="user.open" @click="toggleForms(user)">
                        <i class="fa fa-minus"></i>
                    </span>
                    <div v-if="user.open">
                        <p class="clickable" v-for="form in forms" v-bind:key="form.name" @click="requestForm(form.name)">{{form.name}}</p>
                        <TaskList ref="taskList" v-bind:user="user.name" v-bind:mine="false"></TaskList>
                        <Calendar ref="calendar" v-bind:user="user.name"></Calendar>
                    </div>
                </div>
            </div>
        </div>
        <FormDisplay v-bind:preview="false"></FormDisplay>
    </div>
</template>

<script>
    import '../css/style.css'

    import '@fortawesome/fontawesome-free/css/all.css'
    import '@fortawesome/fontawesome-free/js/all.js'

    import requests from '../services/requests.js';
    import FormDisplay from '../components/FormDisplay.vue';
    import Calendar from '../components/Calendar.vue';
    import TaskList from '../components/TaskList.vue';

    export default {
        components: {
            FormDisplay,
            Calendar,
            TaskList
        },
        data () {
            return {
                forms: [],
                formPreview: false,
                currForm: "",
                myTeam: [],
            }
        },
        mounted () {
            requests.getUserTeam(this.$store.state.user).then(
                response => {
                    let responseData = JSON.parse(response.responseText).data;
                    for (let i of JSON.parse(responseData))
                        this.myTeam.push({
                            name:i,
                            open:false
                        });
                }
            )
        },
        methods: {
            toggleForms(user) {
                if (!user.open) {
                    this.getForms(user)
                    user.open = true;
                }
                else {
                    this.forms = [];
                    user.open = false;
                }
            },
            getForms(user) {
                requests.getUserForms(user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText).data;
                        for (let form of responseData) {
                            this.forms.push({name:JSON.parse(form).title});
                        }
                    }
                )
            },
            requestForm(formName) {
                this.currForm = formName;
                requests.retrieveForm(
                    {"title":formName},
                    this.$store.state.user
                ).then(
                    response => {
                        let responseText = JSON.parse(response.responseText);
                        let form = JSON.parse(responseText.data);
                        this.formTitle = form.title;
                        this.fields = form.fields;
                        this.openFormPreview()
                    }
                )
            },
            openFormPreview() {
                this.formPreview = true;
            },
            closeFormPreview() {
                this.formPreview = false;
            },
        }
    }
</script>

<style lang="scss" scoped>
    #team-container {
        margin: 2em;
        font-size: 1.5rem;
    }

    .user-name {
        display: inline-block;
        margin-right: 1rem;
    }

    .open-icon {
        display: inline-block;
    }
</style>