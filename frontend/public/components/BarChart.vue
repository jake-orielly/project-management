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
                        backgroundColor: ["rgba(220,0,0,0.5)", "rgba(0,220,0,0.5)", "rgba(0,0,220,0.5)", "rgba(220,220,0,0.5)", "rgba(220,0,220,0.5)", "rgba(0,220,220,0.5)"], 
                        hoverBackgroundColor: ["rgba(220,0,0,0.8)", "rgba(0,220,0,0.8)", "rgba(0,0,220,0.8)", "rgba(220,220,0,0.8)", "rgba(220,0,220,0.8)", "rgba(0,220,220,0.8)"], 
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
                this.dates = {}
                for (let i of responseDates)
                    if (this.dates[i] != undefined)
                        this.dates[i]++;
                    else
                        this.dates[i] = 1
            }
        }
    }
</script>