// Component Loader for Header and Footer
class ComponentLoader {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadHeader();
        await this.loadFooter();
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
        this.init();
    }

    init() {
        // Wait for components to load, then initialize mobile menu
        setTimeout(() => {
            this.setupElements();
            this.bindEvents();
        }, 100);
    }

    setupElements() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
    }

    bindEvents() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        if (this.navLinks) {
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger?.contains(e.target) && !this.navMenu?.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
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
    new MobileMenu();
});
