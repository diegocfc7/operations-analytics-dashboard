/* =========================================================
   OPERATIONS ANALYTICS DASHBOARD
   Dynamic chart management
   ========================================================= */

Chart.defaults.font.family =
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif';

Chart.defaults.color = "#667085";


let performanceChart;
let nonConversionChart;


/* =========================================================
   PERFORMANCE CHART
   ========================================================= */

function renderPerformanceChart(data) {

    const context =
        document.getElementById(
            "performanceChart"
        );

    if (performanceChart) {
        performanceChart.destroy();
    }

    performanceChart =
        new Chart(context, {

            type: "bar",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {
                        type: "bar",

                        label:
                            "Operations",

                        data:
                            data.operations,

                        backgroundColor:
                            "rgba(37, 99, 235, 0.18)",

                        borderColor:
                            "#2563eb",

                        borderWidth: 1,

                        borderRadius: 6,

                        yAxisID: "y"
                    },

                    {
                        type: "line",

                        label:
                            "Conversion Rate",

                        data:
                            data.conversion,

                        borderColor:
                            "#0f3d91",

                        backgroundColor:
                            "#0f3d91",

                        borderWidth: 3,

                        pointRadius: 4,

                        pointHoverRadius: 6,

                        tension: 0.35,

                        yAxisID: "y1"
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {
                    mode: "index",
                    intersect: false
                },

                plugins: {

                    legend: {
                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },

                    tooltip: {

                        callbacks: {

                            label(context) {

                                if (
                                    context.dataset.label ===
                                    "Conversion Rate"
                                ) {

                                    return (
                                        ` Conversion: ${context.raw}%`
                                    );
                                }

                                return (
                                    ` Operations: ${context.raw}`
                                );
                            }
                        }
                    }
                },

                scales: {

                    y: {

                        beginAtZero: true,

                        grid: {
                            color:
                                "rgba(148, 163, 184, 0.15)"
                        },

                        title: {
                            display: true,
                            text: "Operations"
                        }
                    },

                    y1: {

                        position: "right",

                        beginAtZero: true,

                        suggestedMax: 50,

                        grid: {
                            drawOnChartArea: false
                        },

                        ticks: {

                            callback(value) {
                                return value + "%";
                            }
                        },

                        title: {
                            display: true,
                            text: "Conversion"
                        }
                    },

                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
}


/* =========================================================
   NON-CONVERSION CHART
   ========================================================= */

function renderNonConversionChart(data) {

    const context =
        document.getElementById(
            "nonConversionChart"
        );

    if (nonConversionChart) {
        nonConversionChart.destroy();
    }

    nonConversionChart =
        new Chart(context, {

            type: "doughnut",

            data: {

                labels:
                    data.labels,

                datasets: [

                    {
                        data:
                            data.values,

                        backgroundColor: [
                            "#0f3d91",
                            "#2563eb",
                            "#60a5fa",
                            "#93c5fd",
                            "#bfdbfe",
                            "#dbeafe"
                        ],

                        borderWidth: 0,

                        hoverOffset: 8
                    }

                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                cutout: "68%",

                plugins: {

                    legend: {

                        position: "bottom",

                        labels: {
                            usePointStyle: true,
                            padding: 14,
                            boxWidth: 8
                        }
                    },

                    tooltip: {

                        callbacks: {

                            label(context) {

                                return (
                                    ` ${context.label}: ${context.raw}%`
                                );
                            }
                        }
                    }
                }
            }
        });
}
