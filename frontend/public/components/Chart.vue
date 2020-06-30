<template>
    <div>
        <canvas id="my-chart" width="100" height="100"></canvas>
    </div>
</template>

<script>
    import Chart from 'chart.js';

    export default {
        mounted() {
            new Chart(document.getElementById('my-chart'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datasets: [
                    {
                        label: '2018 Sales',
                        data: [300, 700, 450, 750, 450]
                    }
                    ]
                },
                options: {
                    responsive: true
                }
            });
        },
    }
</script>