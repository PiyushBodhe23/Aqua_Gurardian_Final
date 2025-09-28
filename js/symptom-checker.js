// Symptom Checker AI functionality

document.addEventListener('DOMContentLoaded', function() {
    initSymptomChecker();
});

function initSymptomChecker() {
    // Symptom data
    const symptomsData = {
        gastrointestinal: [
            { id: 'diarrhea', name: 'Diarrhea', severity: 'medium' },
            { id: 'vomiting', name: 'Vomiting', severity: 'medium' },
            { id: 'nausea', name: 'Nausea', severity: 'low' },
            { id: 'stomach-cramps', name: 'Stomach Cramps', severity: 'low' },
            { id: 'bloody-stool', name: 'Bloody Stool', severity: 'high' },
            { id: 'dehydration', name: 'Dehydration Signs', severity: 'high' }
        ],
        skin: [
            { id: 'rash', name: 'Skin Rash', severity: 'low' },
            { id: 'itching', name: 'Itching', severity: 'low' },
            { id: 'hives', name: 'Hives', severity: 'medium' },
            { id: 'blisters', name: 'Blisters', severity: 'medium' },
            { id: 'swelling', name: 'Swelling', severity: 'high' }
        ],
        respiratory: [
            { id: 'cough', name: 'Cough', severity: 'low' },
            { id: 'shortness-breath', name: 'Shortness of Breath', severity: 'high' },
            { id: 'chest-pain', name: 'Chest Pain', severity: 'high' },
            { id: 'wheezing', name: 'Wheezing', severity: 'medium' }
        ],
        neurological: [
            { id: 'headache', name: 'Headache', severity: 'low' },
            { id: 'dizziness', name: 'Dizziness', severity: 'medium' },
            { id: 'confusion', name: 'Confusion', severity: 'high' },
            { id: 'seizures', name: 'Seizures', severity: 'high' },
            { id: 'vision-changes', name: 'Vision Changes', severity: 'high' }
        ]
    };

    // Illness database
    const illnessesData = [
        {
            name: "Cholera",
            symptoms: ["diarrhea", "vomiting", "dehydration"],
            severity: "high",
            description: "Acute diarrheal illness caused by Vibrio cholerae bacteria",
            recommendations: [
                "Seek immediate medical attention",
                "Drink oral rehydration solution",
                "Practice good hygiene",
                "Use only safe water sources"
            ]
        },
        {
            name: "Giardiasis",
            symptoms: ["diarrhea", "stomach-cramps", "nausea"],
            severity: "medium",
            description: "Intestinal infection caused by Giardia parasite",
            recommendations: [
                "Consult a healthcare provider",
                "Stay hydrated",
                "Practice good hand hygiene",
                "Avoid swimming until symptoms resolve"
            ]
        },
        {
            name: "Legionnaires' Disease",
            symptoms: ["cough", "shortness-breath", "fever", "headache"],
            severity: "high",
            description: "Severe pneumonia caused by Legionella bacteria",
            recommendations: [
                "Seek emergency medical care",
                "Hospitalization may be required",
                "Antibiotic treatment needed",
                "Identify and eliminate water source"
            ]
        },
        {
            name: "Chemical Poisoning",
            symptoms: ["vomiting", "dizziness", "confusion", "vision-changes"],
            severity: "high",
            description: "Toxicity from chemical contaminants in water",
            recommendations: [
                "Call poison control immediately",
                "Seek emergency medical care",
                "Bring water sample for testing",
                "Identify contamination source"
            ]
        },
        {
            name: "Allergic Reaction",
            symptoms: ["rash", "itching", "hives", "swelling"],
            severity: "medium",
            description: "Allergic response to water contaminants",
            recommendations: [
                "Take antihistamines if prescribed",
                "Avoid suspected water source",
                "Consult allergist if persistent",
                "Use filtered or bottled water"
            ]
        }
    ];

    let selectedSymptoms = [];
    let currentStep = 1;

    // Initialize symptom checker
    loadSymptoms('gastrointestinal');
    setupEventListeners();

    function loadSymptoms(category) {
        const symptomsGrid = document.getElementById('symptomsGrid');
        const symptoms = symptomsData[category] || [];
        
        symptomsGrid.innerHTML = symptoms.map(symptom => `
            <div class="symptom-item" data-symptom="${symptom.id}">
                <input type="checkbox" id="${symptom.id}" class="symptom-checkbox">
                <label for="${symptom.id}" class="symptom-label">
                    <span class="symptom-name">${symptom.name}</span>
                    <span class="symptom-severity ${symptom.severity}">${symptom.severity}</span>
                </label>
            </div>
        `).join('');

        // Add event listeners to checkboxes
        document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const symptomId = this.id;
                if (this.checked) {
                    selectedSymptoms.push(symptomId);
                } else {
                    selectedSymptoms = selectedSymptoms.filter(id => id !== symptomId);
                }
                updateSelectedCount();
            });
        });
    }

    function setupEventListeners() {
        // Category selection
        document.querySelectorAll('.category').forEach(category => {
            category.addEventListener('click', function() {
                document.querySelectorAll('.category').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const categoryType = this.getAttribute('data-category');
                loadSymptoms(categoryType);
            });
        });

        // Step navigation
        document.getElementById('nextStep1').addEventListener('click', goToStep2);
        document.getElementById('prevStep2').addEventListener('click', goToStep1);
        document.getElementById('nextStep2').addEventListener('click', analyzeSymptoms);
        document.getElementById('prevStep3').addEventListener('click', goToStep2);
        document.getElementById('restartCheck').addEventListener('click', restartChecker);
    }

    function updateSelectedCount() {
        const nextButton = document.getElementById('nextStep1');
        if (selectedSymptoms.length > 0) {
            nextButton.disabled = false;
            nextButton.textContent = `Next (${selectedSymptoms.length} selected)`;
        } else {
            nextButton.disabled = true;
            nextButton.textContent = 'Next';
        }
    }

    function goToStep2() {
        if (selectedSymptoms.length === 0) {
            showNotification('Please select at least one symptom', 'error');
            return;
        }

        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        currentStep = 2;
    }

    function goToStep1() {
        document.getElementById('step2').classList.remove('active');
        document.getElementById('step1').classList.add('active');
        currentStep = 1;
    }

    function goToStep2() {
        document.getElementById('step3').classList.remove('active');
        document.getElementById('step2').classList.add('active');
        currentStep = 2;
    }

    function analyzeSymptoms() {
        const duration = document.getElementById('symptomDuration').value;
        const waterSource = document.getElementById('waterSource').value;
        const additionalInfo = document.getElementById('additionalInfo').value;

        if (!duration || !waterSource) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Show loading state
        const analyzeBtn = document.getElementById('nextStep2');
        const originalText = analyzeBtn.textContent;
        analyzeBtn.innerHTML = '<div class="spinner"></div>';
        analyzeBtn.disabled = true;

        // Simulate AI analysis
        setTimeout(() => {
            analyzeBtn.textContent = originalText;
            analyzeBtn.disabled = false;

            const results = getAnalysisResults(selectedSymptoms, duration, waterSource, additionalInfo);
            displayResults(results);

            document.getElementById('step2').classList.remove('active');
            document.getElementById('step3').classList.add('active');
            currentStep = 3;
        }, 2000);
    }

    function getAnalysisResults(symptoms, duration, waterSource, additionalInfo) {
        // Simple matching algorithm
        let matchedIllnesses = [];
        
        illnessesData.forEach(illness => {
            const matchingSymptoms = illness.symptoms.filter(symptom => 
                symptoms.includes(symptom)
            );
            
            if (matchingSymptoms.length > 0) {
                const matchScore = matchingSymptoms.length / illness.symptoms.length;
                matchedIllnesses.push({
                    ...illness,
                    matchScore: matchScore,
                    matchingSymptoms: matchingSymptoms
                });
            }
        });

        // Sort by match score
        matchedIllnesses.sort((a, b) => b.matchScore - a.matchScore);

        // Determine overall risk level
        let overallRisk = 'low';
        const highRiskSymptoms = symptoms.filter(symptom => {
            const symptomData = Object.values(symptomsData).flat().find(s => s.id === symptom);
            return symptomData && symptomData.severity === 'high';
        });

        if (highRiskSymptoms.length > 0) {
            overallRisk = 'high';
        } else if (symptoms.length >= 3) {
            overallRisk = 'medium';
        }

        return {
            matchedIllnesses: matchedIllnesses.slice(0, 3), // Top 3 matches
            overallRisk: overallRisk,
            symptomsCount: symptoms.length,
            duration: duration,
            waterSource: waterSource
        };
    }

    function displayResults(results) {
        const resultCard = document.getElementById('resultCard');
        const recommendationsList = document.getElementById('recommendationsList');
        const emergencyAlert = document.getElementById('emergencyAlert');

        // Display matched illnesses
        if (results.matchedIllnesses.length > 0) {
            resultCard.innerHTML = `
                <div class="result-header">
                    <h3>Possible Conditions</h3>
                    <div class="risk-level ${results.overallRisk}">
                        ${results.overallRisk.toUpperCase()} RISK
                    </div>
                </div>
                <div class="illness-matches">
                    ${results.matchedIllnesses.map(illness => `
                        <div class="illness-match">
                            <h4>${illness.name}</h4>
                            <p>${illness.description}</p>
                            <div class="match-details">
                                <span class="match-score">${Math.round(illness.matchScore * 100)}% match</span>
                                <span class="matching-symptoms">
                                    ${illness.matchingSymptoms.length} matching symptoms
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            resultCard.innerHTML = `
                <div class="result-header">
                    <h3>No Specific Matches Found</h3>
                    <div class="risk-level low">
                        LOW RISK
                    </div>
                </div>
                <p>Based on your symptoms, no specific water-related illnesses were identified. However, it's always best to consult a healthcare professional for proper diagnosis.</p>
            `;
        }

        // Display recommendations
        const generalRecommendations = [
            "Drink plenty of clean, safe water",
            "Rest and monitor your symptoms",
            "Practice good hand hygiene",
            "Avoid preparing food for others if you have gastrointestinal symptoms"
        ];

        let allRecommendations = [...generalRecommendations];

        if (results.matchedIllnesses.length > 0) {
            results.matchedIllnesses.forEach(illness => {
                allRecommendations = [...allRecommendations, ...illness.recommendations];
            });
        }

        // Remove duplicates
        allRecommendations = [...new Set(allRecommendations)];

        recommendationsList.innerHTML = allRecommendations.map(rec => `
            <div class="recommendation-item">
                <i class="fas fa-check-circle"></i>
                <span>${rec}</span>
            </div>
        `).join('');

        // Show emergency alert if high risk
        if (results.overallRisk === 'high') {
            emergencyAlert.style.display = 'block';
        } else {
            emergencyAlert.style.display = 'none';
        }
    }

    function restartChecker() {
        // Reset everything
        selectedSymptoms = [];
        currentStep = 1;
        
        // Reset forms
        document.querySelectorAll('.symptom-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.getElementById('symptomDuration').value = '';
        document.getElementById('waterSource').value = '';
        document.getElementById('additionalInfo').value = '';
        
        // Go back to step 1
        document.getElementById('step3').classList.remove('active');
        document.getElementById('step1').classList.add('active');
        
        updateSelectedCount();
    }
}

