<template>
    <div>
        <Banner></Banner>
        <div id="team-container" v-if="!formPreview">
            <p class="clickable" @click="toggleForms('ann_perkins')">
                Ann Perkins
                <i class="fa fa-plus" v-if="forms.length == 0"></i>
                <i class="fa fa-minus" v-if="forms.length != 0"></i>
            </p>
            <p class="clickable" v-for="form in forms" v-bind:key="form.name" @click="requestForm(form.name)">{{form.name}}</p>
        </div>
        <div id="form-preview-modal" v-if="formPreview">
            <i class="fa fa-times form-preview-close" style="font-size:2rem; color:#2C666E;" @click="closeFormPreview"></i>
            <p class="title">{{formTitle}}</p>
            <div v-for="field in fields" v-bind:key="field.label" class="form-field">
                <p> 
                    {{field.label}}
                    <input v-if="field.type == 'text'" :data-label="toLabel(field.label)" type="text">
                    <input v-if="field.type == 'number'" :data-label="toLabel(field.label)" type="number">
                    <textarea v-if="field.type == 'text (long)'" :data-label="toLabel(field.label)" type="number"></textarea>
                    <input v-if="field.type == 'date'" :data-label="toLabel(field.label)" type="date">
                    <select v-if="field.type == 'dropdown'" :data-label="toLabel(field.label)">
                        <option v-for="option in field.options" v-bind:key="option" :value="option">{{option}}</option>
                    </select>
                    <input v-if="field.type == 'slider'" :data-label="toLabel(field.label)" type="range" 
                        :min="field.slider.min" 
                        :max="field.slider.max" 
                        :value="field.slider.initial" 
                        :step="field.slider.step" 
                        class="slider" id="myRange">
                </p>
            </div>
            <button @click="submitForm">Submit</button>
        </div>
    </div>
</template>

<script>
    import '../css/style.css'

    import '@fortawesome/fontawesome-free/css/all.css'
    import '@fortawesome/fontawesome-free/js/all.js'

    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';

    export default {
        components: {
            Banner,
        },
        data () {
            return {
                forms: [],
                formPreview: false,
                currForm: "",
            }
        },
        computed: {
        },
        methods: {
            toggleForms(user) {
                if (this.forms.length == 0)
                    this.getForms(user)
                else
                    this.forms = []
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
            submitForm() {
                let fields = document.querySelectorAll('input,select');
                let response = {};
                for (let i of fields) {
                    response[i.dataset.label] = i.value;
                }
                console.log(response)
                requests.submitResponse(this.currForm,response);
                this.formPreview = false;
                this.currForm = "";
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