<template>
    <div id="field-input-container" v-if="!$parent.formSaved">
        <p>Add a field:</p>
        <p>
            Type:
            <select id="field-dropdown" v-model="currField">
                <option v-bind:value="field" v-for="field in fieldTypes" v-bind:key="field">{{$parent.caps(field)}}</option>
            </select>
        </p>
        <p>
            Label: 
            <input type="text" id="field-label">
        </p>
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
                <i class="fa fa-bars clickable"></i>
            </li>
        </ul>
        <div v-if="currField == 'slider'">
            <p>
                Min: 
                <input type="number" id="slider-min">
            </p>
            <p>
                Max
                <input type="number" id="slider-max">
            </p>
            <p>
                Step
                <input type="number" id="slider-step">
            </p>
            <p>
                Initial
                <input type="number" id="slider-initial">
            </p>
        </div>
        <br>
        <button id="field-add" @click="fieldAdd">Add</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fieldTypes: ['text','number','text (long)','date','dropdown','multi-select','slider'],
                currField: '',
                numDropdownFields: 0,
                numMultiSelectFields: 0,
            }
        },
        methods: {
            fieldAdd: function() {
                let newField = {
                    label: document.getElementById("field-label").value,
                    type: document.getElementById("field-dropdown").value
                };

                if (this.currField == 'dropdown') {
                    newField.options = [];
                    for (let i of document.getElementsByClassName("currDropdownOption"))
                        newField.options.push(i.value);
                    this.numDropdownFields = 0;
                    
                }

                else if (this.currField == "multi-select") {
                    newField.options = [];
                    for (let i of document.getElementsByClassName("multi-select-input"))
                        newField.options.push(i.value);
                    this.numMultiSelectFields = 0;
                }

                else if (this.currField == 'slider') {
                    newField.slider = {};
                    newField.slider.min = document.getElementById("slider-min").value;
                    newField.slider.max = document.getElementById("slider-max").value;
                    newField.slider.step = document.getElementById("slider-step").value;
                    newField.slider.initial = document.getElementById("slider-initial").value;
                }

                this.$parent.fields.push(newField);

                document.getElementById("field-dropdown").value = "";
                this.currField = "";
                document.getElementById("field-label").value = "";
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

</style>