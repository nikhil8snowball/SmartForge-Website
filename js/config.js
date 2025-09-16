// Configuration Management
// This file loads environment variables and provides a centralized config object

class Config {
    constructor() {
        this.loadEnvironmentVariables();
    }

    loadEnvironmentVariables() {
        // For client-side, we'll use a different approach since process.env is not available
        // We'll create a global config object that can be populated from the server
        this.config = {
            // Contentful Configuration
            contentful: {
                spaceId: this.getEnvVar('CONTENTFUL_SPACE_ID'),
                accessToken: this.getEnvVar('CONTENTFUL_ACCESS_TOKEN'),
                managementToken: this.getEnvVar('CONTENTFUL_MANAGEMENT_TOKEN'),
                environment: this.getEnvVar('CONTENTFUL_ENVIRONMENT', 'master')
            },
            
            // Site Configuration
            site: {
                url: this.getEnvVar('SITE_URL'),
                name: this.getEnvVar('SITE_NAME'),
                description: this.getEnvVar('SITE_DESCRIPTION')
            },
            
            // Environment
            nodeEnv: this.getEnvVar('NODE_ENV', 'development'),
            
            // Analytics
            analytics: {
                googleAnalyticsId: this.getEnvVar('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID', ''),
                googleTagManagerId: this.getEnvVar('NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID', '')
            }
        };
    }

    getEnvVar(key, defaultValue = '') {
        let value = '';
        
        // Check if we're in a browser environment
        if (typeof window !== 'undefined') {
            // For client-side, check if config is available in window object
            if (window.ENV_CONFIG && window.ENV_CONFIG[key]) {
                value = window.ENV_CONFIG[key];
            } else {
                // For development/testing, check if we have a local config
                value = this.getLocalConfig(key);
            }
        } else if (typeof process !== 'undefined' && process.env) {
            // For server-side (Node.js)
            value = process.env[key];
        }
        
        // If no value found, use default
        if (!value) {
            value = defaultValue;
        }
        
        // Only validate in production or when explicitly configured
        if (this.shouldValidateSecrets()) {
            this.validateRequiredSecrets(key, value);
        }
        
        return value;
    }

    getLocalConfig(key) {
        // For local development, you can set these in browser console:
        // window.LOCAL_CONFIG = { CONTENTFUL_SPACE_ID: 'your-space-id', ... }
        if (window.LOCAL_CONFIG && window.LOCAL_CONFIG[key]) {
            return window.LOCAL_CONFIG[key];
        }
        return '';
    }

    shouldValidateSecrets() {
        // Only validate secrets in production or when explicitly enabled
        // Get NODE_ENV directly to avoid circular dependency
        const nodeEnv = this.getNodeEnv();
        return nodeEnv === 'production' || window.FORCE_VALIDATE_SECRETS === true;
    }

    getNodeEnv() {
        // Get NODE_ENV directly from environment to avoid circular dependency
        if (typeof window !== 'undefined') {
            if (window.ENV_CONFIG && window.ENV_CONFIG.NODE_ENV) {
                return window.ENV_CONFIG.NODE_ENV;
            } else if (window.LOCAL_CONFIG && window.LOCAL_CONFIG.NODE_ENV) {
                return window.LOCAL_CONFIG.NODE_ENV;
            }
        } else if (typeof process !== 'undefined' && process.env) {
            return process.env.NODE_ENV;
        }
        return 'development';
    }

    validateRequiredSecrets(key, value) {
        const requiredSecrets = [
            'CONTENTFUL_SPACE_ID',
            'CONTENTFUL_ACCESS_TOKEN', 
            'CONTENTFUL_MANAGEMENT_TOKEN'
        ];
        
        if (requiredSecrets.includes(key) && !value) {
            console.error(`❌ Missing required environment variable: ${key}`);
            console.error('Please ensure all required environment variables are set in your deployment platform.');
        }
    }

    getContentfulConfig() {
        return this.config.contentful;
    }

    getSiteConfig() {
        return this.config.site;
    }

    getAnalyticsConfig() {
        return this.config.analytics;
    }

    isDevelopment() {
        return this.config.nodeEnv === 'development';
    }

    isProduction() {
        return this.config.nodeEnv === 'production';
    }
}

// Create global config instance
const config = new Config();

// Debug logging
if (typeof window !== 'undefined') {
    const contentfulConfig = config.getContentfulConfig();
    console.log('🔧 Config loaded:', {
        hasEnvConfig: !!window.ENV_CONFIG,
        hasLocalConfig: !!window.LOCAL_CONFIG,
        nodeEnv: config.getNodeEnv(),
        spaceId: contentfulConfig.spaceId ? '✓' : '✗',
        accessToken: contentfulConfig.accessToken ? '✓' : '✗',
        managementToken: contentfulConfig.managementToken ? '✓' : '✗'
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} else {
    // Make available globally for browser
    window.config = config;
}
