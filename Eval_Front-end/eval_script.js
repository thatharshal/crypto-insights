
// SIDE NAVBAR FUNCTION STARTS

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const toggleIcon = document.getElementById('toggleIcon');
const mainContent = document.getElementById('mainContent');
const evalHead = document.getElementById('h-eval');

// Toggle Button function to collapse and expand navbar

toggleBtn.addEventListener('click', () => {
    if (sidebar.classList.contains('w-64')) {
        // Collapse sidebar
        evalHead.style.display = "none"
        sidebar.classList.remove('w-64');
        sidebar.classList.add('w-16');
        toggleIcon.classList.remove('fa-angle-double-left');
        toggleIcon.classList.add('fa-angle-double-right');
        // Hide text labels
        sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'none');
        // Adjust main content margin
        mainContent.classList.remove('ml-64');
        mainContent.classList.add('ml-16');
    } else {
        // Expand sidebar
        evalHead.style.display = ""
        sidebar.classList.remove('w-16');
        sidebar.classList.add('w-64');
        toggleIcon.classList.remove('fa-angle-double-right');
        toggleIcon.classList.add('fa-angle-double-left');
        // Show text labels
        sidebar.querySelectorAll('nav a span').forEach(span => span.style.display = 'inline');
        // Adjust main content margin
        mainContent.classList.remove('ml-16');
        mainContent.classList.add('ml-64');
    }
});

const barTab = document.getElementById('barBtn')
barTab.addEventListener('click', selectTab);

const confTab = document.getElementById('confBtn')
confTab.addEventListener('click', selectTab);

const lineTab = document.getElementById('lineBtn')
lineTab.addEventListener('click', selectTab);

const barChartContainer = document.querySelector('.bar-chart-container');
const confMatrixContainer = document.querySelector('.confusion-matrix-container');
const lineChartContainer = document.querySelector('.line-chart-container');

// function to switch to different tabs

function selectTab(event) {
    tabs = [barTab, confTab, lineTab]
    charts = [barChartContainer, confMatrixContainer, lineChartContainer]

    tabs.forEach(tab => {
        tab.querySelector("#icon").classList.remove('gradient-text')
        tab.querySelector("#text").classList.remove('gradient-text')
    })

    charts.forEach(chart => {
        chart.style.display = 'none'
    })

    currTab = event.currentTarget
    currTab.querySelector("#icon").classList.add('gradient-text')
    currTab.querySelector("#text").classList.add('gradient-text')

    if(currTab.querySelector('#text').innerText.includes("ACCURACY")){
        barChartContainer.style.display = 'flex'
    } else if(currTab.querySelector('#text').innerText.includes("CONFUSION")){
        confMatrixContainer.style.display = 'flex'
    } else if(currTab.querySelector('#text').innerText.includes("F1")){
        lineChartContainer.style.display = 'flex'
    }

}

// SIDE NAVBAR ENDS

// CHART.JS PART START

const barC = document.getElementById('barChart');
const lineC = document.getElementById('lineChart');
const tnp = document.getElementById('tnp');
const fnp = document.getElementById('fnp');
const tpp = document.getElementById('tpp');
const fpp = document.getElementById('fpp');

// bar chart dataset
const barData = {
    labels: ['Accuracy', 'Error'],
    datasets: [{
        data: [0.94,0.06],
        backgroundColor: ['#bc24c4', '#a8a8a8'],
        borderWidth: 1
    }]
}
// bar chart object
bar = new Chart(barC, {
    type: 'bar',
    data: barData,
    options: {
        scales: {
            x: {
                grid: {
                    color: '#FBF5F3'
                },
                ticks: {
                    color: '#FBF5F3'
                },
                title: {
                    display: true,
                    color: '#FBF5F3'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#FBF5F3'
                },
                ticks: {
                    color: '#FBF5F3'
                },
                title: {
                    display: true,
                    color: '#FBF5F3'
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Model Performance Bar Chart',
                color: '#FBF5F3'
            }
        }
    }
});

// Line chart Datasets
const lineData = {
    labels: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9], // X-Coordinates
    datasets: [
        {
            label: 'Precision',
            data: [0.5, 0.55, 0.57, 0.6, 0.58, 0.61, 0.6, 0.65, 0.7, 0.8], // Y-Coordinates
            borderColor: 'rgba(255,0,0,1)',
            backgroundColor: 'rgba(255,0,0,0.5)',
        },
        {
            label: 'Recall',
            data: [1.0, 1.0, 0.98, 0.95, 0.9, 0.87, 0.83, 0.7, 0.5, 0.3], // Y-Coordinates
            borderColor: 'rgba(0,255,0,1)',
            backgroundColor: 'rgba(0,255,0,0.5)',
        },
        {
            label: 'F1-Score',
            data: [0.66, 0.70, 0.72, 0.73, 0.58, 0.70, 0.69, 0.67, 0.58, 0.43], // Y-Coordinates
            borderColor: 'rgba(0,0,255,1)',
            backgroundColor: 'rgba(0,0,255,0.5)',
           
        }
    ]
};
// line chart object
line = new Chart(lineC, {
    type: 'line',
    data: lineData,
    options: {
        scales: {
            x: {
                grid: {
                    color: '#FBF5F3'
                },
                ticks: {
                    color: '#FBF5F3'
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#FBF5F3'
                },
                ticks: {
                    color: '#FBF5F3'
                }
            }
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#FBF5F3'
                }
            },
            title: {
                display: true,
                text: 'Line Chart',
                color : '#FBF5F3'
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '',
                        color: '#FBF5F3'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '',
                        color: '#FBF5F3'
                    }
                }
            }
        }
    }
});


// data fetch and update function
function fetchData() {
    let p = fetch(path)
    p.then(res => {
        console.log(res.status)
        console.log(res.ok)
        return res.json()
    }).then(data => {
        // console.log(data)
        // updating bar chart
        bar.data.datasets[0].data = [data[0].Accuracy, data[0].Error];
        bar.update();

        // updating confusion matrix
        tnp.innerText = data[1].TN
        tpp.innerText = data[1].TP
        fnp.innerText = data[1].FN
        fpp.innerText = data[1].FP

        // updating line chart
        line.data.labels = data[2].Thresholds;
        line.data.datasets[0].data = data[2].Precision;
        line.data.datasets[1].data = data[2].Recall;
        line.data.datasets[2].data = data[2].F1_Score;        
        line.update();
    })
}

let path = 'http://127.0.0.1:5000/data' // data endpoint
fetchData()

// set interval in which you want to call fetchData function
// setInterval(fetchData, 1000*5) // interval set for 5 secs

// CHART.JS PART ENDS

