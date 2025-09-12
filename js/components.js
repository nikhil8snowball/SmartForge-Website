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
                
                // Reinitialize mobile menu after header is loaded
                this.initMobileMenu();
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

    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            // Remove any existing event listeners
            hamburger.removeEventListener('click', this.handleHamburgerClick);
            
            // Add new event listener
            this.handleHamburgerClick = () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            };
            
            hamburger.addEventListener('click', this.handleHamburgerClick);
            
            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            console.log('Mobile menu initialized successfully');
        } else {
            console.warn('Mobile menu elements not found:', { hamburger, navMenu });
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
