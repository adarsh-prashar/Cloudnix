// Global variables
let currentStep = 1;
let selectedTheme = null;
let formData = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners for theme selection
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            selectTheme(this);
        });
    });

    // Add form validation listeners
    setupFormValidation();

    // Add image upload functionality
    setupImageUpload();

    // Add animations
    addAnimations();
}

// Theme selection functionality
function selectTheme(card) {
    // Remove selection from all cards
    document.querySelectorAll('.theme-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    selectedTheme = card.dataset.theme;
    
    // Enable continue button
    const continueBtn = document.querySelector('#step1 .btn-primary');
    continueBtn.disabled = false;
    continueBtn.style.opacity = '1';
    
    // Show selection notification
    const themeName = card.querySelector('h3').textContent;
    showNotification(`Selected ${themeName} theme`, 'success');
}

// Step navigation
function nextStep() {
    if (currentStep === 1 && !selectedTheme) {
        showNotification('Please select a theme to continue', 'error');
        return;
    }
    
    if (currentStep === 2 && !validateStep2()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (currentStep === 3 && !validateStep3()) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    if (currentStep < 3) {
        currentStep++;
        updateStepDisplay();
        updateProgressBar();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateProgressBar();
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStepElement.classList.add('fade-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            currentStepElement.classList.remove('fade-in');
        }, 500);
    }
}

function updateProgressBar() {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    
    progressSteps.forEach((step, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            step.classList.remove('active');
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.remove('completed');
            step.classList.add('active');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
    
    progressLines.forEach((line, index) => {
        if (index + 1 < currentStep) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

// Form validation
function setupFormValidation() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        control.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateStep2() {
    const requiredFields = ['productType', 'productCategory', 'productName'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateStep3() {
    const requiredFields = ['productName', 'netPrice', 'listPrice', 'stockLevel'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if field is required and empty
    if (field.hasAttribute('required') || ['productType', 'productCategory', 'productName'].includes(fieldName)) {
        if (!value) {
            showFieldError(field, 'This field is required');
            return false;
        }
    }
    
    // Specific validation rules
    if (fieldName === 'productName' && value.length < 2) {
        showFieldError(field, 'Product name must be at least 2 characters');
        return false;
    }
    
    if (fieldName === 'productDescription' && value.length > 200) {
        showFieldError(field, 'Description must be less than 200 characters');
        return false;
    }
    
    // Store valid data
    formData[fieldName] = value;
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '14px';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Image upload functionality
function setupImageUpload() {
    const fileInput = document.getElementById('productImage');
    const uploadBox = document.querySelector('.image-upload-box');
    
    if (fileInput && uploadBox) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file, uploadBox);
            }
        });
        
        // Drag and drop functionality
        uploadBox.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadBox.style.borderColor = '#ff6b35';
            uploadBox.style.background = '#fef7f5';
        });
        
        uploadBox.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e1';
            uploadBox.style.background = '#f8fafc';
        });
        
        uploadBox.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadBox.style.borderColor = '#cbd5e1';
            uploadBox.style.background = '#f8fafc';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                fileInput.files = e.dataTransfer.files;
                handleImageUpload(file, uploadBox);
            }
        });
    }
}

function handleImageUpload(file, uploadBox) {
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const placeholder = uploadBox.querySelector('.upload-placeholder');
            placeholder.innerHTML = `
                <img src="${e.target.result}" alt="Uploaded Image" style="max-width: 100%; max-height: 150px; border-radius: 8px;">
                <p style="margin-top: 10px; color: #10b981;">Image uploaded successfully!</p>
            `;
        };
        reader.readAsDataURL(file);
    }
}

// Animations
function addAnimations() {
    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.theme-card, .pricing-card, .info-item');
    animateElements.forEach(el => observer.observe(el));
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Complete onboarding
function completeOnboarding() {
    // Collect all data
    const onboardingData = {
        theme: selectedTheme,
        product: formData,
        timestamp: new Date().toISOString()
    };
    
    // Show success message
    showNotification('Onboarding completed successfully!', 'success');
    
    // Simulate data submission
    console.log('Onboarding data:', onboardingData);
    
    // You can add actual API call here
    // submitOnboardingData(onboardingData);
    
    // Optional: Redirect to dashboard or show completion page
    setTimeout(() => {
        showCompletionPage();
    }, 2000);
}

function showCompletionPage() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="completion-page">
            <div class="completion-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1>Welcome to Cloudnix!</h1>
                <p>Your onboarding is complete. We're setting up your account and will send you an email with next steps.</p>
                <div class="completion-actions">
                    <button class="btn btn-primary" onclick="window.location.reload()">Start Over</button>
                </div>
            </div>
        </div>
    `;
    
    // Add completion page styles
    const style = document.createElement('style');
    style.textContent = `
        .completion-page {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
        }
        
        .completion-content {
            max-width: 500px;
            padding: 40px;
        }
        
        .success-icon {
            font-size: 80px;
            color: #10b981;
            margin-bottom: 30px;
        }
        
        .completion-content h1 {
            font-size: 36px;
            margin-bottom: 20px;
            color: #1e293b;
        }
        
        .completion-content p {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 40px;
            line-height: 1.6;
        }
    `;
    document.head.appendChild(style);
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        nextStep();
    }
    
    if (e.key === 'ArrowLeft' && e.ctrlKey) {
        e.preventDefault();
        prevStep();
    }
});

// Add CSS for form validation
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .form-control.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
    
    .error-message {
        color: #ef4444;
        font-size: 14px;
        margin-top: 5px;
    }
    
    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .btn:disabled:hover {
        transform: none;
        box-shadow: none;
    }
`;
document.head.appendChild(validationStyles); 