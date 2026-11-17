import * as store from '../store.js';
import { GAMES, STATIONS, GIFTS, EVENT } from '../data.js';
import { t } from '../i18n.js';
import { $, $$, icon, esc, fmtClock, fmtTime, openModal, qrSvg, downloadQr, copyText, toast } from '../ui.js';
import { page, nextAction } from './shared.js';
import { go, render } from '../router.js';
import { burst } from '../fx.js';

// ------------------------------------------------------------------ voucher modal ----
// Used by the survey (celebrate = true) and by the rewards page.
export function openVoucher({ celebrate = false, onClose } = {}) {
  const s = store.get(), v = s.voucher; if (!v) return;
  const used = v.redeemed;
  if (celebrate) burst(5);
  return openModal({
    label: 'Mã đổi quà', onClose,
    html: `<div class="stack" style="align-items:center;text-align:center">
      ${celebrate ? `<span class="chip pink"><span class="ms xs fill" aria-hidden="true">verified</span>祝・体験完了 | Hoàn thành thực nghiệm</span><h2>Chứng nhận hoàn tất khảo sát</h2>
        <p class="sub">Cảm ơn ${esc(s.profile.name || 'bạn')} đã đóng góp dữ liệu cho dự án WAKEI!</p>` : `<span class="chip dark">${icon('verified', 'xs fill')}Tegata Pass • WAKEI</span><h2>Mã đổi quà lưu niệm</h2><p class="sub">Xuất trình cho cán bộ lễ tân để quét mã</p>`}
      <div class="qr lg" style="${used ? 'opacity:.35' : ''}">${qrSvg(v.code)}</div>
      ${used ? `<span class="chip warn">${icon('task_alt', 'xs')}Đã đổi quà lúc ${fmtClock(v.redeemedAt)}</span>` : ''}
      <div class="codebox" style="width:100%;justify-content:space-between"><span>${esc(v.code)}</span><button class="icon-btn ghost" data-copy aria-label="Sao chép mã">${icon('content_copy', 'sm')}</button></div>
      <p class="sub">${icon('schedule', 'xs')} ${esc(EVENT.pickupPlace)}. ${esc(EVENT.pickupNote)}</p>
      <div class="row wrap" style="justify-content:center;width:100%">
        <button class="btn btn-primary grow" data-save>${icon('download_for_offline')}Lưu mã QR</button>
        <a class="btn btn-ghost grow" href="#/rewards" data-close>${icon('featured_seasonal_and_gifts')}Xem Rương quà</a></div>
    </div>`,
    onMount(el, close) {
      $('[data-copy]', el).onclick = () => copyText(v.code, 'Đã sao chép mã phiếu!');
      $('[data-save]', el).onclick = () => downloadQr(v.code, `wakei-${v.code}.png`);
      $('[data-close]', el).addEventListener('click', () => close());
    },
  });
}

// ------------------------------------------------------------------ page ----
export default function rewards() {
  const s = store.get();
  const ready = store.allBadges() && store.surveyDone() && s.voucher;
  return ready ? unlocked(s) : locked(s);
}

function badgeShelf(s) {
  return `<div class="shelf">${STATIONS.map((st) => {
    const b = s.badges[st.game];
    return `<div class="b ${b ? '' : 'off'}"><span class="ico">${icon(b ? st.badge.icon : 'lock', 'fill')}</span>
      <div><strong>${esc(st.badge.name)}</strong><div class="sub">${b ? `${GAMES[st.game].jp.split(' ')[0]} • ${b.time != null ? fmtTime(b.time) : ''} ${b.score != null ? '• ' + b.score + '%' : ''}` : 'Chưa mở khoá'}</div></div></div>`;
  }).join('')}</div>`;
}

