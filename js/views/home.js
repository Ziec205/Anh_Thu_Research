import * as store from '../store.js';
import { STATIONS } from '../data.js';
import { go } from '../router.js';
import { t } from '../i18n.js';
import { $, $$, icon, esc, toast } from '../ui.js';
import { initHero } from '../fx.js';
import { page, nextAction, stationStatus } from './shared.js';

export default async function home({ code } = {}) {
  // Deep link from a station's QR poster: #/checkin/WK-03
  if (code) {
    const st = store.stationByCode(code);
    if (st) {
      const r = store.checkIn(st.id);
      toast(r.already ? `Bạn đã check-in ${st.name} rồi` : `Check-in thành công: ${st.name}`, r.already ? 'info' : 'where_to_vote');
      go(`/explore/${st.id}`, { replace: true });
    } else {
      toast('Mã trạm không hợp lệ. Hãy kiểm tra lại mã trên bảng QR.', 'error');
      go('/', { replace: true });
    }
    return false;
  }

  const s = store.get(), na = nextAction(), pct = store.progressPct();

  const stationRows = STATIONS.map((st) => {
    const sts = stationStatus(st);
    return `<a class="item" href="#/explore/${st.id}" style="text-decoration:none;color:inherit">
      <span class="ico">${icon(st.icon)}</span>
      <div class="grow"><h4>Trạm ${st.no}: ${esc(st.name)} <span class="kanji">${st.jp}</span></h4><p>${esc(st.gameTitle)} • ${st.minutes} phút</p></div>
      ${sts.chip}</a>`;
  }).join('');

  const demoChips = s.demo ? `<div class="row wrap"><span class="demo-tag">DEMO</span><span class="sub">Thử nhanh mã trạm:</span>
      ${STATIONS.map((st) => `<button class="chip pink" type="button" data-code="${st.code}">${st.code}</button>`).join('')}</div>` : '';

  const html = page(`
    <section class="hero" aria-labelledby="h-title">
      <div class="stack">
        <span class="chip green" style="align-self:flex-start">${icon('spa', 'xs fill')}${t('home.title')}</span>
        <h1 id="h-title">Chào mừng đến WAKEI<span class="jp">和敬清寂</span></h1>
        <p class="lead">Check-in tại từng trạm, thử sức với ba minigame văn hoá, thu thập huy hiệu và đổi phần quà lưu niệm độc quyền.</p>
        <div class="row wrap">
          <a class="btn btn-primary" href="${na.href}">${icon(na.icon)}${esc(na.label)}</a>
          <a class="btn btn-ghost" href="#/about">${icon('info')}Về dự án</a>
        </div>
      </div>
      <div class="hero-3d" aria-hidden="true"><div class="glyph">和</div><canvas id="hero3d"></canvas><span class="chip glass tag">${icon('touch_app', 'xs')}Di chuột để xoay</span></div>
    </section>

    <div class="split">
      <section class="card stack" aria-labelledby="ci-h">
        <div class="card-title">${icon('qr_code_scanner', 'lg')}<h2 id="ci-h">Check-in tại trạm</h2></div>
        <p class="sub">Quét mã QR dán tại trạm bằng camera điện thoại — trang này sẽ tự mở và check-in cho bạn. Hoặc nhập mã trạm thủ công:</p>
        <form id="ci-form" class="stack sm" novalidate>
          <div class="field"><label for="ci-code">Mã trạm</label>
            <div class="row"><input class="input" id="ci-code" placeholder="VD: WK-03" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go">
            <button class="btn btn-primary" type="submit">${icon('check')}Check-in</button></div></div>
          <div class="err-text" id="ci-err" role="alert"></div>
        </form>
        ${demoChips}
      </section>

      <aside class="card stack sticky-aside" aria-label="Tiến độ">
        <div class="row between"><h3>Tiến độ của bạn</h3><span class="chip dark">${pct}%</span></div>
        <div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <p class="sub">${store.badgeCount()}/3 huy hiệu • Khảo sát: ${store.surveyDone() ? 'đã hoàn thành' : 'chưa làm'}</p>
        <a class="btn btn-tonal btn-block" href="${na.href}">${icon(na.icon)}${esc(na.label)}</a>
      </aside>
    </div>

    <section class="card stack" aria-labelledby="st-h">
      <div class="row between"><h2 id="st-h">Ba điểm dừng chân</h2><a href="#/explore" class="btn btn-ghost btn-sm">Xem bản đồ${icon('arrow_forward', 'sm')}</a></div>
      <div class="item-list">${stationRows}</div>
    </section>

    <section class="grid cols-3" aria-label="Cách chơi">
      ${[['1', 'Check-in', 'Quét QR hoặc nhập mã tại mỗi trạm.', 'qr_code_scanner'], ['2', 'Chơi minigame', 'Hoàn thành thử thách để nhận huy hiệu.', 'sports_esports'], ['3', 'Nhận quà', 'Đủ 3 huy hiệu + khảo sát → mã QR đổi quà.', 'redeem']]
        .map(([n, h, p, ic]) => `<div class="card tonal step"><span class="n">${n}</span><div><h4>${icon(ic, 'sm')} ${h}</h4><p class="sub">${p}</p></div></div>`).join('')}
    </section>`);

  let dispose = null, dead = false;
  return {
    title: t('nav.home'), html,
    mount(el) {
      initHero($('#hero3d', el)).then((d) => { if (dead) d?.(); else dispose = d; }).catch(() => {});
      const form = $('#ci-form', el), input = $('#ci-code', el), err = $('#ci-err', el);
      const submit = (val) => {
        const st = store.stationByCode(val);
        if (!st) {
          err.textContent = val.trim() ? 'Không tìm thấy mã này. Mã có dạng WK-01, WK-02, WK-03.' : 'Vui lòng nhập mã trạm.';
          input.classList.remove('err'); void input.offsetWidth; input.classList.add('err'); input.focus(); return;
        }
        go(`/checkin/${st.code}`);
      };
      form.addEventListener('submit', (e) => { e.preventDefault(); submit(input.value); });
      input.addEventListener('input', () => { err.textContent = ''; input.classList.remove('err'); });
      $$('[data-code]', el).forEach((b) => b.addEventListener('click', () => submit(b.dataset.code)));
    },
    destroy() { dead = true; dispose?.(); },
  };
}
