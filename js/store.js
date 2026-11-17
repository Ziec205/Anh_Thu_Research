// App state + persistence. Everything is stored in localStorage for now.
// The `api` object at the bottom is the single seam where the backend plugs in later.

import { STATIONS, GAMES } from './data.js';

const KEY = 'wakei.v1';
const TOTAL_BADGES = Object.keys(GAMES).length;

const DEFAULTS = () => ({
  v: 1,
  lang: 'vi',
  demo: true,            // demo mode: stations are unlocked without scanning a QR code
  profile: { name: '', studentId: '' },
  checkins: {},          // stationId -> ISO time
  badges: {},            // gameId -> { at, ...stats }
  survey: null,          // { at, answers }
  voucher: null,         // { code, issuedAt, redeemed, redeemedAt }
  telemetry: [],         // research events, queued for the backend
});

let state = load();
const subs = new Set();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.v === 1) return { ...DEFAULTS(), ...raw, profile: { ...DEFAULTS().profile, ...raw.profile } };
  } catch { /* storage blocked or corrupt */ }
  return DEFAULTS();
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}
function emit() { save(); subs.forEach((fn) => fn(state)); }

export const subscribe = (fn) => { subs.add(fn); return () => subs.delete(fn); };
export const get = () => state;

export const stationOf = (id) => STATIONS.find((s) => s.id === id);
export const stationByGame = (gameId) => STATIONS.find((s) => s.game === gameId);
export const stationByCode = (code) => {
  const c = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
  return STATIONS.find((s) => s.code === c || s.code.replace('-', '') === c);
};

export const isCheckedIn = (stationId) => !!state.checkins[stationId];
export const isUnlocked = (stationId) => state.demo || isCheckedIn(stationId);
export const hasBadge = (gameId) => !!state.badges[gameId];
export const badgeCount = () => Object.keys(state.badges).length;
export const allBadges = () => badgeCount() >= TOTAL_BADGES;
export const surveyDone = () => !!state.survey;
export const progressPct = () => Math.round(((badgeCount() + (surveyDone() ? 1 : 0)) / (TOTAL_BADGES + 1)) * 100);
export const nextGame = () => Object.keys(GAMES).find((id) => !hasBadge(id)) || null;

export function checkIn(stationId) {
  if (!stationOf(stationId)) return { ok: false };
  const already = isCheckedIn(stationId);
  if (!already) {
    state.checkins[stationId] = new Date().toISOString();
    log('checkin', { station: stationId });
    emit();
  }
  return { ok: true, already };
}

export function awardBadge(gameId, stats = {}) {
  const first = !hasBadge(gameId);
  // keep the best result if replayed, but never remove a badge
  const prev = state.badges[gameId];
  if (first || (stats.score ?? 0) >= (prev.score ?? 0)) {
    state.badges[gameId] = { ...stats, at: prev?.at || new Date().toISOString() };
  }
  log('badge', { game: gameId, ...stats });
  emit();
  return { first, all: allBadges() };
}

export function submitSurvey({ answers, name, studentId }) {
  if (!allBadges()) return { ok: false, reason: 'badges' };
  state.profile.name = name.trim();
  state.profile.studentId = (studentId || '').trim();
  state.survey = { at: new Date().toISOString(), answers };
  if (!state.voucher) state.voucher = { code: makeCode(), issuedAt: new Date().toISOString(), redeemed: false, redeemedAt: null };
  log('survey', { answers });
  emit();
  api.pushSurvey?.(state.survey);
  return { ok: true, voucher: state.voucher };
}

export function redeemVoucherDemo() {
  if (!state.voucher || state.voucher.redeemed) return;
  state.voucher.redeemed = true;
  state.voucher.redeemedAt = new Date().toISOString();
  log('voucher_redeemed', {});
  emit();
}

export const setLang = (lang) => { state.lang = lang; emit(); };
export const setDemo = (on) => { state.demo = !!on; emit(); };
export function setProfile(p) { state.profile = { ...state.profile, ...p }; emit(); }
export function resetAll() { const { lang, demo } = state; state = { ...DEFAULTS(), lang, demo }; emit(); }

// ---- research telemetry (queued locally; BE will drain it) -------------------
export function log(type, data = {}) {
  state.telemetry.push({ type, at: Date.now(), ...data });
  if (state.telemetry.length > 500) state.telemetry.splice(0, state.telemetry.length - 500);
  save(); // not emit(): logging shouldn't re-render the UI
}

function makeCode() {
  const rnd = (n, chars) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (v) => chars[v % chars.length]).join('');
  return `WAK-${rnd(4, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789')}-${new Date().getFullYear()}-${rnd(4, '0123456789')}`;
}

// ---- backend seam ---------------------------------------------------------
// TODO(BE): set API_BASE, implement these. Nothing else in the app needs to change.
export const API_BASE = null; // e.g. 'https://api.example.com'
export const api = {
  async pushSurvey(_survey) { /* POST `${API_BASE}/survey` */ },
  async flushTelemetry() { /* POST `${API_BASE}/telemetry` with state.telemetry, then clear it */ },
  async verifyVoucher(_code) { /* GET `${API_BASE}/voucher/:code` — staff side */ },
};
