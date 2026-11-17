import * as store from '../store.js';
import { GAMES } from '../data.js';
import { icon, esc, toast } from '../ui.js';
import { burst } from '../fx.js';

export const page = (inner, cls = '') => `<div class="container"><div class="page ${cls}">${inner}</div></div>`;

export const backBar = (fallback, label = 'Quay lại', right = '') =>
  `<div class="crumbs"><button class="back" type="button" data-back="${fallback}">${icon('arrow_back', 'sm')}<span>${esc(label)}</span></button>${right}</div>`;

// The most useful "next step" for this participant.
export function nextAction() {
  const s = store.get();
  if (!store.allBadges()) {
    const id = store.nextGame();
    const started = store.badgeCount() > 0;
    return { icon: 'play_arrow', href: started ? `#/games/${id}` : '#/explore', label: started ? `Tiếp tục: ${GAMES[id].name}` : 'Bắt đầu khám phá' };
  }
  if (!s.survey) return { icon: 'edit_note', href: '#/survey', label: 'Làm khảo sát để nhận quà' };
  return { icon: 'featured_seasonal_and_gifts', href: '#/rewards', label: 'Xem Rương quà' };
}

export function stationStatus(st) {
  const badge = store.hasBadge(st.game), ci = store.isCheckedIn(st.id);
  if (badge) return { chip: `<span class="chip green">${icon('verified', 'xs fill')}Đã có huy hiệu</span>`, key: 'badge' };
  if (ci) return { chip: `<span class="chip pink">${icon('where_to_vote', 'xs')}Đã check-in</span>`, key: 'checkin' };
  return { chip: `<span class="chip glass">${icon('pin_drop', 'xs')}Chưa check-in</span>`, key: 'none' };
}

// Shown instead of a game when the station hasn't been checked in (and demo mode is off)
export function lockedCard(st) {
  return `<div class="card stack pop" style="align-items:center;text-align:center">
    ${icon('lock', 'lg')}
    <h2>Hãy check-in tại ${esc(st.name)} trước</h2>
    <p class="sub">Quét mã QR dán tại trạm (mã <span class="kbd">${st.code}</span>) hoặc nhập mã ở trang Check-in để mở khoá thử thách này.</p>
    <div class="row wrap" style="justify-content:center"><a class="btn btn-primary" href="#/">${icon('qr_code_scanner')}Đến trang Check-in</a>
    <a class="btn btn-ghost" href="#/explore/${st.id}">Xem trạm</a></div></div>`;
}

// ---- shared game plumbing ---------------------------------------------------
export function gameHeader(g, st) {
  return `${backBar('/games', 'Danh sách Minigame', `<span class="chip pink">${icon('local_activity', 'xs')}Trạm ${st.no} • ${esc(st.badge.name)}</span>`)}
    <header class="stack sm"><span class="eyebrow">${esc(g.kicker)}</span>
      <h1>${esc(g.name)} <span class="kanji" style="font-size:.5em;display:block;letter-spacing:.2em">${esc(g.jp)}</span></h1>
      <p class="sub" style="font-size:1rem">${esc(g.lead)}</p></header>
    <div class="card tonal row" style="align-items:flex-start;gap:14px">${icon('format_quote', 'lg')}
      <div><p style="font-weight:600;line-height:1.5">“${esc(g.quote)}”</p>${g.quoteBy ? `<span class="eyebrow">${esc(g.quoteBy)}</span>` : ''}</div></div>`;
}

export function nextSteps() {
  const next = store.nextGame();
  const main = next
    ? `<a class="btn btn-primary" href="#/games/${next}">${icon('play_arrow')}Thử thách tiếp: ${esc(GAMES[next].name)}</a>`
    : store.surveyDone()
      ? `<a class="btn btn-primary" href="#/rewards">${icon('featured_seasonal_and_gifts')}Xem Rương quà</a>`
      : `<a class="btn btn-primary" href="#/survey">${icon('edit_note')}Làm khảo sát nhận quà</a>`;
  return `<div class="row wrap">${main}<a class="btn btn-ghost" href="#/games">Danh sách Minigame</a></div>`;
}

// Awards the badge, plays the celebration, returns the banner html.
export function claimBadge(gameId, stats) {
  const st = store.stationByGame(gameId);
  const { first, all } = store.awardBadge(gameId, stats);
  burst(first ? 3.5 : 1.5);
  if (first) toast(`Mở khoá huy hiệu: ${st.badge.name}`, 'military_tech');
  return `<div class="card tonal row pop" style="background:var(--tertiary-fixed)">
    <span style="width:52px;height:52px;flex:none;border-radius:50%;background:var(--primary-container);color:#fff;display:grid;place-items:center">${icon(st.badge.icon, 'lg fill')}</span>
    <div class="grow"><div class="row wrap"><strong>Huy hiệu ${esc(st.badge.name)}</strong><span class="chip dark">${first ? 'Mở khoá!' : 'Đã sở hữu'}</span></div>
    <p class="sub">+${st.xp} XP • Đã lưu vào hồ sơ${all ? ' • Bạn đã đủ 3/3 huy hiệu!' : ''}</p></div></div>`;
}
