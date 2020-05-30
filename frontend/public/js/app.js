var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        currField: '',
        fieldTypes: ['text','number','text (long)','date','dropdown','multi-select','slider'],
        numDropdownFields: 0,
        numMultiSelectFields: 0,
        fields: [],
        currTab: "dashboard",
        inbox: [],
        taskList: [],
        calendarDays: 31,
        daysOfWeek: ["Su","Mo","Tu","We","Th","Fr","Sa"],
        weekendClass: "weekend-cell",
        blankDateClass: "blank-cell",
        pastDateClass: "past-cell",
        monthOffset: 5,
        monthLength: 31,
        monthStartDayOfWeek: 4  ,
        today: new Date(),
        workload: [],
        formTitle: "",
        formPreview: false,
        formSaved: false,
        estimating: undefined,
        dayShowing: undefined,
        dayHighlighted: {},
        dayHighlightedClass: 'cell-highlighted',
        draggingPos: undefined,
        draggingField: undefined,
    },
    mounted() {
        this.updateWorkload();
        this.updateInbox();
    },
    methods: {
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
            postForm(form).then(
                response => {
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
        calendarToDate(row,col) {
            return row * 7 + col - this.monthOffset + 1;
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
            app.fields.splice(app.fields.indexOf(field),1);
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
            let targetInner, targetLabel, targetPos, targetField;
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
            
        },
        onDragEnterMultiSelect(event) {
            
        },
        updateInbox() {
            getUserForms("ann_perkins").then(
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
            app.currField = "";
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
})

class InboxItem {
    constructor(description,from,due,estimate) {
        this.description = description;
        this.from = from;
        this.due = due;
        this.estimate = estimate;
        this.danger = false;
    }
}