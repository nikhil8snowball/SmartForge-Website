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
        // Wait for DOM to be fully ready
        setTimeout(() => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!hamburger || !navMenu) {
                console.warn('Mobile menu elements not found');
                return;
            }
            
            // Remove any existing event listeners by cloning the element
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);
            
            // Create a clean event handler
            const toggleMobileMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle active classes
                newHamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Log the state
                const isActive = navMenu.classList.contains('active');
                console.log(`Mobile menu ${isActive ? 'opened' : 'closed'}`);
            };
            
            // Add the event listener
            newHamburger.addEventListener('click', toggleMobileMenu);
            
            // Close menu when clicking on navigation links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    newHamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    console.log('Mobile menu closed by nav link click');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                    if (navMenu.classList.contains('active')) {
                        newHamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                        console.log('Mobile menu closed by outside click');
                    }
                }
            });
            
            console.log('Fresh mobile menu initialized successfully');
        }, 100);
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
});
