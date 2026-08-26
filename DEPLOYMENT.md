# NS Groups — CMS Deployment Guide

Complete step-by-step instructions to deploy the NS Groups website with Supabase CMS backend.

---

## 📋 Prerequisites

- **Supabase Account** — [supabase.com](https://supabase.com)
- **Vercel/Netlify Account** — For frontend hosting
- **GitHub Account** — For version control (optional but recommended)

---

## 🗄️ Step 1: Supabase Database Setup

### 1.1 Create/Select Project
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your existing project: **jvjraqtyhbqaqifjwoix**
3. Note your **Project URL**: `https://jvjraqtyhbqaqifjwoix.supabase.co`
4. Note your **Anon Key**: `sb_publishable_fopmMmEdjwFLAz4sQBkVkQ_AMvHxMEa`

### 1.2 Run Database Schema
1. In Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy the **entire contents** of `supabase-schema.sql` from this project
3. Paste and click **Run**
4. Verify tables created: `categories`, `products`, `site_settings`, `homepage_content`

### 1.3 Create Storage Bucket
1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Name: `product-images`
4. **Public bucket**: ✅ Yes
5. Click **Create bucket**

### 1.4 Configure Storage Policies
In SQL Editor, run:
```sql
-- Allow public read access to product images
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to upload
CREATE POLICY "Admin upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Admin update product images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Admin delete product images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

### 1.5 Configure Authentication
1. Go to **Authentication** → **Settings**
2. **Site URL**: Add your production URL (e.g., `https://nsgroups.in`)
3. **Redirect URLs**: Add:
   - `https://nsgroups.in/admin/`
   - `http://localhost:3000/admin/` (for local development)
4. **Email Auth**: Enable **Email** provider
5. **Disable** email confirmations for easier admin setup (optional):
   - **Authentication** → **Providers** → **Email** → Disable "Confirm email"

---

## 👤 Step 2: Create First Admin Account

### Option A: Supabase Dashboard (Recommended)
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Invite User**
3. Enter your admin email
4. User receives email with magic link to set password

### Option B: Self-Registration
1. Deploy the admin panel first (see Step 3)
2. Visit `https://your-domain.com/admin/login.html`
3. Click "Sign Up" (if enabled) or use magic link

### Option C: SQL (Direct)
```sql
-- Run in SQL Editor
SELECT auth.admin_create_user(
  '{"email": "admin@nsgroups.com", "password": "your-secure-password", "email_confirm": true}'
);
```

---

## 🌐 Step 3: Deploy Frontend (Vercel Recommended)

### 3.1 Prepare Repository
```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: NS Groups with CMS"

# Push to GitHub
git remote add origin https://github.com/yourusername/nsgroups.git
git push -u origin main
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. **Framework Preset**: Other
4. **Root Directory**: `.` (project root)
5. **Build Command**: Leave empty (static site)
6. **Output Directory**: Leave empty
7. Click **Deploy**

### 3.3 Configure Environment Variables (Vercel)
In Vercel Dashboard → **Settings** → **Environment Variables**, add:

| Name | Value | Environment |
|------|-------|-------------|
| `SUPABASE_URL` | `https://jvjraqtyhbqaqifjwoix.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `sb_publishable_fopmMmEdjwFLAz4sQBkVkQ_AMvHxMEa` | Production, Preview, Development |

### 3.4 Update Supabase Auth URLs
After Vercel gives you a URL (e.g., `https://nsgroups.vercel.app`):
1. Supabase → **Authentication** → **Settings**
2. **Site URL**: `https://nsgroups.vercel.app`
3. **Redirect URLs**: Add `https://nsgroups.vercel.app/admin/`

### 3.5 Custom Domain (Optional)
1. Vercel → **Settings** → **Domains**
2. Add your domain (e.g., `nsgroups.in`)
3. Configure DNS as instructed
4. Update Supabase **Site URL** to your custom domain

---

## 📦 Step 4: Migrate Existing Data

### 4.1 Access Migration Tool
1. Visit: `https://your-domain.com/admin/migrate.html`
2. Log in with your admin account

### 4.2 Run Migration
1. Click **"Run Full Migration"**
2. Wait for all 4 steps to complete:
   - ✅ Seed Categories (3 categories)
   - ✅ Migrate Site Settings
   - ✅ Migrate Homepage Content
   - ✅ Migrate 25 Products
3. Check details for any errors

### 4.3 Verify Data
Visit each admin page to confirm:
- `/admin/products.html` — 25 products listed
- `/admin/categories.html` — 3 categories with product counts
- `/admin/settings.html` — Business info populated
- `/admin/homepage.html` — Hero, About, Highlights, Gallery content

---

## ✅ Step 5: Verify Public Website

Visit your deployed site and verify:

### Homepage
- [ ] Hero heading/subtitle from CMS
- [ ] Hero buttons work
- [ ] About section content from CMS
- [ ] Highlights (3 cards) from CMS
- [ ] Gallery images (if uploaded)

### Collections Page
- [ ] All 25 products display
- [ ] Category filters work (Banarasi/Pashmina/Ethnic)
- [ ] Product cards show name, color, price
- [ ] Product modal opens on click
- [ ] "Add to Cart" works

### Cart & Checkout
- [ ] Cart drawer opens
- [ ] Quantity controls work
- [ ] Checkout modal opens
- [ ] WhatsApp order sends correctly
- [ ] UPI payment link works

### Contact Page
- [ ] Address, phone, email from CMS
- [ ] WhatsApp links work
- [ ] Map embed loads
- [ ] Social links work
- [ ] Enquiry form sends to WhatsApp

---

## 📱 Step 6: Client User Guide

### How to Log In (from Phone/PC)
1. Open browser → go to `https://your-domain.com/admin/login.html`
2. Enter admin email & password
3. Tap **"Sign In"**
4. You'll land on **Dashboard**

### How to Add a Product
1. Tap **Products** in sidebar → **Products**
2. Tap **"+ Add Product"** (top right)
3. Fill in:
   - **Product Name** (required)
   - **Category** (required) — dropdown
   - **Color** (required)
   - **Price** (required, in ₹)
   - **Stock Quantity** (default 0)
   - **Stock Status** — In Stock / Out of Stock
   - **Description** (optional)
   - **Product Images** — Tap upload area, select photos from gallery/camera
   - **Visible on Website** — Toggle on/off
   - **Featured Product** — Toggle for homepage highlight
4. Tap **"Save Product"**
5. Product appears instantly on live website

### How to Edit a Product
1. Go to **Products** list
2. Find product → Tap **Edit icon** (pencil)
3. Modify any field
4. Tap **"Save Product"**
6. Changes appear instantly on live website

### How to Change Price
1. Edit product (above)
2. Update **Price** field
3. Save → New price shows immediately on website

### How to Update Stock
1. Edit product
2. Change **Stock Quantity** number
3. Set **Stock Status**: In Stock / Out of Stock
4. Save → Website shows "Out of Stock" badge, disables "Add to Cart"

### How to Upload Images
1. Edit/Add product
2. Tap **"Drag & drop images here, or click to browse"**
3. Select multiple photos from:
   - **Phone**: Gallery, Camera, Files
   - **PC**: File explorer
4. Preview shows thumbnails
5. Tap **×** on any image to remove
6. Save product → Images upload to Supabase Storage CDN

### How to Manage Categories
1. Sidebar → **Categories**
2. **Add Category**: Name + Slug (auto-generated)
3. **Edit**: Tap pencil icon
4. **Delete**: Tap trash icon (moves products to uncategorized)
5. Product count shows per category

### How to Update Business Settings
1. Sidebar → **Business Settings**
2. Three tabs: Basic Info, Contact, Social & Payment
3. Edit any field → **Save** button per section
4. Changes reflect immediately on website

### How to Edit Homepage Content
1. Sidebar → **Homepage**
2. **Hero Section**: Heading, subtitle, button text/links
3. **About Section**: Heading + multiple paragraphs
4. **Highlights**: 3 cards (icon, title, description)
5. **Gallery**: Upload images + CTA button
6. Save each section independently

---

## 🔧 Step 7: Maintenance

### Regular Tasks
- **Weekly**: Check orders via WhatsApp
- **Monthly**: Update stock quantities
- **As needed**: Add new products, upload photos
- **Quarterly**: Review/update business settings

### Backups
- Supabase: Automatic daily backups (Pro plan)
- Manual: **Database** → **Backups** → Create manual backup

### Monitoring
- Vercel Analytics: Page views, performance
- Supabase Logs: API errors, auth events
- WhatsApp Business: Order tracking

---

## 🚨 Troubleshooting

### "Failed to load products" on website
1. Check browser console for errors
2. Verify Supabase URL & Anon Key in Vercel env vars
3. Check Supabase → **Logs** → **API** for failed requests
4. Ensure RLS policies allow public read on `products`

### Admin login fails
1. Check Supabase → **Authentication** → **Users** — user exists?
2. Check email confirmed?
3. Try magic link instead of password
3. Verify Vercel redirect URLs match Supabase config

### Images don't upload
1. Check Storage bucket `product-images` exists and is public
2. Verify storage policies allow authenticated INSERT
3. Check file size < 5MB, type is image/*
4. Check browser console for CORS errors

### WhatsApp orders not sending
1. Verify `whatsappNumber` in settings (no +, no spaces)
2. Test `https://wa.me/919044749797` in browser
3. Check WhatsApp Business app is installed/linked

### Cart not persisting
- Current implementation uses in-memory cart (lost on refresh)
- For persistence, add localStorage backup in `cart.js`

---

## 📁 File Structure Reference

```
ns-groups-website/
├── index.html              # Public website
├── js/
│   ├── config.js           # Fallback config + dynamic config applier
│   ├── products.js         # Product rendering (dynamic + fallback)
│   ├── cart.js             # Cart & checkout logic
│   ├── main.js             # Navigation, modals, initialization
│   ├── public-site.js      # Supabase data fetching for public site
│   ├── supabase-client.js  # Supabase client + helper functions
│   └── three-scene.js      # 3D hero animation
├── css/
│   ├── base.css            # Base styles
│   └── components.css      # Component styles
├── admin/
│   ├── login.html          # Admin login page
│   ├── index.html          # Dashboard overview
│   ├── products.html       # Product management
│   ├── categories.html     # Category management
│   ├── settings.html       # Business settings
│   ├── homepage.html       # Homepage content management
│   ├── migrate.html        # Data migration tool
│   ├── css/
│   │   ├── admin-login.css
│   │   └── admin.css       # Admin dashboard styles
│   └── js/
│       └── admin-core.js   # Admin auth, UI utilities
├── supabase-schema.sql     # Database schema + RLS + seed data
├── assets/
│   └── logo.jpeg
└── DEPLOYMENT.md           # This file
```

---

## 🔐 Security Checklist

- [ ] Supabase Anon Key is public (safe for client-side)
- [ ] Service Role Key **NEVER** in frontend (only in Edge Functions)
- [ ] RLS policies enforce: public read, admin write
- [ ] Admin routes protected by auth check
- [ ] HTTPS enforced (Vercel provides automatically)
- [ ] No secrets in git history (use Vercel env vars)
- [ ] CORS configured for your domain only (Supabase → Auth → Settings)

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Project Issues**: Create issue in GitHub repo

---

**Last Updated**: August 2025  
**Version**: 1.0.0