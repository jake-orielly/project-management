<template>
    <div id="form-list">
        <p class="title">My Forms</p>
        <select id="form-list-scope" @change="scopeChange">
            <option value="mine">Mine</option>
            <option value="team">Team</option>
            <option value="orginization">Orginization</option>n>
        </select>
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
             <span class="clickable" @click="deleteForm(form)">
                <i class="fa fa-times"></i>
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
            this.updateFormList("mine");
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
                        let form = JSON.parse(response.responseText)[0];
                        this.$parent.formTitle = form.title;
                        for (let i of form.fields) {
                            this.$parent.fields.push(i)
                        }
                    }
                )
            },
            updateFormList(scope) {
                let parsedForm;
                this.forms = [];
                requests.getUserForms(this.targetUser,scope).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        for (let form of responseData) {
                            this.forms.push({name:form.title,id:form._id});
                        }
                    }
                )
            },
            scopeChange() {
                let scope = document.getElementById("form-list-scope").value;
                this.updateFormList(scope);
            },
            showResponses(form) {
                this.$parent.showForm(form.name);
            },
            deleteForm(form) {
                let confirmation = confirm("Are you sure you want to delete your form: " + form.name + "?");
                if (confirmation) {
                    requests.deleteForm(form.id,this.$store.state.user).then(
                        () => {
                            this.updateFormList();
                        }
                    );
                }
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