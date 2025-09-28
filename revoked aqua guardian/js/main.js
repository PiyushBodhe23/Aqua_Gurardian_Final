// Main JavaScript for Aqua Guardian Health

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initTestimonialSlider();
    initSmoothScrolling();
    initForms();
    initWaterQualityUpdates();
});

// Navigation functionality
function initNavigation() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    if (mobileMenu && nav) {
        mobileMenu.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    
    if (testimonials.length === 0) return;
    
    function showSlide(n) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + testimonials.length) % testimonials.length;
        
        testimonials[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    
    // Auto slide
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
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
}

// Form initialization
function initForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            this.reset();
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simulate form submission
            showNotification('Thank you for your message! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Water quality updates (simulated)
function initWaterQualityUpdates() {
    const indexValues = document.querySelectorAll('.index-value');
    
    if (indexValues.length === 0) return;
    
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        indexValues.forEach(valueElement => {
            const currentValue = parseFloat(valueElement.textContent);
            const randomChange = (Math.random() - 0.5) * 0.5; // Random change between -0.25 and +0.25
            
            // Update value with animation
            valueElement.style.opacity = '0.5';
            setTimeout(() => {
                const newValue = Math.max(0, currentValue + randomChange);
                valueElement.textContent = newValue.toFixed(1);
                valueElement.style.opacity = '1';
                
                // Update status if needed
                updateQualityStatus(valueElement, newValue);
            }, 300);
        });
    }, 30000);
}

function updateQualityStatus(valueElement, newValue) {
    const statusElement = valueElement.parentElement.querySelector('.index-status');
    const rangeText = valueElement.parentElement.querySelector('.index-range').textContent;
    
    if (!statusElement) return;
    
    // Extract safe range from text (this is a simplified approach)
    let safeMin, safeMax;
    
    if (rangeText.includes('pH')) {
        safeMin = 6.5;
        safeMax = 8.5;
    } else if (rangeText.includes('NTU')) {
        safeMin = 0;
        safeMax = 5;
    } else if (rangeText.includes('Chlorine')) {
        safeMin = 1.0;
        safeMax = 4.0;
    } else if (rangeText.includes('Coliform')) {
        // For coliform, any presence is bad
        safeMin = 0;
        safeMax = 0;
    }
    
    // Update status based on new value
    if (newValue >= safeMin && newValue <= safeMax) {
        statusElement.textContent = 'Optimal';
        statusElement.className = 'index-status good';
    } else if (Math.abs(newValue - safeMin) < 0.5 || Math.abs(newValue - safeMax) < 0.5) {
        statusElement.textContent = 'Moderate';
        statusElement.className = 'index-status warning';
    } else {
        statusElement.textContent = 'Poor';
        statusElement.className = 'index-status danger';
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-content {
                padding: 15px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .notification-message {
                flex: 1;
                margin-right: 15px;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
            }
            
            .notification-info {
                border-left: 4px solid var(--primary);
            }
            
            .notification-success {
                border-left: 4px solid var(--secondary);
            }
            
            .notification-warning {
                border-left: 4px solid var(--accent);
            }
            
            .notification-error {
                border-left: 4px solid var(--danger);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        if (notification.parentElement) {
            notification.parentElement.removeChild(notification);
        }
    });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initTestimonialSlider,
        initSmoothScrolling,
        initForms,
        showNotification
    };
}