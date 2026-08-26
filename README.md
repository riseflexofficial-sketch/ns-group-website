# NS Groups — Website

A fully responsive website for NS Groups (Banarasi, Pashmina & ethnic silk sarees), with a 3D
silk hero, a filterable catalog of 25 sarees, a working cart, and a WhatsApp-based checkout.

## What's inside
- `index.html` — the whole site. Home, Collections, About, Gallery and Contact all live on one
  smooth-scrolling page (product details open in a pop-up instead of a separate page, so the
  cart never loses its contents while browsing).
- `css/base.css`, `css/components.css` — all styling, built from your logo's colors and fonts.
- `js/config.js` — **the file you'll edit most.** Phone, WhatsApp, email, address, UPI ID and
  social links all live here in one place.
- `js/products.js` — your 25 saree listings (name, color, category, price).
- `js/cart.js` — cart + checkout logic.
- `js/three-scene.js` — the animated 3D silk ribbon on the homepage.
- `js/main.js` — navigation, scroll animations, and wiring everything together.
- `assets/logo.jpeg` — your logo.

## Before you launch — please check
1. **Pincode.** I used `221001` in the address. Varanasi PIN codes are usually 6 digits
   starting with 221 — the "21001" you sent looked like it was missing a digit. Confirm the
   correct one in `js/config.js` (`addressLine`).
2. **Email.** I used `nsgroupgroupsn@gmail.com` exactly as sent — worth double-checking it
   isn't a typo (it reads like "group" twice).
3. **UPI ID.** I placed a placeholder (`nsgroups@upi`) in `js/config.js`. Replace it with your
   real UPI ID (from GPay/PhonePe/Paytm/your bank) so the "Pay via UPI App" button works.
4. **WhatsApp number.** Double-check `whatsappNumber` in `js/config.js` is the number you
   actually check orders on.

## How checkout actually works
There's no payment gateway wired in — that needs a registered business (GST) and a provider
like Razorpay. Instead:
- Customers browse, add to cart, and fill in their details at checkout.
- "Place Order via WhatsApp" opens WhatsApp with the full order (items, total, address,
  payment choice) pre-filled, sent to your business WhatsApp number.
- If they choose UPI, they can also tap "Pay via UPI App" to pay directly through
  GPay/PhonePe/etc., then confirm with a screenshot on WhatsApp.
- If they choose Cash on Delivery, that's simply noted in the WhatsApp message.

This is genuinely functional today, at zero cost. Once you register for GST, real-time
automatic UPI/card payment collection can be added on top of this same site.

## Adding real product photos later
Open `js/products.js`. Each product is one line, like:
```
{ id: 1, name: "Banarasi Zari Silk Saree", color: "Royal Maroon", category: "banarasi", price: 8499 },
```
Add an `image` field pointing at a photo (e.g. `image: "assets/products/saree-1.jpg"`), place
the photo in a new `assets/products/` folder, and it will automatically replace the color
swatch on that product — no other changes needed.

## How to host it for free

**Netlify (easiest)**
1. Go to app.netlify.com/drop
2. Drag the whole project folder onto the page
3. Your site is live instantly on a `*.netlify.app` address

**Vercel**
1. Create a free account at vercel.com
2. "Add New Project" → upload the folder
3. Deploy — you'll get a `*.vercel.app` address

**GitHub Pages**
1. Create a free GitHub account and a new repository
2. Upload all these files to the repository
3. Settings → Pages → set source to the main branch
4. Live at `yourusername.github.io/reponame`

## Buying a domain
A `.com` or `.in` domain (like `nsgroups.in`) usually costs ₹500–1,200/year from GoDaddy,
Namecheap, or Hostinger. All three hosts above let you connect a custom domain for free once
you own one.

---
Send real product photos, your GST number (once you have it), and the correct pincode
whenever ready, and the site can be updated.
