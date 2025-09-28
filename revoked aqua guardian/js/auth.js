// Authentication functionality for Aqua Guardian Health

document.addEventListener('DOMContentLoaded', function() {
    initAuthModal();
    initAuthForms();
});

// Auth modal functionality
function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeBtn = document.querySelector('.close');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    if (!authModal) return;
    
    // Open modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
            switchTab('login');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            authModal.style.display = 'block';
            switchTab('signup');
        });
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            authModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');
            switchTab(tab);
        });
    });
}

function switchTab(tab) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const authForms = document.querySelectorAll('.auth-form');
    
    // Update active tab button
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show active form
    authForms.forEach(form => {
        if (form.id === `${tab}Form`) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
}

// Auth forms functionality
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate API call
    showLoading(loginForm);
    
    setTimeout(() => {
        hideLoading(loginForm);
        
        // For demo purposes, accept any login
        if (email && password) {
            showNotification('Login successful!', 'success');
            document.getElementById('authModal').style.display = 'none';
            loginForm.reset();
            
            // Update UI for logged in state
            updateAuthUI(true, email);
        } else {
            showNotification('Invalid email or password', 'error');
        }
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate API call
    showLoading(signupForm);
    
    setTimeout(() => {
        hideLoading(signupForm);
        
        // For demo purposes, accept any signup
        showNotification('Account created successfully!', 'success');
        document.getElementById('authModal').style.display = 'none';
        signupForm.reset();
        
        // Switch to login tab for next time
        switchTab('login');
        
        // Update UI for logged in state
        updateAuthUI(true, email);
    }, 1500);
}

function showLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.innerHTML = '<div class="spinner"></div>';
    submitBtn.disabled = true;
    
    // Store original text for later restoration
    submitBtn.setAttribute('data-original-text', originalText);
}

function hideLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.getAttribute('data-original-text');
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
}

function updateAuthUI(isLoggedIn, email) {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (isLoggedIn) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <button class="btn btn-outline" id="userBtn">
                    <i class="fas fa-user"></i> ${email.split('@')[0]}
                </button>
                <div class="user-dropdown">
                    <a href="#" class="dropdown-item">Dashboard</a>
                    <a href="#" class="dropdown-item">Profile</a>
                    <a href="#" class="dropdown-item" id="logoutBtn">Logout</a>
                </div>
            </div>
        `;
        
        // Add dropdown functionality
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.querySelector('.user-dropdown');
        const logoutBtn = document.getElementById('logoutBtn');
        
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });
        
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateAuthUI(false);
            showNotification('Logged out successfully', 'info');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('active');
        });
        
        // Add dropdown styles if not already added
        if (!document.querySelector('#user-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'user-menu-styles';
            style.textContent = `
                .user-menu {
                    position: relative;
                    display: inline-block;
                }
                
                .user-dropdown {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    min-width: 160px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                    border-radius: 5px;
                    z-index: 1000;
                    display: none;
                    margin-top: 5px;
                }
                
                .user-dropdown.active {
                    display: block;
                    animation: fadeIn 0.3s ease;
                }
                
                .dropdown-item {
                    display: block;
                    padding: 12px 16px;
                    text-decoration: none;
                    color: var(--text);
                    border-bottom: 1px solid var(--border);
                    transition: background 0.3s;
                }
                
                .dropdown-item:last-child {
                    border-bottom: none;
                }
                
                .dropdown-item:hover {
                    background: var(--light);
                    color: var(--primary);
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        authButtons.innerHTML = `
            <button class="btn btn-outline" id="loginBtn">Login</button>
            <button class="btn btn-primary" id="signupBtn">Sign Up</button>
        `;
        
        // Reinitialize auth modal for new buttons
        initAuthModal();
    }
}

// Check if user is already logged in (for demo purposes)
function checkAuthStatus() {
    // In a real app, this would check localStorage or make an API call
    const isLoggedIn = localStorage.getItem('aquaGuardianLoggedIn');
    const userEmail = localStorage.getItem('aquaGuardianUserEmail');
    
    if (isLoggedIn === 'true' && userEmail) {
        updateAuthUI(true, userEmail);
    }
}

// Call on page load
checkAuthStatus();
