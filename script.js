document.addEventListener('DOMContentLoaded', () => {
    // --- Chart Configuration ---
    const MAX_DATA_POINTS = 20; // How many data points to show on the chart
    const UPDATE_INTERVAL = 2000; // Update frequency in milliseconds (e.g., 2000 = 2 seconds)

    // --- Helper Function to Create Chart Config ---
    function createChartConfig(label, initialData = []) {
        return {
            type: 'line',
            data: {
                labels: Array(initialData.length).fill(''), // Initial empty labels
                datasets: [{
                    label: label,
                    data: initialData,
                    borderColor: getRandomColor(),
                    backgroundColor: 'rgba(0, 0, 0, 0.05)', // Slight fill
                    borderWidth: 2,
                    pointRadius: 2, // Smaller points
                    pointBackgroundColor: 'rgba(0,0,0,0.5)',
                    tension: 0.3 // Smoother lines
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allows chart to fill container height
                scales: {
                    y: {
                        beginAtZero: true
                    },
                    x: {
                        ticks: {
                            display: false // Hide x-axis labels for simplicity
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend to save space
                    },
                    tooltip: {
                        enabled: true // Keep tooltips
                    }
                },
                animation: {
                    duration: 250 // Faster update animation
                }
            }
        };
    }

    // --- Get Canvas Contexts ---
    const speedCtx = document.getElementById('speedChart').getContext('2d');
    const rpmCtx = document.getElementById('rpmChart').getContext('2d');
    const tempCtx = document.getElementById('tempChart').getContext('2d');
    const fuelCtx = document.getElementById('fuelChart').getContext('2d');

    // --- Initialize Charts ---
    const speedChart = new Chart(speedCtx, createChartConfig('Speed'));
    const rpmChart = new Chart(rpmCtx, createChartConfig('RPM'));
    const tempChart = new Chart(tempCtx, createChartConfig('Temperature'));
    const fuelChart = new Chart(fuelCtx, createChartConfig('Fuel Level'));

    const charts = [speedChart, rpmChart, tempChart, fuelChart];

    // --- Data Generation ---
    function getRandomValue(min, max) {
        return Math.random() * (max - min) + min;
    }

    function generateVehicleData() {
        return {
            speed: getRandomValue(0, 120),
            rpm: getRandomValue(500, 6000),
            temperature: getRandomValue(70, 110),
            fuel: getRandomValue(10, 95)
        };
    }

    // --- Chart Update Function ---
    function updateCharts() {
        const newData = generateVehicleData();
        const nowLabel = new Date().toLocaleTimeString().split(" ")[0]; // Simple time label HH:MM:SS

        updateSingleChart(speedChart, nowLabel, newData.speed);
        updateSingleChart(rpmChart, nowLabel, newData.rpm);
        updateSingleChart(tempChart, nowLabel, newData.temperature);
        updateSingleChart(fuelChart, nowLabel, newData.fuel);
    }

    function updateSingleChart(chart, label, value) {
        const data = chart.data.datasets[0].data;
        const labels = chart.data.labels;

        // Add new data
        data.push(value);
        labels.push(label);

        // Remove old data if exceeding max points
        if (data.length > MAX_DATA_POINTS) {
            data.shift();
            labels.shift();
        }

        chart.update();
    }

    // --- Initial Data Load & Interval ---
    // Fill with some initial random data
    for (let i = 0; i < MAX_DATA_POINTS / 2; i++) { // Start with half data points
         updateCharts(); // Call multiple times for initial fill without delay
    }

    // Start updating charts periodically
    setInterval(updateCharts, UPDATE_INTERVAL);

     // --- Helper for random colors (Optional - adds variety) ---
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

     // Re-assign colors after initial setup if desired
     charts.forEach(chart => {
         chart.data.datasets[0].borderColor = getRandomColor();
     });

}); // End DOMContentLoaded