// admin-login.js
// Admin login page logic

import { supabase, signIn, getSession } from '../js/supabase-client.js';

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// Check if already logged in
async function checkExistingSession() {
  const session = await getSession();
  if (session) {
    window.location.href = '/admin/';
  }
}

checkExistingSession();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  if (!email || !password) {
    showError('Please enter both email and password');
    return;
  }
  
  setLoading(true);
  hideError();
  
  try {
    const { data, error } = await signIn(email, password);
    
    if (error) {
      showError(getErrorMessage(error.message));
      return;
    }
    
    // Success - redirect to admin dashboard
    window.location.href = '/admin/';
    
  } catch (err) {
    console.error('Login error:', err);
    showError('An unexpected error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
});

function setLoading(loading) {
  loginBtn.disabled = loading;
  loginBtn.classList.toggle('loading', loading);
  emailInput.disabled = loading;
  passwordInput.disabled = loading;
}

function showError(message) {
  loginError.textContent = message;
  loginError.style.display = 'block';
}

function hideError() {
  loginError.textContent = '';
  loginError.style.display = 'none';
}

function getErrorMessage(error) {
  const errorMap = {
    'Invalid login credentials': 'Invalid email or password. Please try again.',
    'Email not confirmed': 'Please check your email and confirm your account.',
    'Too many requests': 'Too many login attempts. Please wait a moment and try again.',
    'User not found': 'No account found with this email address.',
    'Invalid email': 'Please enter a valid email address.',
  };
  
  for (const [key, msg] of Object.entries(errorMap)) {
    if (error.includes(key)) return msg;
  }
  
  return error || 'Login failed. Please try again.';
}

// Clear error on input
[emailInput, passwordInput].forEach(input => {
  input.addEventListener('input', hideError);
});