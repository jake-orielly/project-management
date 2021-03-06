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
            responses: {
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
                    "0,220,220",
                    "110,110,0",
                    "0,110,110"
                ],
                startDate: this.responses[this.responses.length - 1].due_date,
                endDate: this.responses[0].due_date
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
                this.createChart();
                this.split();
            },
            createChart() {
                if (this.chart)
                    this.chart.destroy()
                this.chart = new Chart(this.chartEl, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(this.dates),
                        datasets: [{
                            label: 'Responses',
                            data: Object.values(this.dates),
                            backgroundColor: this.getColor(0,0.5), 
                            hoverBackgroundColor: this.getColor(0,0.8), 
                        }],
                    },
                    options: {
                        responsive: true,
                        chartArea: {
                            backgroundColor: 'rgba(255,255,255,1)'
                        },
                        legend: {
                            labels: {
                                fontColor: "black",
                                fontSize: 18,
                                fontStyle: "bold"
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
                let lastDate = this.startDate;
                let dates = {};
                let emergencyCutoff = 0
                while (lastDate != this.endDate && emergencyCutoff < 15) {
                    emergencyCutoff++;
                    dates[lastDate] = 0
                    lastDate = this.incrementDate(lastDate);
                }
                dates[lastDate] = 0

                for (let i of responseDates)
                        dates[i]++;
                
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

                this.chart.data.datasets = [];

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
                    for (let split in splitData) {
                        dataset = {
                            label: splitData[split].label,
                            data:[],
                            backgroundColor: this.getColor(colorCount,0.5), 
                            hoverBackgroundColor: this.getColor(colorCount,0.8), 
                        }
                        colorCount++;
                        dataset.data = Object.values(this.datesToHistogram(splitData[split].dates.sort()))
                        this.chart.data.datasets.push(dataset);
                    }
                    this.chart.update();
                }
            }
        }
    }

    Chart.pluginService.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                var helpers = Chart.helpers;
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;

                ctx.save();
                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(0, 0, parseInt(ctx.canvas.style.height), parseInt(ctx.canvas.style.width));
                ctx.restore();
            }
        }
    });
</script>