// Dashboard functionality for Aqua Guardian Health

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initCharts();
    initDashboardData();
});

function initDashboard() {
    // Navigation
    initDashboardNavigation();
    
    // User menu
    initUserMenu();
    
    // Modals
    initModals();
    
    // Station management
    initStationManagement();
    
    // Alert management
    initAlertManagement();
    
    // Settings
    initSettings();
    
    // Quick actions
    initQuickActions();
}

function initDashboardNavigation() {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    const pages = document.querySelectorAll('.dashboard-page');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === `${targetPage}-page`) {
                    page.classList.add('active');
                }
            });
            
            // Load page-specific data
            loadPageData(targetPage);
        });
    });
}

function initUserMenu() {
    const userMenu = document.querySelector('.dashboard-user');
    const dropdown = document.querySelector('.user-dropdown');
    
    if (userMenu && dropdown) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            dropdown.classList.remove('active');
        });
    }
}

function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close, [data-dismiss="modal"]');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Add station form
    const addStationForm = document.getElementById('addStationForm');
    if (addStationForm) {
        addStationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add station logic here
            showNotification('Monitoring station added successfully!', 'success');
            document.getElementById('addStationModal').style.display = 'none';
            this.reset();
        });
    }
}

function initStationManagement() {
    // Load stations data
    loadStationsData();
    
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', filterStations);
    }
}

function loadStationsData() {
    const stationsGrid = document.getElementById('stationsGrid');
    if (!stationsGrid) return;
    
    const stations = [
        {
            id: 1,
            name: 'Delhi Central',
            type: 'Municipal Water',
            status: 'online',
            score: 92,
            parameters: {
                pH: 7.2,
                turbidity: 1.8,
                chlorine: 1.5,
                coliform: 0
            },
            lastUpdate: '2 minutes ago'
        },
        {
            id: 2,
            name: 'Mumbai Coastal',
            type: 'Coastal Area',
            status: 'online',
            score: 85,
            parameters: {
                pH: 7.8,
                turbidity: 3.2,
                chlorine: 2.1,
                coliform: 0
            },
            lastUpdate: '5 minutes ago'
        },
        {
            id: 3,
            name: 'Chennai Reservoir',
            type: 'Reservoir',
            status: 'warning',
            score: 67,
            parameters: {
                pH: 6.8,
                turbidity: 8.5,
                chlorine: 0.8,
                coliform: 2
            },
            lastUpdate: '10 minutes ago'
        },
        {
            id: 4,
            name: 'Kolkata Ganges',
            type: 'River Water',
            status: 'offline',
            score: null,
            parameters: {
                pH: null,
                turbidity: null,
                chlorine: null,
                coliform: null
            },
            lastUpdate: '2 hours ago'
        },
        {
            id: 5,
            name: 'Bangalore Lake',
            type: 'Lake',
            status: 'online',
            score: 78,
            parameters: {
                pH: 7.1,
                turbidity: 4.2,
                chlorine: 1.8,
                coliform: 0
            },
            lastUpdate: '15 minutes ago'
        },
        {
            id: 6,
            name: 'Hyderabad Treatment',
            type: 'Treatment Plant',
            status: 'online',
            score: 95,
            parameters: {
                pH: 7.0,
                turbidity: 0.8,
                chlorine: 2.2,
                coliform: 0
            },
            lastUpdate: '1 minute ago'
        }
    ];
    
    stationsGrid.innerHTML = stations.map(station => `
        <div class="station-card" data-id="${station.id}">
            <div class="station-header">
                <div class="station-info">
                    <h3>${station.name}</h3>
                    <span class="station-type">${station.type}</span>
                </div>
                <div class="station-status ${station.status}">
                    <span class="status-dot"></span>
                    <span class="status-text">${station.status}</span>
                </div>
            </div>
            
            <div class="station-metrics">
                <div class="metric">
                    <span class="metric-label">Overall Score</span>
                    <div class="metric-value ${getScoreClass(station.score)}">
                        ${station.score || 'N/A'}
                    </div>
                </div>
                <div class="metric">
                    <span class="metric-label">pH Level</span>
                    <span class="metric-value ${getParameterClass('pH', station.parameters.pH)}">
                        ${station.parameters.pH || 'N/A'}
                    </span>
                </div>
                <div class="metric">
                    <span class="metric-label">Turbidity</span>
                    <span class="metric-value ${getParameterClass('turbidity', station.parameters.turbidity)}">
                        ${station.parameters.turbidity ? station.parameters.turbidity + ' NTU' : 'N/A'}
                    </span>
                </div>
            </div>
            
            <div class="station-actions">
                <button class="btn btn-outline btn-sm" onclick="viewStationDetails(${station.id})">
                    <i class="fas fa-chart-line"></i> View Details
                </button>
                <button class="btn btn-outline btn-sm" onclick="editStation(${station.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </div>
            
            <div class="station-footer">
                <span class="last-update">Last update: ${station.lastUpdate}</span>
            </div>
        </div>
    `).join('');
}

