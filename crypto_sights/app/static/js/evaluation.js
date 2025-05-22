// // SIDE NAVBAR FUNCTION STARTS
// const sidebar = document.getElementById('sidebar');
// const toggleBtn = document.getElementById('toggleSidebar');
// const toggleIcon = document.getElementById('toggleIcon');
// const mainContent = document.getElementById('mainContent');
// const evalHead = document.getElementById('h-eval');

// if (toggleBtn) {
//     toggleBtn.addEventListener('click', () => {
//         if (sidebar && sidebar.classList.contains('w-64')) {
//             if (evalHead) evalHead.style.display = "none";
//             if (sidebar) sidebar.classList.remove('w-64');
//             if (sidebar) sidebar.classList.add('w-16');
//             if (toggleIcon) {
//                 toggleIcon.classList.remove('fa-angle-double-left');
//                 toggleIcon.classList.add('fa-angle-double-right');
//             }
//             if (sidebar) sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'none');
//             if (mainContent) {
//                 mainContent.classList.remove('ml-64');
//                 mainContent.classList.add('ml-16');
//             }
//         } else {
//             if (evalHead) evalHead.style.display = "";
//             if (sidebar) sidebar.classList.remove('w-16');
//             if (sidebar) sidebar.classList.add('w-64');
//             if (toggleIcon) {
//                 toggleIcon.classList.remove('fa-angle-double-right');
//                 toggleIcon.classList.add('fa-angle-double-left');
//             }
//             if (sidebar) sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'inline');
//             if (mainContent) {
//                 mainContent.classList.remove('ml-16');
//                 mainContent.classList.add('ml-64');
//             }
//         }
//     });
// }

// const barTab = document.getElementById('barBtn');
// if (barTab) {
//     barTab.addEventListener('click', selectTab);
// }

// const confTab = document.getElementById('confBtn');
// if (confTab) {
//     confTab.addEventListener('click', selectTab);
// }

// const lineTab = document.getElementById('lineBtn');
// if (lineTab) {
//     lineTab.addEventListener('click', selectTab);
// }

// const barChartContainer = document.querySelector('.bar-chart-container');
// const confMatrixContainer = document.querySelector('.confusion-matrix-container');
// const lineChartContainer = document.querySelector('.line-chart-container');

// function selectTab(event) {
//     const tabs = [barTab, confTab, lineTab].filter(tab => tab !== null);
//     const charts = [barChartContainer, confMatrixContainer, lineChartContainer].filter(chart => chart !== null);

//     tabs.forEach(tab => {
//         if (tab && tab.querySelector("#icon") && tab.querySelector("#text")) {
//             tab.querySelector("#icon").classList.remove('gradient-text');
//             tab.querySelector("#text").classList.remove('gradient-text');
//         }
//     });

//     charts.forEach(chart => {
//         if (chart) {
//             chart.style.display = 'none';
//         }
//     });

//     const currTab = event.currentTarget;
//     if (currTab && currTab.querySelector("#icon") && currTab.querySelector("#text")) {
//         currTab.querySelector("#icon").classList.add('gradient-text');
//         currTab.querySelector("#text").classList.add('gradient-text');

//         const textContent = currTab.querySelector('#text').innerText;
//         if (textContent.includes("ACCURACY") && barChartContainer) {
//             barChartContainer.style.display = 'flex';
//         } else if (textContent.includes("CONFUSION") && confMatrixContainer) {
//             confMatrixContainer.style.display = 'flex';
//         } else if (textContent.includes("F1") && lineChartContainer) {
//             lineChartContainer.style.display = 'flex';
//         }
//     }
// }

// // CHART.JS PART START

// // data fetch and update function
// function fetchData() {
//     let p = fetch(metricsEndpoint)
//     p.then(res => {
//         return res.json()
//     }).then(data => {
//         console.log("Metrics Data:", data); // Log the fetched data

