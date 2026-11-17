// Small UI helpers: escaping, icons, toast, modal, QR, formatting.

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const icon = (name, cls = '') => `<span class="ms ${cls}" aria-hidden="true">${name}</span>`;
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export const fmtTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
export const fmtClock = (iso) => (iso ? new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—');
export const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---- toast ------------------------------------------------------------------
export function toast(msg, ic = 'check_circle') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast'; el.setAttribute('role', 'status');
  el.innerHTML = `${icon(ic, 'sm')}<span>${esc(msg)}</span>`;
  root.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, 2600);
}

export async function copyText(text, okMsg = 'Đã sao chép!') {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    try { document.execCommand('copy'); } catch { /* ignore */ }
    t.remove();
  }
  toast(okMsg);
}

// ---- modal ------------------------------------------------------------------
let openCount = 0;
export function openModal({ html, label = 'Hộp thoại', onMount, onClose }) {
  const root = document.getElementById('modal-root');
  const prevFocus = document.activeElement;
  const wrap = document.createElement('div');
  wrap.className = 'modal';
  wrap.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(label)}" tabindex="-1">
    <button class="icon-btn ghost close" type="button" aria-label="Đóng">${icon('close')}</button>${html}</div>`;
  root.appendChild(wrap);
  document.body.style.overflow = 'hidden'; openCount++;
  const sheet = wrap.firstElementChild;
  let closed = false;
  const close = () => {
    if (closed) return; closed = true;
    document.removeEventListener('keydown', onKey);
    wrap.remove();
    if (--openCount <= 0) { document.body.style.overflow = ''; openCount = 0; }
    prevFocus?.focus?.();
    onClose?.();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // simple focus trap
      const f = $$('button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])', sheet).filter((x) => !x.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };
  document.addEventListener('keydown', onKey);
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  $('.close', sheet).addEventListener('click', close);
  sheet.focus();
  onMount?.(sheet, close);
  return { close, el: sheet };
}

// ---- QR ---------------------------------------------------------------------
// Uses the qrcode-generator lib (loaded from CDN). Falls back to nothing if offline.
export function qrSvg(text) {
  if (typeof window.qrcode !== 'function') return `<div class="muted" style="padding:16px;line-height:1.3">QR chưa tải được.<br>Hãy đọc mã số bên dưới.</div>`;
  const qr = window.qrcode(0, 'M'); qr.addData(text); qr.make();
  const n = qr.getModuleCount(), m = 2; let d = '';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + m},${r + m}h1v1h-1z`;
  return `<svg viewBox="0 0 ${n + m * 2} ${n + m * 2}" shape-rendering="crispEdges" role="img" aria-label="Mã QR ${esc(text)}"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#14432a"/></svg>`;
}

export function downloadQr(text, filename = 'wakei-qr.png') {
  if (typeof window.qrcode !== 'function') { toast('Chưa tạo được ảnh QR', 'error'); return; }
  const qr = window.qrcode(0, 'M'); qr.addData(text); qr.make();
  const n = qr.getModuleCount(), cell = 10, pad = 40, label = 56, size = n * cell + pad * 2;
  const cv = document.createElement('canvas'); cv.width = size; cv.height = size + label;
  const g = cv.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#14432a';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) g.fillRect(pad + c * cell, pad + r * cell, cell, cell);
  g.font = '700 22px ui-monospace, Consolas, monospace'; g.textAlign = 'center'; g.fillText(text, size / 2, size + 14);
  const a = document.createElement('a'); a.href = cv.toDataURL('image/png'); a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  toast('Đã lưu ảnh mã QR');
}
