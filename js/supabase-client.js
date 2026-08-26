// supabase-client.js
// Supabase client configuration for NS Groups

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://jvjraqtyhbqaqifjwoix.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_fopmMmEdjwFLAz4sQBkVkQ_AMvHxMEa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions for common queries
export async function getProducts({ category, visibleOnly = true, featuredOnly = false } = {}) {
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)')
    .order('created_at', { ascending: false });

  if (visibleOnly) query = query.eq('is_visible', true);
  if (featuredOnly) query = query.eq('is_featured', true);
  if (category && category !== 'all') query = query.eq('category_id', category);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data;
}

export async function getCategoryById(id) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

export async function getHomepageContent() {
  const { data, error } = await supabase
    .from('homepage_content')
    .select('*')
    .limit(1)
    .single();
  if (error) throw error;
  return data;
}

// Admin functions (require authentication)
export async function createProduct(product) {
  const { data, error } = await supabase
    .from('products')
    .insert(product)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function updateSiteSettings(settings) {
  const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq('id', (await getSiteSettings()).id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateHomepageContent(content) {
  const { data, error } = await supabase
    .from('homepage_content')
    .update({ ...content, updated_at: new Date().toISOString() })
    .eq('id', (await getHomepageContent()).id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Image upload
export async function uploadProductImage(file, productId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${productId}/${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
  if (error) throw error;
  return data.path;
}

export async function deleteProductImage(path) {
  const { error } = await supabase.storage
    .from('product-images')
    .remove([path]);
  if (error) throw error;
  return true;
}

export function getImagePublicUrl(path) {
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}

// Auth helpers
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}