//         // --- Update Accuracy on evaluation_landing.html ---
//         const accuracyLandingDisplay = document.getElementById('crypto-model-accuracy');
//         if (accuracyLandingDisplay) {
//             const latestMetrics = data[data.length - 1]; // Get the most recent entry
//             const accuracy = latestMetrics.metrics.accuracy;            if (accuracy !== undefined) {
//                 accuracyLandingDisplay.textContent = (accuracy * 100).toFixed(2) + '%';
//             } else {
//                 accuracyLandingDisplay.textContent = 'N/A';
//                 console.warn("Accuracy not found in metrics data.");
//             }
//         }

//         // --- Update Bar Chart on evaluation.html ---
//         const barC = document.getElementById('barChart');
//         if (barC) {
//             const bar = Chart.getChart(barC); // Get existing chart instance
//             if (bar) {
//                 bar.data.datasets[0].data = [accuracy, (1 - accuracy)];
//                 bar.update();
//             } else {
//                 // If chart doesn't exist yet, create it
//                 new Chart(barC, {
//                     type: 'bar',
//                     data: {
//                         labels: ['Accuracy', 'Error Rate'],
//                         datasets: [{
//                             label: 'Performance',
//                             data: [accuracy, (1 - accuracy)],
//                             backgroundColor: ['#bc24c4', 'rgba(119, 119, 119, 0.8)'],
//                         }]
//                     },
//                     options: {
//                         scales: {
//                             y: {
//                                 beginAtZero: true,
//                                 max: 1
//                             }
//                         }
//                     }
//                 });
//             }
//         }

//         // --- Update Confusion Matrix on evaluation.html ---
//         const tnp = document.getElementById('tnp');
//         const tpp = document.getElementById('tpp');
//         const fnp = document.getElementById('fnp');
//         const fpp = document.getElementById('fpp');
//         if (tnp && tpp && fnp && fpp && data.metrics['0']) { // Assuming binary classification and '0' is a class
//             tnp.innerText = data.metrics['0'].TN || 'N/A';
//             tpp.innerText = data.metrics['0'].TP || 'N/A';
//             fnp.innerText = data.metrics['0'].FN || 'N/A';
//             fpp.innerText = data.metrics['0'].FP || 'N/A';
//         }

//         // --- Update Line Chart on evaluation.html ---
//         const lineC = document.getElementById('lineChart');
//         if (lineC && Array.isArray(data)) {
//     const labels = data.map(entry => {
//         const date = new Date(entry.timestamp);
//         return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); // e.g., "22 May"
//     });

//     const precisions = data.map(entry => entry.metrics['macro avg']?.precision || 0);
//     const recalls = data.map(entry => entry.metrics['macro avg']?.recall || 0);
//     const f1s = data.map(entry => entry.metrics['macro avg']?.['f1-score'] || 0);

//     const line = Chart.getChart(lineC);
//             if (line) {
//                 line.data.labels = labels;
//                 line.data.datasets[0].data = precisions;
//                 line.data.datasets[1].data = recalls;
//                 line.data.datasets[2].data = f1s;
//                 line.update();
//             } else {
//                 new Chart(lineC, {
//                     type: 'line',
//                     data: {
//                         labels: labels,
//                         datasets: [
//                             {
//                                 label: 'Precision',
//                                 data: precisions,
//                                 borderColor: '#bc24c4',
//                                 borderWidth: 2,
//                                 tension: 0.4,
//                                 fill: false
//                             },
//                             {
//                                 label: 'Recall',
//                                 data: recalls,
//                                 borderColor: 'rgba(54, 162, 235, 1)',
//                                 borderWidth: 2,
//                                 tension: 0.4,
//                                 fill: false
//                             },
//                             {
//                                 label: 'F1-Score',
//                                 data: f1s,
//                                 borderColor: 'rgba(255, 206, 86, 1)',
//                                 borderWidth: 2,
//                                 tension: 0.4,
//                                 fill: false
//                             }
//                         ]
//                     },
//                     options: {
//                         responsive: true,
//                         plugins: {
//                             legend: {
//                                 display: true,
//                                 position: 'top'
//                             }
//                         },
//                         scales: {
//                             x: {
//                                 grid: {
//                                     color: '#FBF5F3'
//                                 },
//                                 ticks: {
//                                     color: '#FBF5F3'
//                                 }
//                             },
//                             y: {
//                                 beginAtZero: true,
//                                 grid: {
//                                     color: '#FBF5F3'
//                                 },
//                                 ticks: {
//                                     color: '#FBF5F3'
//                                 }
//                             }
//                         }
//                     }
//                 });
//             }
//         }
//     }).catch(error => {
//         console.error("Error fetching metrics:", error);
//         // ...
//     });
// }

