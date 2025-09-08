// Blog Post functionality
class BlogPostManager {
    constructor() {
        this.currentPost = null;
        this.init();
    }

    async init() {
        try {
            await this.loadBlogPost();
            this.setupEventListeners();
            this.updateStructuredData();
        } catch (error) {
            console.error('Error initializing blog post:', error);
            this.showError('Failed to load blog post. Please try again later.');
        }
    }

    async loadBlogPost() {
        const urlParams = new URLSearchParams(window.location.search);
        const slug = urlParams.get('slug');
        
        if (!slug) {
            this.showError('No blog post specified.');
            return;
        }

        try {
            const post = await contentful.getBlogPostBySlug(slug);
            
            if (!post) {
                this.showError('Blog post not found.');
                return;
            }

            this.currentPost = post;
            this.renderBlogPost(post);
            this.loadRelatedPosts(post);
            this.updatePageMeta(post);
            
            // Hide loading state
            document.getElementById('loading').style.display = 'none';
            document.getElementById('blog-post').style.display = 'block';
            
        } catch (error) {
            console.error('Error loading blog post:', error);
            this.showError('Failed to load blog post. Please try again later.');
        }
    }

    renderBlogPost(post) {
        // Update post header
        document.getElementById('post-category').textContent = post.category?.name || 'Uncategorized';
        document.getElementById('post-date').textContent = this.formatDate(post.publishDate);
        document.getElementById('post-reading-time').textContent = `${post.readingTime} min read`;
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-excerpt').textContent = post.excerpt;
        
        // Update author information
        if (post.author) {
            document.getElementById('author-name').textContent = post.author.name;
            document.getElementById('author-bio').textContent = post.author.bio || 'Expert in microfabrication and precision manufacturing';
            
            if (post.author.avatar) {
                document.getElementById('author-avatar').src = post.author.avatar;
                document.getElementById('author-avatar').style.display = 'block';
            } else {
                document.getElementById('author-avatar').style.display = 'none';
            }
        } else {
            document.getElementById('author-name').textContent = 'MicroForge Polymers';
            document.getElementById('author-bio').textContent = 'Leading experts in revolutionary microfabrication technology';
            document.getElementById('author-avatar').style.display = 'none';
        }
        
        // Update featured image
        if (post.featuredImage) {
            document.getElementById('post-image').src = post.featuredImage;
            document.getElementById('post-image').alt = post.title;
        }
        
        // Update post content
        this.renderPostContent(post.content);
        
        // Update tags
        this.renderPostTags(post.tags);
    }

    renderPostContent(content) {
        const container = document.getElementById('post-content');
        
        if (typeof content === 'string') {
            // Simple text content
            container.innerHTML = `<p>${content}</p>`;
        } else if (content && content.content) {
            // Rich text content from Contentful
            container.innerHTML = this.parseRichText(content);
        } else {
            container.innerHTML = '<p>Content not available.</p>';
        }
    }

