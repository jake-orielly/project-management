<template>
    <div>
        <canvas id="my-chart" width="100" height="100"></canvas>
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
        mounted() {
            this.createChart()
        },
        methods: {
            refreshChart() {
                this.split();
            },
            createChart() {
                if (this.chart)
                    this.chart.destroy()
                this.chart = new Chart(document.getElementById('my-chart'), {
                    type: 'pie',
                    data: {
                        labels: ["Responses"],
                        datasets: [
                        {
                            backgroundColor: [
                                "#0ecc71",
                                "#3498db",
                                "#95a5a6",
                                "#9b59b6",
                                "#f1c40f",
                                "#17cce0",
                                "#bd8943",
                                "#6a5a59",
                                "#6b95b9",
                                "#f04c1f",
                            ],
                            data: [1]
                        }
                        ]
                    },
                    options: {
                        responsive: true
                    }
                });
            },
            split() {
                let split = document.getElementById("split-select").value;

                let dataObj = {}
                for (let i of this.filteredResponses)
                    if (dataObj[i.fields[split]])
                        dataObj[i.fields[split]]++
                    else
                        dataObj[i.fields[split]] = 1
                this.chart.data.labels = Object.keys(dataObj)
                this.chart.data.datasets[0].data = Object.values(dataObj);
                this.chart.update();
            }
        }
    }
</script>