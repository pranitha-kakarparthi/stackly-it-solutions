const sessionKey = 'stackly.currentUser';

const removeLoader = () => {
  const loader = document.querySelector('#siteLoader');
  if (!loader) return;
  loader.classList.add('is-hidden');
  window.setTimeout(() => loader.remove(), 250);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeLoader, { once: true });
} else {
  removeLoader();
}
window.setTimeout(removeLoader, 3500);

const fontToggle = document.querySelector('#fontSizeToggle');
fontToggle?.addEventListener('click', () => {
  const enlarged = document.documentElement.classList.toggle('large-text');
  localStorage.setItem('stackly.largeText', String(enlarged));
  fontToggle.setAttribute('aria-pressed', String(enlarged));
});
if (localStorage.getItem('stackly.largeText') === 'true') {
  document.documentElement.classList.add('large-text');
  fontToggle?.setAttribute('aria-pressed', 'true');
}

const saveSession = (user) => {
  localStorage.setItem(sessionKey, JSON.stringify({ ...user, loggedInAt: new Date().toISOString() }));
};
const readSession = () => {
  try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; }
};
const clearSession = () => localStorage.removeItem(sessionKey);

window.StacklySession = { saveSession, readSession, clearSession };