    parseRichText(richText) {
        if (!richText.content) return '';
        
        let html = '';
        
        const getTextFromNode = (node) => {
            if (!node) return '';
            if (node.nodeType === 'text') {
                let text = node.value || '';
                if (node.marks) {
                    node.marks.forEach(mark => {
                        switch (mark.type) {
                            case 'bold':
                                text = `<strong>${text}</strong>`; break;
                            case 'italic':
                                text = `<em>${text}</em>`; break;
                            case 'underline':
                                text = `<u>${text}</u>`; break;
                            case 'code':
                                text = `<code>${text}</code>`; break;
                        }
                    });
                }
                return text;
            }
            if (node.content && Array.isArray(node.content)) {
                return node.content.map(getTextFromNode).join('');
            }
            return '';
        };

        const resolveAsset = (target) => {
            // Prefer includes arrays on currentPost to resolve assets by ID
            const assetId = target?.sys?.id;
            if (!assetId || !this.currentPost) return null;
            const asset = (this.currentPost.includesAssets || []).find(a => a.sys?.id === assetId);
            const file = asset?.fields?.file;
            if (file?.url) {
                return { url: `https:${file.url}`, title: asset.fields.title || '', description: asset.fields.description || '' };
            }
            return null;
        };

        richText.content.forEach(node => {
            if (node.nodeType === 'paragraph') {
                html += '<p>';
                if (node.content) {
                    node.content.forEach(child => {
                        if (child.nodeType === 'hyperlink') {
                            const href = child.data?.uri || '#';
                            const text = getTextFromNode(child);
                            html += `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                        } else {
                            html += getTextFromNode(child);
                        }
                    });
                }
                html += '</p>';
            } else if (node.nodeType === 'embedded-asset-block') {
                const assetInfo = resolveAsset(node.data?.target);
                if (assetInfo) {
                    const alt = assetInfo.description || assetInfo.title || '';
                    html += `<img class="post-image" src="${assetInfo.url}" alt="${alt}">`;
                }
            } else if (node.nodeType === 'heading-1') {
                html += `<h1>${node.content?.[0]?.value || ''}</h1>`;
            } else if (node.nodeType === 'heading-2') {
                html += `<h2>${node.content?.[0]?.value || ''}</h2>`;
            } else if (node.nodeType === 'heading-3') {
                html += `<h3>${node.content?.[0]?.value || ''}</h3>`;
            } else if (node.nodeType === 'heading-4') {
                html += `<h4>${node.content?.[0]?.value || ''}</h4>`;
            } else if (node.nodeType === 'heading-5') {
                html += `<h5>${node.content?.[0]?.value || ''}</h5>`;
            } else if (node.nodeType === 'heading-6') {
                html += `<h6>${node.content?.[0]?.value || ''}</h6>`;
            } else if (node.nodeType === 'unordered-list') {
                html += '<ul>';
                if (node.content) {
                    node.content.forEach(listItem => {
                        const liText = listItem?.content?.map(getTextFromNode).join('') || '';
                        html += `<li>${liText}</li>`;
                    });
                }
                html += '</ul>';
            } else if (node.nodeType === 'ordered-list') {
                html += '<ol>';
                if (node.content) {
                    node.content.forEach(listItem => {
                        const liText = listItem?.content?.map(getTextFromNode).join('') || '';
                        html += `<li>${liText}</li>`;
                    });
                }
                html += '</ol>';
            } else if (node.nodeType === 'blockquote') {
                html += '<blockquote>';
                if (node.content) {
                    node.content.forEach(blockNode => {
                        if (blockNode.nodeType === 'paragraph') {
                            const inner = blockNode.content?.map(getTextFromNode).join('') || '';
                            html += `<p>${inner}</p>`;
                        }
                    });
                }
                html += '</blockquote>';
            } else if (node.nodeType === 'hr') {
                html += '<hr>';
            } else if (node.nodeType === 'table') {
                html += '<table>';
                if (node.content) {
                    node.content.forEach(tableRow => {
                        html += '<tr>';
                        if (tableRow.content) {
                            tableRow.content.forEach(cell => {
                                const tag = tableRow.nodeType === 'table-header-row' ? 'th' : 'td';
                                const cellText = cell.content?.map(getTextFromNode).join('') || '';
                                html += `<${tag}>${cellText}</${tag}>`;
                            });
                        }
                        html += '</tr>';
                    });
                }
                html += '</table>';
            }
        });
        
        return html;
    }

    renderPostTags(tags) {
        const container = document.getElementById('post-tags');
        
        if (!tags || tags.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        const tagsHTML = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        container.innerHTML = `<h4>Tags</h4>${tagsHTML}`;
        container.style.display = 'block';
    }

    async loadRelatedPosts(post) {
        if (!post.category?.slug) {
            document.getElementById('related-posts').style.display = 'none';
            return;
        }

        try {
            const relatedPosts = await contentful.getRelatedPosts(post.id, post.category.slug, 3);
            
            if (relatedPosts.length === 0) {
                document.getElementById('related-posts').style.display = 'none';
                return;
            }

            this.renderRelatedPosts(relatedPosts);
            document.getElementById('related-posts').style.display = 'block';
            
        } catch (error) {
            console.error('Error loading related posts:', error);
            document.getElementById('related-posts').style.display = 'none';
        }
    }

    renderRelatedPosts(posts) {
        const container = document.getElementById('related-posts-grid');
        
        const postsHTML = posts.map(post => `
            <div class="related-post-card">
                <div class="related-post-image">
                    <img src="${post.featuredImage}" alt="${post.title}" loading="lazy">
                </div>
                <div class="related-post-content">
                    <h3 class="related-post-title">
                        <a href="blog-post.html?slug=${post.slug}">${post.title}</a>
                    </h3>
                    <p class="related-post-excerpt">${post.excerpt}</p>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = postsHTML;
    }

    updatePageMeta(post) {
        // Update page title
        document.title = `${post.seoTitle || post.title} - MicroForge Polymers Blog`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = post.seoDescription || post.excerpt;
        }
        
        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = post.ogTitle || post.title;
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = post.ogDescription || post.excerpt;
        }
        
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && post.ogImage) {
            ogImage.content = post.ogImage;
        }
        
        // Update Twitter tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = post.title;
        }
        
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.content = post.excerpt;
        }
        
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage && post.featuredImage) {
            twitterImage.content = post.featuredImage;
        }
        
        // Update canonical URL
        if (post.canonicalUrl) {
            const canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                canonical.href = post.canonicalUrl;
            }
        }
    }

