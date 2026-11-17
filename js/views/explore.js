import * as store from '../store.js';
import { STATIONS, GAMES } from '../data.js';
import { go } from '../router.js';
import { t } from '../i18n.js';
import { $, icon, esc, fmtTime, toast } from '../ui.js';
import { page, backBar, stationStatus } from './shared.js';

// ---------------------------------------------------------------- list ----
export function explore() {
  const cards = STATIONS.map((st) => {
    const sts = stationStatus(st);
    return `<article class="card media-card ${sts.key === 'none' && !store.get().demo ? 'locked-overlay' : ''}">
      <div class="thumb"><img src="${st.img}" alt="" loading="lazy"><span class="chip dark no">Trạm #${String(st.no).padStart(2, '0')}</span><span class="st">${sts.chip}</span>
        <h3>${esc(st.name)} <span style="opacity:.85;font-weight:500">${st.jp}</span></h3></div>
      <div class="body">
        <p class="sub">${esc(st.concept.note.slice(0, 130))}…</p>
        <div class="row wrap"><span class="chip">${icon('schedule', 'xs')}${st.minutes} phút</span><span class="chip pink">${icon('military_tech', 'xs fill')}${esc(st.badge.name)}</span></div>
        <a class="btn btn-primary btn-block" href="#/explore/${st.id}">Xem chi tiết${icon('arrow_forward', 'sm')}</a>
      </div></article>`;
  }).join('');

  return {
    title: t('nav.explore'),
    html: page(`
      <header class="stack sm"><span class="eyebrow">Lộ trình gợi ý: 01 → 02 → 03</span><h1>${t('explore.title')}</h1>
        <p class="sub" style="max-width:62ch">Mỗi điểm dừng chân là một góc văn hoá Nhật Bản. Ghé thăm, đọc câu chuyện của trạm rồi bắt đầu thử thách để nhận huy hiệu.</p></header>
      <div class="grid cols-3">${cards}</div>`),
  };
}