// let metricsEndpoint = 'http://127.0.0.1:8000/get_metrics'; // data endpoint
// fetchData();

// // set interval in which you want to call fetchData function
// // setInterval(fetchData, 1000*5) // interval set for 5 secs

// // CHART.JS PART ENDS

// SIDE NAVBAR FUNCTION STARTS
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const toggleIcon = document.getElementById('toggleIcon');
const mainContent = document.getElementById('mainContent');
const evalHead = document.getElementById('h-eval');

// Mobile menu toggle
    const menuButton = document.querySelector('nav button.md\\:hidden');
    const mobileMenu = document.querySelector('nav .hidden.md\\:flex');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function() {
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-dark', 'p-4', 'z-50');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex', 'flex-col', 'absolute', 'top-20', 'left-0', 'right-0', 'bg-dark', 'p-4', 'z-50');
            }
        });
    }


if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        if (sidebar && sidebar.classList.contains('w-64')) {
            if (evalHead) evalHead.style.display = "none";
            sidebar.classList.replace('w-64', 'w-16');
            toggleIcon.classList.replace('fa-angle-double-left', 'fa-angle-double-right');
            sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'none');
            mainContent.classList.replace('ml-64', 'ml-16');
        } else {
            if (evalHead) evalHead.style.display = "";
            sidebar.classList.replace('w-16', 'w-64');
            toggleIcon.classList.replace('fa-angle-double-right', 'fa-angle-double-left');
            sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'inline');
            mainContent.classList.replace('ml-16', 'ml-64');
        }
    });
}

// TAB SELECTION
const barTab = document.getElementById('barBtn');
const confTab = document.getElementById('confBtn');
const lineTab = document.getElementById('lineBtn');

if (barTab) barTab.addEventListener('click', selectTab);
if (confTab) confTab.addEventListener('click', selectTab);
if (lineTab) lineTab.addEventListener('click', selectTab);

const barChartContainer = document.querySelector('.bar-chart-container');
const confMatrixContainer = document.querySelector('.confusion-matrix-container');
const lineChartContainer = document.querySelector('.line-chart-container');

function selectTab(event) {
    [barTab, confTab, lineTab].filter(Boolean).forEach(tab => {
        tab.querySelector("#icon")?.classList.remove('gradient-text');
        tab.querySelector("#text")?.classList.remove('gradient-text');
    });

    [barChartContainer, confMatrixContainer, lineChartContainer].filter(Boolean).forEach(chart => {
        chart.style.display = 'none';
    });

    const currTab = event.currentTarget;
    currTab.querySelector("#icon")?.classList.add('gradient-text');
    currTab.querySelector("#text")?.classList.add('gradient-text');

    const tabLabel = currTab.querySelector('#text').innerText;
    if (tabLabel.includes("ACCURACY")) barChartContainer.style.display = 'flex';
    else if (tabLabel.includes("CONFUSION")) confMatrixContainer.style.display = 'flex';
    else if (tabLabel.includes("F1")) lineChartContainer.style.display = 'flex';
}

// CHART.JS + METRICS HANDLING
let metricsEndpoint = 'http://127.0.0.1:8000/get_metrics';

