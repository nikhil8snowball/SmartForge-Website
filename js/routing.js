/**
 * Clean URL Routing System for SmartForge Website
 * Handles navigation between sections and pages with clean URLs
 */

class SmartForgeRouter {
    constructor() {
        this.routes = {
            '/': 'home',
            '/breakthrough': 'breakthrough',
            '/technologies': 'technologies',
            '/features': 'features',
            '/gallery': 'gallery',
            '/offers': 'offers',
            '/contact': 'contact',
            '/about': 'about',
            '/blog': 'blog'
        };
        
        this.init();
    }

    init() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(e.state?.path || window.location.pathname);
        });

        // Handle initial page load
        this.handleRoute(window.location.pathname);

        // Update all navigation links to use clean URLs
        this.updateNavigationLinks();
    }

    handleRoute(path) {
        // Normalize path
        if (path === '/index.html' || path === '/index.html/') {
            path = '/';
        }

        // Handle root path
        if (path === '/' || path === '') {
            this.navigateToSection('home');
            return;
        }

        // Check if it's a section route
        const section = this.routes[path];
        if (section) {
            if (section === 'about' || section === 'blog') {
                // Navigate to separate pages
                window.location.href = `/${section}.html`;
                return;
            } else {
                // Navigate to section on home page
                this.navigateToSection(section);
                return;
            }
        }

        // Handle unknown routes - redirect to home
        this.navigateToSection('home');
    }

    navigateToSection(sectionId) {
        // If we're not on the home page, navigate to home first
        if (!window.location.pathname.includes('index.html') && 
            window.location.pathname !== '/' && 
            window.location.pathname !== '') {
            window.location.href = '/index.html';
            return;
        }

        // Scroll to the section
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                console.warn(`Section with id '${sectionId}' not found`);
            }
        }, 100);

        // Update URL without page reload
        const cleanPath = sectionId === 'home' ? '/' : `/${sectionId}`;
        if (window.location.pathname !== cleanPath) {
            window.history.pushState({ path: cleanPath }, '', cleanPath);
        }
    }

    updateNavigationLinks() {
        // Update all navigation links to use clean URLs
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                if (href.startsWith('index.html#')) {
                    const section = href.split('#')[1];
                    link.setAttribute('href', section === 'home' ? '/' : `/${section}`);
                } else if (href.startsWith('#')) {
                    const section = href.substring(1);
                    link.setAttribute('href', section === 'home' ? '/' : `/${section}`);
                } else if (href === 'about.html') {
                    link.setAttribute('href', '/about');
                } else if (href === 'blog.html') {
                    link.setAttribute('href', '/blog');
                }
            }
        });

        // Update CTA buttons
        const ctaButtons = document.querySelectorAll('.book-call-btn, .cta-button');
        ctaButtons.forEach(button => {
            const href = button.getAttribute('href');
            if (href === '#contact' || href === 'index.html#contact') {
                button.setAttribute('href', '/contact');
            }
        });

        // Add click event listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateToCleanUrl(href);
            });
        });

        // Add click event listeners to CTA buttons
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                if (href === '/contact') {
                    e.preventDefault();
                    this.navigateToCleanUrl('/contact');
                }
            });
        });
    }

    navigateToCleanUrl(path) {
        if (path === '/about' || path === '/blog') {
            // Navigate to separate pages
            window.location.href = `${path}.html`;
        } else {
            // Navigate to section
            this.navigateToSection(path === '/' ? 'home' : path.substring(1));
        }
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SmartForgeRouter();
});

// Export for use in other scripts
window.SmartForgeRouter = SmartForgeRouter;
