// Interface-chrome translations (navigation, headings, footer). Lesson content stays in Vietnamese.
// Add keys freely; missing keys fall back to Vietnamese.

import { get } from './store.js';

const DICT = {
  vi: {
    'nav.home': 'Check-in', 'nav.explore': 'Khám phá', 'nav.games': 'Minigame', 'nav.rewards': 'Rương quà', 'nav.about': 'Giới thiệu',
    'home.title': 'Hành trình văn hoá Nhật Bản', 'explore.title': 'Bản đồ khám phá', 'games.title': 'Thử thách Minigame',
    'rewards.title': 'Rương Quà & Lịch Sử', 'survey.title': 'Khảo sát trải nghiệm', 'about.title': 'Về dự án',
    'btn.back': 'Quay lại', 'footer.note': 'Dự án nghiên cứu trải nghiệm văn hoá — dữ liệu chỉ phục vụ mục đích học thuật.',
  },
  ja: {
    'nav.home': 'チェックイン', 'nav.explore': '探索', 'nav.games': 'ゲーム', 'nav.rewards': '宝箱', 'nav.about': '概要',
    'home.title': '日本文化の旅', 'explore.title': '探索マップ', 'games.title': 'ミニゲーム',
    'rewards.title': '宝箱と履歴', 'survey.title': '体験アンケート', 'about.title': 'プロジェクトについて',
    'btn.back': '戻る', 'footer.note': '文化体験の研究プロジェクト — データは学術目的にのみ使用されます。',
  },
};

export const t = (key) => DICT[get().lang]?.[key] ?? DICT.vi[key] ?? key;
