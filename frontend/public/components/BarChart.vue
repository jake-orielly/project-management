<template>
    <div>
        <canvas id="my-chart" width="100" height="100" @click="refreshChart"></canvas>
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
                console.log(1)
                this.refreshChart();
            }
        },
        data() {
            return {
                dates: {},
                startDate: undefined,
                endDate: undefined
            }
        },
        computed: {
            chartEl: function() {
                return document.getElementById('my-chart')
            }
        },
        mounted() {
            this.updateDates();  
            this.chart = new Chart(this.chartEl, {
                type: 'bar',
                data: {
                    labels: Object.keys(this.dates),
                    datasets: [
                    {
                        label: 'Responses',
                        data: Object.values(this.dates),
                        backgroundColor: this.getColors(Object.values(this.dates),0.5), 
                        hoverBackgroundColor: this.getColors(Object.values(this.dates),0.8), 
                    }
                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        labels: {
                            boxWidth: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        },
        methods: {
            refreshChart() {
                this.updateDates(); 
                this.chart.data.labels = Object.keys(this.dates)
                this.chart.data.datasets[0].data = Object.values(this.dates)
                this.chart.update();
            },
            updateDates() {
                let responseDates = this.filteredResponses.slice(0).sort().reverse().map(response => {
                    return response.due_date
                })

                if (!this.startDate) {
                    this.startDate = responseDates[0];
                    this.endDate = responseDates[responseDates.length - 1]
                }

                this.dates = {}
                let lastDate = undefined;
                for (let i of responseDates) {
                    if (this.dates[i] != undefined)
                        this.dates[i]++;
                    else
                        this.dates[i] = 1
                    let count = 0;
                    while (!(new Date(i).getDate() - new Date(lastDate).getDate() <= 1) && lastDate != undefined) {
                        lastDate = this.incrementDate(lastDate);
                        this.dates[lastDate] = 0;
                    }
                    lastDate = i;
                }
            },
            incrementDate(date) {
                let newDate = date.slice(0,date.length-2) + (parseInt(date.slice(date.length-2)) + 1);
                return newDate;
            },
            getColors(dates,opacity) {
                let colors = [
                 "rgba(220,0,0," + opacity + ")",
                 "rgba(0,220,0," + opacity + ")",
                 "rgba(0,0,220," + opacity + ")",
                 "rgba(220,220,0," + opacity + ")",
                 "rgba(220,0,220," + opacity + ")",
                 "rgba(0,220,220," + opacity + ")"
                ];
                let colorPos = 0;
                let colorArr = [];
 
                for (let i of dates)
                    if (i == 0)
                        colorArr.push([""])
                    else {
                        colorArr.push(colors[colorPos])
                        colorPos++;
                    }
                return colorArr;
            }
        }
    }
</script>