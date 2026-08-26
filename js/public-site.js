// public-site.js
// Public website Supabase integration - loads products, config, homepage content dynamically

import { supabase, getProducts, getCategories, getSiteSettings, getHomepageContent, formatPrice } from './supabase-client.js';

// Global state for public site
window.PRODUCTS = [];
window.CATEGORIES = [];
window.NS_CONFIG = {};
window.HOMEPAGE_CONTENT = {};
window.SWATCH_GRADIENTS = {};

// Color swatch gradients (same as original)
const SWATCH_COLORS = {
  "Royal Maroon": ["#4a0f18", "#7a1f2b", "#b5566a"],
  "Peacock Teal": ["#052f2c", "#0f6b66", "#4fb3ab"],
  "Ivory & Gold": ["#d9c48a", "#f3e6c8", "#fffaf0"],
  "Emerald Green": ["#0d3a22", "#1f7a4d", "#5cc490"],
  "Wine Red": ["#2c060c", "#6e1423", "#a83b4c"],
  "Mustard Gold": ["#6b4a0d", "#c98a1f", "#e8b95a"],
  "Royal Blue": ["#081638", "#1c3f8f", "#5b7fd1"],
  "Blush Pink": ["#a9707d", "#e2a1ab", "#f7d6dc"],
  "Charcoal Grey": ["#1a1a1a", "#4a4a4a", "#7d7d7d"],
  "Deep Purple": ["#200d27", "#5a2a6b", "#9a5cb5"],
  "Rust Orange": ["#4a1e0c", "#b5502b", "#e08a5c"],
  "Coral Pink": ["#7a2c22", "#e0685a", "#f2a397"],
  "Forest Green": ["#0d2010", "#2e5a34", "#5f9a66"],
  "Classic Black": ["#000000", "#2b2b2b", "#5a5a5a"],
  "Sapphire Blue": ["#061f33", "#1a4c78", "#4f8ab8"],
  "Sunshine Yellow": ["#5c4310", "#e8c34a", "#f7e29a"],
  "Mint Green": ["#2e5643", "#8fcbb0", "#c9ece0"],
  "Lavender Purple": ["#3a2b4d", "#a48bc9", "#d3c2ea"],
  "Turquoise Blue": ["#0c3d3d", "#2fa3a3", "#7dd4d4"],
  Peach: ["#7a4230", "#f0b499", "#fbe0d2"],
  "Olive Green": ["#2c3313", "#6b7a3a", "#a3b268"],
  "Rani Pink": ["#5a0f2c", "#d6336c", "#ef7ba3"],
  "Sky Blue": ["#1c3d52", "#6fb8e0", "#c3e6f7"],
};

Object.entries(SWATCH_COLORS).forEach(([name, [dark, base, light]]) => {
  window.SWATCH_GRADIENTS[name] = `linear-gradient(120deg, ${dark}, ${base} 35%, ${light} 50%, ${base} 65%, ${dark})`;
});

// Initialize public site data
async function initPublicSite() {
  try {
    showLoadingState();
    
    const [products, categories, settings, homepageContent] = await Promise.all([
      getProducts({ visibleOnly: true }),
      getCategories(),
      getSiteSettings(),
      getHomepageContent()
    ]);
    
    window.PRODUCTS = products;
    window.CATEGORIES = categories;
    window.NS_CONFIG = transformSettings(settings);
    window.HOMEPAGE_CONTENT = homepageContent;
    
    // Apply config to DOM
    applyConfigToDOM(window.NS_CONFIG);
    
    // Apply homepage content
    applyHomepageContent(window.HOMEPAGE_CONTENT);
    
    // Trigger product rendering (will be called by main.js)
    if (window.renderProducts) {
      window.renderProducts('all');
    }
    
    // Trigger gallery rendering
    if (window.renderGallery) {
      window.renderGallery();
    }
    
    hideLoadingState();
    
  } catch (err) {
    console.error('Failed to load public site data:', err);
    hideLoadingState();
    showErrorState();
    // Fallback to original hardcoded data
    loadFallbackData();
  }
}

function showLoadingState() {
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-espresso-light);">Loading products...</div>';
  }
}

function hideLoadingState() {
  // Loading will be replaced by renderProducts
}

function showErrorState() {
  const grid = document.getElementById('productGrid');
  if (grid) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-error);">Failed to load products. Please refresh the page.</div>';
  }
}

function loadFallbackData() {
  // This will be handled by the original products.js if it loads
  console.warn('Using fallback data - ensure products.js loads as backup');
}

function transformSettings(settings) {
  return {
    brandName: settings.brand_name,
    tagline: settings.tagline,
    whatsappNumber: settings.whatsapp,
    phoneDisplay: settings.phone,
    emailAddress: settings.email,
    upiId: settings.upi,
    addressLine: settings.address,
    hours: settings.hours,
    instagramUrl: settings.instagram,
    facebookUrl: settings.facebook,
    mapEmbedSrc: settings.map_location
  };
}

