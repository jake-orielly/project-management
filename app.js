var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!',
        currField: '',
        fieldTypes: ['text','number','date','dropdown','slider'],
        numDropdownFields: 0,
        fields: [],
        currTab: "dashboard",
        inbox: [
            {
                description: 'Give Estimate',
                from: 'Ann Perkins',
                arrived: new Date(2020, 4, 13)  
            },
            {
                description: 'Confirm Completion',
                from: 'Andy Dwyer',
                arrived: new Date(2020, 4, 12)  
            }
        ],
        taskList: [
            {
                description: 'Marketing Campaign',
                from: 'Leslie Knope',
                estimate:25,
                arrived: new Date(2020, 4, 12),
                due: new Date(2020, 4, 19)
            },
            {
                description: 'Design Dashboard',
                from: 'Ann Perkins',
                estimate:25,
                arrived: new Date(2020, 4, 13),
                due: new Date(2020, 4, 23)
            },
            {
                description: 'Prototype Mockups',
                from: 'Ron Swanson',
                estimate:8,
                arrived: new Date(2020, 4, 11),
                due: new Date(2020, 4, 15)
            }
        ],
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
    },
    mounted() {
        this.updateWorkload();
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
                currTask = taskList.shift();
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
                        console.log(workload)
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