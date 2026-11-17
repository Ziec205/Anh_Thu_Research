// Tiny hash router — works on GitHub Pages without server rewrites.
// Routes look like  #/explore/san-an

const routes = [];
let current = null;       // { destroy }
let navCount = 0;         // in-app navigations since load (so "Back" never leaves the site)
let onChange = () => {};

export function route(pattern, handler) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-z]+)\??/gi, (_, k) => { keys.push(k); return '([^/]*)'; }).replace(/\/$/, '') + '/?$');
  routes.push({ re, keys, handler });
}

export const path = () => (location.hash.replace(/^#/, '') || '/').split('?')[0];
let skipCount = false;
export const go = (to, { replace = false } = {}) => {
  const target = '#' + to;
  if (location.hash === target || (to === '/' && !location.hash)) { render(); return; } // same route: no hashchange fires
  if (replace) { skipCount = true; location.replace(target); } else location.hash = to;
};

// "Back" button: real history when we navigated inside the app, else a sensible parent.
export function back(fallback = '/') {
  if (navCount > 0) history.back(); else go(fallback, { replace: true });
}

export function start(changeCb) {
  onChange = changeCb || onChange;
  window.addEventListener('hashchange', () => { if (skipCount) skipCount = false; else navCount++; render(); });
  render();
}

export async function render() {
  const p = path();
  current?.destroy?.(); current = null;
  let match = null;
  for (const r of routes) {
    const m = r.re.exec(p);
    if (m) { match = { r, params: Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1] || '')])) }; break; }
  }
  if (!match) { go('/', { replace: true }); return; }
  const view = await match.r.handler(match.params);
  if (view === false) return; // handler redirected
  current = view;
  onChange(p, view);
}
