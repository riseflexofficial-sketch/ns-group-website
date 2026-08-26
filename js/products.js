// products.js
// Product catalog rendering — now uses dynamic data from Supabase (window.PRODUCTS)
// Falls back to hardcoded data if Supabase hasn't loaded yet.

// Color swatch gradients (fallback for products without images)
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

const SWATCH_GRADIENTS = {};
Object.entries(SWATCH_COLORS).forEach(([name, [dark, base, light]]) => {
  SWATCH_GRADIENTS[name] = `linear-gradient(120deg, ${dark}, ${base} 35%, ${light} 50%, ${base} 65%, ${dark})`;
});

// Make globally available for public-site.js and main.js
window.SWATCH_GRADIENTS = SWATCH_GRADIENTS;

// Fallback hardcoded products (used if Supabase fails to load)
const FALLBACK_PRODUCTS = [
  { id: "1", name: "Banarasi Zari Silk Saree", color: "Royal Maroon", category: "banarasi", price: 8499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "2", name: "Banarasi Silk Saree", color: "Peacock Teal", category: "banarasi", price: 7999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "3", name: "Banarasi Katan Silk Saree", color: "Ivory & Gold", category: "banarasi", price: 8999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "4", name: "Banarasi Silk Saree", color: "Emerald Green", category: "banarasi", price: 6999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "5", name: "Banarasi Silk Saree", color: "Wine Red", category: "banarasi", price: 7499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "6", name: "Banarasi Tanchoi Silk Saree", color: "Mustard Gold", category: "banarasi", price: 6499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "7", name: "Banarasi Silk Saree", color: "Royal Blue", category: "banarasi", price: 7199, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "8", name: "Banarasi Organza Silk Saree", color: "Blush Pink", category: "banarasi", price: 5999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Banarasi Silk", slug: "banarasi" } },
  { id: "9", name: "Pashmina Silk Saree", color: "Charcoal Grey", category: "pashmina", price: 4999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "10", name: "Pashmina Silk Saree", color: "Deep Purple", category: "pashmina", price: 4499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "11", name: "Pashmina Embroidered Saree", color: "Rust Orange", category: "pashmina", price: 5499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "12", name: "Pashmina Silk Saree", color: "Coral Pink", category: "pashmina", price: 3999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "13", name: "Pashmina Silk Saree", color: "Forest Green", category: "pashmina", price: 4799, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "14", name: "Pashmina Silk Saree", color: "Classic Black", category: "pashmina", price: 4299, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "15", name: "Pashmina Silk Saree", color: "Sapphire Blue", category: "pashmina", price: 4999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Pashmina Silk", slug: "pashmina" } },
  { id: "16", name: "Ethnic Silk Saree", color: "Sunshine Yellow", category: "ethnic", price: 1499, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "17", name: "Ethnic Silk Saree", color: "Mint Green", category: "ethnic", price: 1299, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "18", name: "Ethnic Silk Saree", color: "Lavender Purple", category: "ethnic", price: 1199, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "19", name: "Ethnic Silk Saree", color: "Royal Maroon", category: "ethnic", price: 999, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "20", name: "Ethnic Silk Saree", color: "Turquoise Blue", category: "ethnic", price: 1399, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "21", name: "Ethnic Printed Silk Saree", color: "Peach", category: "ethnic", price: 899, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "22", name: "Ethnic Silk Saree", color: "Olive Green", category: "ethnic", price: 1099, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "23", name: "Ethnic Silk Saree", color: "Rani Pink", category: "ethnic", price: 699, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "24", name: "Ethnic Silk Saree", color: "Sky Blue", category: "ethnic", price: 799, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
  { id: "25", name: "Ethnic Silk Saree", color: "Ivory & Gold", category: "ethnic", price: 1599, stock_quantity: 10, stock_status: "in_stock", is_visible: true, is_featured: false, image_urls: [], description: "", categories: { name: "Ethnic Silk", slug: "ethnic" } },
];

// Use dynamic products from Supabase, or fallback
function getProducts() {
  return window.PRODUCTS && window.PRODUCTS.length > 0 ? window.PRODUCTS : FALLBACK_PRODUCTS;
}

function formatPrice(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function categoryLabel(cat) {
  if (cat === "banarasi") return "Banarasi Silk";
  if (cat === "pashmina") return "Pashmina Silk";
  return "Ethnic Silk";
}

function swatchStyleFor(p) {
  if (p.image_urls?.length) return `background-image:url('${p.image_urls[0]}'); background-size:cover; background-position:center;`;
  return `--swatch: ${SWATCH_GRADIENTS[p.color] || SWATCH_GRADIENTS["Royal Maroon"]};`;
}

function productCardHTML(p) {
  const isOutOfStock = p.stock_status === 'out_of_stock' || p.stock_quantity === 0;
  const isHidden = p.is_visible === false;
  
  return `
    <article class="product-card reveal ${isHidden ? 'hidden' : ''}" data-id="${p.id}" data-category="${p.category}">
      <div class="product-swatch" style="${swatchStyleFor(p)}" data-id="${p.id}" tabindex="0" role="button" aria-label="View ${p.name}">
        ${p.image_urls?.length ? "" : `<span class="swatch-tag">Photo coming soon</span>`}
        ${isOutOfStock ? `<span class="swatch-tag out-of-stock-tag">Out of Stock</span>` : ""}
        ${isHidden ? `<span class="swatch-tag hidden-tag">Hidden</span>` : ""}
      </div>
      <div class="product-info">
        <p class="product-category">${p.categories?.name || categoryLabel(p.category)}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-color">${p.color}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(p.price)}</span>
          <button class="btn-add-cart" data-id="${p.id}" aria-label="Add ${p.name} to cart" ${isOutOfStock || isHidden ? 'disabled' : ''}>
            ${isOutOfStock ? 'Out of Stock' : isHidden ? 'Hidden' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts(filter) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  
  const products = getProducts();
  const items = filter && filter !== "all" ? products.filter((p) => p.category === filter) : products;
  
  if (!items.length) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: var(--color-espresso-light);">
        No products found${filter && filter !== 'all' ? ' in this category' : ''}.
      </div>
    `;
    return;
  }
  
  grid.innerHTML = items.map(productCardHTML).join("");
  attachProductCardEvents();
}

function attachProductCardEvents() {
  document.querySelectorAll(".product-swatch, .product-name").forEach((el) => {
    el.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (card) openProductModal(card.dataset.id);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const card = e.target.closest(".product-card");
        if (card) openProductModal(card.dataset.id);
      }
    });
  });
  
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.disabled) return;
      const id = e.currentTarget.dataset.id;
      addToCart(id, 1);
      const original = e.currentTarget.textContent;
      e.currentTarget.textContent = "Added ✓";
      setTimeout(() => {
        e.currentTarget.textContent = original;
      }, 1200);
    });
  });
}

