# WAKEI 和敬 — Nền tảng trải nghiệm văn hoá Nhật Bản (gamified)

Website tĩnh (HTML + ES modules, không cần build) chạy được trên **GitHub Pages**, hiển thị tốt trên **điện thoại và máy tính**.

## Chạy thử

```bash
python -m http.server 5173   # rồi mở http://localhost:5173
```

> Cần chạy qua HTTP (không mở trực tiếp file `index.html`) vì dùng ES modules.

## Bật GitHub Pages

Repo → **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
Link sẽ có dạng `https://ziec205.github.io/Anh_Thu_Research/`.

## Sơ đồ trang (hash routing — hoạt động trên GitHub Pages không cần cấu hình)

| Đường dẫn | Trang |
|---|---|
| `#/` | Check-in (trang chủ) |
| `#/checkin/WK-01` … `WK-03` | Liên kết để in thành mã QR dán tại trạm — tự check-in rồi mở trang trạm |
| `#/explore` · `#/explore/:id` | Bản đồ trạm · chi tiết trạm (`matsuri`, `washoku`, `san-an`) |
| `#/games` · `#/games/chado` · `washoku` · `matsuri` | Hub minigame · 3 minigame |
| `#/survey` | Khảo sát (mở khi đủ 3 huy hiệu) |
| `#/rewards` | Rương quà + mã QR đổi quà |
| `#/about` | Giới thiệu & quyền riêng tư |

## Cấu trúc

```
index.html          khung trang (header, nav, footer, importmap three.js)
css/styles.css      design system Zen (token từ docs/DESIGN.md), responsive 3 mức: <700 / ≥700 / ≥960
js/app.js           khởi tạo, route, header/nav
js/router.js        hash router + nút Back an toàn
js/store.js         state + localStorage + **điểm nối backend (`api`)**
js/data.js          toàn bộ nội dung (trạm, câu hỏi, quà, khảo sát) — sửa ở đây
js/fx.js            hiệu ứng three.js (cánh hoa anh đào + vòng ensō/gợn nước)
js/views/*.js       từng trang
```

## Khi làm Backend

Mọi nơi cần gọi server nằm ở cuối `js/store.js`:

- `API_BASE` — URL server.
- `api.pushSurvey()` · `api.flushTelemetry()` · `api.verifyVoucher()` — hiện đang để trống (TODO).
- `state.telemetry` đã ghi sẵn sự kiện nghiên cứu (thời gian trả lời, số lần thử, độ chính xác…) chờ đồng bộ.
- Mã đổi quà hiện sinh ở client (`makeCode`); khi có BE nên sinh & xác thực ở server.
- Nút "Giả lập ban tổ chức" và chế độ demo (mở khoá mọi trạm) chỉ để thử — tắt trong **Hồ sơ & cài đặt** khi chạy thật.

## Các lỗi logic đã sửa so với bản thiết kế Stitch

- Dữ liệu cứng mâu thuẫn nhau (huy hiệu 2/3 vs 3/3, “3 quà” vs “4 phần quà”, bộ đếm bộ lọc, giờ nhận quà sau giờ cấp phiếu…) → mọi số liệu giờ **tính từ state thực**.
- Bộ huy hiệu không khớp minigame (Kintsugi không có màn chơi; sticker liệt kê 4 chủ đề khác minigame) → thống nhất 3 huy hiệu = Chado, Washoku, Matsuri.
- Matsuri báo “Đạt yêu cầu” khi mới ghép 2/3 cặp; số liệu lượt/hiệu suất/thời gian mâu thuẫn → huy hiệu chỉ trao khi đủ cặp, số liệu tính thật.
- Chado: đáp án đúng chọn sẵn, nút xác nhận không kiểm tra đáp án, đồng hồ 15 s không có hệ quả → quiz 3 câu có hết giờ, chấm điểm, ngưỡng đạt 2/3, làm lại được.
- Washoku: nút “Khóa bố cục” tự đặt món dù chưa chơi, nhận huy hiệu ngay → phải đặt đúng cả 6 vị trí mới khóa được; có gợi ý khi sai.
- Nút Quay lại dùng `history.back()` (mở thẳng trang thì thoát khỏi site) → có fallback về trang cha.
- Thanh điều hướng `href="#"`, nút/QR giả → điều hướng thật; QR là mã thật (tạo từ mã phiếu), lưu được thành PNG.
- Khoá zoom (`user-scalable=no`) → bỏ để đảm bảo khả năng tiếp cận.
- “Telemetry SPSS” và “Cronbach’s α Verified” hiển thị cho người dùng (số giả) → chuyển thành dữ liệu ghi nền, không hiển thị số giả.
- Tên/MSSV cứng → nhập ở khảo sát/Hồ sơ, có xác nhận đồng ý chia sẻ dữ liệu nghiên cứu.
- Tailwind CDN (chỉ dành cho dev) → CSS thuần.
- Chuyển ngôn ngữ VI/JA trước đây không làm gì → giao diện (menu, tiêu đề chính) đổi được; nội dung bài học giữ tiếng Việt.
