import * as store from '../store.js';
import { GAMES, STATIONS } from '../data.js';
import { t } from '../i18n.js';
import { icon, esc, fmtTime } from '../ui.js';
import { page, stationStatus } from './shared.js';

export function gamesHub() {
  const cards = STATIONS.map((st) => {
    const g = GAMES[st.game], b = store.get().badges[st.game], unlocked = store.isUnlocked(st.id);
    const stat = b ? [b.time != null ? `⏱ ${fmtTime(b.time)}` : '', b.score != null ? `${b.score}%` : ''].filter(Boolean).join(' • ') : '';
    const chip = b ? `<span class="chip green">${icon('verified', 'xs fill')}Hoàn thành</span>` : unlocked ? `<span class="chip pink">Chưa chơi</span>` : `<span class="chip glass">${icon('lock', 'xs')}Cần check-in</span>`;
    const btn = unlocked
      ? `<a class="btn btn-primary btn-block" href="#/games/${g.id}">${icon(b ? 'replay' : 'play_arrow')}${b ? 'Chơi lại' : 'Chơi ngay'}</a>`
      : `<a class="btn btn-ghost btn-block" href="#/checkin/${st.code}">${icon('qr_code_scanner')}Check-in ${st.code}</a>`;
    return `<article class="card media-card ${unlocked ? '' : 'locked-overlay'}">
      <div class="thumb"><img src="${g.img}" alt="" loading="lazy"><span class="chip dark no">Trạm ${st.no}</span><span class="st">${chip}</span>
        <h3>${esc(g.name)} <span style="opacity:.85;font-weight:500">${g.jp.split(' ')[0]}</span></h3></div>
      <div class="body"><p class="sub">${esc(st.gameTitle)} • ${st.minutes} phút</p>
        <div class="row wrap"><span class="chip pink">${icon(st.badge.icon, 'xs fill')}${esc(st.badge.name)}</span>${stat ? `<span class="chip">${stat}</span>` : ''}</div>
        ${btn}</div></article>`;
  }).join('');

  const all = store.allBadges();
  const cta = all
    ? (store.surveyDone() ? `<a class="btn btn-primary" href="#/rewards">${icon('featured_seasonal_and_gifts')}Xem Rương quà</a>` : `<a class="btn btn-primary" href="#/survey">${icon('edit_note')}Làm khảo sát nhận quà</a>`)
    : `<span class="chip pink">Còn ${3 - store.badgeCount()} huy hiệu nữa</span>`;

  return {
    title: t('nav.games'),
    html: page(`
      <header class="stack sm"><span class="eyebrow">3 thử thách • 3 huy hiệu</span><h1>${t('games.title')}</h1>
        <p class="sub" style="max-width:62ch">Hoàn thành cả ba minigame để mở khoá khảo sát cuối và nhận mã đổi quà.</p></header>
      <div class="card row between wrap"><div class="grow stack sm"><div class="row between"><strong>Tiến độ huy hiệu</strong><span>${store.badgeCount()}/3</span></div>
        <div class="bar"><i style="width:${(store.badgeCount() / 3) * 100}%"></i></div></div>${cta}</div>
      <div class="grid cols-3">${cards}</div>`),
  };
}
