var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        currField: '',
        fieldTypes: ['text','number','text (long)','date','dropdown','slider'],
        numDropdownFields: 0,
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
        formSaved: false
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
                workload.push(8);
            while (taskList.length) {
                currTask = Object.assign({}, taskList.shift());
                while (currTask.estimate > 0) {
                    if (this.isWeekend(currDay)) {
                        currDay++;
                    }
                    else if (workload[currDay] >= currTask.estimate) {
                        workload[currDay] -= currTask.estimate;
                        currTask.estimate = 0;
                    }
                    else if (currTask.due.getDate() > currDay) {
                        if (workload[currDay]) {
                            currTask.estimate -= (workload[currDay] - 1);
                            workload[currDay] = 1;
                        }
                        currDay++;
                    }
                    else {
                        for (let j = currDay; j >= this.today.getDate(); j--) {
                            if (this.isWeekend(j)) {
                                j--;
                            }
                            else if (workload[j] > 0) {
                                availibleHours = workload[j];
                                workload[j] = Math.max(0, workload[j] - currTask.estimate);
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
        isWeekend(day) {
            let dayOfWeek = this.daysOfWeek[(this.monthStartDayOfWeek + day) % this.daysOfWeek.length];
            return (dayOfWeek == "Sa" || dayOfWeek == "Su");
        },
        workloadClasses(day) {
            let hours = this.workload[day]
            if (hours <= 0)
                return "red-day"
            else if (hours <= 1)
                return "yellow-day"
            else if (hours < 6)
                return "green-day";
        },
        calendarToDate(row,col) {
            return row * 7 + col - this.monthOffset + 1;
        },
        openInboxItem(item) {
            this.taskList.push(
                {
                    description: (item.response[0]),
                    from: 'Leslie Knope',
                    due: new Date(item.response[1]),
                    estimate:4
                },
            )
            this.inbox.splice(this.inbox.indexOf(item),1);
            this.updateWorkload();
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
                            "response":r
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
        caps: function(text) {
            if (!text)
                return text;
            return text[0].toUpperCase() + text.substr(1);
        }
    }
})