// -------------------------------------------------------------- detail ----
export function station(id) {
  const st = store.stationOf(id);
  if (!st) { go('/explore', { replace: true }); return false; }
  const idx = STATIONS.indexOf(st), prev = STATIONS[idx - 1], next = STATIONS[idx + 1];
  const unlocked = store.isUnlocked(st.id), earned = store.hasBadge(st.game), ci = store.isCheckedIn(st.id);

  const items = st.items.map((it) => `<div class="item"><div class="ico">${icon(it.icon)}</div><div class="grow"><h4>${esc(it.name)} <span class="kanji">(${it.jp})</span></h4><p>${esc(it.text)}</p></div></div>`).join('');

  const audio = st.audio ? `<section class="card stack" aria-labelledby="au-h">
      <div class="row between"><div class="row">${icon('graphic_eq')}<h3 id="au-h">${esc(st.audio.title)}</h3></div><span class="chip green">${st.audio.seconds} giây</span></div>
      <p class="sub">${esc(st.audio.text)}</p>
      <div class="player" id="player">
        <button class="play" id="au-btn" type="button" aria-label="Phát âm thanh">${icon('play_arrow', 'lg fill')}</button>
        <div class="grow stack sm"><div class="row between sub"><span id="au-status">Sẵn sàng lắng nghe</span><span id="au-time">${fmtTime(st.audio.seconds)}</span></div>
          <div class="wave" aria-hidden="true">${'<i></i>'.repeat(14)}</div></div>
      </div>
      <p class="muted" style="font-size:.75rem">Âm thanh được tổng hợp trực tiếp trên thiết bị để mô phỏng nước sôi và gió qua rừng tùng.</p>
    </section>` : '';

  // status + CTA (derived from real state, not hard-coded)
  let notice, cta;
  if (earned) {
    notice = `<div class="notice ok">${icon('verified', 'sm fill')}<span>Bạn đã nhận huy hiệu "${esc(st.badge.name)}". Chơi lại để cải thiện kết quả.</span></div>`;
    cta = `<a class="btn btn-primary btn-block" href="#/games/${st.game}">${icon('replay')}Chơi lại thử thách</a>`;
  } else if (unlocked) {
    notice = `<div class="notice warn">${icon('info', 'sm')}<span>Bạn chưa hoàn thành "${esc(st.gameTitle)}" để nhận huy hiệu tại trạm này.</span></div>`;
    cta = `<a class="btn btn-primary btn-block" href="#/games/${st.game}">Bắt đầu: ${esc(st.gameTitle)}${icon('arrow_forward', 'sm')}</a>`;
  } else {
    notice = `<div class="notice info">${icon('lock', 'sm')}<span>Check-in tại trạm (mã <span class="kbd">${st.code}</span>) để mở khoá thử thách.</span></div>`;
    cta = `<a class="btn btn-primary btn-block" href="#/checkin/${st.code}">${icon('qr_code_scanner')}Check-in trạm này</a>`;
  }

  const html = page(`
    ${backBar('/explore', 'Quay lại Bản đồ', `<span class="chip pink">${icon('spa', 'xs fill')}Điểm dừng chân #${String(st.no).padStart(2, '0')}</span>`)}
    <div class="hero-img"><img src="${st.img}" alt="${esc(st.name)}"><div class="cap">
      <span class="chip glass">${icon('schedule', 'xs fill')}Thời gian khuyến nghị: ${st.minutes} phút</span>
      <h1>${esc(st.name)} <span style="font-weight:500;opacity:.9">(${st.jp})</span></h1></div></div>

    <div class="split">
      <div class="stack" style="gap:20px">
        <section class="card stack">
          <div class="row" style="align-items:flex-start"><span class="item"><span class="ico" style="background:var(--primary-fixed)">${icon(st.icon)}</span></span>
            <div><span class="eyebrow">${esc(st.concept.tag)}</span><h2>${esc(st.concept.title)}</h2></div></div>
          <div class="card tonal"><div class="card-title">${icon('filter_vintage', 'sm fill')}<h3 style="color:var(--secondary)">${esc(st.concept.noteTitle)}</h3></div><p class="sub">${esc(st.concept.note)}</p></div>
        </section>
        ${audio}
        <section class="card stack"><div class="row between"><h3>${esc(st.itemsTitle)}</h3></div><p class="sub">${esc(st.itemsSub)}</p><div class="item-list">${items}</div></section>
      </div>

      <aside class="card stack sticky-aside" aria-label="Thử thách của trạm">
        ${notice}
        <div class="row between item" style="align-items:center">
          <div class="row"><span class="ico" style="background:var(--primary-fixed);width:42px;height:42px;border-radius:50%;display:grid;place-items:center">${icon(st.badge.icon, 'fill')}</span>
            <div><p class="eyebrow" style="color:var(--on-variant)">Phần thưởng trạm</p><p style="font-weight:700;color:var(--tertiary)">Huy hiệu ${esc(st.badge.name)}</p></div></div>
          <span class="chip dark">+${st.xp} XP</span>
        </div>
        ${cta}
        ${ci ? '' : `<a class="btn btn-ghost btn-block" href="#/">${icon('qr_code_scanner')}Mở trang Check-in</a>`}
      </aside>
    </div>

    <nav class="row between" aria-label="Chuyển trạm">
      ${prev ? `<a class="btn btn-ghost" href="#/explore/${prev.id}">${icon('arrow_back', 'sm')}Trạm ${prev.no}: ${esc(prev.name)}</a>` : '<span></span>'}
      ${next ? `<a class="btn btn-ghost" href="#/explore/${next.id}">Trạm ${next.no}: ${esc(next.name)}${icon('arrow_forward', 'sm')}</a>` : `<a class="btn btn-tonal" href="#/games">Tới Minigame${icon('arrow_forward', 'sm')}</a>`}
    </nav>`);

  let stopAudio = () => {};
  return {
    title: st.name, html,
    mount(el) { if (st.audio) stopAudio = mountAudio(el, st.audio.seconds); },
    destroy() { stopAudio(); },
  };
}

// ---------------------------------------------------------------- audio ----
// Synthesised "kettle + pine wind" ambience (brown noise → band-pass, slowly swelling). No audio files needed.
function mountAudio(el, seconds) {
  const player = $('#player', el), btn = $('#au-btn', el), status = $('#au-status', el), clock = $('#au-time', el);
  let ctx = null, nodes = [], tick = null, left = seconds, playing = false;

  const setUi = (on, text) => {
    playing = on; player.classList.toggle('on', on);
    btn.innerHTML = icon(on ? 'pause' : 'play_arrow', 'lg fill'); btn.setAttribute('aria-label', on ? 'Tạm dừng' : 'Phát âm thanh');
    status.textContent = text; clock.textContent = fmtTime(left);
  };
  const teardown = () => { clearInterval(tick); tick = null; nodes.forEach((n) => { try { n.stop?.(); n.disconnect?.(); } catch { /* */ } }); nodes = []; };

  function build() {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
    ctx ||= new AC();
    const len = ctx.sampleRate * 3, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.7;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
    const gain = ctx.createGain(); gain.gain.value = 0.0;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.18;
    const depth = ctx.createGain(); depth.gain.value = 0.12;
    lfo.connect(depth).connect(gain.gain);
    src.connect(bp).connect(lp).connect(gain).connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.28, now + 1.5);
    src.start(); lfo.start();
    nodes = [src, lfo, depth, gain, bp, lp];
    return true;
  }

  function play() {
    if (left <= 0) left = seconds;
    teardown();
    if (!build()) { toast('Trình duyệt không hỗ trợ phát âm thanh', 'error'); return; }
    ctx.resume?.();
    setUi(true, 'Đang phát âm thanh…');
    tick = setInterval(() => {
      left--; clock.textContent = fmtTime(Math.max(0, left));
      if (left <= 0) { teardown(); left = seconds; setUi(false, 'Đã nghe xong — nghe lại?'); store.log('audio_done', { station: 'san-an' }); }
    }, 1000);
  }
  function pause() { teardown(); setUi(false, 'Tạm dừng'); }

  btn.addEventListener('click', () => (playing ? pause() : play()));
  return () => { teardown(); ctx?.close?.(); ctx = null; };
}
