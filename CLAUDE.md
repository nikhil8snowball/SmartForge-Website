# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment

This is a static website project for SmartForge - a microfabrication technology company. The site uses vanilla HTML, CSS, and JavaScript with no build system or dependencies.

### Quick Start
- Open `index.html` directly in a browser to view the website
- No build process required - all files are served directly
- For development, use a local server like Python's `python -m http.server` or VS Code Live Server

### File Structure
```
SmartForge-Website-main/
├── index.html              # Main homepage
├── about.html              # About page
├── css/
│   └── style.css          # Complete stylesheet with mobile-first responsive design
├── js/
│   └── main.js            # JavaScript functionality for interactions
├── assets/
│   ├── images/            # Company logos, product images, technology photos
│   └── video/
│       └── hero-background.mp4  # Hero section video background
└── README.md              # Comprehensive design documentation
```

## Architecture & Design System

### Theme: "Bold Tech Edge"
- **Color Scheme**: Dark mode with neon accents (jet black #0D0D0D, electric cyan #00FFFF, neon lime #B4FF00)
- **Typography**: Space Grotesk for headers, IBM Plex Sans for body text
- **Design Philosophy**: Startup-driven, futuristic, confident design for tech innovation

### CSS Architecture
- **Mobile-first responsive design** with breakpoints at 768px and 1200px
- **CSS Grid and Flexbox** for layouts
- **CSS Variables** for consistent theming throughout `:root`
- **Utility classes** for spacing, layout, and common patterns
- **Custom animations** using keyframes for glitch effects, gradient shifts, and scroll animations

### JavaScript Features
- **Modular initialization** - all functionality initialized in `initNavigation()`, `initSmoothScrolling()`, etc.
- **Scroll animations** using Intersection Observer API
- **Gallery modal system** for image viewing
- **Animated statistics** that count up on scroll
- **Mobile hamburger menu** functionality
- **Smooth scrolling** between sections with offset calculations

## Key Components

### Navigation System
- Sticky navbar with backdrop blur effect
- Smooth scrolling to sections with 80px offset for fixed header
- Mobile hamburger menu with responsive behavior
- External links (like `about.html`) handled separately from anchor scrolling

### Hero Section
- Animated statistics that count up when scrolled into view
- Video background with overlay effects
- Gradient text animations and glitch effects
- Responsive breakpoints for mobile adaptation

### Interactive Gallery
- Modal system using full viewport overlays
- Click handlers for opening/closing modals
- Image specifications and technical details display
- Accessibility considerations with keyboard navigation

### Animation System
- Intersection Observer for scroll-triggered animations
- CSS transitions with cubic-bezier timing functions
- Transform effects (translateY, scale, opacity)
- Hover states with glow effects and neon borders

## Content Management

### Images
- Company logos in SVG format for crisp scaling
- Product photography stored in `assets/images/`
- Technology demonstration images with descriptive filenames
- Optimized for web delivery (proper sizing and compression)

### Typography Hierarchy
- H1: 4rem, uppercase, glitch animation for hero titles
- H2: 2.5rem, uppercase for section headings
- H3: 1.8rem for subsection headings
- Body: 1.1rem for readable content

## Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **CSS Features**: Grid, Flexbox, CSS Variables, backdrop-filter
- **JavaScript**: ES6+ with Intersection Observer API
- **Progressive enhancement**: Core functionality works without JavaScript

## SEO & Performance

- Comprehensive meta tags for social sharing
- Canonical URLs and proper heading structure  
- Optimized CSS selectors and efficient animations
- Hardware-accelerated transitions for smooth performance
- Accessible design with ARIA labels where needed

## Customization Notes

### Color Theming
All colors defined as CSS variables in `:root` for easy customization:
```css
--primary-black: #0D0D0D;
--accent-cyan: #00FFFF;
--accent-lime: #B4FF00;
```

### Animation Timing
Global transition timing controlled via CSS variables:
```css
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Responsive Breakpoints
- Mobile: <768px (single column)
- Tablet: 768px-1199px (two column)  
- Desktop: 1200px+ (three column)

## External Dependencies

- **Google Fonts**: Space Grotesk and IBM Plex Sans families
- **Calendly**: Integration for "Book a Call" functionality  
- **External links**: Company website references for navigation consistency

The website is designed for direct browser viewing without any build tools or preprocessing requirements.