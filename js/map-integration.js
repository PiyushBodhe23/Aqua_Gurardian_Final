// Water Quality Map Integration

document.addEventListener('DOMContentLoaded', function() {
    initWaterQualityMap();
    initMapData();
    initAlertSystem();
});

let waterQualityMap;
let stationsData = [];
let currentPage = 1;
const itemsPerPage = 10;

function initWaterQualityMap() {
    // Initialize the map
    waterQualityMap = L.map('waterQualityMap').setView([20.5937, 78.9629], 5); // Center on India
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(waterQualityMap);
    
    // Add scale control
    L.control.scale().addTo(waterQualityMap);
    
    // Set up event listeners
    setupMapControls();
}

function setupMapControls() {
    // Filter application
    document.getElementById('applyFilters').addEventListener('click', applyMapFilters);
    
    // Search functionality
    document.getElementById('stationSearch').addEventListener('input', filterStationsTable);
    
    // Pagination
    document.getElementById('prevPage').addEventListener('click', goToPrevPage);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
    
    // Export data
    document.getElementById('exportData').addEventListener('click', exportData);
}

function initMapData() {
    // Generate sample data for demonstration
    generateSampleData();
    
    // Add markers to map
    addMarkersToMap();
    
    // Populate table
    populateStationsTable();
}

function generateSampleData() {
    const locations = [
        { name: "Delhi Central", lat: 28.6139, lng: 77.2090, region: "north" },
        { name: "Mumbai Coastal", lat: 19.0760, lng: 72.8777, region: "west" },
        { name: "Chennai Reservoir", lat: 13.0827, lng: 80.2707, region: "south" },
        { name: "Kolkata Ganges", lat: 22.5726, lng: 88.3639, region: "east" },
        { name: "Bangalore Lake", lat: 12.9716, lng: 77.5946, region: "south" },
        { name: "Hyderabad Treatment", lat: 17.3850, lng: 78.4867, region: "central" },
        { name: "Pune River", lat: 18.5204, lng: 73.8567, region: "west" },
        { name: "Jaipur Groundwater", lat: 26.9124, lng: 75.7873, region: "north" },
        { name: "Lucknow Municipal", lat: 26.8467, lng: 80.9462, region: "north" },
        { name: "Ahmedabad Well", lat: 23.0225, lng: 72.5714, region: "west" },
        { name: "Chandigarh Lake", lat: 30.7333, lng: 76.7794, region: "north" },
        { name: "Bhopal Reservoir", lat: 23.2599, lng: 77.4126, region: "central" }
    ];
    
    const waterSources = ['municipal', 'well', 'river', 'lake'];
    const regions = ['north', 'south', 'east', 'west', 'central'];
    
    stationsData = locations.map((location, index) => {
        const pH = (6.5 + Math.random() * 2).toFixed(1);
        const turbidity = (Math.random() * 10).toFixed(1);
        const chlorine = (Math.random() * 3).toFixed(1);
        const coliform = Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0;
        
        // Calculate overall score (0-100)
        let score = 100;
        score -= Math.abs(7 - pH) * 5; // Penalty for pH deviation from 7
        score -= turbidity * 2; // Penalty for turbidity
        score -= Math.abs(1.5 - chlorine) * 10; // Penalty for chlorine deviation from 1.5
        score -= coliform * 8; // Heavy penalty for coliform presence
        
        score = Math.max(0, Math.min(100, score));
        
        return {
            id: index + 1,
            name: location.name,
            location: `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`,
            coordinates: [location.lat, location.lng],
            waterSource: waterSources[Math.floor(Math.random() * waterSources.length)],
            region: location.region,
            parameters: {
                pH: parseFloat(pH),
                turbidity: parseFloat(turbidity),
                chlorine: parseFloat(chlorine),
                coliform: coliform
            },
            overallScore: Math.round(score),
            lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
            status: score >= 90 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor'
        };
    });
}

