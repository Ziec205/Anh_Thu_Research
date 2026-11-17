import * as store from '../store.js';
import { GAMES } from '../data.js';
import { $, $$, icon, esc, fmtTime, shuffle } from '../ui.js';
import { page, backBar, lockedCard, gameHeader, claimBadge, nextSteps } from './shared.js';

const SEIGAIHA = `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="sg" width="36" height="18" patternUnits="userSpaceOnUse">
  <path d="M0,18 A18,18 0 0,1 36,18 M0,13 A13,13 0 0,1 36,13 M0,8 A8,8 0 0,1 36,8" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <path d="M-18,9 A18,18 0 0,1 18,9 M-18,4 A13,13 0 0,1 18,4 M18,9 A18,18 0 0,1 54,9 M18,4 A13,13 0 0,1 54,4" fill="none" stroke="currentColor" stroke-width="1.2"/></pattern></defs>
  <rect width="100%" height="100%" fill="url(#sg)"/></svg>`;

export default function matsuri() {
  const g = GAMES.matsuri, st = store.stationByGame('matsuri');
  if (!store.isUnlocked(st.id)) return { title: g.name, html: page(backBar('/games', 'Danh sách Minigame') + lockedCard(st)) };

  const lesson = st.items.map((it) => `<div class="item"><div class="ico">${icon(it.icon)}</div><div class="grow"><h4>${esc(it.name)} <span class="kanji">(${it.jp})</span></h4><p>${esc(it.text)}</p></div></div>`).join('');
  const html = page(`
    ${gameHeader(g, st)}
    <section class="card stack"><div class="row between"><h2>${esc(st.itemsTitle)}</h2><span class="chip">Ghi nhớ trước khi chơi</span></div><div class="item-list">${lesson}</div></section>
    <section class="card stack" id="game" aria-live="polite"></section>`);

  let ticker = null;
  return {
    title: g.name, html,
    mount(el) {
      const box = $('#game', el);
      const total = g.pairs.length;
      let deck, flipped, matched, attempts, t0, lock, done;

      const stop = () => { clearInterval(ticker); ticker = null; };
      const faceHtml = (c) => {
        const p = g.pairs.find((x) => x.id === c.pair);
        return c.kind === 'visual'
          ? `<div class="face front"><span class="chip dark mo">${p.month}</span><img src="${p.img}" alt="${esc(p.name)}"><div class="lab">${esc(p.name)}<small>${esc(p.place)}</small></div></div>`
          : `<div class="face front sym"><span class="eyebrow">Ký hiệu</span><span class="big">${p.kanji}</span><strong>${esc(p.roma)}</strong><small class="muted">${esc(p.sub)}</small></div>`;
      };

      function reset() {
        stop();
        deck = shuffle(g.pairs.flatMap((p) => [{ pair: p.id, kind: 'visual' }, { pair: p.id, kind: 'symbol' }]));
        flipped = []; matched = new Set(); attempts = 0; t0 = 0; lock = false; done = false;
        box.innerHTML = `
          <div class="stats" aria-label="Thống kê"><div class="stat"><b id="m-time">00:00</b><span>Thời gian</span></div><div class="stat"><b id="m-att">0</b><span>Lượt lật</span></div><div class="stat"><b id="m-eff">—</b><span>Hiệu suất</span></div></div>
          <div class="stack sm"><div class="row between sub"><span>Tiến độ ghép cặp</span><span id="m-prog">0 / ${total} cặp</span></div><div class="bar"><i id="m-bar"></i></div></div>
          <div class="mgrid" id="m-grid">${deck.map((c, i) => `<button type="button" class="mcard" data-i="${i}" aria-label="Thẻ ${i + 1}, đang úp">
            <div class="in"><div class="face back">${SEIGAIHA}<div class="crest"><b>和</b><span>WAKEI</span></div></div>${faceHtml(c)}</div></button>`).join('')}</div>
          <p class="sub">Chạm vào hai thẻ có cùng biểu tượng lễ hội và tên gọi tương ứng để ghép cặp.</p>
          <div id="m-result"></div>`;
      }

      function updateStats() {
        $('#m-att', box).textContent = attempts;
        $('#m-eff', box).textContent = attempts ? `${Math.round((matched.size / attempts) * 100)}%` : '—';
        $('#m-prog', box).textContent = `${matched.size} / ${total} cặp`;
        $('#m-bar', box).style.width = `${(matched.size / total) * 100}%`;
      }

      function win() {
        stop(); done = true;
        const time = Math.round((Date.now() - t0) / 1000), eff = Math.round((total / attempts) * 100);
        store.log('matsuri_done', { time, attempts, efficiency: eff });
        $('#m-result', box).innerHTML = `<div class="stack pop"><div class="notice ok">${icon('celebration', 'sm')}<span>Tuyệt vời! Bạn ghép đủ ${total} cặp trong ${fmtTime(time)} với ${attempts} lượt (hiệu suất ${eff}%).</span></div>
          ${claimBadge('matsuri', { score: eff, time, attempts })}${nextSteps()}
          <button class="btn btn-ghost btn-block" data-act="again">${icon('replay')}Chơi lại</button></div>`;
        $('#m-result', box).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      function flip(i) {
        if (lock || done || flipped.includes(i)) return;
        const card = $(`[data-i="${i}"]`, box);
        if (card.classList.contains('matched')) return;
        if (!t0) { t0 = Date.now(); ticker = setInterval(() => { $('#m-time', box).textContent = fmtTime((Date.now() - t0) / 1000); }, 500); }
        card.classList.add('flipped'); flipped.push(i);
        if (flipped.length < 2) return;
        attempts++;
        const [a, b] = flipped.map((k) => deck[k]);
        if (a.pair === b.pair && a.kind !== b.kind) {
          flipped.forEach((k) => { const c = $(`[data-i="${k}"]`, box); c.classList.remove('flipped'); c.classList.add('matched'); c.disabled = true; });
          matched.add(a.pair); flipped = []; updateStats();
          if (matched.size === total) setTimeout(win, 500);
        } else {
          lock = true; updateStats();
          const pair = [...flipped];
          pair.forEach((k) => $(`[data-i="${k}"]`, box).classList.add('nope'));
          setTimeout(() => {
            pair.forEach((k) => { const c = $(`[data-i="${k}"]`, box); c.classList.remove('flipped', 'nope'); });
            flipped = []; lock = false;
          }, 850);
        }
      }

      box.addEventListener('click', (e) => {
        const c = e.target.closest('.mcard'); if (c) { flip(+c.dataset.i); return; }
        if (e.target.closest('[data-act="again"]')) { reset(); box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      });
      reset();
    },
    destroy() { clearInterval(ticker); ticker = null; },
  };
}
