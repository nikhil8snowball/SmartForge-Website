const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const envConfig = {
    CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID || '',
    CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN || '',
    CONTENTFUL_MANAGEMENT_TOKEN: process.env.CONTENTFUL_MANAGEMENT_TOKEN || '',
    CONTENTFUL_ENVIRONMENT: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    SITE_URL: process.env.SITE_URL || '',
    SITE_NAME: process.env.SITE_NAME || '',
    SITE_DESCRIPTION: process.env.SITE_DESCRIPTION || '',
    NODE_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || ''
};

function injectEnvIntoHtml(html) {
    const envScript = `<script>
window.ENV_CONFIG = ${JSON.stringify(envConfig)};
</script>`;

    let content = html.replace('</head>', `${envScript}\n</head>`);

    if (envConfig.SITE_URL) {
        content = content.replace(/https:\/\/mf-polymers-website-2\.onrender\.com/g, envConfig.SITE_URL);
    }

    return content;
}

function serveHtml(fileName) {
    return (req, res) => {
        const filePath = path.join(__dirname, fileName);
        const content = fs.readFileSync(filePath, 'utf8');
        res.type('html').send(injectEnvIntoHtml(content));
    };
}

app.get('/health', (req, res) => {
    res.json({
        ok: true,
        contentful: {
            spaceId: !!envConfig.CONTENTFUL_SPACE_ID,
            accessToken: !!envConfig.CONTENTFUL_ACCESS_TOKEN,
            managementToken: !!envConfig.CONTENTFUL_MANAGEMENT_TOKEN,
            environment: envConfig.CONTENTFUL_ENVIRONMENT
        }
    });
});

app.get('/', serveHtml('index.html'));
app.get('/index.html', serveHtml('index.html'));
app.get('/about', serveHtml('about.html'));
app.get('/about.html', serveHtml('about.html'));
app.get('/blog', serveHtml('blog.html'));
app.get('/blog.html', serveHtml('blog.html'));
app.get('/blog/:slug', serveHtml('blog-post.html'));
app.get('/blog-post.html', serveHtml('blog-post.html'));

app.use(express.static('.', { index: false }));

app.listen(PORT, () => {
    console.log(`SmartForge Polymers website running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        CONTENTFUL_SPACE_ID: envConfig.CONTENTFUL_SPACE_ID ? '✓' : '✗',
        CONTENTFUL_ACCESS_TOKEN: envConfig.CONTENTFUL_ACCESS_TOKEN ? '✓' : '✗',
        CONTENTFUL_MANAGEMENT_TOKEN: envConfig.CONTENTFUL_MANAGEMENT_TOKEN ? '✓' : '✗',
        CONTENTFUL_ENVIRONMENT: envConfig.CONTENTFUL_ENVIRONMENT
    });
});
