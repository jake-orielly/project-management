<!-- eslint-disable -->
<template>
    <div>
        <Banner v-bind:user="'Leslie Knope'"></Banner>
        <div id="team-container" v-if="!formPreview">
        <div class="clickable" @click="toggleForms('ann_perkins')">
            <p>
                Ann Perkins
                <div v-if="!formsOpen">
                    <p>
                        <i class="fa fa-plus"></i>
                    </p>
                </div>
                <div v-if="formsOpen">
                    <p>
                        <i class="fa fa-minus"></i>
                    </p>
                </div>
            </p>
            <p class="clickable" v-for="form in forms" v-bind:key="form.name" @click="requestForm(form.name)">{{form.name}}</p>
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

    export default {
        components: {
            Banner,
            FormDisplay,
        },
        data () {
            return {
                forms: [],
                formsOpen: false,
                formPreview: false,
                currForm: "",
            }
        },
        computed: {
        },
        methods: {
            toggleForms(user) {
                if (!this.formsOpen) {
                    this.getForms(user)
                    this.formsOpen = true;
                }
                else {
                    this.forms = [];
                    this.formsOpen = false;
                }
                console.log(this.formsOpen)
            },
            getForms(user) {
                requests.getUserForms(user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText).data;
                        for (let form of responseData) {
                            this.forms.push({name:JSON.parse(form).title});
                        }
                        console.log(this.forms)
                    }
                )
            },
            requestForm(formName) {
                this.currForm = formName;
                requests.retrieveForm(formName).then(
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
            toLabel(s) {
                return s.replace(/ /g,'_').toLowerCase();
            }
        }
    }
</script>