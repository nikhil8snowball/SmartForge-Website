// Component Loader for Header and Footer
class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        // Skip component loading on production/server environments
        // since the HTML files already have the navigation built-in
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' || 
            window.location.protocol === 'file:') {
            await this.loadHeader();
            await this.loadFooter();
        }
        this.setActiveNavLink();
    }

    async loadHeader() {
        try {
            const response = await fetch('components/header.html');
            const headerHtml = await response.text();
            
            // Find the header placeholder or replace existing header
            const existingHeader = document.querySelector('.navbar');
            if (existingHeader) {
                existingHeader.outerHTML = headerHtml;
                
                // Re-initialize mobile menu after header is replaced
                if (window.mobileMenuInstance) {
                    setTimeout(() => {
                        window.mobileMenuInstance.setupElements();
                        window.mobileMenuInstance.bindEvents();
                    }, 50);
                }
            }
        } catch (error) {
            console.warn('Could not load header component:', error);
        }
    }

    async loadFooter() {
        try {
            const response = await fetch('components/footer.html');
            const footerHtml = await response.text();
            
            // Find the footer placeholder or replace existing footer
            const existingFooter = document.querySelector('.footer');
            if (existingFooter) {
                existingFooter.outerHTML = footerHtml;
            }
        } catch (error) {
            console.warn('Could not load footer component:', error);
        }
    }

    setActiveNavLink() {
        // Set active state for current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (currentPage === 'index.html' && link.getAttribute('href') === '#home') {
                link.classList.add('active');
            } else if (currentPage === 'about.html' && link.getAttribute('href') === 'about.html') {
                link.classList.add('active');
            } else if (currentPage === 'blog.html' && link.getAttribute('href') === 'blog.html') {
                link.classList.add('active');
            }
        });
    }
}

// Mobile Menu Functionality
class MobileMenu {
    constructor() {
        this.hamburger = null;
        this.navMenu = null;
        this.navLinks = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Initialize mobile menu immediately
        this.setupElements();
        this.bindEvents();
        
        // Also try again after a short delay in case elements weren't ready
        setTimeout(() => {
            if (!this.isInitialized) {
                this.setupElements();
                this.bindEvents();
            }
        }, 100);
    }

    setupElements() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        console.log('Mobile menu elements found:', {
            hamburger: !!this.hamburger,
            navMenu: !!this.navMenu,
            navLinks: this.navLinks.length
        });
    }

    bindEvents() {
        // Remove existing event listeners to prevent duplicates
        if (this.hamburger) {
            this.hamburger.removeEventListener('click', this.toggleMenu);
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        if (this.navLinks) {
            this.navLinks.forEach(link => {
                link.removeEventListener('click', this.closeMenu);
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        // Remove existing document event listeners
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleEscapeKey);
        
        // Add new event listeners
        this.handleOutsideClick = (e) => {
            if (!this.hamburger?.contains(e.target) && !this.navMenu?.contains(e.target)) {
                this.closeMenu();
            }
        };
        
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        };
        
        document.addEventListener('click', this.handleOutsideClick);
        document.addEventListener('keydown', this.handleEscapeKey);
        
        this.isInitialized = true;
        console.log('Mobile menu events bound successfully');
    }

    toggleMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    closeMenu() {
        if (!this.hamburger || !this.navMenu) return;

        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
    window.mobileMenuInstance = new MobileMenu();
});
