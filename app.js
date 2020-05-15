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
                description: 'Design Dashboard',
                from: 'Ann Perkins',
                arrived: new Date(2020, 4, 13),
                due: new Date(2020, 4, 17)
            }
        ],
        calendarDays: 31,
        days: ["Su","Mo","Tu","We","Th","Fr","Sa"],
        weekendClass: "weekend-cell",
        blankDateClass: "blank-cell",
        pastDateClass: "past-cell",
        monthOffset: 5,
        monthLength: 31
    },
    computed: {
        dailyWorkload() {
            return [];
        }
    },
    methods: {
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