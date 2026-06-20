// Mock content for NoorStream — a verified Islamic content platform.

export const INTERESTS = [
  { id: 'quran', label: 'Quran & Tajweed', desc: 'Recitation, tafsir, memorisation', icon: 'BookOpen', tint: '#22D3A6' },
  { id: 'fiqh', label: 'Islamic Rulings', desc: 'Fiqh, fatwa, halal & haram', icon: 'Scale', tint: '#8B7CFF' },
  { id: 'spirituality', label: 'Spirituality', desc: "Du'a, dhikr and tawakkul", icon: 'Heart', tint: '#F7C873' },
  { id: 'seerah', label: 'Seerah & History', desc: "The Prophet's life and history", icon: 'Star', tint: '#F0997B' },
  { id: 'finance', label: 'Halal Finance', desc: 'Banking, zakat, investments', icon: 'Coins', tint: '#5CE7C2' },
  { id: 'family', label: 'Family & Marriage', desc: 'Parenting, nikah, family life', icon: 'Users', tint: '#ED93B1' },
  { id: 'kids', label: 'Kids Content', desc: 'Islamic stories and learning', icon: 'Smile', tint: '#85B7EB' },
  { id: 'arabic', label: 'Arabic Language', desc: 'Quranic & modern Arabic', icon: 'Languages', tint: '#22D3A6' },
  { id: 'hajj', label: 'Hajj & Umrah', desc: 'Pilgrimage guides and duas', icon: 'MapPin', tint: '#FAC775' },
  { id: 'wellbeing', label: 'Muslim Wellbeing', desc: 'Mental health, Islamic lens', icon: 'Sprout', tint: '#97C459' },
];

export const MADHABS = [
  { id: 'hanafi', glyph: 'ح', name: 'Hanafi', imam: 'Imam Abu Hanifa (699–767)', region: 'Turkey, South Asia, GCC' },
  { id: 'shafii', glyph: 'ش', name: "Shafi'i", imam: "Imam al-Shafi'i (767–820)", region: 'SE Asia, East Africa, Yemen' },
  { id: 'maliki', glyph: 'م', name: 'Maliki', imam: 'Imam Malik (711–795)', region: 'North & West Africa, Spain' },
  { id: 'hanbali', glyph: 'ه', name: 'Hanbali', imam: 'Imam Ahmad ibn Hanbal (780–855)', region: 'Saudi Arabia, Qatar, UAE' },
];

export const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', name: 'English', native: 'English', meta: '1.35B speakers · Global default' },
  { id: 'ar', flag: '🇸🇦', name: 'Arabic', native: 'العربية', meta: '422M speakers · Language of the Quran' },
  { id: 'ur', flag: '🇵🇰', name: 'Urdu', native: 'اردو', meta: '230M speakers · South Asia' },
  { id: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia', meta: '199M speakers · SE Asia' },
  { id: 'tr', flag: '🇹🇷', name: 'Turkish', native: 'Türkçe', meta: '88M speakers' },
  { id: 'fr', flag: '🇫🇷', name: 'French', native: 'Français', meta: '280M speakers · Francophone Africa' },
];

export const NOTIF_TYPES = [
  { id: 'prayer', icon: 'Moon', title: 'Prayer time reminders', desc: 'Adhan alerts for all 5 daily prayers' },
  { id: 'daily', icon: 'Sun', title: 'Daily Islamic reminder', desc: 'A verified hadith or ayah each morning' },
  { id: 'scholar', icon: 'UserCheck', title: 'New scholar content', desc: 'When scholars you follow post' },
  { id: 'ramadan', icon: 'Star', title: 'Ramadan & Eid alerts', desc: 'Special content and event reminders' },
  { id: 'live', icon: 'Radio', title: 'Live scholar sessions', desc: 'Alerts when a scholar goes live' },
];

