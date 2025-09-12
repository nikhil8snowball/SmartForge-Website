# Clean URL Routing System

This document explains how the clean URL routing system works for the SmartForge website.

## URL Mapping

The following URL mappings are implemented:

| Current URL                                   | Clean URL                          |
| --------------------------------------------- | ---------------------------------- |
| `https://smforge.com/index.html#home`         | `https://smforge.com/`             |
| `https://smforge.com/index.html`              | `https://smforge.com/`             |
| `https://smforge.com/index.html#breakthrough` | `https://smforge.com/breakthrough` |
| `https://smforge.com/index.html#technologies` | `https://smforge.com/technologies` |
| `https://smforge.com/index.html#features`     | `https://smforge.com/features`     |
| `https://smforge.com/index.html#gallery`      | `https://smforge.com/gallery`      |
| `https://smforge.com/index.html#offers`       | `https://smforge.com/offers`       |
| `https://smforge.com/index.html#contact`      | `https://smforge.com/contact`      |
| `https://smforge.com/about.html`              | `https://smforge.com/about`        |
| `https://smforge.com/blog.html`               | `https://smforge.com/blog`         |

## How It Works

### 1. Client-Side Routing

- The `js/routing.js` file implements a client-side router
- Uses the HTML5 History API (`pushState`/`popState`) to manage URL changes
- No page reloads for section navigation within the home page

### 2. Navigation Links

- All navigation links now use clean URLs (e.g., `/breakthrough`, `/technologies`)
- The router intercepts clicks and handles navigation appropriately
- Section links scroll to the correct section on the home page
- Page links navigate to separate HTML files

### 3. Browser Back/Forward Support

- The router listens for `popstate` events
- Users can use browser back/forward buttons normally
- URLs update correctly in the address bar

### 4. Fallback Handling

- Unknown routes redirect to the home page
- Missing sections show a console warning
- Graceful degradation if JavaScript is disabled

## Implementation Details

### Router Class

The `SmartForgeRouter` class handles:

- Route mapping and navigation
- URL updates without page reloads
- Smooth scrolling to sections
- Event listener management

### Navigation Updates

All navigation links are automatically updated to use clean URLs:

- Header navigation menu
- Footer links
- CTA buttons
- Hero section buttons

### File Structure

- `js/routing.js` - Main routing logic
- All HTML files include the routing script
- Navigation links updated in all files

## Testing

To test the clean URL system:

1. **Direct Navigation**: Click any navigation link and verify the URL changes
2. **Browser Navigation**: Use back/forward buttons to test history
3. **Direct URL Access**: Type clean URLs directly in the address bar
4. **Section Scrolling**: Verify smooth scrolling to correct sections

## Browser Compatibility

- Modern browsers with HTML5 History API support
- Graceful fallback for older browsers
- Works with JavaScript enabled

## SEO Benefits

- Clean, readable URLs
- Better user experience
- Improved shareability
- Professional appearance