function getScoreClass(score) {
    if (score === null) return 'offline';
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
}

function getParameterClass(parameter, value) {
    if (value === null) return 'offline';
    
    const ranges = {
        pH: { min: 6.5, max: 8.5 },
        turbidity: { max: 5 },
        chlorine: { min: 1, max: 4 },
        coliform: { max: 0 }
    };
    
    const range = ranges[parameter];
    
    if (parameter === 'coliform') {
        return value === 0 ? 'excellent' : 'poor';
    }
    
    if (parameter === 'turbidity') {
        return value <= range.max ? 'excellent' : value <= range.max * 2 ? 'fair' : 'poor';
    }
    
    if (value >= range.min && value <= range.max) return 'excellent';
    if (value >= range.min - 0.5 && value <= range.max + 0.5) return 'fair';
    return 'poor';
}

function filterStations() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const stationCards = document.querySelectorAll('.station-card');
    
    stationCards.forEach(card => {
        const stationName = card.querySelector('h3').textContent.toLowerCase();
        const stationType = card.querySelector('.station-type').textContent.toLowerCase();
        
        if (stationName.includes(searchTerm) || stationType.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initAlertManagement() {
    loadAlertsData();
    
    // Filter functionality
    const typeFilter = document.getElementById('alertTypeFilter');
    const statusFilter = document.getElementById('alertStatusFilter');
    
    if (typeFilter && statusFilter) {
        typeFilter.addEventListener('change', filterAlerts);
        statusFilter.addEventListener('change', filterAlerts);
    }
}

function loadAlertsData() {
    const alertsTable = document.getElementById('alertsTable');
    if (!alertsTable) return;
    
    const alerts = [
        {
            id: 1,
            type: 'critical',
            description: 'Chemical contamination detected',
            location: 'Blue River Station',
            severity: 'High',
            status: 'active',
            time: '2 hours ago',
            parameter: 'Lead',
            value: '0.08 mg/L'
        },
        {
            id: 2,
            type: 'warning',
            description: 'Equipment malfunction',
            location: 'Chennai Reservoir',
            severity: 'Medium',
            status: 'active',
            time: '5 hours ago',
            parameter: 'pH Sensor',
            value: 'Offline'
        },
        {
            id: 3,
            type: 'info',
            description: 'Maintenance due',
            location: 'Mumbai Coastal',
            severity: 'Low',
            status: 'active',
            time: '1 day ago',
            parameter: 'General',
            value: 'Scheduled'
        },
        {
            id: 4,
            type: 'critical',
            description: 'High turbidity levels',
            location: 'Delhi Central',
            severity: 'High',
            status: 'resolved',
            time: '3 days ago',
            parameter: 'Turbidity',
            value: '12.5 NTU'
        }
    ];
    
    alertsTable.innerHTML = alerts.map(alert => `
        <tr data-id="${alert.id}" data-type="${alert.type}" data-status="${alert.status}">
            <td>
                <span class="alert-badge ${alert.type}">
                    <i class="fas fa-${getAlertIcon(alert.type)}"></i>
                    ${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </span>
            </td>
            <td>
                <div class="alert-description">
                    <strong>${alert.description}</strong>
                    <div class="alert-parameter">${alert.parameter}: ${alert.value}</div>
                </div>
            </td>
            <td>${alert.location}</td>
            <td>
                <span class="severity-badge ${alert.severity.toLowerCase()}">
                    ${alert.severity}
                </span>
            </td>
            <td>
                <span class="status-badge ${alert.status}">
                    ${alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                </span>
            </td>
            <td>${alert.time}</td>
            <td>
                <div class="alert-actions">
                    ${alert.status === 'active' ? `
                        <button class="btn-action resolve" onclick="resolveAlert(${alert.id})" title="Resolve">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-action acknowledge" onclick="acknowledgeAlert(${alert.id})" title="Acknowledge">
                            <i class="fas fa-eye"></i>
                        </button>
                    ` : ''}
                    <button class="btn-action delete" onclick="deleteAlert(${alert.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getAlertIcon(type) {
    const icons = {
        critical: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function filterAlerts() {
    const typeFilter = document.getElementById('alertTypeFilter').value;
    const statusFilter = document.getElementById('alertStatusFilter').value;
    const alertRows = document.querySelectorAll('#alertsTable tr');
    
    alertRows.forEach(row => {
        const alertType = row.getAttribute('data-type');
        const alertStatus = row.getAttribute('data-status');
        
        const typeMatch = typeFilter === 'all' || alertType === typeFilter;
        const statusMatch = statusFilter === 'all' || alertStatus === statusFilter;
        
        if (typeMatch && statusMatch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function resolveAlert(alertId) {
    showNotification(`Alert #${alertId} resolved successfully`, 'success');
    // Update alert status in UI
    const alertRow = document.querySelector(`tr[data-id="${alertId}"]`);
    if (alertRow) {
        alertRow.setAttribute('data-status', 'resolved');
        alertRow.querySelector('.status-badge').textContent = 'Resolved';
        alertRow.querySelector('.status-badge').className = 'status-badge resolved';
        // Remove action buttons for resolved alerts
        alertRow.querySelector('.alert-actions').innerHTML = `
            <button class="btn-action delete" onclick="deleteAlert(${alertId})" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
    }
}

function acknowledgeAlert(alertId) {
    showNotification(`Alert #${alertId} acknowledged`, 'info');
}

function deleteAlert(alertId) {
    if (confirm('Are you sure you want to delete this alert?')) {
        showNotification(`Alert #${alertId} deleted`, 'success');
        const alertRow = document.querySelector(`tr[data-id="${alertId}"]`);
        if (alertRow) {
            alertRow.remove();
        }
    }
}

function initSettings() {
    // Settings tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Settings form submission
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Profile settings updated successfully!', 'success');
        });
    }
}

function initQuickActions() {
    // Add station button
    const addStationBtn = document.getElementById('addStation');
    if (addStationBtn) {
        addStationBtn.addEventListener('click', function() {
            document.getElementById('addStationModal').style.display = 'block';
        });
    }
    
    // Add new station button
    const addNewStationBtn = document.getElementById('addNewStation');
    if (addNewStationBtn) {
        addNewStationBtn.addEventListener('click', function() {
            document.getElementById('addStationModal').style.display = 'block';
        });
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReport');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', function() {
            showNotification('Generating comprehensive report...', 'info');
            // Simulate report generation
            setTimeout(() => {
                showNotification('Report generated successfully!', 'success');
            }, 2000);
        });
    }
    
    // View map button
    const viewMapBtn = document.getElementById('viewMap');
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', function() {
            window.location.href = 'water-quality-map.html';
        });
    }
    
    // Generate report button in reports page
    const generateReportPageBtn = document.getElementById('generateReportBtn');
    if (generateReportPageBtn) {
        generateReportPageBtn.addEventListener('click', function() {
            const startDate = document.getElementById('reportStartDate').value;
            const endDate = document.getElementById('reportEndDate').value;
            
            if (!startDate || !endDate) {
                showNotification('Please select both start and end dates', 'error');
                return;
            }
            
            showNotification(`Generating report for ${startDate} to ${endDate}...`, 'info');
            // Simulate report generation
            setTimeout(() => {
                showNotification('PDF report generated successfully!', 'success');
            }, 2000);
        });
    }
}