function locked(s) {
  const na = nextAction(), n = store.badgeCount(), pct = store.progressPct();
  const why = n < 3 ? `Hoàn thành thêm ${3 - n} minigame để mở khoá khảo sát.` : 'Chỉ còn khảo sát cuối cùng trước khi nhận mã đổi quà.';
  return {
    title: t('nav.rewards'),
    html: page(`
      <header class="stack sm"><span class="eyebrow">受取履歴</span><h1>${t('rewards.title')}</h1><p class="sub">Phần quà sẽ mở khoá khi bạn có đủ 3/3 huy hiệu và hoàn thành khảo sát.</p></header>
      <div class="split">
        <div class="stack" style="gap:20px">
          <section class="card stack"><div class="row between"><h3>Huy hiệu của bạn</h3><span class="chip dark">${n}/3</span></div>${badgeShelf(s)}
            <div class="notice info">${icon('lock', 'sm')}<span>${why}</span></div></section>
          <section class="card stack"><h3>Quà đang chờ bạn</h3><div class="grid cols-3">${GIFTS.map((g) => `<div class="gift locked-overlay"><div class="pic"><img src="${g.img}" alt="" loading="lazy"><span class="chip glass">${icon('lock', 'xs')}Đã khoá</span></div><div class="body"><h4>${esc(g.name)}</h4></div></div>`).join('')}</div></section>
        </div>
        <aside class="card stack sticky-aside"><div class="row between"><h3>Tiến độ</h3><span class="chip dark">${pct}%</span></div><div class="bar"><i style="width:${pct}%"></i></div>
          <a class="btn btn-primary btn-block" href="${na.href}">${icon(na.icon)}${esc(na.label)}</a></aside>
      </div>`),
  };
}