function addMarkersToMap() {
    // Clear existing markers
    waterQualityMap.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            waterQualityMap.removeLayer(layer);
        }
    });
    
    // Add new markers
    stationsData.forEach(station => {
        const markerColor = getMarkerColor(station.overallScore);
        
        const marker = L.marker(station.coordinates, {
            icon: L.divIcon({
                className: `water-marker ${station.status}`,
                html: `<div class="marker-pin" style="background-color: ${markerColor}">
                         <span>${station.overallScore}</span>
                       </div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            })
        });
        
        marker.addTo(waterQualityMap).bindPopup(`
            <div class="map-popup">
                <h3>${station.name}</h3>
                <div class="popup-details">
                    <p><strong>Water Source:</strong> ${station.waterSource}</p>
                    <p><strong>Overall Score:</strong> ${station.overallScore}/100</p>
                    <p><strong>Status:</strong> <span class="status-${station.status}">${station.status.toUpperCase()}</span></p>
                    <div class="popup-parameters">
                        <div class="parameter">
                            <span>pH: ${station.parameters.pH}</span>
                            <span class="parameter-status ${getParameterStatus('pH', station.parameters.pH)}"></span>
                        </div>
                        <div class="parameter">
                            <span>Turbidity: ${station.parameters.turbidity} NTU</span>
                            <span class="parameter-status ${getParameterStatus('turbidity', station.parameters.turbidity)}"></span>
                        </div>
                        <div class="parameter">
                            <span>Chlorine: ${station.parameters.chlorine} mg/L</span>
                            <span class="parameter-status ${getParameterStatus('chlorine', station.parameters.chlorine)}"></span>
                        </div>
                        <div class="parameter">
                            <span>Coliform: ${station.parameters.coliform} CFU</span>
                            <span class="parameter-status ${getParameterStatus('coliform', station.parameters.coliform)}"></span>
                        </div>
                    </div>
                </div>
            </div>
        `);
    });
}

function getMarkerColor(score) {
    if (score >= 90) return '#34a853'; // Excellent - Green
    if (score >= 70) return '#fbbc05'; // Good - Yellow
    if (score >= 50) return '#ff6d01'; // Fair - Orange
    return '#ea4335'; // Poor - Red
}

function getParameterStatus(parameter, value) {
    const ranges = {
        pH: { min: 6.5, max: 8.5 },
        turbidity: { max: 5 },
        chlorine: { min: 1, max: 4 },
        coliform: { max: 0 }
    };
    
    const range = ranges[parameter];
    
    if (parameter === 'coliform') {
        return value === 0 ? 'good' : 'poor';
    }
    
    if (parameter === 'turbidity') {
        return value <= range.max ? 'good' : value <= range.max * 2 ? 'fair' : 'poor';
    }
    
    if (value >= range.min && value <= range.max) return 'good';
    if (value >= range.min - 0.5 && value <= range.max + 0.5) return 'fair';
    return 'poor';
}

function applyMapFilters() {
    const selectedParameters = Array.from(document.querySelectorAll('input[name="parameter"]:checked'))
        .map(input => input.value);
    
    const selectedSources = Array.from(document.querySelectorAll('input[name="source"]:checked'))
        .map(input => input.value);
    
    const selectedRegion = document.getElementById('regionSelect').value;
    
    // Filter stations data
    const filteredData = stationsData.filter(station => {
        const parameterMatch = selectedParameters.length > 0;
        const sourceMatch = selectedSources.includes(station.waterSource);
        const regionMatch = selectedRegion === 'all' || station.region === selectedRegion;
        
        return sourceMatch && regionMatch;
    });
    
    // Update table with filtered data
    populateStationsTable(filteredData);
    
    // Update map markers (simplified - in real app you would filter markers)
    showNotification(`Showing ${filteredData.length} monitoring stations`, 'info');
}

function populateStationsTable(data = stationsData) {
    const tableBody = document.getElementById('stationsTable');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    
    tableBody.innerHTML = pageData.map(station => `
        <tr>
            <td>${station.name}</td>
            <td>${station.location}</td>
            <td><span class="source-tag ${station.waterSource}">${station.waterSource}</span></td>
            <td>
                <span class="parameter-value ${getParameterStatus('pH', station.parameters.pH)}">
                    ${station.parameters.pH}
                </span>
            </td>
            <td>
                <span class="parameter-value ${getParameterStatus('turbidity', station.parameters.turbidity)}">
                    ${station.parameters.turbidity} NTU
                </span>
            </td>
            <td>
                <span class="parameter-value ${getParameterStatus('chlorine', station.parameters.chlorine)}">
                    ${station.parameters.chlorine} mg/L
                </span>
            </td>
            <td>
                <span class="parameter-value ${getParameterStatus('coliform', station.parameters.coliform)}">
                    ${station.parameters.coliform} CFU
                </span>
            </td>
            <td>
                <div class="score-display ${station.status}">
                    ${station.overallScore}
                </div>
            </td>
            <td>${formatDate(station.lastUpdated)}</td>
        </tr>
    `).join('');
    
    // Update pagination info
    const totalPages = Math.ceil(data.length / itemsPerPage);
    document.querySelector('.page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    
    // Update button states
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function filterStationsTable() {
    const searchTerm = document.getElementById('stationSearch').value.toLowerCase();
    const filteredData = stationsData.filter(station => 
        station.name.toLowerCase().includes(searchTerm) ||
        station.location.toLowerCase().includes(searchTerm) ||
        station.waterSource.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    populateStationsTable(filteredData);
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        populateStationsTable();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(stationsData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        populateStationsTable();
    }
}

function exportData() {
    // In a real application, this would generate a CSV or PDF
    showNotification('Exporting water quality data...', 'info');
    
    // Simulate export process
    setTimeout(() => {
        showNotification('Data exported successfully!', 'success');
    }, 1500);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function initAlertSystem() {
    // In a real application, this would connect to a real-time alert system
    // For now, we'll just set up the UI
    
    const alertSubscription = document.querySelector('.alert-subscription');
    if (alertSubscription) {
        alertSubscription.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            const region = this.querySelector('select').value;
            
            showNotification(`Subscribed to water quality alerts for ${region} region`, 'success');
            this.reset();
        });
    }
}

// Add CSS for map integration
const mapIntegrationStyles = `
    .map-hero {
        padding: 150px 0 80px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
        text-align: center;
    }
    
    .map-hero h1 {
        font-size: 42px;
        margin-bottom: 20px;
    }
    
    .map-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 30px;
        margin-top: 40px;
    }
    
    .map-controls {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        height: fit-content;
        position: sticky;
        top: 100px;
    }
    
    .control-group {
        margin-bottom: 25px;
    }
    
    .control-group h3 {
        font-size: 16px;
        margin-bottom: 15px;
        color: var(--dark);
    }
    
    .parameter-filters,
    .source-filters {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .filter-option {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .filter-option:hover {
        background: #f5f9ff;
    }
    
    .filter-label {
        font-size: 14px;
        color: var(--text);
    }
    
    .map-wrapper {
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    #waterQualityMap {
        height: 600px;
        width: 100%;
    }
    
    .map-legend {
        position: absolute;
        bottom: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    .map-legend h4 {
        margin-bottom: 10px;
        font-size: 14px;
        color: var(--dark);
    }
    
    .legend-items {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
    }
    
    .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: inline-block;
    }
    
    .legend-color.excellent { background: #34a853; }
    .legend-color.good { background: #fbbc05; }
    .legend-color.fair { background: #ff6d01; }
    .legend-color.poor { background: #ea4335; }
    
    .water-marker {
        text-align: center;
    }
    
    .marker-pin {
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    
    .marker-pin span {
        transform: rotate(45deg);
    }
    
    .map-popup {
        min-width: 250px;
    }
    
    .map-popup h3 {
        margin-bottom: 10px;
        color: var(--dark);
    }
    
    .popup-details p {
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .popup-parameters {
        margin-top: 15px;
    }
    
    .parameter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
        border-bottom: 1px solid #f0f0f0;
        font-size: 13px;
    }
    
    .parameter:last-child {
        border-bottom: none;
    }
    
    .parameter-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
    }
    
    .parameter-status.good { background: #34a853; }
    .parameter-status.fair { background: #fbbc05; }
    .parameter-status.poor { background: #ea4335; }
    
    .status-excellent { color: #34a853; }
    .status-good { color: #fbbc05; }
    .status-fair { color: #ff6d01; }
    .status-poor { color: #ea4335; }
    
    .quality-data {
        padding: 80px 0;
        background: #f8f9fa;
    }
    
    .data-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        gap: 20px;
    }
    
    .search-box {
        position: relative;
        flex: 1;
        max-width: 400px;
    }
    
    .search-box input {
        padding-left: 40px;
    }
    
    .search-box i {
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
    }
    
    .data-table-container {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        margin-bottom: 30px;
    }
    
    .data-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .data-table th {
        background: #f8f9fa;
        padding: 15px;
        text-align: left;
        font-weight: 600;
        color: var(--dark);
        border-bottom: 1px solid var(--border);
    }
    
    .data-table td {
        padding: 15px;
        border-bottom: 1px solid var(--border);
    }
    
    .data-table tr:hover {
        background: #f5f9ff;
    }
    
    .source-tag {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: capitalize;
    }
    
    .source-tag.municipal { background: #e3f2fd; color: var(--primary); }
    .source-tag.well { background: #e8f5e8; color: var(--secondary); }
    .source-tag.river { background: #e3f2fd; color: #1a73e8; }
    .source-tag.lake { background: #fff8e1; color: #f57c00; }
    
    .parameter-value {
        font-weight: 600;
    }
    
    .parameter-value.good { color: #34a853; }
    .parameter-value.fair { color: #fbbc05; }
    .parameter-value.poor { color: #ea4335; }
    
    .score-display {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: white;
    }
    
    .score-display.excellent { background: #34a853; }
    .score-display.good { background: #fbbc05; }
    .score-display.fair { background: #ff6d01; }
    .score-display.poor { background: #ea4335; }
    
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
    
    .page-info {
        font-weight: 500;
        color: var(--text);
    }
    
    .alert-system {
        padding: 80px 0;
        background: white;
    }
    
    .alerts-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .alert-card {
        display: flex;
        align-items: flex-start;
        gap: 20px;
        padding: 25px;
        border-radius: 10px;
        border-left: 4px solid;
    }
    
    .alert-card.critical {
        background: #fce8e6;
        border-left-color: #ea4335;
    }
    
    .alert-card.warning {
        background: #fef7e0;
        border-left-color: #fbbc05;
    }
    
    .alert-card.info {
        background: #e3f2fd;
        border-left-color: #1a73e8;
    }
    
    .alert-icon {
        font-size: 24px;
        margin-top: 2px;
    }
    
    .alert-card.critical .alert-icon { color: #ea4335; }
    .alert-card.warning .alert-icon { color: #fbbc05; }
    .alert-card.info .alert-icon { color: #1a73e8; }
    
    .alert-content {
        flex: 1;
    }
    
    .alert-content h3 {
        margin-bottom: 8px;
        font-size: 18px;
    }
    
    .alert-content p {
        margin-bottom: 12px;
        color: var(--text);
    }
    
    .alert-meta {
        display: flex;
        gap: 20px;
        font-size: 14px;
        color: #666;
    }
    
    .alert-subscription {
        margin-top: 15px;
    }
    
    @media (max-width: 992px) {
        .map-container {
            grid-template-columns: 1fr;
        }
        
        .map-controls {
            position: static;
        }
        
        .data-controls {
            flex-direction: column;
            align-items: stretch;
        }
        
        .search-box {
            max-width: none;
        }
    }
    
    @media (max-width: 768px) {
        #waterQualityMap {
            height: 400px;
        }
        
        .data-table {
            display: block;
            overflow-x: auto;
        }
        
        .alert-card {
            flex-direction: column;
            gap: 15px;
        }
        
        .alert-meta {
            flex-direction: column;
            gap: 5px;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mapIntegrationStyles;
document.head.appendChild(styleSheet);