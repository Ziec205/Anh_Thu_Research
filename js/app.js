import * as store from './store.js';
import { route, start, back, render, path, go } from './router.js';
import { t } from './i18n.js';
import { $, $$, icon, esc } from './ui.js';
import { initPetals } from './fx.js';
import { openProfile } from './views/profile.js';

import home from './views/home.js';
import { explore, station } from './views/explore.js';
import { gamesHub } from './views/games.js';
import chado from './views/chado.js';
import washoku from './views/washoku.js';
import matsuri from './views/matsuri.js';
import rewards from './views/rewards.js';
import survey from './views/survey.js';
import about from './views/about.js';

const NAV = [
  { key: 'home', href: '#/', icon: 'qr_code_scanner', match: (p) => p === '/' || p.startsWith('/checkin') },
  { key: 'explore', href: '#/explore', icon: 'temple_buddhist', match: (p) => p.startsWith('/explore') },
  { key: 'games', href: '#/games', icon: 'potted_plant', match: (p) => p.startsWith('/games') },
  { key: 'rewards', href: '#/rewards', icon: 'featured_seasonal_and_gifts', match: (p) => p.startsWith('/rewards') || p.startsWith('/survey') },
];

// ---- routes ---------------------------------------------------------------
route('/', () => home());
route('/checkin/:code', (p) => home({ code: p.code }));
route('/explore', () => explore());
route('/explore/:id', (p) => station(p.id));
route('/games', () => gamesHub());
route('/games/chado', () => chado());
route('/games/washoku', () => washoku());
route('/games/matsuri', () => matsuri());
route('/games/:id', () => { go('/games', { replace: true }); return false; }); // unknown game id
route('/rewards', () => rewards());
route('/survey', () => survey());
route('/about', () => about());

// ---- chrome (header / nav / footer) ----------------------------------------
function renderChrome() {
  const p = path(), s = store.get();
  const links = NAV.map((n) => `<a href="${n.href}" ${n.match(p) ? 'aria-current="page"' : ''}>${icon(n.icon, 'sm')}<span>${t('nav.' + n.key)}</span></a>`);
  $('#topnav').innerHTML = links.join('') + `<a href="#/about" ${p.startsWith('/about') ? 'aria-current="page"' : ''}>${icon('info', 'sm')}<span>${t('nav.about')}</span></a>`;
  $('#bottomnav-list').innerHTML = NAV.map((n) => `<li><a href="${n.href}" ${n.match(p) ? 'aria-current="page"' : ''}><span class="pill">${icon(n.icon)}</span><span>${t('nav.' + n.key)}</span></a></li>`).join('');
  $('#chip-progress').innerHTML = `${icon('military_tech', 'sm fill')}<span>${store.badgeCount()}/3</span><span class="lbl">huy hiệu</span>`;
  $$('#lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === s.lang)));
  document.documentElement.lang = s.lang === 'ja' ? 'ja' : 'vi';
  $('#footer-links').innerHTML = [...NAV.map((n) => `<a href="${n.href}">${t('nav.' + n.key)}</a>`), `<a href="#/about">${t('nav.about')}</a>`].join('');
  $('#footer-note').textContent = t('footer.note');
}

// ---- view mounting ----------------------------------------------------------
let first = true;
start((p, view) => {
  const main = $('#view');
  main.innerHTML = view.html;
  view.mount?.(main);
  document.title = `${view.title ? view.title + ' · ' : ''}WAKEI 和敬`;
  renderChrome();
  if (!first) { window.scrollTo({ top: 0, behavior: 'instant' }); main.focus({ preventScroll: true }); }
  first = false;
});

// language switch re-renders the current page; any other state change only refreshes the chrome
let lastLang = store.get().lang;
store.subscribe((s) => { renderChrome(); if (s.lang !== lastLang) { lastLang = s.lang; render(); } });

// ---- global interactions ----------------------------------------------------
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-back]');
  if (b) { e.preventDefault(); back(b.dataset.back); return; }
  const l = e.target.closest('#lang button');
  if (l) store.setLang(l.dataset.lang);
  if (e.target.closest('#btn-profile')) openProfile();
});

// Pretty keyboard shortcut: Esc inside a game does nothing special. Nothing else global.

// ---- effects (non-blocking, optional) ---------------------------------------
initPetals($('#fx')).catch(() => {});

// Expose a tiny debug handle for testers
window.WAKEI = { store };