// Scholars keyed by id.
export const SCHOLARS = {
  khalid: {
    id: 'khalid', initials: 'SK', color: '#0E8A6C',
    name: 'Sheikh Khalid Al-Rashidi',
    role: 'Professor of Islamic Jurisprudence',
    inst: 'Al-Azhar University, Cairo · UAE-based',
    field: 'Islamic Jurisprudence',
    followers: '2.1M', videoCount: '148', courseCount: '12', rating: '4.9',
    glyph: 'بسم الله',
    bioAr: 'الشيخ خالد الراشدي — عالم وداعية إسلامي',
    bio: [
      "Sheikh Khalid Al-Rashidi is one of the most respected Islamic jurists in the Arab world, with over 25 years of scholarly service. He earned his doctorate in Islamic Jurisprudence from Al-Azhar University in Cairo.",
      'He has authored 14 books on Fiqh, delivered over 3,000 lectures across 40 countries, and serves as a fatwa advisor to multiple Islamic boards in the GCC.',
    ],
    specs: ['Islamic Jurisprudence', 'Halal Finance', 'Usul al-Fiqh', 'Contemporary Fatwas', 'Islamic Economics', 'Quran & Tafsir'],
    education: [
      { title: 'PhD — Islamic Jurisprudence', meta: 'Al-Azhar University, Cairo · 1998' },
      { title: 'Ijazah in Hadith Sciences', meta: 'Dar al-Uloom, Kuwait · 1993' },
      { title: 'Fatwa Board Advisor', meta: 'Dubai Islamic Authority · 2010–present' },
    ],
    pinnedAr: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
    pinned: '"Only those fear Allah, from among His servants, who have knowledge." — Surah Fatir 35:28',
    videos: [
      { glyph: 'حكم', tint: '#22D3A6', title: 'Is cryptocurrency halal? Clear fatwa', views: '2.3M', likes: '24K', dur: '4:32' },
      { glyph: 'زكاة', tint: '#8B7CFF', title: 'Zakat on savings — calculate it right', views: '1.8M', likes: '18K', dur: '6:18' },
      { glyph: 'نكاح', tint: '#F0997B', title: 'Islamic marriage contract explained', views: '1.1M', likes: '15K', dur: '8:45' },
      { glyph: 'ربا', tint: '#85B7EB', title: "Riba — what counts and what doesn't", views: '980K', likes: '11K', dur: '5:57' },
      { glyph: 'صيام', tint: '#97C459', title: 'Fasting while travelling', views: '750K', likes: '8.2K', dur: '3:20' },
      { glyph: 'وقف', tint: '#F7C873', title: 'Waqf — the Islamic endowment', views: '620K', likes: '7.1K', dur: '7:02' },
    ],
    courses: [
      { glyph: 'فقه', tint: '#0E8A6C', badge: 'Bestseller', title: 'Complete Islamic Jurisprudence', desc: 'Master the foundations of Islamic rulings across worship, transactions, and family law.', lessons: '40 lessons', hrs: '18 hrs', students: '12.4K', price: '$49.99', sub: 'Lifetime access' },
      { glyph: 'مال', tint: '#1B2540', badge: 'New', title: 'Halal Finance & Islamic Banking', desc: 'From mortgages to investments — what Islam permits in modern financial life.', lessons: '28 lessons', hrs: '11 hrs', students: '8.1K', price: '$34.99', sub: 'Lifetime access' },
      { glyph: 'نكاح', tint: '#141D33', badge: 'Popular', title: 'Marriage in Islam', desc: 'A comprehensive guide to Islamic marriage — nikah contract, spousal rights, and family.', lessons: '22 lessons', hrs: '9 hrs', students: '5.7K', price: 'Free', sub: 'Limited time', free: true },
    ],
    reviews: [
      { initials: 'AM', color: '#0E8A6C', name: 'Ahmad Masood', meta: 'Dubai · 2 weeks ago', text: "Sheikh Khalid's explanation of halal finance changed how I handle my investments. Every answer comes with clear evidence — no opinions without daleel." },
      { initials: 'FA', color: '#8B7CFF', name: 'Fatima Al-Amin', meta: 'London · 1 month ago', text: "The verified badge gives me confidence I'm not getting random opinions. His Fiqh course is exceptional." },
      { initials: 'MK', color: '#F0997B', name: 'Mohammed Khan', meta: 'Karachi · 3 weeks ago', text: 'The crypto fatwa video alone is worth downloading this app. Clear, structured, evidence-based.' },
    ],
  },
  yasmin: {
    id: 'yasmin', initials: 'DY', color: '#8B7CFF',
    name: 'Dr. Yasmin Mogahed', role: 'Islamic Psychology · Global Speaker',
    inst: 'Author & international speaker', field: 'Islamic Psychology',
    followers: '3.4M', videoCount: '210', courseCount: '6', rating: '4.9',
  },
  omar: {
    id: 'omar', initials: 'OH', color: '#F0997B',
    name: 'Omar Hashi Academy', role: 'Quran & Tajweed', inst: '890K followers',
    field: 'Quran & Tajweed', followers: '890K', rating: '4.8',
  },
  nouman: {
    id: 'nouman', initials: 'NA', color: '#85B7EB',
    name: 'Nouman Ali Khan', role: 'Quran Tafsir & Arabic Linguistics', inst: 'Bayyinah Institute',
    field: 'Tafsir & Linguistics', followers: '5.6M', rating: '4.9',
  },
};

