<!-- eslint-disable -->
<template>
    <div>
        <Banner></Banner>
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
                    <div v-if="user.open" id="user-container">
                        <p class="clickable" v-for="form in forms.filter(form => form.creator == user.name)" v-bind:key="form.name" @click="requestForm(form.name)">{{form.name}}</p>
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
    import Banner from '../components/Banner.vue';
    import FormDisplay from '../components/FormDisplay.vue';
    import Calendar from '../components/Calendar.vue';
    import TaskList from '../components/TaskList.vue';

    export default {
        components: {
            Banner,
            FormDisplay,
            Calendar,
            TaskList
        },
        data () {
            return {
                forms: [],
                formPreview: false,
                currForm: "",
                myTeam: [{
                    name:this.$store.state.user,
                    open:false
                }],
            }
        },
        mounted () {
            requests.getUserTeam(this.$store.state.user).then(
                response => {
                    for (let i of JSON.parse(response.responseText))
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
                    this.getForms(user.name)
                    user.open = true;
                }
                else {
                    this.forms = [];
                    user.open = false;
                }
            },
            getForms(user) {
                requests.getUserForms(user,"mine").then(
                    response => {
                        for (let form of JSON.parse(response.responseText))
                            this.forms.push({name:form.title,creator:user});
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
                        let form = JSON.parse(response.responseText)[0];
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