<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <Banner></Banner>
        <div v-if="!formPreview" id="form-creation">
            <FormList ref="FormList" v-bind:targetUser="$store.state.user"></FormList>
            <FormResponses ref="formResponses"></FormResponses>
            <FieldAdd></FieldAdd>
            <FormCreation></FormCreation>
        </div>
        <FormDisplay v-bind:preview="true"></FormDisplay>
    </div>
</template>

<script>
    import '../css/style.css'
    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';
    import FieldAdd from '../components/FieldAdd.vue';
    import FormCreation from '../components/FormCreation.vue';
    import FormDisplay from '../components/FormDisplay.vue';
    import FormList from '../components/FormList.vue';
    import FormResponses from '../components/FormResponses.vue';

    export default {
        components: {
            Banner,
            FieldAdd,
            FormCreation,
            FormDisplay,
            FormList,
            FormResponses
        },
        data () {
            return {
                currTab: "dashboard",
                fields: [
                    ],
                inbox: [],
                formTitle: "",
                formPreview: false,
                formSaved: true,
                draggingPos: undefined,
                draggingField: undefined,
                modalTint: false,
            }
        },
        mounted() {
            this.updateInbox();
            let app = this;
            setInterval(
                () => {app.updateInbox()},
                2500
            )
        },
        methods: {
            updateInbox() {
                requests.getInbox(this.$store.state.user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        this.inbox = [];
                        for (let response of responseData) {
                            this.inbox.push({
                                "description": "Give Estimate",
                                "from": "Leslie Knope",
                                "title":response.form_title,
                                "fields":response
                            })
                        }
                    }
                )
            },
            showForm(formName) {
                this.$refs.formResponses.loadForm(formName);
            },
            caps: function(text) {
                if (!text)
                    return text;
                return text[0].toUpperCase() + text.substr(1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    #dashboard {
        height: 90vh;
        display: grid;
        grid-template-columns: 2fr 1fr;
        margin-right: 2rem;
    
        & div {
            margin-top: 1rem;
        }
    }

    #modal-tint {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #00000066;
        z-index: 1;
    }
</style>