function initCharts() {
    // Water Quality Trends Chart
    const trendCtx = document.getElementById('qualityTrendChart');
    if (trendCtx) {
        new Chart(trendCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'pH Level',
                        data: [7.2, 7.1, 7.3, 7.0, 7.4, 7.2, 7.1],
                        borderColor: '#1a73e8',
                        backgroundColor: 'rgba(26, 115, 232, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Turbidity (NTU)',
                        data: [2.1, 2.8, 1.9, 3.2, 2.5, 2.0, 1.8],
                        borderColor: '#fbbc05',
                        backgroundColor: 'rgba(251, 188, 5, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
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
    
    // Parameter Distribution Chart
    const paramCtx = document.getElementById('parameterChart');
    if (paramCtx) {
        new Chart(paramCtx, {
            type: 'doughnut',
            data: {
                labels: ['Excellent', 'Good', 'Fair', 'Poor'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        '#34a853',
                        '#fbbc05',
                        '#ff6d01',
                        '#ea4335'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    }
                }
            }
        });
    }
    
    // Regional Comparison Chart
    const regionalCtx = document.getElementById('regionalChart');
    if (regionalCtx) {
        new Chart(regionalCtx, {
            type: 'bar',
            data: {
                labels: ['North', 'South', 'East', 'West', 'Central'],
                datasets: [{
                    label: 'Water Quality Score',
                    data: [88, 92, 85, 90, 87],
                    backgroundColor: '#1a73e8',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
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
}

function initDashboardData() {
    // Update real-time data every 30 seconds
    setInterval(updateRealTimeData, 30000);
    
    // Initial data update
    updateRealTimeData();
}

function updateRealTimeData() {
    // Simulate real-time data updates
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const valueElement = card.querySelector('.stat-value');
        const changeElement = card.querySelector('.stat-change');
        
        if (valueElement && changeElement) {
            // Simulate small changes
            const currentValue = parseFloat(valueElement.textContent) || 0;
            const randomChange = (Math.random() - 0.5) * 5;
            const newValue = Math.max(0, Math.min(100, currentValue + randomChange));
            
            // Update with animation
            valueElement.style.opacity = '0.5';
            setTimeout(() => {
                valueElement.textContent = Number.isInteger(newValue) ? newValue : newValue.toFixed(1);
                valueElement.style.opacity = '1';
            }, 300);
        }
    });
}

function loadPageData(page) {
    switch (page) {
        case 'overview':
            // Overview page is already loaded
            break;
        case 'monitoring':
            loadStationsData();
            break;
        case 'alerts':
            loadAlertsData();
            break;
        case 'reports':
            // Reports page doesn't need additional loading
            break;
        case 'settings':
            // Settings page doesn't need additional loading
            break;
    }
}

function viewStationDetails(stationId) {
    showNotification(`Loading details for station #${stationId}...`, 'info');
    // In a real application, this would open a detailed view or modal
    setTimeout(() => {
        showNotification(`Station #${stationId} details loaded`, 'success');
    }, 1000);
}

function editStation(stationId) {
    showNotification(`Editing station #${stationId}...`, 'info');
    // In a real application, this would open an edit form
    setTimeout(() => {
        showNotification(`Station #${stationId} edit mode activated`, 'success');
    }, 1000);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initDashboard,
        loadStationsData,
        loadAlertsData,
        resolveAlert,
        acknowledgeAlert,
        deleteAlert
    };
}

// Add CSS for dashboard specific elements
const dashboardStyles = `
    .alert-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .alert-badge.critical {
        background: #fce8e6;
        color: #ea4335;
    }
    
    .alert-badge.warning {
        background: #fef7e0;
        color: #fbbc05;
    }
    
    .alert-badge.info {
        background: #e3f2fd;
        color: #1a73e8;
    }
    
    .severity-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .severity-badge.high {
        background: #fce8e6;
        color: #ea4335;
    }
    
    .severity-badge.medium {
        background: #fef7e0;
        color: #fbbc05;
    }
    
    .severity-badge.low {
        background: #e3f2fd;
        color: #1a73e8;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .status-badge.active {
        background: #e6f4ea;
        color: #34a853;
    }
    
    .status-badge.resolved {
        background: #f0f0f0;
        color: #5f6368;
    }
    
    .alert-actions {
        display: flex;
        gap: 5px;
    }
    
    .btn-action {
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
    }
    
    .btn-action.resolve {
        background: #e6f4ea;
        color: #34a853;
    }
    
    .btn-action.acknowledge {
        background: #e3f2fd;
        color: #1a73e8;
    }
    
    .btn-action.delete {
        background: #fce8e6;
        color: #ea4335;
    }
    
    .btn-action:hover {
        transform: scale(1.1);
    }
    
    .alert-description {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    
    .alert-parameter {
        font-size: 12px;
        color: #5f6368;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .stat-card.updating {
        animation: pulse 1s ease-in-out;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dashboardStyles;
document.head.appendChild(styleSheet);