// Contentful API Client
class ContentfulClient {
    constructor() {
        this.spaceId = 'wqlg3e74ktlj';
        this.accessToken = 'ROnS4WgpvaoG-KVJ3xW8sf9mfEJlpMLhAENeRfky0AU';
        this.baseUrl = 'https://cdn.contentful.com';
    }

    async getBlogPosts(limit = 10, skip = 0) {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `order=-sys.createdAt&` +
                `limit=${limit}&` +
                `skip=${skip}&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processEntries(data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            return [];
        }
    }

    async getBlogPostBySlug(slug) {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `fields.slug=${slug}&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.items.length > 0 ? this.processEntry(data.items[0], data.includes || {}) : null;
        } catch (error) {
            console.error('Error fetching blog post:', error);
            return null;
        }
    }

    async getBlogCategories() {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogCategory&` +
                `order=fields.name&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processEntries(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async getBlogPostsByCategory(categorySlug, limit = 10, skip = 0) {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `fields.category.fields.slug=${categorySlug}&` +
                `order=-sys.createdAt&` +
                `limit=${limit}&` +
                `skip=${skip}&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processEntries(data);
        } catch (error) {
            console.error('Error fetching blog posts by category:', error);
            return [];
        }
    }

    async searchBlogPosts(query, limit = 10) {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `query=${encodeURIComponent(query)}&` +
                `order=-sys.createdAt&` +
                `limit=${limit}&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processEntries(data);
        } catch (error) {
            console.error('Error searching blog posts:', error);
            return [];
        }
    }

    processEntries(data) {
        const includes = data.includes || {};
        return data.items.map(item => this.processEntry(item, includes));
    }

    processEntry(entry, includes = {}) {
        const fields = entry.fields;
        const sys = entry.sys;
        
        return {
            id: sys.id,
            title: fields.title,
            slug: fields.slug,
            excerpt: fields.excerpt,
            content: fields.content,
            // Pass through includes for rich text asset resolution
            includesAssets: includes.Asset || [],
            includesEntries: includes.Entry || [],
            featuredImage: this.getAssetUrlFrom(fields.featuredImage, includes),
            author: this.processAuthor(this.resolveLink(fields.author, includes), includes),
            category: this.processCategory(this.resolveLink(fields.category, includes)),
            tags: fields.tags || [],
            publishDate: fields.publishDate,
            lastModified: fields.lastModified,
            readingTime: fields.readingTime,
            seoTitle: fields.seoTitle || fields.title,
            seoDescription: fields.seoDescription || fields.excerpt,
            seoKeywords: fields.seoKeywords || [],
            ogImage: this.getAssetUrlFrom(fields.ogImage || fields.featuredImage, includes),
            ogTitle: fields.ogTitle || fields.title,
            ogDescription: fields.ogDescription || fields.excerpt,
            twitterCard: fields.twitterCard || 'summary_large_image',
            canonicalUrl: fields.canonicalUrl,
            structuredData: fields.structuredData,
            metaRobots: fields.metaRobots || 'index,follow',
            featured: fields.featured || false,
            allowComments: fields.allowComments !== false
        };
    }

    getAssetUrl(asset) {
        if (!asset || !asset.fields || !asset.fields.file) return null;
        
        const file = asset.fields.file;
        return `https:${file.url}`;
    }

    getAssetUrlFrom(linkOrAsset, includes = {}) {
        if (!linkOrAsset) return null;
        if (linkOrAsset.fields && linkOrAsset.fields.file) {
            return this.getAssetUrl(linkOrAsset);
        }
        const resolved = this.resolveLink(linkOrAsset, includes);
        return this.getAssetUrl(resolved);
    }

    resolveLink(link, includes = {}) {
        if (!link || !link.sys) return null;
        const { linkType, id } = link.sys;
        if (linkType === 'Asset') {
            return (includes.Asset || []).find(a => a.sys.id === id) || null;
        }
        if (linkType === 'Entry') {
            return (includes.Entry || []).find(e => e.sys.id === id) || null;
        }
        return null;
    }

    processAuthor(author, includes) {
        if (!author || !author.fields) return null;
        
        return {
            name: author.fields.name,
            bio: author.fields.bio,
            avatar: this.getAssetUrlFrom(author.fields.avatar, includes),
            email: author.fields.email,
            website: author.fields.website,
            socialLinks: author.fields.socialLinks,
            expertise: author.fields.expertise || []
        };
    }

    processCategory(category) {
        if (!category || !category.fields) return null;
        
        return {
            name: category.fields.name,
            slug: category.fields.slug,
            description: category.fields.description,
            icon: category.fields.icon,
            color: category.fields.color,
            seoTitle: category.fields.seoTitle,
            seoDescription: category.fields.seoDescription
        };
    }

    // Helper method to get total count of posts
    async getTotalPostCount() {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `limit=1`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.total;
        } catch (error) {
            console.error('Error getting post count:', error);
            return 0;
        }
    }

    // Helper method to get related posts
    async getRelatedPosts(currentPostId, categorySlug, limit = 3) {
        try {
            const response = await fetch(
                `${this.baseUrl}/spaces/${this.spaceId}/entries?` +
                `access_token=${this.accessToken}&` +
                `content_type=blogPost&` +
                `fields.category.fields.slug=${categorySlug}&` +
                `sys.id[ne]=${currentPostId}&` +
                `order=-sys.createdAt&` +
                `limit=${limit}&` +
                `include=2`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.processEntries(data);
        } catch (error) {
            console.error('Error fetching related posts:', error);
            return [];
        }
    }
}

// Initialize Contentful client
const contentful = new ContentfulClient();