    updateStructuredData() {
        if (!this.currentPost) return;
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": this.currentPost.seoTitle || this.currentPost.title,
            "description": this.currentPost.seoDescription || this.currentPost.excerpt,
            "image": this.currentPost.featuredImage,
            "author": {
                "@type": "Person",
                "name": this.currentPost.author?.name || "MicroForge Polymers",
                "url": this.currentPost.author?.website || "https://microforge.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "MicroForge Polymers",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://microforge.com/assets/images/Company_Logo_for_second_design.svg"
                }
            },
            "datePublished": this.currentPost.publishDate,
            "dateModified": this.currentPost.lastModified,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://microforge.com/blog/${this.currentPost.slug}`
            },
            "articleSection": this.currentPost.category?.name || "Manufacturing",
            "keywords": this.currentPost.seoKeywords?.join(', ') || "microfabrication, precision manufacturing, micro-injection molding",
            "wordCount": this.currentPost.content?.content?.reduce((count, node) => {
                if (node.content) {
                    node.content.forEach(textNode => {
                        count += textNode.value?.length || 0;
                    });
                }
                return count;
            }, 0) || 0
        };
        
        const script = document.getElementById('structured-data');
        if (script) {
            script.textContent = JSON.stringify(structuredData, null, 2);
        }
    }

    formatDate(dateString) {
        if (!dateString) return 'Date not available';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        // Share button functionality
        window.shareOnTwitter = () => {
            if (!this.currentPost) return;
            
            const text = encodeURIComponent(`${this.currentPost.title} - Read more on MicroForge Polymers Blog`);
            const url = encodeURIComponent(window.location.href);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        };
        
        window.shareOnLinkedIn = () => {
            if (!this.currentPost) return;
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(this.currentPost.title);
            const summary = encodeURIComponent(this.currentPost.excerpt);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
        };
        
        window.shareViaEmail = () => {
            if (!this.currentPost) return;
            
            const subject = encodeURIComponent(`Check out this article: ${this.currentPost.title}`);
            const body = encodeURIComponent(`I thought you might be interested in this article from MicroForge Polymers:\n\n${this.currentPost.title}\n\n${this.currentPost.excerpt}\n\nRead more at: ${window.location.href}`);
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        };
    }

    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }
}

// Initialize blog post when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlogPostManager();
});
