export const MODULES = [
  // MUTLU
  { id: 'm_mutlu_1', title: 'Günlük Yaz', description: 'Günün en güzel anını kelimelere dök.', duration: '5', timeOfDay: 'any', tags: ['mutlu'], steps: ['Defterini al.', 'Bugün neyin seni güldürdüğünü yaz.'], icon: 'edit-2' },
  { id: 'm_mutlu_2', title: 'Arkadaşını Ara', description: 'Mutluluğunu sevdiklerinle paylaş.', duration: '10', timeOfDay: 'any', tags: ['mutlu'], steps: ['Rehberini aç.', 'Seni anlayan biriyle güzel bir sohbet et.'], icon: 'phone' },
  // ENERJİK
  { id: 'm_enerjik_1', title: 'Hızlı Yürüyüş', description: 'Enerjini dışarı atmak için tempolu bir yürüyüş.', duration: '20', timeOfDay: 'any', tags: ['enerjik'], steps: ['Spor ayakkabılarını giy.', 'Tempolu müzik aç ve yürü.'], icon: 'activity' },
  { id: 'm_enerjik_2', title: 'Ev Düzenle', description: 'Enerjikken ortalığı toparlamak harika hissettirir.', duration: '15', timeOfDay: 'any', tags: ['enerjik'], steps: ['Dağınık bir köşe seç.', '15 dakika boyunca toparla.'], icon: 'home' },
  // SAKİN
  { id: 'm_sakin_1', title: 'Kitap Oku', description: 'Dingin zihnini yeni sayfalarla doldur.', duration: '20', timeOfDay: 'any', tags: ['sakin'], steps: ['Rahat bir köşeye geç.', 'Sevdiğin kitabın 10 sayfasını oku.'], icon: 'book-open' },
  { id: 'm_sakin_2', title: 'Meditasyon', description: 'Anın tadını çıkar ve anda kal.', duration: '10', timeOfDay: 'any', tags: ['sakin'], steps: ['Gözlerini kapat.', 'Sadece nefesine odaklan.'], icon: 'wind' },
  // YORGUN
  { id: 'm_yorgun_1', title: 'Göz Dinlendirme', description: 'Ekranlardan uzak, 5 dakikalık mola.', duration: '5', timeOfDay: 'any', tags: ['yorgun'], steps: ['Ekrandan uzaklaş.', 'Gözlerini kapat ve bekle.'], icon: 'eye-off' },
  { id: 'm_yorgun_2', title: '5 Dakika Esneme', description: 'Kaslarındaki gerginliği hafiflet.', duration: '5', timeOfDay: 'any', tags: ['yorgun'], steps: ['Ayağa kalk.', 'Sırtını ve omuzlarını yavaşça esnet.'], icon: 'move' },
  // STRESLİ
  { id: 'm_stresli_1', title: '4-7-8 Nefes Tekniği', description: 'Anında rahatlamak için etkili bir nefes kontrolü.', duration: '3', timeOfDay: 'any', tags: ['stresli'], steps: ['4 saniye nefes al.', '7 saniye tut.', '8 saniyede yavaşça ver.'], icon: 'wind' },
  { id: 'm_stresli_2', title: 'Klasik Müzik', description: 'Sinir sistemini sakinleştirecek ritimler.', duration: '15', timeOfDay: 'any', tags: ['stresli'], steps: ['Kulaklıklarını tak.', 'Klasik müzik açıp gözlerini kapat.'], icon: 'headphones' },
  // KÖTÜ
  { id: 'm_kotu_1', title: 'Duygu Boşaltma (Sesli)', description: 'İçindekileri sesli olarak dışa vur.', duration: '5', timeOfDay: 'any', tags: ['kötü'], steps: ['Ses kaydediciyi aç.', 'Tüm hislerini filtresiz anlat.'], icon: 'mic' },
  { id: 'm_kotu_2', title: 'Yumuşak Müzik', description: 'Seni yargılamayan, sadece eşlik eden tınılar.', duration: '15', timeOfDay: 'any', tags: ['kötü'], steps: ['Ruh haline uygun en hafif çalma listeni aç.', 'Oturup sadece dinle.'], icon: 'music' }
];

export const MOODS = [
  {
    label: 'Mutlu',
    emoji: '😊',
    advice: "Harika bir gün! Bu pozitif enerjiyi bir sesli notla dondurmaya ne dersin?",
    color: '#FFFDE7',
    accent: '#F9A825',
    tag: 'mutlu'
  },
  {
    label: 'Enerjik',
    emoji: '⚡',
    advice: "İçindeki gücü dışarı vur! Bugün yeni bir hedef belirlemek için harika bir zaman.",
    color: '#FFF3E0',
    accent: '#EF6C00',
    tag: 'enerjik'
  },
  {
    label: 'Sakin',
    emoji: '😌',
    advice: "Zihnin durulmuş durumda. Bu dinginliği derin bir nefesle kutla.",
    color: '#E8F5E9',
    accent: '#2E7D32',
    tag: 'sakin'
  },
  {
    label: 'Yorgun',
    emoji: '😫',
    advice: "Vücudun 'mola' diyor. Kendine izin ver, sadece uzan ve hiçbir şey düşünme.",
    color: '#EFEBE9',
    accent: '#4E342E',
    tag: 'yorgun'
  },
  {
    label: 'Stresli',
    emoji: '🤯',
    advice: "Nefes al Rabia. Kontrol sende. Sadece şu anki ana odaklanalım.",
    color: '#E3F2FD',
    accent: '#1565C0',
    tag: 'stresli'
  },
  {
    label: 'Kötü',
    emoji: '😔',
    advice: "Duygularını serbest bırak. Yarın her şeyin daha iyi olacağını unutma.",
    color: '#FAFAFA',
    accent: '#424242',
    tag: 'kötü'
  }
];
