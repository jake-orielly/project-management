<template>
    <div>
        <p>
            <autocomplete :suggestions="sortedForms.map(form => form.name)" id="search-bar"></autocomplete>
        </p>
        <div id="form-container">
            <div id="scope-container">
                <p class="bold">Scope</p>
                <p v-for="scope in scopes" v-bind:key="scope" 
                    :class="{'buzz-bold':currScope == scope}" class="clickable"
                    @click="scopeChange(scope)">{{scope}}</p>
            </div>
            <div id="form-container-inner">
                <div v-for="form in filteredForms" v-bind:key="form.name" class="form">
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
                        <font-awesome-icon icon="star" v-if="isFavorited(form)" @click="unFavorite(form)" class="clickable"/>
                        <font-awesome-icon :icon="['far', 'star']" v-if="!isFavorited(form)" @click="favorite(form)" class="clickable outline"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import requests from '../services/requests.js';
    import Autocomplete from '../components/Autocomplete.vue';

    export default {
        components: {
            FontAwesomeIcon,
            Autocomplete
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
                currScope:"Mine",
                favoriteForms:[],
                autocompleteVal:""
            }
        },
        computed: {
            sortedForms: function() {
                let app = this;
                let forms = this.forms;
                function compare(a, b) {
                    let aIndex = app.favoriteForms.indexOf(a.name);
                    let bIndex = app.favoriteForms.indexOf(b.name); 
                    if (aIndex != -1 && bIndex == -1)
                        return -1;
                    else if (aIndex == -1 && bIndex != -1)
                        return 1;
                    else
                        if (a.name > b.name)
                            return 1;
                        else if (b.name > a.name)
                            return -1
                        else
                            return 0;
                }
                forms = forms.sort(compare);
                return forms;
            },
            filteredForms: function() {
                return this.sortedForms.filter(form => {
                    console.log(this.autocompleteVal)
                    return form.name.toLowerCase().match(this.autocompleteVal.toLowerCase());
                });
            }
        },
        mounted() {
            this.updateFormList();
            requests.getFavoriteForms(this.$store.state.user).then(
                response => {
                    this.favoriteForms = JSON.parse(response.responseText);
                }
            );
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
                requests.getUserForms(this.targetUser,this.currScope).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        for (let form of responseData)
                            this.forms.push({name:form.title,id:form._id});
                    }
                )
            },
            scopeChange(value) {
                this.currScope = value;
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
            isFavorited(form) {
                return this.favoriteForms.indexOf(form.name) != -1;
            },
            favorite(form) {
                this.favoriteForms.push(form.name);
                requests.postFavoriteForms(this.$store.state.user,"favorite",form.name);
            },
            unFavorite(form) {
                this.favoriteForms.splice(this.favoriteForms.indexOf(form.name),1);
                requests.postFavoriteForms(this.$store.state.user,"unfavorite",form.name)
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
        grid-template-columns: 15% 80%;
        grid-gap: 10px;

    }

    #form-container-inner {
        display: grid;
        grid-template-columns: 30% 30% 30%;
        grid-gap: 2rem;

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

    #search-bar {
        float: right;
        margin-right: 10%;
    }
</style>