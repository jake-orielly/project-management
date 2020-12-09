<template>
    <div id="field-input-container">
        <p>Add a field:</p>
        <p>
            Type:
            <select id="field-dropdown" v-model="currField">
                <option v-bind:value="field" v-for="field in fieldTypes" v-bind:key="field">{{$parent.caps(field)}}</option>
            </select>
        </p>
        <p>
            Label: 
            <input type="text" v-model="fieldLabel" id="field-label">
        </p>
        <p>
            Mandatory:
            <input type="checkbox" v-model="fieldMandatory" id="field-mandatory" checked>
        </p>
        <ul v-if="currField == 'binary'">
            <li>
                <input type="text" class="binary-label" placeholder="Yes">
            </li>
            <li>
                <input type="text" class="binary-label" placeholder="No">
            </li>
        </ul>
        <ul v-if="currField == 'dropdown'">
            <li>
                <button id="dropdown-add" @click="dropdownAdd">Add Dropdown Option</button>
            </li>
            <li v-for="field in numDropdownFields" v-bind:key="field">
                <input type="text" class="currDropdownOption" placeholder="New Dropdown Option">
            </li>
        </ul>
        <ul v-if="currField == 'multi-select'">
            <li>
                <button id="dropdown-add" @click="multiSelectAdd">Add Selection Option</button>
            </li>
            <li v-for="selection in [...Array(numMultiSelectFields).keys()]" 
            v-bind:key="selection"
            draggable 
            @dragstart='onDragMultiSelect(field)' 
            @dragenter='onDragEnterMultiSelect($event)' 
            @dragover.prevent 
            @dragenter.prevent
            >
                <input type="checkbox" class="multi-select-input">
                <input type="text" class="multi-select-label" placeholder="New Item Label">
                <font-awesome-icon icon="bars" class="clickable"/>
            </li>
        </ul>
        <div v-if="currField == 'slider'">
            <p>
                Min: 
                <input type="number" v-model="sliderMin" id="slider-min">
            </p>
            <p>
                Max
                <input type="number" v-model="sliderMax" id="slider-max">
            </p>
            <p>
                Step
                <input type="number" v-model="sliderStep" id="slider-step">
            </p>
            <p>
                Initial
                <input type="number" v-model="sliderInitial" id="slider-initial">
            </p>
        </div>
        <div v-if="currField == 'db field'">
            <select id="db-field-dropdown" v-model="selectedDbField">
                <option v-bind:value="field.name" v-for="field in dbFields" v-bind:key="field.name">
                    {{field.name}}
                </option>
            </select>
        </div>
        <br>
        <button id="field-add" @click="fieldAdd">Add</button>
    </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import requests from '../services/requests.js';

    export default {
        components: {
            FontAwesomeIcon
        },
        data() {
            return {
                fieldTypes: ["text","number","text (long)","date","binary","dropdown","multi-select","slider","db field", "file upload"],
                currField: "",
                numDropdownFields: 0,
                numMultiSelectFields: 0,
                fieldLabel:"",
                fieldMandatory:true,
                sliderMin:0,
                sliderMax:0,
                sliderStep:0,
                sliderInitial:0,
                dbFields:[],
                selectedDbField: ""
            }
        },
        mounted() {
            requests.getDbFields().then(
                response => {
                    this.dbFields = JSON.parse(response.responseText);
                }
            );
        },
        methods: {
            fieldAdd: function() {
                let newField = {
                    label: this.fieldLabel,
                    type: this.currField,
                    mandatory: this.fieldMandatory,
                    id: this.idGenerator(),
                    recordField: false
                };
                if (this.currField == 'binary') 
                    newField = this.addBinaryField(newField);
                else if (this.currField == 'dropdown')
                    newField = this.addDropdownField(newField);
                else if (this.currField == "multi-select") 
                    newField = this.addMultiField(newField);
                else if (this.currField == 'slider')
                    newField = this.addSliderField(newField);

                this.$parent.fields.push(newField);

                this.currField = "";
                this.fieldLabel = "";
            },
            addBinaryField(newField) {
                newField.options = [];
                for (let i of document.getElementsByClassName("binary-label")) {
                    newField.options.push(i.value);
                    i.value = "";
                }
                return newField;
            },
            addDropdownField(newField) {
                newField.options = [];
                for (let i of document.getElementsByClassName("currDropdownOption"))
                    newField.options.push(i.value);
                this.numDropdownFields = 0;
                return newField;
            },
            addMultiField(newField) {
                newField.options = [];
                for (let i of document.getElementsByClassName("multi-select-input"))
                    newField.options.push(i.value);
                this.numMultiSelectFields = 0;
                return newField;
            },
            addSliderField(newField) {
                newField.slider = {};
                newField.slider.min = this.sliderMin;
                newField.slider.max = this.sliderMax;
                newField.slider.step = this.sliderStep;
                newField.slider.initial = this.sliderInitial;
                return newField;
            },
            idGenerator() {
                const S4 = () => {
                    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
                };
                return (S4()+"-"+S4()+"-"+S4()+"-"+S4());
            },
            dropdownAdd: function() {
                this.numDropdownFields++;
            },
            multiSelectAdd: function() {
                this.numMultiSelectFields++;
            },
            onDragMultiSelect(item) {
                return item
            },
            onDragEnterMultiSelect(event) {
                return event
            },
        }
    }
</script>

<style lang="scss" scoped>
@import "../scss/_variables.scss";

#field-input-container {
    display: inline-block;
    margin-left: 2em;
    margin-top: 1em;
    padding: 1rem;
    border: 3px solid $buzz-blue;
    border-radius: 1rem;

    p {
        margin: 0.25rem;
    }
}
</style>