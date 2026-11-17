import { t } from '../i18n.js';
import { icon } from '../ui.js';
import { page, backBar } from './shared.js';

export default function about() {
  const blocks = [
    ['spa', 'WAKEI là gì?', 'WAKEI (和敬) lấy cảm hứng từ hai chữ đầu của "Hòa – Kính – Thanh – Tịch", bốn nguyên tắc của Trà đạo. Dự án mời bạn đi qua ba điểm dừng chân để cảm nhận văn hoá Nhật Bản bằng thị giác, thính giác và trò chơi.'],
    ['route', 'Cách tham gia', 'Check-in tại trạm bằng mã QR → chơi minigame để nhận huy hiệu → đủ 3 huy hiệu thì làm khảo sát ngắn → nhận mã QR đổi quà tại bàn lễ tân.'],
    ['shield', 'Dữ liệu của bạn', 'Hiện tại mọi tiến độ, kết quả minigame và câu trả lời khảo sát chỉ được lưu trong trình duyệt trên thiết bị của bạn. Khi hệ thống máy chủ được kích hoạt, dữ liệu ẩn danh (thời gian trả lời, số lần thử, điểm khảo sát) sẽ được đồng bộ cho mục đích nghiên cứu. Bạn có thể xoá toàn bộ tiến độ trong mục Hồ sơ & cài đặt.'],
    ['accessibility_new', 'Khả năng tiếp cận', 'Trang hoạt động trên điện thoại và máy tính, hỗ trợ bàn phím và giảm chuyển động (prefers-reduced-motion) cho hiệu ứng 3D.'],
  ];
  return {
    title: t('nav.about'),
    html: page(`${backBar('/', 'Trang chủ')}
      <header class="stack sm"><span class="eyebrow">和敬清寂</span><h1>${t('about.title')}</h1></header>
      <div class="grid cols-2">${blocks.map(([ic, h, p]) => `<section class="card stack"><div class="card-title">${icon(ic, 'lg')}<h2>${h}</h2></div><p class="sub" style="font-size:1rem">${p}</p></section>`).join('')}</div>
      <div class="row wrap"><a class="btn btn-primary" href="#/explore">${icon('explore')}Bắt đầu khám phá</a><a class="btn btn-ghost" href="#/">Về trang Check-in</a></div>`),
  };
}
