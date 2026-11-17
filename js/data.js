// Static content. Editable without touching any logic.

export const EVENT = {
  name: 'WAKEI 和敬',
  pickupPlace: 'Bàn lễ tân Không gian Văn hoá WAKEI',
  pickupNote: 'Giờ nhận quà theo thông báo của Ban tổ chức tại sự kiện.',
};

// One station = one physical stop + one minigame. Order = suggested route.
export const STATIONS = [
  {
    id: 'matsuri', no: 1, code: 'WK-01', game: 'matsuri', icon: 'local_activity',
    name: 'Quảng trường Matsuri', jp: '祭り', minutes: 2, xp: 100,
    img: 'img/matsuri-kamakura.jpg',
    badge: { name: 'Bậc Thầy Lễ Hội', icon: 'celebration' },
    gameTitle: 'Lật Thẻ Ký Ức Matsuri',
    concept: {
      tag: 'Lễ hội truyền thống', title: 'Matsuri — nhịp thở của bốn mùa',
      noteTitle: 'Ý niệm Matsuri',
      note: 'Matsuri là dịp cộng đồng cùng tri ân thiên nhiên và thần linh. Mỗi mùa đều có lễ hội riêng: lều tuyết giữa mùa đông, cờ cá chép đầu hạ, đèn lồng khổng lồ trong đêm hè.',
    },
    itemsTitle: 'Ba lễ hội tiêu biểu',
    itemsSub: 'Ghi nhớ biểu tượng và tên gọi để ghép cặp trong thử thách.',
    items: [
      { icon: 'ac_unit', name: 'Kamakura', jp: '雪洞', text: 'Lều tuyết thắp nến ở Yokote, Akita (tháng 2) — nơi trẻ em mời khách vào "nhà tuyết" uống trà nóng.' },
      { icon: 'flag', name: 'Koinobori', jp: '鯉のぼり', text: 'Cờ cá chép treo mừng Ngày Thiếu nhi (tháng 5), mong con trẻ khoẻ mạnh, kiên cường như cá chép vượt thác.' },
      { icon: 'lightbulb', name: 'Nebuta', jp: 'ねぶた', text: 'Đèn lồng hình võ tướng khổng lồ diễu hành ở Aomori (tháng 8), rực rỡ trong đêm hè.' },
    ],
  },
  {
    id: 'washoku', no: 2, code: 'WK-02', game: 'washoku', icon: 'ramen_dining',
    name: 'Bàn Ăn Washoku', jp: '和食', minutes: 3, xp: 100,
    img: 'img/station-washoku.jpg',
    badge: { name: 'Đầu Bếp Washoku', icon: 'ramen_dining' },
    gameTitle: 'Sắp Xếp Khay Ichiju-Sansai',
    concept: {
      tag: 'Di sản UNESCO', title: 'Washoku — nghệ thuật cân bằng ngũ vị, ngũ sắc',
      noteTitle: 'Ý niệm Shun (旬)',
      note: 'Tôn trọng thiên nhiên qua từng nguyên liệu tươi ngon nhất theo mùa. Một bữa ăn Washoku là sự hài hoà giữa hương vị, màu sắc và cách bày biện.',
    },
    itemsTitle: 'Ba bài học then chốt',
    itemsSub: 'Nắm vững quy tắc để bày khay đúng chuẩn.',
    items: [
      { icon: 'rice_bowl', name: 'Ichiju-Sansai', jp: '一汁三菜', text: 'Một canh ba món: cơm trắng, canh miso, một món chính và hai món phụ (rau ninh, tsukemono).' },
      { icon: 'palette', name: 'Goshiki', jp: '五色', text: 'Ngũ sắc: trắng, đen/nâu, đỏ, vàng và xanh — màu sắc đa dạng tạo nên sự cân bằng dinh dưỡng.' },
      { icon: 'table_restaurant', name: 'Cách bày khay', jp: '配膳', text: 'Cơm ở phía trước bên trái, canh miso phía trước bên phải, món chính phía sau bên phải; đũa đặt ngang phía trước.' },
    ],
  },
  {
    id: 'san-an', no: 3, code: 'WK-03', game: 'chado', icon: 'emoji_food_beverage',
    name: 'Trà Thất San-an', jp: '三庵', minutes: 3, xp: 100,
    img: 'img/station-san-an.jpg',
    badge: { name: 'Trà Nhân Tinh Tế', icon: 'emoji_food_beverage' },
    gameTitle: 'Thử Thách Trà Nhân',
    audio: { seconds: 30, title: 'Trải Nghiệm Giác Quan Âm Thanh', text: 'Lắng nghe âm thanh nước sôi như tiếng gió qua đồi tùng (Matsukaze) trong ấm gang Kama.' },
    concept: {
      tag: 'Di sản văn hoá', title: 'Trà Thất Tinh Tịch San-an & Lễ Nghi Thưởng Trà',
      noteTitle: 'Ý niệm Wabi-sabi trong Trà thất',
      note: 'Không gian khiêm nhường chỉ vừa 4,5 chiếu tatami, những cột gỗ mộc không sơn phết và vách đất tự nhiên. Nơi đây khước từ mọi vẻ hoa mỹ để con người trút bỏ địa vị xã hội, cúi mình bước qua cửa nhỏ Nijiriguchi và đối diện chân thật với chính tâm hồn mình.',
    },
    itemsTitle: 'Bộ Trà Cụ 4 Món Cơ Bản',
    itemsSub: 'Mỗi vật phẩm đều chứa đựng triết lý trân quý từng khoảnh khắc (Ichigo Ichie).',
    items: [
      { icon: 'brush', name: 'Chasen', jp: '茶筅', text: 'Chổi tre chẻ thủ công thành hàng trăm sợi tơ, dùng đánh tan bột matcha và tạo lớp bọt mịn.' },
      { icon: 'soup_kitchen', name: 'Chashaku', jp: '茶杓', text: 'Muỗng tre uốn cong tự nhiên, đong đúng lượng bột trà cho một tuần trà tỉnh thức.' },
      { icon: 'coffee', name: 'Chawan', jp: '茶碗', text: 'Chén trà gốm mộc nung củi mang nét rạn tự nhiên, vừa vặn vòm tay và giữ hơi ấm dịu dàng.' },
      { icon: 'inventory_2', name: 'Natsume', jp: '棗', text: 'Hộp đựng bột trà sơn mài, dáng quả táo tàu tượng trưng cho sự trọn vẹn và tĩnh tại.' },
    ],
  },
];

