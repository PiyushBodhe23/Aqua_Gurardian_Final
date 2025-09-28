// Contact page functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
});

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validate form
            if (!validateContactForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<div class="spinner"></div>';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // In a real application, you would send the data to a server here
                console.log('Contact form submitted:', data);
            }, 2000);
        });
    }
}

function validateContactForm(data) {
    // Basic validation
    if (!data.firstName || !data.lastName) {
        showNotification('Please enter your full name', 'error');
        return false;
    }
    
    if (!data.email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.subject) {
        showNotification('Please select a subject', 'error');
        return false;
    }
    
    if (!data.message || data.message.length < 10) {
        showNotification('Please enter a detailed message (at least 10 characters)', 'error');
        return false;
    }
    
    return true;
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question i').classList.remove('fa-chevron-up');
                    otherItem.querySelector('.faq-question i').classList.add('fa-chevron-down');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.querySelector('i').classList.remove('fa-chevron-down');
                question.querySelector('i').classList.add('fa-chevron-up');
            } else {
                answer.style.maxHeight = null;
                question.querySelector('i').classList.remove('fa-chevron-up');
                question.querySelector('i').classList.add('fa-chevron-down');
            }
        });
    });
}

// Add CSS for contact page
const contactStyles = `
    .contact-hero {
        padding: 150px 0 80px;
        background: linear-gradient(135deg, #e3f2fd 0%, #f0f4ff 100%);
        text-align: center;
    }
    
    .contact-hero h1 {
        font-size: 42px;
        margin-bottom: 20px;
    }
    
    .contact-section {
        padding: 80px 0;
        background: white;
    }
    
    .contact-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 60px;
        align-items: start;
    }
    
    .contact-info h2 {
        margin-bottom: 20px;
        color: var(--dark);
    }
    
    .contact-info > p {
        margin-bottom: 40px;
        color: var(--text);
    }
    
    .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 30px;
        margin-bottom: 50px;
    }
    
    .contact-method {
        display: flex;
        align-items: flex-start;
        gap: 20px;
    }
    
    .method-icon {
        width: 50px;
        height: 50px;
        background: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .method-details h3 {
        margin-bottom: 8px;
        color: var(--dark);
        font-size: 18px;
    }
    
    .method-details p {
        color: var(--text);
        margin: 0;
    }
    
    .emergency-contact {
        background: #fce8e6;
        padding: 25px;
        border-radius: 10px;
        border-left: 4px solid var(--danger);
    }
    
    .emergency-contact h3 {
        margin-bottom: 10px;
        color: var(--dark);
    }
    
    .emergency-contact > p {
        margin-bottom: 15px;
        color: var(--text);
    }
    
    .emergency-number {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 18px;
        font-weight: 700;
        color: var(--danger);
    }
    
    .emergency-number i {
        font-size: 24px;
    }
    
    .contact-form-container {
        background: #f8f9fa;
        padding: 40px;
        border-radius: 10px;
    }
    
    .contact-form-container h2 {
        margin-bottom: 30px;
        color: var(--dark);
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        cursor: pointer;
        font-size: 14px;
        color: var(--text);
    }
    
    .checkbox-label input {
        margin-top: 2px;
    }
    
    .checkbox-label a {
        color: var(--primary);
        text-decoration: none;
    }
    
    .checkbox-label a:hover {
        text-decoration: underline;
    }
    
    .faq-section {
        padding: 80px 0;
        background: #f8f9fa;
    }
    
    .faq-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: white;
        border-radius: 10px;
        margin-bottom: 15px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        overflow: hidden;
    }
    
    .faq-question {
        padding: 25px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .faq-question:hover {
        background: #f5f9ff;
    }
    
    .faq-question h3 {
        margin: 0;
        font-size: 18px;
        color: var(--dark);
        flex: 1;
    }
    
    .faq-question i {
        color: var(--primary);
        transition: transform 0.3s;
        margin-left: 15px;
    }
    
    .faq-answer {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        background: #f8f9fa;
    }
    
    .faq-answer p {
        padding: 0 25px 25px;
        margin: 0;
        color: var(--text);
        line-height: 1.6;
    }
    
    .faq-item.active .faq-answer {
        max-height: 200px;
    }
    
    @media (max-width: 992px) {
        .contact-container {
            grid-template-columns: 1fr;
            gap: 40px;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
    }
    
    @media (max-width: 768px) {
        .contact-form-container {
            padding: 30px 20px;
        }
        
        .contact-method {
            flex-direction: column;
            text-align: center;
            gap: 15px;
        }
        
        .faq-question {
            padding: 20px;
        }
        
        .faq-question h3 {
            font-size: 16px;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);