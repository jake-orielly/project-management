<template>
    <div>
        <div v-if="modalTint" id="modal-tint"></div>
        <TopBanner active="forms"></TopBanner>
        <div v-if="!formPreview" id="form-creation">
            <div v-if="formSaved">
                <FormList ref="FormList" v-bind:targetUser="$store.state.user"></FormList>
                <FormResponses ref="formResponses"></FormResponses>
                <div class="create-button-container">
                    <button @click="createForm">Create Form</button>
                </div>
            </div>
            <div v-if="!formSaved">
                <FieldAdd></FieldAdd>
                <RecordFieldAdd></RecordFieldAdd>
            </div>
            <FormCreation
                @saveForm="saveForm"
                @closeForm="closeForm"
            ></FormCreation>
        </div>
        <FormDisplay v-bind:preview="true"></FormDisplay>
    </div>
</template>

<script>
    import '../css/style.css'
    import requests from '../services/requests.js';
    import TopBanner from '../components/TopBanner.vue';
    import FieldAdd from '../components/FieldAdd.vue';
    import FormCreation from '../components/FormCreation.vue';
    import FormDisplay from '../components/FormDisplay.vue';
    import FormList from '../components/FormList.vue';
    import FormResponses from '../components/FormResponses.vue';
    import RecordFieldAdd from '../components/RecordFieldAdd.vue';

    export default {
        components: {
            TopBanner,
            FieldAdd,
            FormCreation,
            FormDisplay,
            FormList,
            FormResponses,
            RecordFieldAdd
        },
        data () {
            return {
                currTab: "dashboard",
                fields: [
                    ],
                taskList: [],
                formTitle: "",
                formPreview: false,
                formSaved: true,
                draggingPos: undefined,
                draggingField: undefined,
                modalTint: false,
                recordFields: []
            }
        },
        mounted() {
            this.updateTaskList();
            let app = this;
            setInterval(
                () => {app.updateTaskList()},
                2500
            )
        },
        methods: {
            updateTaskList() {
                requests.getTasks(this.$store.state.user).then(
                    response => {
                        let responseData = JSON.parse(response.responseText);
                        this.taskList = [];
                        for (let response of responseData) {
                            this.taskList.push({
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
            saveForm() {
                let form = {};
                form.title = this.formTitle;
                form.fields = this.fields.slice();
                form.record_fields = this.recordFields;
                
                requests.retrieveForm(
                    {"title":this.formTitle},
                    this.$store.state.user
                ).then(
                    response => {
                        if (!JSON.parse(response.responseText).length) {
                            requests.postForm(form,this.$store.state.user).then(
                                () => {
                                    this.formSaved = true;
                                    this.$refs.FormList.updateFormList("mine"); 
                                }
                            );
                        }
                        else {
                            requests.patchForm(form,this.$store.state.user).then(
                                () => {
                                    this.formSaved = true;
                                }
                            );
                        }
                        this.recordFields = [];
                    }
                );
            },
            closeForm() {
                this.formSaved = true;
                this.fields = [];
                this.formTitle = "";
            },
            createForm() {
                this.fields = [];
                this.formSaved = false;
                this.formTitle = "";
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

    .create-button-container {
        text-align: center;
    }
</style>