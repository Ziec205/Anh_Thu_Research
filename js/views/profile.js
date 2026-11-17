import * as store from '../store.js';
import { openModal, icon, esc, $, toast } from '../ui.js';
import { render } from '../router.js';

export function openProfile() {
  const s = store.get();
  openModal({
    label: 'Hồ sơ và cài đặt',
    html: `<div class="stack">
      <div class="row"><span class="ms lg" aria-hidden="true">person</span><h2>Hồ sơ & cài đặt</h2></div>
      <p class="sub">Thông tin này chỉ lưu trên thiết bị của bạn và được dùng để khắc tên lên thẻ Ema.</p>
      <div class="field"><label for="p-name">Tên hiển thị</label><input class="input" id="p-name" maxlength="40" autocomplete="name" value="${esc(s.profile.name)}" placeholder="Ví dụ: Anh Thư"></div>
      <div class="field"><label for="p-id">Mã số sinh viên (không bắt buộc)</label><input class="input" id="p-id" maxlength="20" inputmode="numeric" value="${esc(s.profile.studentId)}"></div>
      <label class="row" style="align-items:flex-start;gap:12px;cursor:pointer">
        <input type="checkbox" id="p-demo" ${s.demo ? 'checked' : ''} style="width:22px;height:22px;margin-top:2px;accent-color:var(--primary-container)">
        <span><strong>Chế độ trải nghiệm (demo)</strong> <span class="demo-tag">DEMO</span><br><span class="sub">Mở sẵn mọi trạm mà không cần quét QR. Hãy tắt khi chạy sự kiện thật.</span></span>
      </label>
      <button class="btn btn-primary btn-block" id="p-save" type="button">${icon('check')}Lưu</button>
      <hr class="sep">
      <button class="btn btn-danger btn-block" id="p-reset" type="button">${icon('restart_alt')}Xoá toàn bộ tiến độ</button>
    </div>`,
    onMount(el, close) {
      $('#p-save', el).onclick = () => {
        store.setProfile({ name: $('#p-name', el).value.trim(), studentId: $('#p-id', el).value.trim() });
        store.setDemo($('#p-demo', el).checked);
        toast('Đã lưu cài đặt'); close(); render();
      };
      $('#p-reset', el).onclick = () => {
        if (!confirm('Xoá toàn bộ huy hiệu, khảo sát và mã quà trên thiết bị này? Hành động không thể hoàn tác.')) return;
        store.resetAll(); toast('Đã đặt lại tiến độ', 'restart_alt'); close(); location.hash = '#/'; render();
      };
    },
  });
}
