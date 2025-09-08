// Blog functionality
class BlogManager {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 9;
        this.totalPosts = 0;
        this.allPosts = [];
        this.init();
    }

    async init() {
        try {
            await this.loadBlogPosts();
            this.setupEventListeners();
            this.setupPagination();
        } catch (error) {
            console.error('Error initializing blog:', error);
        }
    }

    async loadBlogPosts() {
        try {
            const posts = await contentful.getBlogPosts(this.postsPerPage, (this.currentPage - 1) * this.postsPerPage);
            
            this.allPosts = posts;
            this.renderBlogPosts(posts);
            
            // Update total count for pagination
            if (this.currentPage === 1) {
                this.totalPosts = await contentful.getTotalPostCount();
            }
        } catch (error) {
            console.error('Error loading blog posts:', error);
            this.showError('Failed to load blog posts. Please try again later.');
        }
    }

    renderBlogPosts(posts) {
        const container = document.getElementById('blog-posts');
        
        if (posts.length === 0) {
            container.innerHTML = `
                <div class="no-posts">
                    <div class="no-posts-icon">📝</div>
                    <h3>No blog posts found</h3>
                    <p>No posts available at the moment.</p>
                </div>
            `;
            return;
        }

        const postsHTML = posts.map(post => this.createPostCard(post)).join('');
        container.innerHTML = postsHTML;
    }

    createPostCard(post) {
        const featuredImage = post.featuredImage || 'assets/images/Company_Logo_for_second_design.png';
        const readingTime = post.readingTime || '5';
        const publishDate = post.publishDate || new Date().toISOString();
        const authorName = post.author?.name || 'SmartForge';
        const excerptText = (post.excerpt || '').trim();
        const words = excerptText.split(/\s+/).filter(Boolean);
        const shortExcerpt = words.slice(0, 10).join(' ');
        const excerptDisplay = shortExcerpt ? shortExcerpt + (words.length > 10 ? '…' : '') : 'No excerpt available';
        
        return `
            <article class="blog-card" data-slug="${post.slug}">
                <a class="blog-card-link" href="blog-post.html?slug=${post.slug}">
                    <div class="blog-card-image">
                        <img src="${featuredImage}" alt="${post.title}" loading="lazy" onerror="this.src='assets/images/Company_Logo_for_second_design.png'">
                        ${post.featured ? '<div class="featured-badge">⭐ Featured</div>' : ''}
                    </div>
                    <div class="blog-card-content">
                        <h3 class="blog-card-title">${post.title}</h3>
                        <div class="blog-card-row">
                            <div class="blog-card-author-col">
                                <span class="blog-card-author">
                                    ${post.author?.avatar ? `<img src="${post.author.avatar}" alt="${authorName}" class="author-avatar">` : ''}
                                    ${authorName}
                                </span>
                            </div>
                            <p class="blog-card-excerpt">${excerptDisplay}</p>
                        </div>
                        <div class="blog-card-meta">
                            <span class="blog-card-date">${this.formatDate(publishDate)}</span>
                            <span class="blog-card-reading-time">${readingTime} min read</span>
                        </div>
                        <div class="blog-card-tags">
                            ${(post.tags && post.tags.length > 0) ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '<span class="tag">General</span>'}
                        </div>
                    </div>
                </a>
            </article>
        `;
    }

    setupEventListeners() {
        // Pagination only
        document.addEventListener('click', (e) => {
            if (e.target.id === 'prev-page') {
                this.previousPage();
            } else if (e.target.id === 'next-page') {
                this.nextPage();
            }
        });
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadBlogPosts();
            this.updatePagination();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.loadBlogPosts();
            this.updatePagination();
        }
    }

    setupPagination() {
        this.updatePagination();
    }

    updatePagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.totalPosts / this.postsPerPage);
        
        if (totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');

        if (prevBtn) prevBtn.disabled = this.currentPage === 1;
        if (nextBtn) nextBtn.disabled = this.currentPage === totalPages;
        if (currentPageSpan) currentPageSpan.textContent = this.currentPage;
        if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    showError(message) {
        const container = document.getElementById('blog-posts');
        container.innerHTML = `
            <div class="no-posts">
                <div class="no-posts-icon">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Initialize component loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ComponentLoader();
    new BlogManager();
});
