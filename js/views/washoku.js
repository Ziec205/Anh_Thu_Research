import * as store from '../store.js';
import { GAMES } from '../data.js';
import { $, $$, icon, esc, fmtTime, toast, shuffle } from '../ui.js';
import { page, backBar, lockedCard, gameHeader, claimBadge, nextSteps } from './shared.js';

const HINTS = {
  gohan: 'Cơm ở vị trí tôn quý nhất: phía trước, bên trái.',
  shiru: 'Canh miso nằm phía trước, bên phải.',
  shusai: 'Món chính (cá nướng) đặt phía sau, bên phải.',
  kobachi: 'Món phụ rau ninh đặt phía sau, bên trái.',
  tsukemono: 'Dưa muối tsukemono là món phụ ở giữa hàng sau.',
  hashi: 'Đũa Hashi đặt ngang phía trước, đầu gắp hướng sang trái.',
};

export default function washoku() {
  const g = GAMES.washoku, st = store.stationByGame('washoku');
  if (!store.isUnlocked(st.id)) return { title: g.name, html: page(backBar('/games', 'Danh sách Minigame') + lockedCard(st)) };

  const lesson = g.cards.map((c) => `<div class="item"><div class="ico kanji" style="color:var(--primary)">${c.k}</div><div class="grow"><h4>${esc(c.t)} ${c.dots ? `<span class="dots">${c.dots.map((d) => `<i style="background:${d}"></i>`).join('')}</span>` : ''}</h4><p>${esc(c.p)}</p></div></div>`).join('');
  const html = page(`
    ${gameHeader(g, st)}
    <div class="hero-img" style="height:clamp(180px,28vw,320px)"><img src="${g.img}" alt="Bữa ăn Ichiju-Sansai"><div class="cap"><span class="chip glass">${icon('verified', 'xs fill')}Cân bằng & Tối giản</span></div></div>
    <section class="card stack"><div class="row between"><h2>Triết lý cốt lõi</h2><span class="chip">3 bài học then chốt</span></div><div class="item-list">${lesson}</div></section>
    <section class="card stack" id="game" aria-live="polite"></section>`);

  let ticker = null;
  return {
    title: g.name, html,
    mount(el) {
      const box = $('#game', el);
      let S;
      const fresh = () => ({ placed: {}, sel: null, mistakes: 0, t0: 0, done: false, elapsed: 0 });
      S = fresh();
      const dishOf = (id) => g.dishes.find((d) => d.id === id);
      const stop = () => { clearInterval(ticker); ticker = null; };
      const startClock = () => {
        if (S.t0) return; S.t0 = Date.now();
        ticker = setInterval(() => { const n = $('#wk-time', box); if (n) n.textContent = fmtTime((Date.now() - S.t0) / 1000); }, 500);
      };
      const placedCount = () => Object.keys(S.placed).length;

      function draw() {
        const slots = g.slots.map((sl) => {
          const d = S.placed[sl.id] && dishOf(S.placed[sl.id]);
          if (d) return `<div class="slot filled ${sl.wide ? 'chopsticks' : ''}" role="img" aria-label="${esc(d.name)} đã đặt đúng">${icon('check_circle', 'sm fill tick')}${icon(d.icon, 'lg')}<span>${esc(d.name)}</span></div>`;
          return `<button type="button" class="slot target ${sl.wide ? 'chopsticks' : ''}" data-slot="${sl.id}" aria-label="Vị trí: ${esc(sl.label)}">${icon(sl.wide ? 'horizontal_rule' : 'add', 'sm')}<span>${esc(sl.label)}</span></button>`;
        }).join('');
        const dishes = g.dishes.map((d) => `<button type="button" class="dish" data-dish="${d.id}" aria-pressed="${S.sel === d.id}" ${S.placed[g.slots.find((s) => s.dish === d.id).id] ? 'disabled' : ''}>${icon(d.icon, 'sm')}${esc(d.name)}</button>`).join('');
        const all = placedCount() === g.slots.length;
        box.innerHTML = `
          <div class="row between wrap"><div class="row"><span class="chip dark">${icon('extension', 'xs fill')}Minigame tương tác</span><span class="sub">Sắp xếp khay ăn Ichiju-Sansai</span></div>
            <span class="timer-pill" style="background:var(--sc-high);color:var(--on-surface)">${icon('schedule', 'xs')}<span id="wk-time"> ${fmtTime(S.t0 ? (Date.now() - S.t0) / 1000 : 0)}</span></span></div>
          <div class="row between wrap"><strong>Khay gỗ sơn mài (Ozen)</strong><span class="sub">Đã đặt ${placedCount()}/${g.slots.length} món • Sai: ${S.mistakes}</span></div>
          <div class="tray-wrap"><div class="tray" aria-label="Khay ăn">${slots}</div></div>
          <p class="sub" id="wk-hint">${S.sel ? `Đang chọn: <strong>${esc(dishOf(S.sel).name)}</strong> — chạm vào vị trí đúng trên khay.` : (all ? 'Bố cục đã hoàn chỉnh!' : '1) Chọn một món ở khay nguyên liệu  2) Chạm vào vị trí của nó trên khay.')}</p>
          <div class="stack sm"><span class="eyebrow">Khay nguyên liệu sẵn có</span><div class="dishes">${dishes}</div></div>
          <div class="row wrap"><button class="btn btn-primary grow" data-act="lock" ${all ? '' : 'disabled'}>${icon('restaurant')}Khóa bố cục khay & thưởng thức</button>
            <button class="btn btn-ghost" data-act="reset">${icon('restart_alt')}Đặt lại</button></div>`;
      }

      function finish() {
        stop(); S.done = true; S.elapsed = Math.round((Date.now() - S.t0) / 1000);
        const total = g.slots.length, acc = Math.round((total / (total + S.mistakes)) * 100);
        store.log('washoku_done', { time: S.elapsed, mistakes: S.mistakes, accuracy: acc });
        const banner = claimBadge('washoku', { score: acc, time: S.elapsed, mistakes: S.mistakes });
        box.innerHTML = `<div class="stack" style="align-items:center;text-align:center"><span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--primary-fixed)">${icon('check_circle', 'lg fill')}</span>
          <h2>Đã hoàn thành khay Washoku!</h2><p class="sub">Độ chính xác <strong>${acc}%</strong> • ${S.mistakes} lần đặt sai • ${fmtTime(S.elapsed)}</p></div>
          ${banner}${nextSteps()}<button class="btn btn-ghost btn-block" data-act="reset">${icon('replay')}Chơi lại</button>`;
      }

      box.addEventListener('click', (e) => {
        const dish = e.target.closest('[data-dish]');
        if (dish && !S.done) { startClock(); S.sel = S.sel === dish.dataset.dish ? null : dish.dataset.dish; draw(); return; }
        const slot = e.target.closest('[data-slot]');
        if (slot && !S.done) {
          if (!S.sel) { toast('Hãy chọn một món ở khay nguyên liệu trước', 'touch_app'); return; }
          startClock();
          const sl = g.slots.find((s) => s.id === slot.dataset.slot);
          if (sl.dish === S.sel) { S.placed[sl.id] = S.sel; S.sel = null; draw(); }
          else {
            S.mistakes++; const hint = HINTS[S.sel], id = sl.id;
            draw();
            $(`[data-slot="${id}"]`, box)?.classList.add('shake');
            toast(`Chưa đúng vị trí. ${hint}`, 'lightbulb');
          }
          return;
        }
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'lock' && placedCount() === g.slots.length) finish();
        if (act === 'reset') { stop(); S = fresh(); draw(); }
      });
      draw();
    },
    destroy() { clearInterval(ticker); ticker = null; },
  };
}
