// Prevention Guidelines functionality

document.addEventListener('DOMContentLoaded', function() {
    initGuidelines();
    initResourceDownloads();
});

function initGuidelines() {
    // Smooth scrolling for guideline links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize interactive elements
    initInteractiveGuidelines();
}

function initInteractiveGuidelines() {
    // Add expand/collapse functionality to guideline cards
    const guidelineCards = document.querySelectorAll('.guideline-card');
    
    guidelineCards.forEach(card => {
        const steps = card.querySelector('.guideline-steps');
        if (steps) {
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-steps-btn';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            toggleBtn.addEventListener('click', function() {
                steps.classList.toggle('expanded');
                this.querySelector('i').classList.toggle('fa-chevron-down');
                this.querySelector('i').classList.toggle('fa-chevron-up');
            });
            
            card.appendChild(toggleBtn);
        }
    });
    
    // Initialize emergency preparedness checklist
    initEmergencyChecklist();
}

function initEmergencyChecklist() {
    const emergencyCards = document.querySelectorAll('.emergency-card');
    
    emergencyCards.forEach(card => {
        const steps = card.querySelectorAll('.step');
        
        steps.forEach(step => {
            step.addEventListener('click', function() {
                this.classList.toggle('completed');
                
                // Update step number to checkmark when completed
                const stepNumber = this.querySelector('.step-number');
                if (this.classList.contains('completed')) {
                    stepNumber.innerHTML = '<i class="fas fa-check"></i>';
                    stepNumber.style.background = 'var(--secondary)';
                } else {
                    stepNumber.textContent = stepNumber.textContent;
                    stepNumber.style.background = 'var(--primary)';
                }
                
                // Check if all steps are completed
                const allSteps = this.parentElement.querySelectorAll('.step');
                const completedSteps = this.parentElement.querySelectorAll('.step.completed');
                
                if (allSteps.length === completedSteps.length) {
                    showNotification('All emergency steps completed!', 'success');
                }
            });
        });
    });
}

function initResourceDownloads() {
    const downloadButtons = document.querySelectorAll('.resource-card .btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
            
            // Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<div class="spinner"></div>';
            this.disabled = true;
            
            // Simulate download process
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                
                showNotification(`Downloading: ${resourceTitle}`, 'info');
                
                // In a real application, this would trigger an actual download
                setTimeout(() => {
                    showNotification(`${resourceTitle} downloaded successfully!`, 'success');
                }, 1000);
            }, 1500);
        });
    });
}

// Add CSS for guidelines page
const guidelinesStyles = `
    .guidelines-hero {
        padding: 150px 0 80px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
        text-align: center;
    }
    
    .guidelines-hero h1 {
        font-size: 42px;
        margin-bottom: 20px;
    }
    
    .quick-actions {
        padding: 60px 0;
        background: white;
    }
    
    .actions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 30px;
    }
    
    .action-card {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        transition: transform 0.3s, box-shadow 0.3s;
        border: 2px solid transparent;
    }
    
    .action-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-color: var(--primary);
    }
    
    .action-icon {
        width: 80px;
        height: 80px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 32px;
    }
    
    .action-card h3 {
        margin-bottom: 15px;
        color: var(--dark);
    }
    
    .action-card p {
        margin-bottom: 20px;
        color: var(--text);
    }
    
    .who-guidelines {
        padding: 80px 0;
        background: #f8f9fa;
    }
    
    .guideline-category {
        margin-bottom: 60px;
    }
    
    .guideline-category h3 {
        font-size: 28px;
        margin-bottom: 30px;
        color: var(--dark);
        padding-bottom: 10px;
        border-bottom: 2px solid var(--primary);
    }
    
    .guideline-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }
    
    .guideline-card {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        position: relative;
        transition: transform 0.3s;
    }
    
    .guideline-card:hover {
        transform: translateY(-5px);
    }
    
    .guideline-card h4 {
        font-size: 20px;
        margin-bottom: 15px;
        color: var(--dark);
    }
    
    .guideline-card p {
        margin-bottom: 20px;
        color: var(--text);
    }
    
    .guideline-steps {
        list-style: none;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
    }
    
    .guideline-steps.expanded {
        max-height: 500px;
    }
    
    .guideline-steps li {
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        position: relative;
        padding-left: 25px;
    }
    
    .guideline-steps li:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--secondary);
        font-weight: bold;
    }
    
    .guideline-steps li:last-child {
        border-bottom: none;
    }
    
    .toggle-steps-btn {
        position: absolute;
        top: 30px;
        right: 30px;
        background: var(--primary);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
    }
    
    .toggle-steps-btn:hover {
        background: #0d62d9;
    }
    
    .emergency-preparedness {
        padding: 80px 0;
        background: white;
    }
    
    .emergency-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 40px;
    }
    
    .emergency-card {
        background: #f8f9fa;
        padding: 30px;
        border-radius: 10px;
        border-left: 4px solid var(--primary);
    }
    
    .emergency-card h3 {
        margin-bottom: 25px;
        color: var(--dark);
        font-size: 24px;
    }
    
    .emergency-steps {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .step {
        display: flex;
        align-items: flex-start;
        gap: 15px;
        padding: 15px;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s;
        border: 2px solid transparent;
    }
    
    .step:hover {
        border-color: var(--primary);
        background: #f5f9ff;
    }
    
    .step.completed {
        background: #e6f4ea;
        border-color: var(--secondary);
    }
    
    .step-number {
        width: 30px;
        height: 30px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 14px;
        flex-shrink: 0;
        transition: background 0.3s;
    }
    
    .step p {
        margin: 0;
        color: var(--text);
    }
    
    .download-resources {
        padding: 80px 0;
        background: #f8f9fa;
    }
    
    .resources-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 30px;
    }
    
    .resource-card {
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        transition: transform 0.3s;
    }
    
    .resource-card:hover {
        transform: translateY(-5px);
    }
    
    .resource-icon {
        width: 70px;
        height: 70px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        font-size: 28px;
    }
    
    .resource-card h3 {
        margin-bottom: 15px;
        color: var(--dark);
    }
    
    .resource-card p {
        margin-bottom: 20px;
        color: var(--text);
    }
    
    @media (max-width: 768px) {
        .guideline-cards {
            grid-template-columns: 1fr;
        }
        
        .emergency-grid {
            grid-template-columns: 1fr;
        }
        
        .step {
            flex-direction: column;
            text-align: center;
        }
        
        .step-number {
            align-self: center;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = guidelinesStyles;
document.head.appendChild(styleSheet);