function fetchData() {
    fetch(metricsEndpoint)
        .then(res => res.json())
        .then(data => {
            console.log("Metrics Data:", data);
            const latestEntry = data[data.length - 1];
            const latestMetrics = latestEntry?.metrics || {};

            // ACCURACY DISPLAY
            const accuracyLandingDisplay = document.getElementById('crypto-model-accuracy');
            if (accuracyLandingDisplay) {
                const accuracy = latestMetrics.accuracy;
                accuracyLandingDisplay.textContent = accuracy !== undefined
                    ? (accuracy * 100).toFixed(2) + '%'
                    : 'N/A';
            }

            // BAR CHART (Accuracy & Error Rate)
            const barC = document.getElementById('barChart');
            const accuracy = latestMetrics.accuracy || 0;
            if (barC) {
                const bar = Chart.getChart(barC);
                if (bar) {
                    bar.data.datasets[0].data = [accuracy, 1 - accuracy];
                    bar.update();
                } else {
                    new Chart(barC, {
                        type: 'bar',
                        data: {
                            labels: ['Accuracy', 'Error Rate'],
                            datasets: [{
                                label: 'Performance',
                                data: [accuracy, 1 - accuracy],
                                backgroundColor: ['#bc24c4', 'rgba(119, 119, 119, 0.8)'],
                            }]
                        },
                        options: {
                            scales: {
                                y: { beginAtZero: true, max: 1 }
                            }
                        }
                    });
                }
            }

            // CONFUSION MATRIX
            const tnp = document.getElementById('tnp');
            const tpp = document.getElementById('tpp');
            const fnp = document.getElementById('fnp');
            const fpp = document.getElementById('fpp');
            const class0 = latestMetrics['0'] || {};

            if (tnp) tnp.innerText = class0.TN ?? 'N/A';
            if (tpp) tpp.innerText = class0.TP ?? 'N/A';
            if (fnp) fnp.innerText = class0.FN ?? 'N/A';
            if (fpp) fpp.innerText = class0.FP ?? 'N/A';

            // LINE CHART (Trend of Precision, Recall, F1-Score)
            const lineC = document.getElementById('lineChart');
            if (lineC && Array.isArray(data)) {
                const labels = data.map(entry =>
                    new Date(entry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                );

                const precisions = data.map(entry => entry.metrics['macro avg']?.precision ?? 0);
                const recalls = data.map(entry => entry.metrics['macro avg']?.recall ?? 0);
                const f1s = data.map(entry => entry.metrics['macro avg']?.['f1-score'] ?? 0);

                const line = Chart.getChart(lineC);
                if (line) {
                    line.data.labels = labels;
                    line.data.datasets[0].data = precisions;
                    line.data.datasets[1].data = recalls;
                    line.data.datasets[2].data = f1s;
                    line.update();
                } else {
                    new Chart(lineC, {
                        type: 'line',
                        data: {
                            labels,
                            datasets: [
                                {
                                    label: 'Precision',
                                    data: precisions,
                                    borderColor: '#bc24c4',
                                    borderWidth: 2,
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: 'Recall',
                                    data: recalls,
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 2,
                                    tension: 0.4,
                                    fill: false
                                },
                                {
                                    label: 'F1-Score',
                                    data: f1s,
                                    borderColor: 'rgba(255, 206, 86, 1)',
                                    borderWidth: 2,
                                    tension: 0.4,
                                    fill: false
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top'
                                }
                            },
                            scales: {
                                x: {
                                    grid: { color: '#FBF5F3' },
                                    ticks: { color: '#FBF5F3' }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: { color: '#FBF5F3' },
                                    ticks: { color: '#FBF5F3' }
                                }
                            }
                        }
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error fetching metrics:", error);
        });
}

// INITIALIZE
fetchData();
// setInterval(fetchData, 5000); // Enable this for live updates every 5s
