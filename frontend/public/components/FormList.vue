<template>
    <div>
        <div id="form-container">
            <div id="scope-container">
                <p class="bold">Scope</p>
                <p v-for="scope in scopes" v-bind:key="scope" 
                    :class="{'buzz-bold':curr_scope == scope}" class="clickable"
                    @click="scopeChange(scope)">{{scope}}</p>
            </div>
            <div v-for="form in forms" v-bind:key="form.name" class="form">
                <p class="title">
                    {{form.name}}
                </p>
                <p class="description">
                    {{"This is a form."}}
                </p>
                <p class="icon-row">
                    <font-awesome-icon icon="pencil-alt" @click="edit(form)" class="clickable"/>
                    <font-awesome-icon icon="reply" @click="showResponses(form)" class="clickable"/>
                    <font-awesome-icon icon="paperclip" @click="copyUrl(form)" class="clickable"/>
                    <font-awesome-icon icon="times" @click="deleteForm(form)" class="clickable"/>
                </p>
                <div class="star-container">
                    <font-awesome-icon icon="star" v-if="form.favorited" @click="unFavorite(form.id)" class="clickable"/>
                    <font-awesome-icon :icon="['far', 'star']" v-if="!form.favorited" @click="favorite(form.id)" class="clickable outline"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import requests from '../services/requests.js';

    export default {
        components: {
            FontAwesomeIcon
        },
        props: {
            targetUser: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                forms: [],
                scopes:["Mine","Team","Orginization"],
                curr_scope:"Mine"
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
                        let form = JSON.parse(response.responseText)[0];
                        this.$parent.formTitle = form.title;
                        for (let i of form.fields) {
                            this.$parent.fields.push(i)
                        }
                    }
                )
            },
            updateFormList() {
                this.forms = [];
                requests.getUserForms(this.targetUser,this.curr_scope).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        for (let form of responseData) {
                            this.forms.push({name:form.title,id:form._id});
                        }
                    }
                )
            },
            scopeChange(value) {
                this.curr_scope = value;
                this.updateFormList();
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
            },
            favorite(formId) {
                const matchedId = (element) => element.id == formId;
                let index = this.forms.findIndex(matchedId);
                this.$set(this.forms[index], 'favorited', true)
            },
            unFavorite(formId) {
                const matchedId = (element) => element.id == formId;
                let index = this.forms.findIndex(matchedId);
                this.$set(this.forms[index], 'favorited', false)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../scss/_variables.scss";

    #scope-container {
        margin-top: 1rem;
        margin-left: 3rem;
        text-align: left;
    }

    #form-container {
        display: grid;
        grid-template-columns: 15% 25% 25% 25%;
        grid-gap: 10px;

    }
    .form {
        position: relative;
        height: 13rem;
        border: 3px solid $buzz-blue;
        border-radius: 1rem;

        .icon-row {
            position: absolute;
            width: 100%;
            bottom: 1rem;

            * {
                margin-left: 0.5rem;
            }
        }

        .star-container {
            position: absolute;
            right: 1rem;
            bottom:1rem;

            .fa-star {
                color: $buzz-yellow;

                &.outline {
                    color:$buzz-grey;
                }
            }
        }

        .icon-row, .star-container span {
            font-size: 1.15rem;
        }

        .title {
            font-size: 1.25rem;
            font-weight: 700;
        }

        .description {
            font-size: 1.15rem;
        }
    }
</style>