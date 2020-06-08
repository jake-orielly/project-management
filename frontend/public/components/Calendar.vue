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
                        <td v-for="col in [0,1,2,3,4,5,6]" v-bind:key="col" v-bind:class="[ $parent.dayHighlighted[calendarToDate(row,col)] ? $parent.dayHighlightedClass : '']">
                            <div @click="showDay(row,col)" class="calendar-cell clickable" 
                                v-bind:class="[
                                isWeekend(calendarToDate(row,col))? weekendClass : '',(calendarToDate(row,col) < 1 || 
                                calendarToDate(row,col) > monthLength)? blankDateClass : '',
                                (new Date() > new Date(2020, 5, calendarToDate(row,col), 23) ? pastDateClass : ''),
                                workloadClasses(calendarToDate(row,col))]"
                            >
                                {{dayInMonth(row,col) ? calendarToDate(row,col) :''}}
                            </div>
                            <div class="date-info" 
                            v-if="dayShowing == calendarToDate(row,col) && $parent.workload[calendarToDate(row,col)].tasks.length">
                                <div class="date-info-inner">
                                    <div class="close-icon-container" @click="hideDay">
                                        <i class="fa fa-times clickable"></i>
                                    </div>
                                    <p v-for="task in $parent.workload[calendarToDate(row,col)].tasks" v-bind:key="task.name">
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
        data() {
            return {
                daysOfWeek: ["Su","Mo","Tu","We","Th","Fr","Sa"],
                dayShowing: undefined,
                monthStartOffset: 1,
                monthLength: 30,
                calendarDays: 30,
                weekendClass: "weekend-cell",
                blankDateClass: "blank-cell",
                pastDateClass: "past-cell",
            }
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
                if (this.$parent.workload[day])
                    hours = this.$parent.workload[day].remaining;
                else
                    return;
                if (hours <= 0)
                    return "red-day"
                else if (hours <= 1)
                    return "yellow-day"
                else if (hours < 8)
                    return "green-day";
            },
        }
    }
</script>

<style lang="scss" scoped>
    .close-icon-container {
        text-align: right;
    }
</style>