// cart.js
// Cart state + checkout flow.
// There's no payment gateway wired in (that needs a registered business + provider like
// Razorpay). Instead, "Place Order" builds a complete order summary and sends it straight
// to the store's WhatsApp — genuinely functional today, at zero cost.

let CART = []; // { id, qty }

function addToCart(id, qty) {
  const existing = CART.find((item) => item.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    CART.push({ id, qty });
  }
  updateCartUI();
  pulseCartIcon();
}

function removeFromCart(id) {
  CART = CART.filter((item) => item.id !== id);
  updateCartUI();
}

function updateQty(id, qty) {
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  const item = CART.find((item) => item.id === id);
  if (!item) return;
  item.qty = qty;
  updateCartUI();
}

function getCartDetails() {
  return CART.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return { ...item, product };
  }).filter((item) => item.product);
}

function getCartTotal() {
  return getCartDetails().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function getCartCount() {
  return CART.reduce((sum, item) => sum + item.qty, 0);
}

function pulseCartIcon() {
  const badge = document.getElementById("cartCount");
  if (!badge) return;
  badge.classList.remove("pulse");
  void badge.offsetWidth; // restart animation
  badge.classList.add("pulse");
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const emptyEl = document.getElementById("cartEmpty");
  if (countEl) countEl.textContent = getCartCount();
  if (!itemsEl || !totalEl) return;

  const details = getCartDetails();
  if (details.length === 0) {
    itemsEl.innerHTML = "";
    if (emptyEl) emptyEl.style.display = "block";
  } else {
    if (emptyEl) emptyEl.style.display = "none";
    itemsEl.innerHTML = details
      .map((item) => {
        const swatchStyle = swatchStyleFor(item.product);
        return `
        <div class="cart-item">
          <div class="cart-item-swatch" style="${swatchStyle}"></div>
          <div class="cart-item-info">
            <p class="cart-item-name">${item.product.name}</p>
            <p class="cart-item-color">${item.product.color}</p>
            <div class="cart-item-controls">
              <button class="qty-btn" aria-label="Decrease quantity" onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" aria-label="Increase quantity" onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
              <button class="cart-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
          </div>
          <span class="cart-item-price">${formatPrice(item.product.price * item.qty)}</span>
        </div>
      `;
      })
      .join("");
  }
  totalEl.textContent = formatPrice(getCartTotal());
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("visible");
  document.body.classList.add("no-scroll");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

function openCheckout() {
  if (getCartCount() === 0) return;
  closeCart();
  document.getElementById("checkoutModal").classList.add("open");
  document.body.classList.add("no-scroll");
  document.getElementById("checkoutTotal").textContent = formatPrice(getCartTotal());
}
function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function togglePaymentDetails() {
  const checked = document.querySelector('input[name="payment"]:checked');
  const upiBox = document.getElementById("upiInstructions");
  if (upiBox && checked) upiBox.style.display = checked.value === "upi" ? "block" : "none";
}

function buildOrderMessage(customer) {
  const details = getCartDetails();
  const lines = details.map(
    (item, i) =>
      `${i + 1}. ${item.product.name} - ${item.product.color} x${item.qty} - ${formatPrice(item.product.price * item.qty)}`
  );
  const total = formatPrice(getCartTotal());
  const method = customer.payment === "upi" ? "UPI" : "Cash on Delivery";

  return [
    "New Order - NS Groups Website",
    "",
    "Items:",
    ...lines,
    "",
    `Total: ${total}`,
    "",
    "Customer Details:",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
    "",
    `Payment Method: ${method}`,
    customer.notes ? `Notes: ${customer.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function submitOrder(event) {
  event.preventDefault();
  const form = event.target;
  const customer = {
    name: form.name.value.trim(),
    phone: form.phone.value.trim(),
    address: form.address.value.trim(),
    city: form.city.value.trim(),
    state: form.state.value.trim(),
    pincode: form.pincode.value.trim(),
    notes: form.notes.value.trim(),
    payment: form.payment.value,
  };

  const message = buildOrderMessage(customer);
  const url = "https://wa.me/" + NS_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(message);
  window.open(url, "_blank");

  CART = [];
  updateCartUI();
  closeCheckout();
  form.reset();
  togglePaymentDetails();
}

function payViaUpiApp() {
  const amount = getCartTotal();
  if (amount <= 0) return;
  const upiUrl =
    "upi://pay?pa=" +
    encodeURIComponent(NS_CONFIG.upiId) +
    "&pn=" +
    encodeURIComponent(NS_CONFIG.brandName) +
    "&am=" +
    amount +
    "&cu=INR" +
    "&tn=" +
    encodeURIComponent("NS Groups Saree Order");
  window.location.href = upiUrl;
}