function applyConfigToDOM(config) {
  const waLink = "https://wa.me/" + config.whatsappNumber;
  const set = (id, attr, value) => {
    const el = document.getElementById(id);
    if (el) el[attr] = value;
  };
  
  set("whatsappFloat", "href", waLink);
  set("contactWhatsapp", "href", waLink);
  set("contactMap", "src", config.mapEmbedSrc);
  set("displayAddress", "textContent", config.addressLine);
  set("displayPhone", "textContent", config.phoneDisplay);
  set("displayWhatsapp", "textContent", "+91 " + config.whatsappNumber.slice(2).replace(/(\d{5})(\d{5})/, "$1 $2"));
  set("displayEmail", "textContent", config.emailAddress);
  set("displayHours", "textContent", config.hours);
  set("upiIdDisplay", "textContent", config.upiId);
  set("igLink", "href", config.instagramUrl);
  set("fbLink", "href", config.facebookUrl);
  set("galleryIgLink", "href", config.instagramUrl);
  
  // Update brand name in header
  const brandNameEl = document.querySelector('.brand-name');
  if (brandNameEl) brandNameEl.textContent = config.brandName;
  
  // Update footer brand
  const footerBrand = document.querySelector('.footer-brand');
  if (footerBrand) footerBrand.textContent = config.brandName;
  
  const footerTagline = document.querySelector('.footer-tagline');
  if (footerTagline) footerTagline.textContent = config.tagline;
}

function applyHomepageContent(content) {
  // Hero section
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && content.hero_heading) {
    heroTitle.innerHTML = content.hero_heading;
  }
  
  const heroSub = document.querySelector('.hero-sub');
  if (heroSub && content.hero_subtitle) {
    heroSub.textContent = content.hero_subtitle;
  }
  
  const heroPrimaryBtn = document.querySelector('.hero-actions .btn-primary');
  if (heroPrimaryBtn) {
    if (content.hero_primary_btn_text) heroPrimaryBtn.textContent = content.hero_primary_btn_text;
    if (content.hero_primary_btn_link) heroPrimaryBtn.href = content.hero_primary_btn_link;
  }
  
  const heroSecondaryBtn = document.querySelector('.hero-actions .btn-outline');
  if (heroSecondaryBtn) {
    if (content.hero_secondary_btn_text) heroSecondaryBtn.textContent = content.hero_secondary_btn_text;
    if (content.hero_secondary_btn_link) heroSecondaryBtn.href = content.hero_secondary_btn_link;
  }
  
  // About section
  const aboutHeading = document.querySelector('.about-story .section-title');
  if (aboutHeading && content.about_heading) {
    aboutHeading.textContent = content.about_heading;
  }
  
  const aboutParagraphs = document.querySelectorAll('.about-story p');
  if (content.about_paragraphs && content.about_paragraphs.length) {
    content.about_paragraphs.forEach((text, i) => {
      if (aboutParagraphs[i]) aboutParagraphs[i].innerHTML = text;
    });
  }
  
  // Highlights
  const highlightCards = document.querySelectorAll('.highlight-card');
  if (content.highlight_cards && content.highlight_cards.length) {
    content.highlight_cards.forEach((card, i) => {
      if (highlightCards[i]) {
        const icon = highlightCards[i].querySelector('.highlight-icon');
        const title = highlightCards[i].querySelector('.highlight-title');
        const text = highlightCards[i].querySelector('.highlight-text');
        if (icon) icon.textContent = card.icon || '';
        if (title) title.textContent = card.title || '';
        if (text) text.textContent = card.text || '';
      }
    });
  }
  
  // Gallery CTA
  const galleryCta = document.getElementById('galleryIgLink');
  if (galleryCta) {
    if (content.gallery_cta_text) galleryCta.textContent = content.gallery_cta_text;
    if (content.gallery_cta_link) galleryCta.href = content.gallery_cta_link;
  }
}

// Make functions globally available for main.js compatibility
window.formatPrice = formatPrice;
window.categoryLabel = function(cat) {
  const category = window.CATEGORIES?.find(c => c.slug === cat || c.id === cat);
  return category?.name || (cat === 'banarasi' ? 'Banarasi Silk' : cat === 'pashmina' ? 'Pashmina Silk' : 'Ethnic Silk');
};

window.swatchStyleFor = function(p) {
  if (p.image_urls?.length) return `background-image:url('${p.image_urls[0]}'); background-size:cover; background-position:center;`;
  return `--swatch: ${window.SWATCH_GRADIENTS[p.color] || window.SWATCH_GRADIENTS["Royal Maroon"]};`;
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPublicSite);
} else {
  initPublicSite();
}

export { initPublicSite, window };