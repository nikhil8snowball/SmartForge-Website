// Development Configuration Example
// Copy this file to dev-config.js and replace with your actual values
// This file is for local development only - DO NOT use in production

window.LOCAL_CONFIG = {
    // Contentful Configuration - Replace with your actual values
    CONTENTFUL_SPACE_ID: 'your-space-id-here',
    CONTENTFUL_ACCESS_TOKEN: 'your-access-token-here',
    CONTENTFUL_MANAGEMENT_TOKEN: 'your-management-token-here',
    CONTENTFUL_ENVIRONMENT: 'master',
    
    // Site Configuration
    SITE_URL: 'https://smartforge.com',
    SITE_NAME: 'SmartForge Polymers',
    SITE_DESCRIPTION: 'Revolutionizing microfabrication with bold tech innovation',
    
    // Environment
    NODE_ENV: 'development'
};

// Enable validation for development (optional)
// window.FORCE_VALIDATE_SECRETS = true;

console.log('🔧 Development configuration loaded');
console.log('📝 Note: This file is for local development only');
console.log('🚀 For production, use environment variables in your deployment platform');
