const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('.'));

// Inject environment variables into HTML
app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        // Inject environment variables into the response
        const originalSend = res.send;
        res.send = function(data) {
            if (typeof data === 'string') {
                // Inject environment config script before closing head tag
                const envScript = `
<script>
window.ENV_CONFIG = {
    CONTENTFUL_SPACE_ID: '${process.env.CONTENTFUL_SPACE_ID || ''}',
    CONTENTFUL_ACCESS_TOKEN: '${process.env.CONTENTFUL_ACCESS_TOKEN || ''}',
    CONTENTFUL_MANAGEMENT_TOKEN: '${process.env.CONTENTFUL_MANAGEMENT_TOKEN || ''}',
    CONTENTFUL_ENVIRONMENT: '${process.env.CONTENTFUL_ENVIRONMENT || 'master'}',
    SITE_URL: '${process.env.SITE_URL || ''}',
    SITE_NAME: '${process.env.SITE_NAME || ''}',
    SITE_DESCRIPTION: '${process.env.SITE_DESCRIPTION || ''}',
    NODE_ENV: '${process.env.NODE_ENV || 'development'}',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || ''}',
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: '${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''}'
};
</script>`;
                
                data = data.replace('</head>', envScript + '\n</head>');
            }
            originalSend.call(this, data);
        };
    }
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/blog/:slug', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog-post.html'));
});

app.listen(PORT, () => {
    console.log(`SmartForge Polymers website running on http://localhost:${PORT}`);
    console.log('Environment variables loaded:', {
        CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID ? '✓' : '✗',
        CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN ? '✓' : '✗',
        CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN ? '✓' : '✗',
        CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'master'
    });
});
