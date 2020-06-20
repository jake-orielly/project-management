<template>
    <div id="form-list">
        <p class="title">My Forms</p>
        <p v-for="form in forms" v-bind:key="form.name">
            {{form.name}}
            <span class="clickable" @click="edit(form)">
                <i class="fa fa-pencil-alt"></i>
            </span>
            <span class="clickable" @click="showResponses(form)">
                <i class="fa fa-reply"></i>
            </span>
            <span class="clickable" @click="copyUrl(form)">
                <i class="fa fa-paperclip"></i>
            </span>
        </p>
    </div>
</template>

<script>
    import requests from '../services/requests.js';

    export default {
        props: {
            targetUser: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                forms: [],
            }
        },
        mounted() {
            this.updateFormList();
        },
        methods: {
            copyUrl(form) {
                let url = "http://23.254.164.217:8081/#/forms/" + this.$store.state.user + "/" + form.id;
                const el = document.createElement('textarea');
                el.value = url;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                alert("Url copied to clipboard")
            },
            edit(form) {
                this.$parent.formSaved = false;
                requests.retrieveForm(
                    {"title":form.name},
                    this.$store.state.user
                ).then(
                    response => {
                        let responseText = JSON.parse(response.responseText);
                        let form = JSON.parse(responseText.data[0]);
                        this.$parent.formTitle = form.title;
                        for (let i of form.fields) {
                            this.$parent.fields.push(i)
                        }
                    }
                )
            },
            updateFormList() {
                let parsedForm;
                this.forms = [];
                requests.getUserForms(this.targetUser).then(
                    response => {
                        let responseData = JSON.parse(response.responseText).data;
                        for (let form of responseData) {
                            parsedForm = JSON.parse(form);
                            this.forms.push({name:parsedForm.title,id:parsedForm._id});
                        }
                    }
                )
            },
            showResponses(form) {
                this.$parent.showForm(form.name);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #form-list {
        width: 90%;
        margin-left: 2em;
        margin-top: 1em;
        padding: 1rem;
        border: 3px solid #2C666E;
        border-radius: 1rem;
        font-size: 1.15rem;
    }

    .title {
        text-decoration: underline;
        font-weight: bold;
    }

    span {
        margin-left: 0.25rem;
    }
</style>