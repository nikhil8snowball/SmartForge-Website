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

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
