<template>
    <div id="form-display-container">
        <FormDisplay v-bind:preview="false"></FormDisplay>
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

</style>