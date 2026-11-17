import * as store from '../store.js';
import { GAMES } from '../data.js';
import { $, icon, esc, shuffle } from '../ui.js';
import { page, backBar, lockedCard, gameHeader, claimBadge, nextSteps } from './shared.js';

export default function chado() {
  const g = GAMES.chado, st = store.stationByGame('chado');
  if (!store.isUnlocked(st.id)) return { title: g.name, html: page(backBar('/games', 'Danh sách Minigame') + lockedCard(st)) };

  const lesson = g.cards.map((c) => `<div class="item"><div class="ico kanji" style="font-size:1.4rem;color:var(--primary)">${c.k}</div><div class="grow"><h4>${esc(c.t)}</h4><p>${esc(c.p)}</p></div></div>`).join('');
  const html = page(`
    ${gameHeader(g, st)}
    <div class="hero-img" style="height:clamp(180px,28vw,320px)"><img src="${g.img}" alt="Không gian trà thất"><div class="cap"><span class="chip glass">${icon('verified', 'xs fill')}Cốt lõi tinh thần Wabi-Sabi</span></div></div>
    <section class="card stack"><div class="row between"><h2>Tam điểm thẩm thấu</h2><span class="chip">3 thẻ chắt lọc</span></div><div class="item-list">${lesson}</div></section>
    <section class="card stack" id="quiz" aria-live="polite"></section>`);

  let stopTimer = () => {};
  return {
    title: g.name, html,
    mount(el) {
      const box = $('#quiz', el);
      let S, timer = null, attempts = 0;
      const newRun = () => ({
        i: 0, correct: 0, picked: null, phase: 'intro', left: g.quizSeconds, t0: 0, qStart: 0,
        qs: g.questions.map((q) => ({ ...q, opts: shuffle(q.a.map((txt, idx) => ({ txt, ok: idx === q.ok }))) })),
      });
      S = newRun();
      const stop = () => { clearInterval(timer); timer = null; };
      stopTimer = stop;

      function startQ() {
        S.phase = 'q'; S.picked = null; S.left = g.quizSeconds; S.qStart = Date.now(); stop();
        draw();
        timer = setInterval(() => {
          S.left--; const pill = $('#qtimer', box);
          if (pill) { pill.lastChild.textContent = ` 00:${String(Math.max(S.left, 0)).padStart(2, '0')}s còn lại`; pill.classList.toggle('low', S.left <= 5); }
          if (S.left <= 0) submit(true);
        }, 1000);
      }
      function submit(timeout = false) {
        if (S.phase !== 'q') return;
        if (!timeout && S.picked == null) return;
        stop();
        const q = S.qs[S.i], ok = !timeout && !!q.opts[S.picked]?.ok;
        if (ok) S.correct++;
        S.phase = 'reveal'; S.timeout = timeout; S.ok = ok;
        store.log('chado_answer', { q: S.i, ok, ms: Date.now() - S.qStart, timeout });
        draw();
      }
      function next() {
        if (S.i + 1 < S.qs.length) { S.i++; startQ(); return; }
        stop(); S.phase = 'done'; attempts++;
        S.elapsed = Math.round((Date.now() - S.t0) / 1000);
        S.pass = S.correct >= g.passMin;
        store.log('chado_done', { correct: S.correct, time: S.elapsed, attempts });
        if (S.pass) S.banner = claimBadge('chado', { score: Math.round((S.correct / S.qs.length) * 100), time: S.elapsed, attempts });
        draw();
      }

      function draw() {
        const q = S.qs[S.i];
        if (S.phase === 'intro') {
          box.innerHTML = `<div class="row"><span class="ico" style="width:46px;height:46px;border-radius:14px;background:var(--primary-fixed);display:grid;place-items:center">${icon('sports_esports', 'lg')}</span><div><span class="eyebrow">Minigame tương tác</span><h2>${esc(st.gameTitle)}: thao tác thưởng trà</h2></div></div>
            <p class="sub">${S.qs.length} câu tình huống • mỗi câu ${g.quizSeconds} giây • trả lời đúng từ ${g.passMin}/${S.qs.length} câu để nhận huy hiệu <strong>${esc(st.badge.name)}</strong>.</p>
            <button class="btn btn-primary btn-block" data-act="start">${icon('play_arrow')}Bắt đầu thử thách</button>`;
        } else if (S.phase === 'q' || S.phase === 'reveal') {
          const rev = S.phase === 'reveal';
          const opts = q.opts.map((o, k) => {
            let cls = 'opt';
            if (rev) cls += o.ok ? ' correct' : (S.picked === k ? ' wrong' : '');
            const tag = rev && o.ok ? ' <strong>• Chính xác</strong>' : rev && S.picked === k ? ' <strong>• Chưa đúng</strong>' : '';
            return `<button class="${cls}" type="button" data-pick="${k}" aria-pressed="${S.picked === k}" ${rev ? 'disabled' : ''}><span class="k">${'ABCD'[k]}</span><span>${esc(o.txt)}${tag}</span></button>`;
          }).join('');
          const verdict = S.timeout ? '<strong>Hết giờ!</strong> ' : S.ok ? '<strong>Đúng rồi!</strong> ' : '<strong>Chưa đúng.</strong> ';
          box.innerHTML = `<div class="row between wrap"><div class="row"><span class="chip dark">Câu ${S.i + 1}/${S.qs.length}</span><span class="chip green">Đúng: ${S.correct}</span></div>
              ${rev ? '' : `<span class="timer-pill" id="qtimer">${icon('hourglass_top', 'xs')}<span> 00:${String(S.left).padStart(2, '0')}s còn lại</span></span>`}</div>
            <div><span class="eyebrow">Tình huống thực tế</span><p style="font-weight:600;font-size:1.05rem;margin-top:4px">${esc(q.q)}</p></div>
            <div class="stack sm" role="group" aria-label="Các đáp án">${opts}</div>
            ${rev
              ? `<div class="explain">${verdict}${esc(q.why)}</div><button class="btn btn-primary btn-block" data-act="next">${S.i + 1 < S.qs.length ? 'Câu tiếp theo' : 'Xem kết quả'}${icon('arrow_forward', 'sm')}</button>`
              : `<button class="btn btn-primary btn-block" data-act="submit" ${S.picked == null ? 'disabled' : ''}>${icon('check_circle')}Xác nhận đáp án</button>`}`;
        } else {
          box.innerHTML = `<div class="stack" style="align-items:center;text-align:center">
              <span style="width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:${S.pass ? 'var(--primary-fixed)' : 'var(--secondary-fixed)'}">${icon(S.pass ? 'done_all' : 'replay', 'lg')}</span>
              <h2>${S.pass ? 'Thao tác hoàn hảo! Chén trà sẵn sàng' : 'Chưa đạt — hãy thử lại'}</h2>
              <p class="sub">Bạn trả lời đúng <strong>${S.correct}/${S.qs.length}</strong> câu trong ${S.elapsed} giây${S.pass ? '' : ` (cần tối thiểu ${g.passMin})`}.</p></div>
            ${S.pass ? S.banner + nextSteps() : `<button class="btn btn-primary btn-block" data-act="retry">${icon('replay')}Thử lại</button><a class="btn btn-ghost btn-block" href="#/explore/${st.id}">Đọc lại nội dung trạm</a>`}`;
        }
      }

      box.addEventListener('click', (e) => {
        const pick = e.target.closest('[data-pick]');
        if (pick && S.phase === 'q') { S.picked = +pick.dataset.pick; draw(); $(`[data-pick="${S.picked}"]`, box)?.focus(); return; }
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'start') { S.t0 = Date.now(); startQ(); }
        else if (act === 'submit') submit(false);
        else if (act === 'next') next();
        else if (act === 'retry') { S = newRun(); S.t0 = Date.now(); startQ(); }
      });
      draw();
    },
    destroy() { stopTimer(); },
  };
}