// Add CSS for symptom checker
const symptomCheckerStyles = `
    .symptom-hero {
        padding: 150px 0 80px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
        text-align: center;
    }
    
    .symptom-hero h1 {
        font-size: 42px;
        margin-bottom: 20px;
    }
    
    .checker-container {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 40px;
        margin-top: 40px;
    }
    
    .checker-sidebar {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        height: fit-content;
        position: sticky;
        top: 100px;
    }
    
    .symptom-categories {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 30px;
    }
    
    .category {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        border: 2px solid transparent;
    }
    
    .category:hover {
        background: #f5f9ff;
    }
    
    .category.active {
        background: #e3f2fd;
        border-color: var(--primary);
    }
    
    .category i {
        font-size: 20px;
        color: var(--primary);
        width: 24px;
        text-align: center;
    }
    
    .quick-tips {
        background: #fff8e1;
        padding: 20px;
        border-radius: 8px;
        border-left: 4px solid var(--accent);
    }
    
    .quick-tips ul {
        list-style: none;
        margin-top: 15px;
    }
    
    .quick-tips li {
        padding: 8px 0;
        position: relative;
        padding-left: 20px;
    }
    
    .quick-tips li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--secondary);
        font-weight: bold;
    }
    
    .checker-main {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    
    .checker-step {
        display: none;
    }
    
    .checker-step.active {
        display: block;
    }
    
    .symptoms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin: 30px 0;
    }
    
    .symptom-item {
        border: 2px solid var(--border);
        border-radius: 8px;
        padding: 15px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .symptom-item:hover {
        border-color: var(--primary);
        background: #f5f9ff;
    }
    
    .symptom-checkbox {
        display: none;
    }
    
    .symptom-checkbox:checked + .symptom-label {
        color: var(--primary);
    }
    
    .symptom-checkbox:checked + .symptom-label .symptom-severity {
        opacity: 1;
    }
    
    .symptom-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        margin: 0;
    }
    
    .symptom-severity {
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 12px;
        font-weight: 600;
        opacity: 0.7;
    }
    
    .symptom-severity.low {
        background: #e6f4ea;
        color: var(--secondary);
    }
    
    .symptom-severity.medium {
        background: #fef7e0;
        color: var(--accent);
    }
    
    .symptom-severity.high {
        background: #fce8e6;
        color: var(--danger);
    }
    
    .checker-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid var(--border);
    }
    
    .results-container {
        margin: 30px 0;
    }
    
    .result-card {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        margin-bottom: 30px;
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .risk-level {
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 700;
    }
    
    .risk-level.low {
        background: #e6f4ea;
        color: var(--secondary);
    }
    
    .risk-level.medium {
        background: #fef7e0;
        color: var(--accent);
    }
    
    .risk-level.high {
        background: #fce8e6;
        color: var(--danger);
    }
    
    .illness-match {
        background: white;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 15px;
        border-left: 4px solid var(--primary);
    }
    
    .match-details {
        display: flex;
        gap: 20px;
        margin-top: 10px;
        font-size: 14px;
    }
    
    .match-score {
        color: var(--primary);
        font-weight: 600;
    }
    
    .recommendation-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 8px;
        margin-bottom: 10px;
        border-left: 4px solid var(--secondary);
    }
    
    .recommendation-item i {
        color: var(--secondary);
    }
    
    .emergency-alert {
        background: #fce8e6;
        border: 1px solid var(--danger);
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
    }
    
    .alert-content {
        display: flex;
        align-items: flex-start;
        gap: 15px;
    }
    
    .alert-content i {
        color: var(--danger);
        font-size: 24px;
        margin-top: 2px;
    }
    
    .common-illnesses {
        background: #f8f9fa;
        padding: 80px 0;
    }
    
    .illnesses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 50px;
    }
    
    .illness-card {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    }
    
    .illness-symptoms {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
    }
    
    .symptom-tag {
        background: #e3f2fd;
        color: var(--primary);
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .disclaimer {
        font-size: 12px;
        color: #666;
        margin-top: 10px;
    }
    
    @media (max-width: 768px) {
        .checker-container {
            grid-template-columns: 1fr;
        }
        
        .checker-sidebar {
            position: static;
        }
        
        .symptoms-grid {
            grid-template-columns: 1fr;
        }
        
        .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = symptomCheckerStyles;
document.head.appendChild(styleSheet);