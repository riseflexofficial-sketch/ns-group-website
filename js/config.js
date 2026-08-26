// config.js
// Business settings - loaded dynamically or falls back to defaults

const DEFAULT_CONFIG = {
    brandName: "NS Groups",
    tagline: "Banarasi Luxury in Every Thread",
    whatsappNumber: "919044749797",
    phoneDisplay: "+91 9044749797",
    emailAddress: "nsgroupgroupsn@gmail.com",
    upiId: "nsgroups@upi",
    addressLine: "B3/294, Shivala, Varanasi, Uttar Pradesh - 221001",
    hours: "10:00 AM - 8:00 PM",
    instagramUrl: "https://www.instagram.com/nsgroupns",
    facebookUrl: "https://www.facebook.com/share/1FXFjNG69L/",
    mapEmbedSrc: "https://www.google.com/maps?q=" + encodeURIComponent("B3/294, Shivala, Varanasi, Uttar Pradesh 221001") + "&output=embed"
};

// Use dynamic config from Supabase, or fallback
function getConfig() {
    return window.NS_CONFIG && Object.keys(window.NS_CONFIG).length > 0 ? window.NS_CONFIG : DEFAULT_CONFIG;
}

// Make config globally available
window.NS_CONFIG = getConfig();

// Re-apply config when dynamic data loads
window.applyDynamicConfig = function(config) {
    window.NS_CONFIG = config;
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
    set("displayWhatsapp", "textContent", config.phoneDisplay);
    set("displayEmail", "textContent", config.emailAddress);
    set("displayHours", "textContent", config.hours);
    set("upiIdDisplay", "textContent", config.upiId);
    set("igLink", "href", config.instagramUrl);
    set("fbLink", "href", config.facebookUrl);
    set("galleryIgLink", "href", config.instagramUrl);

    // Update brand name in header
    const brandNameEl = document.querySelector('.brand-name');
    if (brandNameEl) brandNameEl.textContent = config.brandName;
};