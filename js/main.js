// ===== THEME 2: BOLD TECH EDGE JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize all functionality
        initNavigation();
        initSmoothScrolling();
        initScrollAnimations();
        initGalleryModals();
        initAnimatedStats();
        initMobileMenu();
        
        // Fallback mobile menu initialization after a short delay
        setTimeout(() => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            console.log('Fallback check - Hamburger:', hamburger, 'NavMenu:', navMenu);
            
            if (hamburger && navMenu && !hamburger.hasAttribute('data-initialized')) {
                hamburger.setAttribute('data-initialized', 'true');
                hamburger.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Fallback hamburger clicked!');
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                    console.log('Fallback menu toggled. Active classes:', {
                        hamburger: hamburger.classList.contains('active'),
                        navMenu: navMenu.classList.contains('active')
                    });
                });
                console.log('Fallback mobile menu initialized');
            }
        }, 500);
        
        // Additional fallback for about page specifically
        setTimeout(() => {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            if (currentPage === 'about.html') {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (hamburger && navMenu && !hamburger.hasAttribute('data-about-initialized')) {
                    hamburger.setAttribute('data-about-initialized', 'true');
                    hamburger.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('About page fallback hamburger clicked!');
                        hamburger.classList.toggle('active');
                        navMenu.classList.toggle('active');
                        console.log('About page fallback menu toggled. Active classes:', {
                            hamburger: hamburger.classList.contains('active'),
                            navMenu: navMenu.classList.contains('active')
                        });
                    });
                    console.log('About page fallback mobile menu initialized');
                }
            }
        }, 1000);
        
        // Final safety net - direct event delegation for mobile menu
        document.addEventListener('click', function(e) {
            if (e.target.closest('.hamburger')) {
                const hamburger = e.target.closest('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (navMenu) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Direct delegation hamburger clicked!');
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                    console.log('Direct delegation menu toggled. Active classes:', {
                        hamburger: hamburger.classList.contains('active'),
                        navMenu: navMenu.classList.contains('active')
                    });
                }
            }
        });
        
        console.log('SmartForge Theme 2 - Bold Tech Edge initialized successfully');
    } catch (error) {
        console.error('Error initializing SmartForge Theme 2:', error);
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

// ===== MOBILE MENU =====
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('Initializing mobile menu - Hamburger:', hamburger, 'NavMenu:', navMenu);
    
    if (hamburger && navMenu) {
        // Remove any existing event listeners to prevent duplicates
        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        // Add event listener to the new element
        newHamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Main hamburger clicked!');
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('Main menu toggled. Active classes:', {
                hamburger: newHamburger.classList.contains('active'),
                navMenu: navMenu.classList.contains('active')
            });
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                newHamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        console.log('Mobile menu initialized successfully');
    } else {
        console.warn('Mobile menu elements not found:', { hamburger, navMenu });
    }
}

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

// ===== ENHANCED HOVER EFFECTS =====
// Removed cursor follower particle effects for clean, elite appearance
// Kept only essential hover effects for professional UI 