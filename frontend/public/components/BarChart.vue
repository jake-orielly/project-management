<template>
    <div>
        <canvas id="my-chart" width="100" height="100" @click="refreshChart"></canvas>
        <select v-on:change="split" id="split-select">
            <option value="not split">Not Split</option>
            <option v-bind:value="field" v-for="field in Object.keys(this.filteredResponses[0].fields)" v-bind:key="field">
                {{field}}
            </option>
        </select>
    </div>
</template>

<script>
    import Chart from 'chart.js';

    export default {
        props: {
            filteredResponses: {
                type: Array,
                required: true
            },
        },
        watch: { 
            filteredResponses: function() {
                this.refreshChart();
            }
        },
        data() {
            return {
                dates: {},
                colors:[
                    "220,0,0",
                    "0,220,0",
                    "0,0,220",
                    "220,220,0",
                    "220,0,220",
                    "0,220,220"
                ]
            }
        },
        computed: {
            chartEl: function() {
                return document.getElementById('my-chart')
            }
        },
        mounted() {
            this.updateDates();
            this.createChart();
        },
        methods: {
            refreshChart() {
                this.updateDates();
                this.chart.data.labels = Object.keys(this.dates)
                this.chart.data.datasets[0].data = Object.values(this.dates);
                this.chart.update();
            },
            createChart() {
                this.chart = new Chart(this.chartEl, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(this.dates),
                        datasets: [{
                            label: 'Responses',
                            data: Object.values(this.dates),
                            backgroundColor: this.getColor(0,0.5), 
                            hoverBackgroundColor: this.getColor(0,0.8), 
                        }]
                    },
                    options: {
                        responsive: true,
                        legend: {
                            labels: {
                                boxWidth: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                stacked: true
                            }],
                            yAxes: [{
                                stacked: true,
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                });
            },
            updateDates() {
                this.dates = this.datesToHistogram(
                    this.filteredResponses.slice(0).sort().reverse().map(
                        response => {
                            return response.due_date
                        }
                    )
                );  
            },
            datesToHistogram(responseDates) {
                let startDate = this.filteredResponses[this.filteredResponses.length - 1].due_date;
                let endDate = this.filteredResponses[0].due_date;
                let dates = {}
                let lastDate = startDate;

                for (let i of responseDates) {
                    if (dates[i] != undefined)
                        dates[i]++;
                    else
                        dates[i] = 1
                    while (!(new Date(lastDate).getDate() - new Date(i).getDate() < 0)) {
                        lastDate = this.incrementDate(lastDate);
                        dates[lastDate] = 0;
                    }
                    lastDate = i;
                }

                while (!(new Date(endDate).getDate() - new Date(lastDate).getDate() <= 0)) {
                    lastDate = this.incrementDate(lastDate);
                    dates[lastDate] = 0;
                }
                
                return dates;
            },
            incrementDate(date) {
                let newDate = date.slice(0,date.length-2) + (parseInt(date.slice(date.length-2)) + 1);
                return newDate;
            },
            getColor(num,opacity) {
                return "rgba(" + this.colors[num] + "," + opacity + ")"
            },
            split() {
                let split = document.getElementById("split-select").value;
                let splitData = {};
                let currSplit, dataset;

                this.chart.data.datasets.forEach((dataset) => {
                    dataset.data.pop();
                });

                if (split == "not split") {
                    this.updateDates();
                    this.createChart();
                }
                else {
                    for (let response of this.filteredResponses) {
                        currSplit =  response.fields[split];

                        if (!splitData[currSplit]) 
                            splitData[currSplit] = {
                                label:currSplit,
                                dates:[response.due_date]
                            }
                        else 
                            splitData[currSplit].dates.push(response.due_date)

                    }
                    
                    let colorCount = 0;
                    this.chart.data.datasets = []
                    for (let split in splitData) {
                        dataset = {
                            label: splitData[split].label,
                            data:[],
                            backgroundColor: this.getColor(colorCount,0.5), 
                            hoverBackgroundColor: this.getColor(colorCount,0.8), 
                        }
                        colorCount++;
                        console.log(this.datesToHistogram(splitData[split].dates.sort()))
                        dataset.data = Object.values(this.datesToHistogram(splitData[split].dates.sort())).reverse()
                        this.chart.data.datasets.push(dataset);
                        this.chart.update();
                    }
                }
            }
        }
    }
</script>