export const GAMES = {
  chado: {
    id: 'chado', station: 'san-an', name: 'Nghi Thức Trà Đạo', jp: '茶道 • Sadō', img: 'img/chado-hero.jpg',
    kicker: 'Văn hoá Trà đạo • Bài học 01', quote: 'Mỗi chén trà là một duyên hội ngộ duy nhất trong đời — Nhất kỳ nhất hội (一期一会).',
    quoteBy: 'Sen no Rikyū (千利休)',
    lead: 'Hòa, Kính, Thanh, Tịch (和敬清寂)',
    cards: [
      { k: '和', t: '1. Tinh thần Hòa – Kính (和・敬)', p: 'Sự giao hòa với thiên nhiên và vạn vật; nuôi dưỡng lòng tôn kính khiêm nhường đối với từng trà khách và từng trà cụ mộc mạc.' },
      { k: '清', t: '2. Tinh thần Thanh – Tịch (清・寂)', p: 'Thanh lọc tâm hồn khỏi bụi trần; an trú trong không gian tịch lặng, chiêm nghiệm sự bất toàn mà tĩnh tại.' },
      { k: '躙', t: '3. Cửa vào trà thất Nijiriguchi (躙り口)', p: 'Cửa gỗ chỉ cao chừng 90 cm. Mọi samurai hay lãnh chúa đều phải tháo gươm bên ngoài, khom mình bước vào — biểu tượng của sự bình đẳng trước một chén trà.' },
    ],
    quizSeconds: 20,
    passMin: 2,
    questions: [
      {
        q: 'Khi chủ tọa (Teishu) dâng bát trà matcha lên trước mặt bạn, thao tác đúng chuẩn của phái Urasenke là gì?',
        a: ['Nâng bát bằng tay phải, đỡ đáy bằng tay trái, xoay nhẹ bát 2 lần thuận chiều kim đồng hồ để tránh uống vào mặt chính của bát.',
            'Cầm bằng một tay và uống cạn ngay một hơi để khen trà ngon đậm vị.',
            'Dùng thìa tre khuấy đều bọt trà rồi mới nhấp từng ngụm nhỏ.',
            'Xoay bát ngược chiều kim đồng hồ 3 lần rồi lập tức đặt xuống bàn.'],
        ok: 0,
        why: 'Xoay bát thuận chiều kim đồng hồ 2 lần là cách khách tránh uống trực tiếp vào mặt chính (Sho-men) có hoa văn đẹp nhất — thể hiện sự kính trọng với chủ nhân.',
      },
      {
        q: 'Cửa Nijiriguchi chỉ cao chừng 90 cm. Điều này tượng trưng cho điều gì?',
        a: ['Để giữ nhiệt cho phòng trà vào mùa đông.',
            'Chỉ dành riêng cho gia chủ ra vào.',
            'Mọi người, kể cả samurai, đều phải cúi mình và bỏ gươm bên ngoài — bình đẳng trước một chén trà.',
            'Chỉ là trang trí theo phong cách thời xưa.'],
        ok: 2,
        why: 'Cửa thấp buộc mọi vị khách khom mình, trút bỏ địa vị xã hội trước khi bước vào không gian trà.',
      },
      {
        q: '“Ichigo Ichie” (一期一会) nhắc nhở người thưởng trà điều gì?',
        a: ['Mỗi cuộc gặp gỡ chỉ có một lần duy nhất trong đời, hãy trân trọng khoảnh khắc ấy.',
            'Mỗi ngày chỉ nên uống đúng một chén trà.',
            'Trà hội chỉ được tổ chức một lần mỗi năm.',
            'Mỗi chén trà phải pha từ một loại lá khác nhau.'],
        ok: 0,
        why: 'Ichigo Ichie là tinh thần của Sen no Rikyū: mỗi buổi trà là duy nhất, không bao giờ lặp lại y hệt, nên chủ và khách đều dốc trọn tâm ý.',
      },
    ],
  },

  washoku: {
    id: 'washoku', station: 'washoku', name: 'Ẩm Thực Washoku', jp: '和食', img: 'img/station-washoku.jpg',
    kicker: 'Triết lý ẩm thực • Bài học 02 • Di sản UNESCO',
    quote: 'Tôn trọng thiên nhiên qua từng nguyên liệu tươi ngon nhất theo mùa (Shun – 旬).',
    lead: 'Nghệ thuật cân bằng ngũ vị & ngũ sắc',
    cards: [
      { k: '01', t: 'Một canh ba món (Ichiju-Sansai 一汁三菜)', p: 'Nền tảng gồm 1 bát cơm trắng, 1 bát canh miso, 1 món chính (cá nướng hoặc thịt hấp) và 2 món phụ (rau ninh, dưa muối tsukemono).' },
      { k: '02', t: 'Quy chuẩn ngũ sắc (Goshiki 五色)', p: 'Trắng của gạo, đen/nâu của rong biển và mè, đỏ của cá hồi, vàng của trứng hoặc tương, xanh của rau non tạo nên sự cân bằng hoàn hảo.', dots: ['#ffffff', '#4a3b32', '#d94a4a', '#f2c94c', '#4caf50'] },
      { k: '03', t: 'Quy tắc bày khay chuẩn', p: 'Cơm luôn ở trước bên trái (vị trí tôn quý), súp miso ở trước bên phải. Món chính ở sau bên phải, hai món phụ ở sau bên trái và giữa. Đôi đũa Hashi đặt ngang phía trước.' },
    ],
    // Slot ids → correct dish id. Row layout is defined in the view.
    slots: [
      { id: 'back-l', label: 'Sau – trái', dish: 'kobachi' },
      { id: 'back-c', label: 'Sau – giữa', dish: 'tsukemono' },
      { id: 'back-r', label: 'Sau – phải', dish: 'shusai' },
      { id: 'front-l', label: 'Trước – trái', dish: 'gohan' },
      { id: 'chop', label: 'Đũa: ngang, phía trước', dish: 'hashi', wide: true },
      { id: 'front-r', label: 'Trước – phải', dish: 'shiru' },
    ],
    dishes: [
      { id: 'gohan', icon: 'rice_bowl', name: 'Cơm trắng', sub: 'Gohan' },
      { id: 'shiru', icon: 'soup_kitchen', name: 'Canh miso', sub: 'Shirumono' },
      { id: 'shusai', icon: 'set_meal', name: 'Cá hồi nướng muối', sub: 'Shusai – món chính' },
      { id: 'kobachi', icon: 'eco', name: 'Rau ninh mè', sub: 'Kobachi – món phụ' },
      { id: 'tsukemono', icon: 'lunch_dining', name: 'Dưa Tsukemono', sub: 'Món phụ' },
      { id: 'hashi', icon: 'horizontal_rule', name: 'Đũa Hashi', sub: 'Đặt ngang' },
    ],
    passAccuracy: 0, // finishing the tray is the success condition
  },

  matsuri: {
    id: 'matsuri', station: 'matsuri', name: 'Lật Thẻ Ký Ức Matsuri', jp: '日本の祭り', img: 'img/matsuri-nebuta.jpg',
    kicker: 'Lễ hội truyền thống • Thử thách trí nhớ',
    quote: 'Lật đúng 3 cặp hình để nhận Huy hiệu Bậc Thầy Lễ Hội!',
    lead: 'Ghép biểu tượng lễ hội với tên gọi tương ứng.',
    cards: [],
    pairs: [
      { id: 'kamakura', month: 'Tháng 2', img: 'img/matsuri-kamakura.jpg', name: 'Lều tuyết Kamakura', place: 'Akita', kanji: '雪洞', roma: 'Kamakura', sub: 'Lễ hội tuyết Yokote' },
      { id: 'koinobori', month: 'Tháng 5', img: 'img/matsuri-koinobori.jpg', name: 'Cờ cá chép Koinobori', place: 'Kodomo no Hi', kanji: '鯉のぼり', roma: 'Koinobori', sub: 'Lễ hội Thiếu nhi' },
      { id: 'nebuta', month: 'Tháng 8', img: 'img/matsuri-nebuta.jpg', name: 'Đèn lồng Nebuta', place: 'Aomori', kanji: 'ねぶた', roma: 'Nebuta Matsuri', sub: 'Lễ hội Aomori' },
    ],
  },
};

