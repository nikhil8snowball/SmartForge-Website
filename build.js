const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Environment variables to inject
const envConfig = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || '',
    CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    SITE_URL: process.env.SITE_URL || '',
    SITE_NAME: process.env.SITE_NAME || '',
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION || '',
    NODE_ENV: process.env.NODE_ENV || 'production',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''
};

// Create environment injection script
const envScript = `<script>
window.ENV_CONFIG = ${JSON.stringify(envConfig)};
</script>`;

// HTML files to process
const htmlFiles = ['index.html', 'about.html', 'blog.html', 'blog-post.html'];

console.log('🔧 Building static site with environment variables...');
console.log('📝 Environment variables loaded:', {
    CONTENTFUL_SPACE_ID: envConfig.CONTENTFUL_SPACE_ID ? '✓' : '✗',
    CONTENTFUL_ACCESS_TOKEN: envConfig.CONTENTFUL_ACCESS_TOKEN ? '✓' : '✗',
    CONTENTFUL_MANAGEMENT_TOKEN: envConfig.CONTENTFUL_MANAGEMENT_TOKEN ? '✓' : '✗',
    CONTENTFUL_ENVIRONMENT: envConfig.CONTENTFUL_ENVIRONMENT
});

// Process each HTML file
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Inject environment script before closing head tag
        content = content.replace('</head>', envScript + '\n</head>');
        
        // Write back to file
        fs.writeFileSync(filePath, content);
        console.log(`✅ Processed ${file}`);
    } else {
        console.log(`⚠️  File not found: ${file}`);
    }
});

console.log('🎉 Build complete!');
