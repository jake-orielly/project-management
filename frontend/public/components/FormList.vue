<template>
    <div id="form-list">
        <p class="title">My Forms</p>
        <p v-for="form in forms" v-bind:key="form.name">
            {{form.name}}
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
                let url = "http://23.254.164.217:8081/#/forms/" + form.id;
                const el = document.createElement('textarea');
                el.value = url;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                alert("Url copied to clipboard")
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
    }

    .title {
        text-decoration: underline;
        font-weight: bold;
    }
</style>