export const GIFTS = [
  { id: 'ema', kind: 'physical', img: 'img/gift-ema.jpg', name: 'Thẻ Gỗ Ước Nguyện Ema (絵馬)', tag: '01 hiện vật',
    desc: 'Gỗ Hinoki khắc laser tên bạn cùng lời chúc vạn sự cát tường WAKEI. Hãy viết lời nguyện và treo lên giàn Ema hoặc giữ làm kỷ vật.' },
  { id: 'sticker', kind: 'physical', img: 'img/gift-sticker.jpg', name: 'Bộ Sticker Văn Hoá WAKEI (ステッカー)', tag: 'Set 4 cái',
    desc: 'Vinyl cán mờ chống nước với bốn hoạ tiết: sóng Seigaiha, Chasen, bát trà và cá Koinobori.' },
  { id: 'matcha', kind: 'physical', img: 'img/gift-matcha.jpg', name: 'Chén Matcha Uji tại Trà thất San-an', tag: '01 suất',
    desc: 'Thưởng thức trực tiếp một chén matcha Uji kèm bánh wagashi tại quầy trà.' },
];

export const SURVEY = [
  { id: 'q1', label: 'Mức độ kết nối cảm xúc của bạn khi thực hành nghi thức Trà đạo (Chado)?' },
  { id: 'q2', label: 'Bạn cảm nhận tính chánh niệm (Mindfulness) qua không gian WAKEI ở mức nào?' },
  { id: 'q3', label: 'Mức độ hiểu biết của bạn về triết lý ẩm thực Washoku sau khi trải nghiệm?' },
  { id: 'q4', label: 'Mức độ bạn muốn tìm hiểu thêm về lễ hội và văn hoá Nhật Bản (Matsuri)?' },
];
export const LIKERT = { low: 'Hoàn toàn không', high: 'Rất nhiều' };
