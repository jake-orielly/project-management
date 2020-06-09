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
                currForm: this.$route.params.formId,
                formTitle: "",
                fields: []
            }
        },
        mounted() {
            requests.retrieveForm(
                {"id":this.currForm}
            ).then(
                response => {
                    let responseText = JSON.parse(response.responseText);
                    let form = JSON.parse(responseText.data[0])[0];
                    this.formTitle = form.title;
                    this.currForm = this.formTitle;
                    this.fields = form.fields;
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