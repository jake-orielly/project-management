<template>
    <div>
        <div id="topbar">
            <img src="images/logo.png" id="logo-img">
            <p class="clickable" @click="setTab('dashboard')">Dashboard</p>
            <p class="clickable" @click="setTab('myForms')">My Forms</p>
            <img src="images/avatar.png" id="avatar-img">
            <p id="user-name">Ann Perkins</p>
        </div>
        <div v-if="currTab == 'dashboard'" id="dashboard">
            <div id="inbox">
                <div v-if="estimating == undefined">
                    <p class="title">Inbox</p>
                    <ul>
                        <li v-for="item in inbox" v-bind:key="item.title">
                            <div class="dashboard-card">
                                <p @click="openInboxItem(item)">{{item.description}}: {{item.title}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div id="estimate-container" v-if="estimating != undefined">
                    <p class="title">Estimate Task</p>
                    <p>{{estimating.response.description}}</p>
                    <p><input type="number" id="estimate-input"></p>
                    <button @click="submitEstimate">Submit</button>
                </div>
            </div>
            <div id="calendar">
                <p class="title">Calendar</p>
                <div id="calendar-table-container">
                    <table id="calendar-table" cellspacing="0">
                        <thead>
                            <tr>
                                <th v-for="day in daysOfWeek" v-bind:key="day">{{day}}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in [...Array(6).keys()]" v-bind:key="row">
                                <td v-for="col in [...Array(7).keys()]" v-bind:key="col" v-bind:class="[ dayHighlighted[calendarToDate(row,col)] ? dayHighlightedClass : '']">
                                    <div @click="showDay(row,col)" class="calendar-cell clickable" 
                                        v-bind:class="[
                                        (col == 0 || col == 6)? weekendClass : '',(calendarToDate(row,col) < 1 || 
                                        calendarToDate(row,col) > monthLength)? blankDateClass : '',
                                        (new Date() > new Date(2020, 4, calendarToDate(row,col), 23) ? pastDateClass : ''),
                                        workloadClasses(calendarToDate(row,col))]"
                                    >
                                        {{dayInMonth(row,col) ? calendarToDate(row,col) :''}}
                                    </div>
                                    <div class="date-info" 
                                    v-if="dayShowing == calendarToDate(row,col) && workload[calendarToDate(row,col)].tasks.length">
                                        <div class="date-info-inner">
                                            <p v-for="task in workload[calendarToDate(row,col)].tasks" v-bind:key="task.name">
                                                {{task.name + ": " + task.time + " hours"}}
                                            </p>
                                            <i class="fa fa-times clickable" @click="hideDay"></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div id="taskList">
                <p class="title">My Tasks</p>
                <ul>
                    <li v-for="task in taskList" @click="taskClick(task)" v-bind:key="task.name">
                        <div class="dashboard-card" :class="[task.danger ? 'card-danger' : '']">
                            <p>{{task.description}}</p>
                        </div>
                    </li>
                </ul>
            </div>
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
        <div id="form-preview-modal" v-if="formPreview">
            <i class="fa fa-times form-preview-close" style="font-size:2rem; color:#2C666E;" @click="closeFormPreview"></i>
            <p class="title">{{formTitle}}</p>
            <div v-for="field in fields" class="form-field" v-bind:key="field.label">
                <p> {{field.label}}
                    <input v-if="field.type == 'text'" type="text">
                    <input v-if="field.type == 'number'" type="number">
                    <textarea v-if="field.type == 'text (long)'" type="number"></textarea>
                    <input v-if="field.type == 'date'" type="date">
                    <select v-if="field.type == 'dropdown'">
                        <option v-for="option in field.options" value="option" v-bind:key="option">{{option}}</option>
                    </select>
                    <input v-if="field.type == 'slider'" type="range" 
                        :min="field.slider.min" 
                        :max="field.slider.max" 
                        :value="field.slider.initial" 
                        :step="field.slider.step" 
                        class="slider" id="myRange">
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import '../css/login.css'
    import requests from '../services/requests.js';
    //import app_js from '../js/app.js'

    export default {
        data () {
            return {
                currTab: "dashboard",
                monthOffset: 5,
                monthLength: 31,
                estimating: undefined,
                currField: '',
                fieldTypes: ['text','number','text (long)','date','dropdown','multi-select','slider'],
                numDropdownFields: 0,
                numMultiSelectFields: 0,
                fields: [],
                inbox: [],
                taskList: [],
                calendarDays: 31,
                daysOfWeek: ["Su","Mo","Tu","We","Th","Fr","Sa"],
                weekendClass: "weekend-cell",
                blankDateClass: "blank-cell",
                pastDateClass: "past-cell",
                monthStartDayOfWeek: 4  ,
                today: new Date(),
                workload: [],
                formTitle: "",
                formPreview: false,
                formSaved: false,
                dayShowing: undefined,
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
            calendarToDate(row,col) {
                return row * 7 + col - this.monthOffset + 1;
            },
            dayInMonth(row,col) {
                return (this.calendarToDate(row,col) > 0 && this.calendarToDate(row,col) <= this.monthLength);
            },
            taskClick(task) {
            this.dayHighlighted = {};
            for (let i = 0; i < this.workload.length; i++)
                if (this.workload[i].tasks.filter(item => item.name == task.description).length)
                    this.dayHighlighted[i] = true;
        },
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
        closeFormPreview() {
            this.formPreview = false;
        },
        showDay(row,col) {
            this.dayShowing = this.calendarToDate(row,col);
        },
        hideDay() {
            this.dayShowing = undefined;
        },
        isWeekend(day) {
            let dayOfWeek = this.daysOfWeek[(this.monthStartDayOfWeek + day) % this.daysOfWeek.length];
            return (dayOfWeek == "Sa" || dayOfWeek == "Su");
        },
        workloadClasses(day) {
            let hours;
            if (this.workload[day])
                hours = this.workload[day].remaining;
            else
                return;
            if (hours <= 0)
                return "red-day"
            else if (hours <= 1)
                return "yellow-day"
            else if (hours < 8)
                return "green-day";
        },
        openInboxItem(item) {
            this.estimating = item;
        },
        submitEstimate() {
            this.taskList.push(
                new InboxItem
                (
                    this.estimating.response.description,
                    'Leslie Knope',
                    new Date(this.estimating.response.due_date),
                    document.getElementById("estimate-input").value
                ),
            )
            this.inbox.splice(this.inbox.indexOf(this.estimating),1);
            this.estimating = undefined;
            this.updateWorkload();
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
        setTab: function(newTab) {
            this.currTab = newTab;
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

class InboxItem {
    constructor(description,from,due,estimate) {
        this.description = description;
        this.from = from;
        this.due = due;
        this.estimate = estimate;
        this.danger = false;
    }
}
</script>