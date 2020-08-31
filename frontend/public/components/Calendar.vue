<template>
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
                    <tr v-for="row in [0,1,2,3,4,5]" v-bind:key="row">
                        <td v-for="col in [0,1,2,3,4,5,6]" v-bind:key="col" v-bind:class="[dayHighlighted[calendarToDate(row,col)] ? dayHighlightedClass : '']">
                            <div @click="showDay(row,col)" class="calendar-cell clickable" 
                                v-bind:class="[
                                isWeekend(calendarToDate(row,col))? weekendClass : '',(calendarToDate(row,col) < 1 || 
                                calendarToDate(row,col) > monthLength)? blankDateClass : '',
                                (today.getDate() > calendarToDate(row,col) ? pastDateClass : ''),
                                workloadClasses(calendarToDate(row,col))]"
                            >
                                {{dayInMonth(row,col) ? calendarToDate(row,col) :''}}
                            </div>
                            <div class="date-info" 
                            v-if="dayShowing == calendarToDate(row,col) && workload[calendarToDate(row,col)].tasks.length">
                                <div class="date-info-inner">
                                    <div class="close-icon-container" @click="hideDay">
                                        <i class="fa fa-times clickable"></i>
                                    </div>
                                    <p v-for="task in workload[calendarToDate(row,col)].tasks" v-bind:key="task.hash">
                                        {{task.name + ": " + task.time + " hours"}}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            user: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                daysOfWeek: ["Su","Mo","Tu","We","Th","Fr","Sa"],
                dayShowing: undefined,
                monthStartOffset: 0,
                monthLength: 0,
                weekendClass: "weekend-cell",
                blankDateClass: "blank-cell",
                pastDateClass: "past-cell",
                today: "",
                workload: [],
                dayHighlighted: {},
                dayHighlightedClass: 'cell-highlighted',
            }
        },
        created() {
            this.today = new Date();
            let firstOfTheMonth = new Date();
            firstOfTheMonth.setDate(1);
            this.monthStartOffset = firstOfTheMonth.getDay();
            this.monthLength = new Date(this.today.getYear(),this.today.getMonth(),0).getDate()
        },
        methods: {
            showDay(row,col) {
                this.dayShowing = this.calendarToDate(row,col);
            },
            hideDay() {
                this.dayShowing = undefined;
            },
            isWeekend(day) {
                let dayOfWeek = this.daysOfWeek[(this.monthStartOffset - 1 + day) % this.daysOfWeek.length];
                return (dayOfWeek == "Sa" || dayOfWeek == "Su");
            },
            calendarToDate(row,col) {
                return row * 7 + col - this.monthStartOffset + 1;
            },
            dayInMonth(row,col) {
                return (this.calendarToDate(row,col) > 0 && this.calendarToDate(row,col) <= this.monthLength);
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
            updateWorkload(givenTaskList) {
                let workload = [];
                let taskList = givenTaskList.slice().filter(task => task.status == "In Progress");
                let currTask;
                let currDay = this.today.getDate();
                let availibleHours;
                taskList = taskList.sort(
                    (a,b) => new Date(a.due_date) < new Date(b.due_date) ? -1 : 1
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
                        else if (new Date(currTask.due_date).getDate() + 1 > currDay) {
                            if (workload[currDay].remaining) {
                                workload[currDay].tasks.push({name:currTask.description, time:parseInt(workload[currDay].remaining)});
                                currTask.estimate -= (workload[currDay].remaining);
                                workload[currDay].remaining = 1;
                            }
                            currDay++;

                        }
                        else {
                            for (let j = currDay; j >= this.today.getDate(); j--) {
                                if (this.isWeekend(j)) {
                                    j--;
                                }
                                else if (new Date(currTask.due_date).getDate() + 1 == currDay) {
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
                            console.log(currDay)
                        }
                    }
                }
                this.workload = workload;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .close-icon-container {
        text-align: right;
    }
</style>