function unlocked(s) {
  const v = s.voucher, used = v.redeemed;
  const xp = STATIONS.reduce((a, st) => a + (s.badges[st.game] ? st.xp : 0), 0);
  const items = [
    ...GIFTS.map((g) => ({ ...g, type: used ? 'redeemed' : 'pending' })),
    ...STATIONS.map((st) => ({ id: 'b-' + st.game, kind: 'digital', type: 'redeemed', st, b: s.badges[st.game] })),
  ];
  const counts = { all: items.length, pending: items.filter((i) => i.type === 'pending').length, redeemed: items.filter((i) => i.type === 'redeemed').length };

  const card = (i) => {
    if (i.kind === 'digital') {
      return `<article class="gift" data-type="redeemed"><div class="pic badge">${icon(i.st.badge.icon, 'lg fill')}<span class="chip green">Kỹ thuật số</span></div>
        <div class="body"><h4>Huy hiệu số: ${esc(i.st.badge.name)}</h4><p class="sub">${esc(GAMES[i.st.game].name)}${i.b?.time != null ? ` • ${fmtTime(i.b.time)}` : ''}${i.b?.score != null ? ` • ${i.b.score}%` : ''}</p>
        <div class="foot"><span>${icon('cloud_done', 'xs')} Đã lưu vào hồ sơ</span><span>${fmtClock(i.b?.at)}</span></div></div></article>`;
    }
    return `<article class="gift" data-type="${i.type}"><div class="pic"><img src="${i.img}" alt="${esc(i.name)}" loading="lazy"><span class="chip ${used ? 'green' : 'pink'}">${used ? 'Đã nhận' : 'Chờ nhận tại bàn'}</span></div>
      <div class="body"><div class="row between"><h4>${esc(i.name)}</h4></div><p class="sub">${esc(i.desc)}</p>
      <div class="foot"><span>${icon(used ? 'task_alt' : 'location_on', 'xs')} ${used ? 'Đã đổi tại bàn lễ tân' : esc(EVENT.pickupPlace)}</span><span>${used ? fmtClock(v.redeemedAt) : esc(i.tag)}</span></div></div></article>`;
  };

  const html = page(`
    <header class="row between wrap"><div class="stack sm"><span class="eyebrow">受取履歴</span><h1>${t('rewards.title')}</h1><p class="sub">Hồ sơ phần thưởng văn hoá & hiện vật kỷ niệm</p></div>
      <button class="btn btn-tonal" data-act="qr">${icon('qr_code_scanner')}Mở nhanh mã QR</button></header>

    <div class="split rev">
      <aside class="stack sticky-aside" style="gap:20px">
        <section class="card stack"><div class="row"><span class="ico" style="width:52px;height:52px;border-radius:50%;background:var(--primary-fixed);display:grid;place-items:center">${icon('verified', 'lg fill')}</span>
          <div class="grow"><strong style="font-size:1.1rem">${esc(s.profile.name || 'Người tham gia')}</strong>${s.profile.studentId ? ` <span class="chip">${esc(s.profile.studentId)}</span>` : ''}
            <p class="sub">Đủ 3/3 huy hiệu • ${xp} XP</p></div></div>
          <span class="chip dark" style="align-self:flex-start">Hoàn tất 100%</span>${badgeShelf(s)}</section>
        <section class="card stack"><h4>${icon('assignment_turned_in', 'sm')} Quy trình nhận quà</h4>
          ${[['Đến bàn lễ tân', 'Xuất trình mã QR trên điện thoại hoặc đọc mã số độc bản.'], ['Ban tổ chức đối soát & trao quà', 'Nhận thẻ gỗ Ema khắc tên và bộ sticker kỷ niệm.'], ['Check-in cổng Torii & treo Ema', 'Treo điều ước lên giá gỗ hoặc giữ làm kỷ niệm.']]
            .map(([h, p], i) => `<div class="step"><span class="n">${i + 1}</span><div><strong>${h}</strong><p class="sub">${p}</p></div></div>`).join('')}
          <div class="notice info">${icon('schedule', 'sm')}<span>${esc(EVENT.pickupPlace)}. ${esc(EVENT.pickupNote)}</span></div></section>
      </aside>

      <div class="stack" style="gap:20px">
        <section class="card pass" aria-label="Thẻ đổi quà"><div class="wm" aria-hidden="true">和</div><div class="inner">
          <div class="row between wrap"><div class="row"><span class="kanji" style="font-size:1.6rem;color:var(--secondary)">手形</span><strong>Tegata Pass</strong></div>
            <span class="chip ${used ? 'warn' : 'green'}">${used ? 'Đã sử dụng' : 'Chưa nhận • chờ quét QR tại bàn BTC'}</span></div>
          <div><h2>Gói Quà Vinh Danh Văn Hoá WAKEI</h2><p class="sub">Thẻ gỗ Ema khắc tên + bộ 4 sticker + chén matcha tại Trà thất San-an.</p></div>
          <div class="row wrap" style="align-items:stretch">
            <div class="grow stack sm"><span class="eyebrow">Mã phiếu độc bản</span>
              <div class="codebox"><span class="grow">${esc(v.code)}</span><button class="icon-btn ghost" data-act="copy" aria-label="Sao chép mã">${icon('content_copy', 'sm')}</button></div>
              <span class="sub">Phát hành lúc ${fmtClock(v.issuedAt)}</span></div>
            <button class="qr sm" data-act="qr" aria-label="Phóng to mã QR" style="border:0;cursor:zoom-in;${used ? 'opacity:.4' : ''}">${qrSvg(v.code)}</button></div>
          <button class="btn btn-primary btn-block" data-act="qr">${icon('qr_code_2')}Xem mã QR đổi quà tại bàn BTC</button>
        </div></section>

        <section class="stack">
          <div class="row between wrap"><h2>Hiện vật & chứng nhận</h2><span class="sub">${items.length} mục</span></div>
          <div class="filter" role="group" aria-label="Lọc phần quà">
            ${[['all', 'Tất cả'], ['pending', 'Chờ đổi tại bàn'], ['redeemed', 'Đã nhận']].map(([k, l], i) => `<button type="button" data-filter="${k}" aria-pressed="${i === 0}">${l}<b>${counts[k]}</b></button>`).join('')}
          </div>
          <div class="grid cols-2" id="gifts">${items.map(card).join('')}</div>
          <p class="empty" id="gifts-empty" hidden>Không có mục nào trong bộ lọc này.</p>
        </section>

        ${s.demo && !used ? `<section class="card tonal stack"><div class="row"><span class="demo-tag">DEMO</span><strong>Giả lập ban tổ chức</strong></div>
          <p class="sub">Dùng để thử luồng "đã nhận quà". Khi có hệ thống máy chủ, bước này do cán bộ lễ tân quét mã QR thực hiện.</p>
          <button class="btn btn-ghost" data-act="redeem">${icon('task_alt')}Giả lập: BTC đã quét mã & trao quà</button></section>` : ''}
      </div>
    </div>`);

  return {
    title: t('nav.rewards'), html,
    mount(el) {
      el.addEventListener('click', onClick);
      function onClick(e) {
        const f = e.target.closest('[data-filter]');
        if (f) {
          $$('[data-filter]', el).forEach((b) => b.setAttribute('aria-pressed', String(b === f)));
          let shown = 0;
          $$('#gifts > .gift', el).forEach((g) => { const ok = f.dataset.filter === 'all' || g.dataset.type === f.dataset.filter; g.hidden = !ok; shown += ok; });
          $('#gifts-empty', el).hidden = shown > 0; return;
        }
        const act = e.target.closest('[data-act]')?.dataset.act;
        if (act === 'qr') openVoucher();
        else if (act === 'copy') copyText(v.code, 'Đã sao chép mã phiếu!');
        else if (act === 'redeem') { store.redeemVoucherDemo(); toast('Đã ghi nhận đổi quà (demo)', 'task_alt'); render(); }
      }
      this._off = () => el.removeEventListener('click', onClick);
    },
    destroy() { this._off?.(); },
  };
}
