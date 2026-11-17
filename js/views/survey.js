import * as store from '../store.js';
import { SURVEY, LIKERT, GAMES } from '../data.js';
import { t } from '../i18n.js';
import { $, $$, icon, esc, toast } from '../ui.js';
import { page, backBar } from './shared.js';
import { go } from '../router.js';
import { openVoucher } from './rewards.js';

export default function survey() {
  const s = store.get();

  if (!store.allBadges()) {
    const missing = Object.keys(GAMES).filter((id) => !store.hasBadge(id));
    return {
      title: t('survey.title'),
      html: page(`${backBar('/games', 'Quay lại Minigame')}
        <div class="card stack pop" style="align-items:center;text-align:center">${icon('lock', 'lg')}<h2>Khảo sát chưa mở khoá</h2>
          <p class="sub">Bạn cần đủ 3/3 huy hiệu. Còn thiếu: ${missing.map((m) => `<strong>${esc(GAMES[m].name)}</strong>`).join(', ')}.</p>
          <a class="btn btn-primary" href="#/games/${missing[0]}">${icon('play_arrow')}Chơi ngay</a></div>`),
    };
  }

  if (store.surveyDone()) {
    return {
      title: t('survey.title'),
      html: page(`${backBar('/rewards', 'Rương quà')}
        <div class="card stack pop" style="align-items:center;text-align:center">${icon('cloud_done', 'lg')}<h2>Bạn đã hoàn thành khảo sát</h2>
          <p class="sub">Cảm ơn bạn! Mã đổi quà đang chờ trong Rương quà.</p>
          <a class="btn btn-primary" href="#/rewards">${icon('featured_seasonal_and_gifts')}Xem Rương quà</a></div>`),
    };
  }

  const qs = SURVEY.map((q, i) => `<fieldset class="card stack" style="border:0;margin:0" data-q="${q.id}">
      <legend class="eyebrow" style="padding:0">Câu ${i + 1} / ${SURVEY.length}</legend>
      <p style="font-weight:600">${esc(q.label)}</p>
      <div class="likert" role="group" aria-label="Mức độ từ 1 đến 5">${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-v="${n}" aria-pressed="false" aria-label="${n} trên 5">${n}</button>`).join('')}</div>
      <div class="likert-legend"><span>1 • ${LIKERT.low}</span><span>5 • ${LIKERT.high}</span></div></fieldset>`).join('');

  const html = page(`
    ${backBar('/games', 'Quay lại Minigame')}
    <header class="stack sm"><span class="eyebrow">Bước cuối cùng</span><h1>${t('survey.title')}</h1>
      <p class="sub" style="max-width:62ch">Chỉ mất khoảng một phút. Câu trả lời của bạn giúp chúng tôi hiểu trải nghiệm văn hoá WAKEI.</p></header>
    <form id="sv" class="stack" novalidate>
      <div class="bar" aria-hidden="true"><i id="sv-bar"></i></div>
      <div class="grid cols-2">${qs}</div>
      <section class="card stack">
        <h3>${icon('badge', 'sm')} Thông tin khắc trên thẻ Ema</h3>
        <div class="grid cols-2">
          <div class="field"><label for="sv-name">Tên hiển thị *</label><input class="input" id="sv-name" maxlength="40" autocomplete="name" value="${esc(s.profile.name)}" placeholder="Ví dụ: Anh Thư" required></div>
          <div class="field"><label for="sv-id">Mã số sinh viên (không bắt buộc)</label><input class="input" id="sv-id" maxlength="20" inputmode="numeric" value="${esc(s.profile.studentId)}"></div>
        </div>
        <label class="row" style="align-items:flex-start;gap:12px;cursor:pointer"><input type="checkbox" id="sv-ok" style="width:22px;height:22px;margin-top:2px;accent-color:var(--primary-container)">
          <span class="sub">Tôi đồng ý để dữ liệu tương tác và câu trả lời khảo sát (ẩn danh) được dùng cho mục đích nghiên cứu. <a href="#/about">Tìm hiểu thêm</a></span></label>
        <div class="err-text" id="sv-err" role="alert"></div>
        <button class="btn btn-primary btn-block" type="submit">${icon('redeem')}Gửi khảo sát & nhận mã đổi quà</button>
      </section>
    </form>`);

  return {
    title: t('survey.title'), html,
    mount(el) {
      const form = $('#sv', el), err = $('#sv-err', el), answers = {};
      const bar = $('#sv-bar', el);
      const sync = () => { bar.style.width = `${(Object.keys(answers).length / SURVEY.length) * 100}%`; };
      form.addEventListener('click', (e) => {
        const b = e.target.closest('[data-v]'); if (!b) return;
        const fs = b.closest('[data-q]'); answers[fs.dataset.q] = +b.dataset.v;
        $$('[data-v]', fs).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        fs.style.outline = ''; err.textContent = ''; sync();
      });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const missing = SURVEY.find((q) => !answers[q.id]);
        const name = $('#sv-name', el).value.trim();
        if (missing) { const fs = $(`[data-q="${missing.id}"]`, el); fs.style.outline = '2px solid var(--error)'; fs.scrollIntoView({ behavior: 'smooth', block: 'center' }); err.textContent = 'Vui lòng trả lời tất cả các câu hỏi.'; return; }
        if (!name) { err.textContent = 'Vui lòng nhập tên để khắc lên thẻ Ema.'; $('#sv-name', el).classList.add('err'); $('#sv-name', el).focus(); return; }
        if (!$('#sv-ok', el).checked) { err.textContent = 'Bạn cần đồng ý chia sẻ dữ liệu nghiên cứu để tiếp tục.'; return; }
        const r = store.submitSurvey({ answers, name, studentId: $('#sv-id', el).value });
        if (!r.ok) { toast('Chưa đủ huy hiệu để gửi khảo sát', 'error'); return; }
        openVoucher({ celebrate: true, onClose: () => go('/rewards') });
      });
      $('#sv-name', el).addEventListener('input', (e) => { e.target.classList.remove('err'); err.textContent = ''; });
    },
  };
}