// Vertical feed reels.
export const REELS = [
  {
    id: 'r1', scholar: 'khalid', bg: '#08110D', glyph: 'مسجد', glyphTint: '#22D3A6',
    caption: 'Is cryptocurrency permissible in Islam? A clear fatwa with Quranic evidence.',
    tags: ['#Fiqh', '#HalalFinance', '#IslamicEcon'], likes: 24.3, comments: '1.8K',
  },
  {
    id: 'r2', scholar: 'yasmin', bg: '#140C24', glyph: 'هلال', glyphTint: '#9B8FF5',
    caption: "When your du'a feels unanswered — the hidden mercy Allah has for you in the waiting.",
    tags: ['#Spirituality', '#Dua', '#Sabr'], likes: 48.1, comments: '3.2K',
  },
  {
    id: 'r3', scholar: 'omar', bg: '#170B0B', glyph: 'قرآن', glyphTint: '#F0997B',
    caption: 'Mastering the Qalqalah letters — lesson 7 of the complete Tajweed series.',
    tags: ['#Quran', '#Tajweed', '#Recitation'], likes: 12.7, comments: '642',
  },
  {
    id: 'r4', scholar: 'nouman', bg: '#081320', glyph: 'نور', glyphTint: '#85B7EB',
    caption: 'Surah Al-Baqarah 286 — "Allah does not burden a soul beyond what it can bear."',
    tags: ['#Tafsir', '#AlBaqarah', '#Hope'], likes: 61.4, comments: '5.1K',
  },
];

