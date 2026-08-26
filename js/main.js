// main.js
// Navigation, modal wiring, scroll reveal animations, and dynamic data rendering.

document.addEventListener("DOMContentLoaded", () => {
  // Wait for public-site.js to load data, then initialize
  waitForData(() => {
    renderProducts("all");
    renderGallery();
    updateCartUI();
    setupNav();
    setupFilters();
    setupModals();
    setupScrollReveal();
    setupCheckoutForm();
    setupEnquiryForm();
    document.getElementById("year").textContent = new Date().getFullYear();
  });
});

function waitForData(callback) {
  // Check if data is already loaded
  if (window.PRODUCTS && window.PRODUCTS.length > 0) {
    callback();
    return;
  }
  
  // Wait for data to load (public-site.js populates window.PRODUCTS)
  const checkInterval = setInterval(() => {
    if (window.PRODUCTS && window.PRODUCTS.length > 0) {
      clearInterval(checkInterval);
      callback();
    }
  }, 100);
  
  // Timeout after 10 seconds
  setTimeout(() => {
    clearInterval(checkInterval);
    if (!window.PRODUCTS || window.PRODUCTS.length === 0) {
      console.warn('Product data not loaded, using fallback');
      callback(); // Will use fallback from products.js
    }
  }, 10000);
}

function setupNav() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
    toggle.classList.toggle("open");
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
    });
  });

  const header = document.getElementById("siteHeader");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderProducts(tab.dataset.filter);
    });
  });
}

function setupModals() {
  document.getElementById("cartIconBtn").addEventListener("click", openCart);
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("checkoutBtn").addEventListener("click", openCheckout);

  document.getElementById("productModalClose").addEventListener("click", closeProductModal);
  document.getElementById("productModal").addEventListener("click", (e) => {
    if (e.target.id === "productModal") closeProductModal();
  });
  document.querySelector(".modal-add-cart").addEventListener("click", (e) => {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const qty = parseInt(document.querySelector(".modal-qty").value, 10) || 1;
    addToCart(id, qty);
    closeProductModal();
    openCart();
  });

  document.getElementById("checkoutClose").addEventListener("click", closeCheckout);
  document.getElementById("checkoutOverlay").addEventListener("click", closeCheckout);

  document.querySelectorAll('input[name="payment"]').forEach((input) => {
    input.addEventListener("change", togglePaymentDetails);
  });
  document.getElementById("upiAppBtn").addEventListener("click", payViaUpiApp);

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeProductModal();
    closeCheckout();
    closeCart();
  });
}

function setupCheckoutForm() {
  document.getElementById("checkoutForm").addEventListener("submit", submitOrder);
}

function setupEnquiryForm() {
  const form = document.getElementById("enquiryForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = [
      "Enquiry from NS Groups Website",
      "",
      `Name: ${form.name.value}`,
      `Phone: ${form.phone.value}`,
      form.email.value ? `Email: ${form.email.value}` : "",
      `Message: ${form.message.value}`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open("https://wa.me/" + NS_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message), "_blank");
    form.reset();
  });
}

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Product grid re-renders on filter change, so newly created cards need re-observing.
  const grid = document.getElementById("productGrid");
  const gridObserver = new MutationObserver(() => {
    document.querySelectorAll(".product-grid .reveal:not(.visible)").forEach((el) => observer.observe(el));
  });
  gridObserver.observe(grid, { childList: true });
}

function renderGallery() {
  const gallery = document.getElementById("galleryGrid");
  if (!gallery) return;
  
  // Use homepage content gallery images if available, otherwise fall back to color swatches
  if (window.HOMEPAGE_CONTENT?.gallery_images?.length) {
    gallery.innerHTML = window.HOMEPAGE_CONTENT.gallery_images
      .map((img, i) => `
        <div class="gallery-item reveal" style="background-image: url('${img}'); background-size: cover; background-position: center;">
        </div>
      `)
      .join("");
  } else {
    // Fallback to color swatches
    const colors = Object.keys(SWATCH_GRADIENTS).slice(0, 12);
    gallery.innerHTML = colors
      .map(
        (color) => `
        <div class="gallery-item reveal" style="--swatch: ${SWATCH_GRADIENTS[color]}">
          <span class="gallery-label">${color}</span>
        </div>
      `
      )
      .join("");
  }
}

// These functions are now provided by public-site.js and cart.js
// formatPrice, categoryLabel, swatchStyleFor, PRODUCTS, NS_CONFIG, SWATCH_GRADIENTS