function openProductModal(id) {
  const products = getProducts();
  const p = products.find((x) => x.id == id);
  if (!p) return;
  
  const modal = document.getElementById("productModal");
  const swatchEl = modal.querySelector(".modal-swatch");
  swatchEl.removeAttribute("style");
  swatchEl.setAttribute("style", swatchStyleFor(p));

  modal.querySelector(".modal-category").textContent = p.categories?.name || categoryLabel(p.category);
  modal.querySelector(".modal-name").textContent = p.name;
  modal.querySelector(".modal-color").textContent = "Color: " + p.color;
  modal.querySelector(".modal-price").textContent = formatPrice(p.price);
  modal.querySelector(".modal-qty").value = 1;
  modal.querySelector(".modal-add-cart").dataset.id = p.id;
  modal.querySelector(".modal-add-cart").disabled = p.stock_status === 'out_of_stock' || p.stock_quantity === 0 || p.is_visible === false;
  modal.querySelector(".modal-whatsapp").href =
    "https://wa.me/" +
    NS_CONFIG.whatsappNumber +
    "?text=" +
    encodeURIComponent(`Hi NS Groups! I'd like to enquire about the ${p.name} (${p.color}) - ${formatPrice(p.price)}`);

  modal.classList.add("open");
  document.body.classList.add("no-scroll");
  modal.querySelector(".modal-close").focus();
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

// Export for cart.js and main.js
window.PRODUCTS = getProducts();
window.formatPrice = formatPrice;
window.categoryLabel = categoryLabel;
window.swatchStyleFor = swatchStyleFor;
window.renderProducts = renderProducts;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.getProducts = getProducts;