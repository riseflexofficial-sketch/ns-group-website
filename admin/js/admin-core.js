// admin-core.js
// Core admin dashboard functionality: auth, navigation, UI utilities

import { supabase, signOut, getSession, onAuthStateChange } from '../js/supabase-client.js';

// DOM elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const menuToggle = document.getElementById('menuToggle');
const logoutBtn = document.getElementById('logoutBtn');
const userNameEl = document.getElementById('userName');
const userAvatarEl = document.getElementById('userAvatar');
const pageContent = document.getElementById('pageContent');

// State
let currentUser = null;
let toastContainer = null;

// Initialize
async function init() {
  await checkAuth();
  setupEventListeners();
  highlightActiveNav();
  createToastContainer();
}

// Auth
async function checkAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }
  
  currentUser = session.user;
  updateUserUI(currentUser);
  
  // Listen for auth changes
  onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.href = 'login.html';
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      currentUser = session.user;
      updateUserUI(currentUser);
    }
  });
}

function updateUserUI(user) {
  if (userNameEl) userNameEl.textContent = user.email?.split('@')[0] || 'Admin';
  if (userAvatarEl) userAvatarEl.textContent = (user.email?.[0] || 'A').toUpperCase();
}

async function handleLogout() {
  try {
    await signOut();
  } catch (err) {
    console.error('Logout error:', err);
    showToast('Failed to logout', 'error');
  }
}

// Navigation
function setupEventListeners() {
  // Menu toggle
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleSidebar);
  }
  
  // Sidebar overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Close sidebar on nav link click (mobile)
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeSidebar();
    });
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeAllModals();
    }
  });
}

function toggleSidebar() {
  const isOpen = sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('visible', isOpen);
  menuToggle.setAttribute('aria-expanded', isOpen);
}

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('visible');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function highlightActiveNav() {
  const currentPage = getCurrentPageName();
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
}

function getCurrentPageName() {
  const path = window.location.pathname;
  const page = path.split('/').pop().replace('.html', '') || 'index';
  const pageMap = {
    'index': 'dashboard',
    'products': 'products',
    'categories': 'categories',
    'homepage': 'homepage',
    'settings': 'settings'
  };
  return pageMap[page] || 'dashboard';
}

// Toast notifications
function createToastContainer() {
  if (!document.getElementById('toastContainer')) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  } else {
    toastContainer = document.getElementById('toastContainer');
  }
}

export function showToast(message, type = 'info', duration = 4000) {
  if (!toastContainer) createToastContainer();
  
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Dismiss">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>
  `;
  
  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, duration);
}

// Modal utilities
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    // Focus first focusable element
    const focusable = modal.querySelector('input, select, textarea, button:not([disabled])');
    if (focusable) focusable.focus();
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
}

export function closeAllModals() {
  document.querySelectorAll('.modal-overlay.open').forEach(modal => {
    modal.classList.remove('open');
  });
  document.body.classList.remove('no-scroll');
}

// Setup modal close handlers
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeAllModals();
  }
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    const modal = e.target.closest('.modal-overlay');
    if (modal) closeModal(modal.id);
  }
});

// Keyboard: Escape closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeAllModals();
});

// Form utilities
export function serializeForm(form) {
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  }
  return data;
}

export function setFormValues(form, data) {
  Object.entries(data).forEach(([key, value]) => {
    const input = form.querySelector(`[name="${key}"]`);
    if (input) {
      if (input.type === 'checkbox') {
        input.checked = Boolean(value);
      } else if (input.type === 'radio') {
        const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else if (input.tagName === 'SELECT' && input.multiple) {
        Array.from(input.options).forEach(opt => {
          opt.selected = Array.isArray(value) && value.includes(opt.value);
        });
      } else {
        input.value = value ?? '';
      }
    }
  });
}

export function showFormError(input, message) {
  input.classList.add('error');
  let errorEl = input.parentNode.querySelector('.form-error');
  if (!errorEl) {
    errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    input.parentNode.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

export function clearFormError(input) {
  input.classList.remove('error');
  const errorEl = input.parentNode.querySelector('.form-error');
  if (errorEl) errorEl.remove();
}

export function clearAllFormErrors(form) {
  form.querySelectorAll('.form-error').forEach(el => el.remove());
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Loading state for buttons
export function setButtonLoading(button, loading) {
  button.disabled = loading;
  button.classList.toggle('loading', loading);
}

// Format currency
export function formatPrice(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

// Format date
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Debounce
export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Generate slug
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for use in other modules
export { supabase, currentUser };