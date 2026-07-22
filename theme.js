// Handles the light/dark theme toggle.
// Defaults to the system preference unless the user has explicitly chosen a theme.
const media = window.matchMedia('(prefers-color-scheme: light)');

function getSystemTheme() {
  return media.matches ? 'light' : 'dark';
}

function getEffectiveTheme() {
  return document.documentElement.getAttribute('data-theme') || getSystemTheme();
}

function updateToggleIcon(theme) {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.textContent = theme === 'light' ? '🌙' : '☀️';
  btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateToggleIcon(theme);
}

function initThemeToggle() {
  updateToggleIcon(getEffectiveTheme());

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      applyTheme(getEffectiveTheme() === 'light' ? 'dark' : 'light');
    });
  }

  // Keep the icon in sync if the OS theme changes while no explicit choice is stored
  media.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) {
      updateToggleIcon(getSystemTheme());
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}
