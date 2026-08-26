// config.js
// Business settings — now loaded dynamically from Supabase (window.NS_CONFIG)
// Falls back to hardcoded defaults if Supabase hasn't loaded yet.

const DEFAULT_CONFIG = {
  brandName: "NS Groups",
  tagline: "Banarasi Luxury in Every Thread",
  whatsappNumber: "919044749797",
  phoneDisplay: "+91 90447 49794",
  emailAddress: "nsgroupgroupsn@gmail.com",
  upiId: "nsgroups@upi",
  addressLine: "B3/294, Shivala, Varanasi, Uttar Pradesh - 221001",
  hours: "9:00 AM – 6:00 PM",
  instagramUrl: "https://instagram.com/nsgroupns",
  facebookUrl: "https://facebook.com/nsgroupns",
  mapEmbedSrc:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("B3/294, Shivala, Varanasi, Uttar Pradesh 221001") +
    "&output=embed",
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
};