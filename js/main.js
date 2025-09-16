// ===== SMARTFORGE POLYMERS JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all functionality
        initNavigation();
        initSmoothScrolling();
        initScrollAnimations();
        initGalleryModals();
        initAnimatedStats();
        initNewsletterForm();
        
        console.log('SmartForge Polymers website initialized successfully');
    } catch (error) {
        console.error('Error initializing SmartForge Polymers Theme 2:', error);
    }
});

// ===== NAVIGATION FUNCTIONALITY =====
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(236, 240, 241, 0.98)'; // Secondary Neutral with transparency
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.background = 'rgba(236, 240, 241, 0.95)'; // Secondary Neutral with transparency
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            console.log('Navigation link clicked:', targetId); // Debug log
            
            // Handle external links (like about.html)
            if (targetId.startsWith('http') || targetId.includes('.html')) {
                window.location.href = targetId;
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                console.log('Scrolling to:', targetId, 'at position:', offsetTop); // Debug log
            } else {
                console.log('Target section not found:', targetId); // Debug log
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .offer-item, .gallery-item, .stat-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== ANIMATED STATS =====
function initAnimatedStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateNumber = (element, target) => {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 30);
    };
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===== GALLERY MODAL FUNCTIONALITY =====
function initGalleryModals() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modals = document.querySelectorAll('.gallery-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Open modal on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const imageId = this.getAttribute('data-image');
            const modal = document.getElementById(`modal-${imageId}`);
            if (modal) {
                // Close any other open modals first
                modals.forEach(m => {
                    m.style.display = 'none';
                    m.classList.remove('active');
                });
                
                // Show modal
                modal.style.display = 'block';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add class to body to prevent hover effects
                document.body.classList.add('modal-open');
                
                // Focus trap for accessibility
                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.focus();
                }
            }
        });
    });

    // Close modal with X button
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const modal = this.closest('.gallery-modal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
                this.classList.remove('active');
                document.body.style.overflow = 'auto';
                document.body.classList.remove('modal-open');
            }
        });
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.gallery-modal.active');
            if (openModal) {
                openModal.style.display = 'none';
                openModal.classList.remove('active');
                document.body.style.overflow = 'auto';
                document.body.classList.remove('modal-open');
            }
        }
    });
}

// Mobile menu functionality moved to components.js

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #00FFFF, #B4FF00)';
        notification.style.color = '#0D0D0D';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(45deg, #FF6B6B, #FF8E53)';
    } else {
        notification.style.background = 'linear-gradient(45deg, #8B5CF6, #00FFFF)';
    }
    
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
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ===== NEWSLETTER FORM FUNCTIONALITY =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('newsletter-email');
        const submitBtn = document.querySelector('.newsletter-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const messageDiv = document.getElementById('newsletter-message');
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showMessage(messageDiv, 'Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        
        try {
            // Generate unique entry ID
            const entryId = generateUniqueId();
            
            // Get Contentful configuration
            if (typeof config === 'undefined') {
                throw new Error('Configuration not loaded. Please refresh the page.');
            }
            const contentfulConfig = config.getContentfulConfig();
            
            // Create entry in Contentful
            const createResponse = await fetch(
                `https://api.contentful.com/spaces/${contentfulConfig.spaceId}/environments/${contentfulConfig.environment}/entries/${entryId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${contentfulConfig.managementToken}`,
                        'Content-Type': 'application/vnd.contentful.management.v1+json',
                        'X-Contentful-Content-Type': 'newsletterSubscriber'
                    },
                    body: JSON.stringify({
                        fields: {
                            email: { 'en-US': email },
                            subscriptionDate: { 'en-US': new Date().toISOString() },
                            status: { 'en-US': 'active' },
                            source: { 'en-US': 'website' }
                        }
                    })
                }
            );
            
            if (!createResponse.ok) {
                throw new Error(`HTTP error! status: ${createResponse.status}`);
            }
            
            const entryData = await createResponse.json();
            
            // Publish entry
            const publishResponse = await fetch(
                `https://api.contentful.com/spaces/${contentfulConfig.spaceId}/environments/${contentfulConfig.environment}/entries/${entryId}/published`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${contentfulConfig.managementToken}`,
                        'X-Contentful-Version': entryData.sys.version
                    }
                }
            );
            
            if (!publishResponse.ok) {
                throw new Error(`Failed to publish entry: ${publishResponse.status}`);
            }
            
            // Success
            showMessage(messageDiv, 'Thank you for subscribing! You\'ll receive our latest updates soon.', 'success');
            emailInput.value = '';
            
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showMessage(messageDiv, 'Sorry, there was an error subscribing. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
        }
    });
}

// Helper function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to generate unique ID
function generateUniqueId() {
    return 'newsletter-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Helper function to show messages
function showMessage(messageDiv, text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.className = 'form-message';
            messageDiv.textContent = '';
        }, 5000);
    }
}

// ===== ENHANCED HOVER EFFECTS =====
// Removed cursor follower particle effects for clean, elite appearance
// Kept only essential hover effects for professional UI 