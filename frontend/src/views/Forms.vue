<template>
    <div id="form-display-container">
        <FormDisplay v-bind:preview="false"></FormDisplay>
        <p class="submit-text" v-if="!currForm">Your response has been submitted.</p>
    </div>
</template>

<script>
    import requests from '../services/requests.js';
    import FormDisplay from '../components/FormDisplay.vue';
    
    export default {
        components: {
            FormDisplay,
        },
        data () {
            return {
                formPreview: false,
                user: this.$route.params.user,
                currForm: this.$route.params.formId,
                formTitle: "",
                fields: []
            }
        },
        mounted() {
            requests.retrieveForm(
                {"id":this.currForm},
                this.user
            ).then(
                response => {
                    let form = JSON.parse(response.responseText)[0];
                    let dbFields = form.fields.filter(f => f.type == "db field");
                    let apiDbFields;
                    this.formTitle = form.title;
                    this.currForm = this.formTitle;
                    this.fields = form.fields;
                    if (dbFields.length) {
                        requests.getDbFields().then(
                            response => {
                                apiDbFields = JSON.parse(response.responseText);
                                for (let field of dbFields)
                                    field.options = apiDbFields.filter(
                                        apiField => apiField.name.toLowerCase() == field.label.toLowerCase()
                                    )[0].options;
                                this.openFormPreview()
                            }
                        )
                    }
                    else
                        this.openFormPreview()
                }
            )
        },
        methods: {
            openFormPreview() {
                this.formPreview = true;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .submit-text {
        text-align: center;
        margin-top: 4em;
        font-size: 1.5rem;
    }
</style>