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
                // Check if we're on the about page and need to preserve navigation links
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                let modifiedHeaderHtml = headerHtml;
                
                if (currentPage === 'about.html') {
                    // Update navigation links for about page
                    modifiedHeaderHtml = headerHtml
                        .replace('href="index.html#home"', 'href="index.html"')
                        .replace('href="index.html#breakthrough"', 'href="index.html#breakthrough"')
                        .replace('href="index.html#scaleup"', 'href="index.html#scaleup"')
                        .replace('href="index.html#features"', 'href="index.html#features"')
                        .replace('href="index.html#gallery"', 'href="index.html#gallery"')
                        .replace('href="index.html#offers"', 'href="index.html#offers"')
                        .replace('href="index.html#contact"', 'href="index.html#contact"');
                }
                
                existingHeader.outerHTML = modifiedHeaderHtml;
                
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
        
        console.log('Initializing mobile menu - Hamburger:', hamburger, 'NavMenu:', navMenu);
        
        if (hamburger && navMenu) {
            // Remove any existing event listeners to prevent duplicates
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);
            
            // Add new event listener
            newHamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('About page hamburger clicked!');
                newHamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                console.log('About page menu toggled. Active classes:', {
                    hamburger: newHamburger.classList.contains('active'),
                    navMenu: navMenu.classList.contains('active')
                });
            });
            
            // Close menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    newHamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
            
            console.log('About page mobile menu initialized successfully');
        } else {
            console.warn('About page mobile menu elements not found:', { hamburger, navMenu });
        }
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