// AI knowledge base (catalog-scoped, cited answers).
export const AI_DATA = {
  'morning dua': {
    en: { text: 'The Prophet ﷺ taught this dua upon waking each morning:', dua: { ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', tr: 'Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namootu wa ilaikan-nushoor', mn: 'O Allah, by You we enter the morning, by You the evening, by You we live and die, and to You is the resurrection.' }, ref: 'Sunan Abu Dawood 5068 · Hasan' },
    ar: { text: 'علّمنا النبي ﷺ هذا الدعاء عند الاستيقاظ:', dua: { ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ', tr: '', mn: 'اللهم بك نبدأ صباحنا وبك نحيا ونموت وإليك المصير' }, ref: 'سنن أبي داود ٥٠٦٨' },
  },
  'dua for anxiety': {
    en: { text: 'For worry, grief and anxiety the Prophet ﷺ taught:', dua: { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', tr: "Allahumma inni a'udhu bika minal-hammi wal-hazani wal-'ajzi wal-kasali", mn: 'O Allah, I seek refuge in You from worry, grief, incapacity and laziness.' }, ref: 'Sahih al-Bukhari 6369' },
    ar: { text: 'للقلق والهم والحزن علّمنا النبي ﷺ:', dua: { ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', tr: '', mn: 'اللهم أعوذ بك من القلق والحزن والعجز والكسل' }, ref: 'صحيح البخاري ٦٣٦٩' },
  },
  'dua before eating': {
    en: { text: 'The Sunnah before eating:', dua: { ar: 'بِسْمِ اللَّهِ', tr: 'Bismillah', mn: 'In the name of Allah. If you forget at the start, say: Bismillahi fi awwalihi wa akhirih.' }, ref: 'Sunan Abu Dawood 3767' },
    ar: { text: 'السنة قبل الأكل:', dua: { ar: 'بِسْمِ اللَّهِ', tr: '', mn: 'ابدأ طعامك بذكر الله' }, ref: 'سنن أبي داود ٣٧٦٧' },
  },
  'is music haram': {
    en: { text: 'Scholars differ. The majority classical position: music with immoral lyrics or that distracts from worship is impermissible. Simple nasheeds without instruments are generally permitted. Your selected madhab leans toward prohibiting wind and string instruments.', ref: 'Surah Luqman 31:6 · Ibn Kathir Tafsir' },
    ar: { text: 'اختلف العلماء. الجمهور: الغناء المصحوب بالمعازف محرّم، والنشيد البسيط جائز عند كثير من العلماء.', ref: 'سورة لقمان ٣١:٦ · تفسير ابن كثير' },
  },
  'pillars of islam': {
    en: { text: 'The five pillars are: (1) Shahada — testimony of faith. (2) Salah — five daily prayers. (3) Zakat — annual charity at 2.5%. (4) Sawm — fasting Ramadan. (5) Hajj — pilgrimage once in a lifetime if able.', ref: 'Sahih al-Bukhari 8 · Sahih Muslim 16' },
    ar: { text: 'أركان الإسلام الخمسة: الشهادتان، الصلاة، الزكاة، الصوم، الحج.', ref: 'صحيح البخاري ٨ · صحيح مسلم ١٦' },
  },
  'wudu steps': {
    en: { text: 'Wudu steps: (1) Intention. (2) Bismillah. (3) Wash hands ×3. (4) Rinse mouth ×3. (5) Sniff water into nose ×3. (6) Wash face ×3. (7) Wash arms to elbows ×3, right first. (8) Wipe head. (9) Wipe ears. (10) Wash feet to ankles ×3, right first.', ref: 'Sahih al-Bukhari 164' },
    ar: { text: 'خطوات الوضوء: النية، البسملة، غسل اليدين، المضمضة، الاستنشاق، غسل الوجه، غسل الذراعين، مسح الرأس، مسح الأذنين، غسل القدمين.', ref: 'صحيح البخاري ١٦٤' },
  },
  default: {
    en: { text: 'JazakAllahu Khayran for your question. Based on Quran and Sunnah I can share general knowledge. For a specific personal fatwa, please consult a verified scholar.', ref: 'NoorStream Verified Scholar Network' },
    ar: { text: 'جزاك الله خيراً. للفتاوى الشخصية يُرجى استشارة عالم موثّق.', ref: 'شبكة علماء نورستريم' },
  },
};

export function aiKey(q) {
  const l = q.toLowerCase();
  if (l.includes('morning') || l.includes('waking') || l.includes('صباح')) return 'morning dua';
  if (l.includes('anxiety') || l.includes('worry') || l.includes('stress') || l.includes('قلق') || l.includes('هم')) return 'dua for anxiety';
  if (l.includes('eat') || l.includes('food') || l.includes('أكل') || l.includes('طعام')) return 'dua before eating';
  if (l.includes('music') || l.includes('موسيق')) return 'is music haram';
  if (l.includes('pillar') || l.includes('أركان')) return 'pillars of islam';
  if (l.includes('wudu') || l.includes('ablution') || l.includes('وضوء')) return 'wudu steps';
  return 'default';
}

export const TRENDING = ['#Ramadan', '#HalalFinance', '#Tajweed', '#DuaOfTheDay', '#Seerah', '#IslamicParenting', '#Tafsir', '#Zakat'];
