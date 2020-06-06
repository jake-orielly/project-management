<template>
    <div>
        <banner></banner>
        <div v-if="currTab == 'dashboard'" id="dashboard">
            <Inbox></Inbox>
            <Calendar></Calendar>
            <TaskList></TaskList>
        </div>
        <div v-if="currTab == 'myForms' && !formPreview" id="form-creation">
            <div id="field-input-container" v-if="!formSaved">
                <p>Add a field:</p>
                <p>
                    Type:
                    <select id="field-dropdown" v-model="currField">
                        <option v-bind:value="field" v-for="field in fieldTypes" v-bind:key="field">{{caps(field)}}</option>
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
                    <li v-for="option in [...Array(numDropdownFields).keys()]" v-bind:key="option">
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
            <div id="form-container">
                <div id="form-content" v-if="!formSaved">
                    <input placeholder="Form Title" type="text" id="form-title" autocomplete="off" v-model="formTitle">
                    <i class="fa fa-eye eye-icon" style="font-size:2rem; color:#2C666E;" @click="openFormPreview"></i>
                    <i class="fa fa-save save-icon" style="font-size:2rem; color:#2C666E;" @click="saveForm"></i>
                    <p v-if="fields.length == 0">Add some content to your form!</p>
                    <div v-for="field in fields" class="field-card" v-bind:key="field.label"
                    draggable 
                    @dragstart='onDrag(field)' 
                    @dragenter='onDragEnter($event)' 
                    @dragover.prevent 
                    @dragenter.prevent>
                        <div class="field-card-inner">
                            <input class="field-label" v-model="field.label" @input="resizeInput(field)">
                            <span class="field-type">{{"(" + caps(field.type) + ")"}}</span>
                            <i class="fa fa-bars clickable"></i>
                            <i class="fa fa-times clickable" @click="deleteField(field)"></i>
                            <ul v-for="option in field.options" v-bind:key="option">
                                <li>{{option}}</li>
                            </ul>
                            <ul v-for="property in (field.slider ? Object.keys(field.slider) : [])" v-bind:key="field.label + property">
                                <li>{{caps(property) + ": " + field.slider[property]}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-if="formSaved">
                    <p>Your form has been saved to the database.</p>
                </div>
            </div>
        </div>
        <FormPreview></FormPreview>
    </div>
</template>

<script>
    import '../css/style.css'
    import requests from '../services/requests.js';
    import Banner from '../components/Banner.vue';
    import Calendar from '../components/Calendar.vue';
    import Inbox from '../components/Inbox.vue';
    import TaskList from '../components/TaskList.vue';
    import FormPreview from '../components/FormPreview.vue';

    export default {
        components: {
            Banner,
            Calendar,
            Inbox,
            TaskList,
            FormPreview
        },
        data () {
            return {
                currTab: "dashboard",
                currField: '',
                fieldTypes: ['text','number','text (long)','date','dropdown','multi-select','slider'],
                numDropdownFields: 0,
                numMultiSelectFields: 0,
                fields: [],
                inbox: [],
                taskList: [],
                today: new Date(),
                workload: [],
                formTitle: "",
                formPreview: false,
                formSaved: false,
                dayHighlighted: {},
                dayHighlightedClass: 'cell-highlighted',
                draggingPos: undefined,
                draggingField: undefined,
            }
        },
        mounted() {
            this.updateWorkload();
            this.updateInbox();
        },
        methods: {
        updateWorkload() {
            let workload = [];
            let taskList = this.taskList.slice();
            let currTask;
            let currDay = this.today.getDate();
            let availibleHours;
            taskList = taskList.sort(
                (a,b) => a.due < b.due ? -1 : 1
            )
            for (let i = 0; i < this.monthLength; i++)  
                workload.push({remaining:8,tasks:[]});
            for (let i of taskList) {
                currTask = Object.assign({}, i);
                i.danger = false;
                while (currTask.estimate > 0) {
                    if (this.isWeekend(currDay)) {
                        currDay++;
                    }
                    else if (workload[currDay].remaining > currTask.estimate) {
                        workload[currDay].tasks.push({name:currTask.description, time:parseInt(currTask.estimate)});
                        workload[currDay].remaining -= currTask.estimate;
                        currTask.estimate = 0;
                    }
                    else if (currTask.due.getDate() + 1 > currDay) {
                        if (workload[currDay].remaining) {
                            workload[currDay].tasks.push({name:currTask.description, time:parseInt(workload[currDay].remaining - 1)});
                            currTask.estimate -= (workload[currDay].remaining - 1);
                            workload[currDay].remaining = 1;
                        }
                        currDay++;
                    }
                    else {
                        for (let j = currDay; j >= this.today.getDate(); j--) {
                            if (this.isWeekend(j)) {
                                j--;
                            }
                            else if (currTask.due.getDate() + 1 == currDay) {
                                workload[currDay].tasks.push({name:currTask.description, time:parseInt(currTask.estimate)});
                                workload[j].remaining -= currTask.estimate;
                                i.danger = true;
                                currTask.estimate = 0;
                                break;
                            }
                            else if (workload[j].remaining > 0) {
                                availibleHours = workload[j].remaining;
                                workload[currDay].tasks.push({name:currTask.description, time:availibleHours});
                                workload[j].remaining = Math.max(0, workload[j].remaining - currTask.estimate);
                                currTask.estimate -= availibleHours;
                                if (currTask.estimate <= 0)
                                    break;
                            }
                        }
                        currDay++;
                    }
                }
            }
            this.workload = workload;
        },
        saveForm() {
            let form = {};
            form.title = this.formTitle;
            form.fields = this.fields.slice();
            requests.postForm(form).then(
                () => {
                    this.formSaved = true;
                }
            );
        },
        openFormPreview() {
            this.formPreview = true;
        },
        resizeInput(field) {
            let fieldIndex = this.fields.indexOf(field);
            let inputs = document.getElementsByClassName("field-label");
            let currInput = inputs[fieldIndex];
            currInput.style.width = (field.label.length * 0.95 + 2) + "ch";
        },
        deleteField(field) {
            this.fields.splice(this.fields.indexOf(field),1);
        },
        onDrag(item) {
            for (let i = 0; i < this.fields.length; i++)
                if (this.fields[i] == item) {
                    this.draggingPos = i;
                    this.draggingField = this.fields[i];
                    break;
                }
        },
        onDragEnter(event) {
            let targetInner, targetLabel, targetPos;
            // Get the value of the input element we're dragging to
            if (event.target.classList.contains("field-card"))
                targetInner = event.target.getElementsByClassName("field-card-inner")[0];
            else if (event.target.classList.contains("field-card-inner"))
                targetInner = event.target;
            else
                targetInner = event.target.parentElement;
            targetLabel = targetInner.getElementsByTagName("input")[0].value;

            // Find it's position in fields
            for (let i = 0; i < this.fields.length; i++)
                if (this.fields[i].label == targetLabel) {
                    targetPos = i;
                    break;
                }
            
            if (targetPos != this.draggingPos) {
                this.fields.splice(this.draggingPos,1);
                this.fields = this.fields.slice(0,targetPos).concat([this.draggingField]).concat(this.fields.slice(targetPos));
                this.draggingPos = targetPos;
            }
        },
        onDragMultiSelect(item) {
            return item
        },
        onDragEnterMultiSelect(event) {
            return event
        },
        updateInbox() {
            requests.getUserForms("ann_perkins").then(
                response => {
                    let responseData = JSON.parse(response.responseText).data;
                    for (let form of responseData) {
                        let responses = JSON.parse(form).responses;
                        let fieldLabels = [];
                        for (let field of JSON.parse(form).fields)
                            fieldLabels.push(field.label);
                        for (let r of responses)
                        this.inbox.push({
                            "description": "Give Estimate",
                            "from": "Leslie Knope",
                            "form":fieldLabels,
                            "response":r,
                            "title":JSON.parse(form).title
                        })
                    }
                }
            )
        },
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

            this.fields.push(newField);

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
        caps: function(text) {
            if (!text)
                return text;
            return text[0].toUpperCase() + text.substr(1);
        }
        }
    }
</script>