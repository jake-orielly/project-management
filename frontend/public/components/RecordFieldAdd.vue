<template>
    <div id="record-field-container">
        <p>Add a record field:</p>
        <autocomplete :suggestions="recordFields.map(field => field.label)"></autocomplete>
        <div v-if="fieldInput">
            <p v-for="(field, ind) in matchingFields" 
                v-bind:key="field.id"
                :class="{'selected' : ind == selectedField}"

            >
                {{field.label}}
            </p>
        </div>
        <p>
            Mandatory:
            <input type="checkbox" v-model="fieldMandatory" id="field-mandatory" checked>
        </p>
        <br>
        <button id="field-add" @click="fieldAdd">Add</button>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js'
    import Autocomplete from '../components/Autocomplete.vue';

    export default {
        components: {
            FontAwesomeIcon,
            Autocomplete
        },
        data() {
            return {
                recordFields: [],
                fieldInput:"",
                selectedField:0,
                autocompleteVal:"",
                fieldMandatory:false
            }
        },
        methods: {
            fieldAdd: function() {
                let recordField = this.recordFields.filter(
                    field => field.label == this.autocompleteVal
                )[0];
               
                if (!recordField) {
                    alert("Record field not found");
                    return;
                }

                let newField = {
                    label: recordField.label,
                    type: recordField.type,
                    mandatory: this.fieldMandatory,
                    id: recordField.id,
                    recordField: true
                };

                this.$parent.fields.push(newField);
                this.$parent.recordFields.push(recordField.id);
                this.autocompleteVal = "";
            },
        },
        mounted() {
            requests.getRecordFields().then(
                response => {
                    this.recordFields = JSON.parse(response.response);
                }
            )
        }
    }
</script>

<style lang="scss" scoped>
#record-field-container {
    display: inline-block;
    margin-left: 2em;
    margin-top: 1em;
    padding: 1rem;
    border: 3px solid #2C666E;
    border-radius: 1rem;
}

.selected {
    background-color: red;
}
</style>