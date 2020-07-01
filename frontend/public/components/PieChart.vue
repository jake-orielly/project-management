<template>
    <div>
        <canvas id="my-chart" width="100" height="100"></canvas>
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
        mounted() {
            new Chart(document.getElementById('my-chart'), {
                type: 'pie',
                data: {
                    labels: ["Green", "Blue", "Gray", "Purple", "Yellow"],
                    datasets: [
                    {
                        backgroundColor: [
                            "#0ecc71",
                            "#3498db",
                            "#95a5a6",
                            "#9b59b6",
                            "#f1c40f"
                        ],
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