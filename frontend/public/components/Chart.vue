<template>
    <div>
        <canvas id="my-chart" width="100" height="100" @click="ping"></canvas>
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
        data() {
            return {
                dates: undefined
            }
        },
        mounted() {
            let responseDates = this.filteredResponses.sort().map(response => {
                return response.due_date
            })

            this.dates = {}

            for (let i of responseDates)
                if (this.dates[i] != undefined)
                    this.dates[i]++;
                else
                    this.dates[i] = 1

            console.log(Object.values(this.dates))
            new Chart(document.getElementById('my-chart'), {
                type: 'bar',
                data: {
                    labels: Object.keys(this.dates),
                    datasets: [
                    {
                        label: '2018 Sales',
                        data: Object.values(this.dates)
                    }
                    ]
                },
                options: {
                    responsive: true
                }
            });
        },
        methods: {
            ping() {
                console.log(this.filteredResponses)
            }
        }
    }
</script>