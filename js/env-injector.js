// Environment Variable Injector for Client-Side
// This script should be run on the server to inject environment variables into the client

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Create environment config object for client-side
const envConfig = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID,
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
    CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT,
    SITE_URL: process.env.SITE_URL,
    SITE_NAME: process.env.SITE_NAME,
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
};

// Create a script tag that will inject these variables into window.ENV_CONFIG
const envScript = `
<script>
window.ENV_CONFIG = ${JSON.stringify(envConfig)};
</script>
`;

// Write the environment script to a file
fs.writeFileSync(path.join(__dirname, 'env-config.js'), envScript);

console.log('Environment variables injected into env-config.js');
console.log('Available variables:', Object.keys(envConfig));
