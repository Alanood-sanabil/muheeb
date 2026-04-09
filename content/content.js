// ============================================================
//  MUHEEB — CONTENT CONFIGURATION
//  Edit this file to change any text, price, or contact info
//  You can also add an "en" object here later for English
// ============================================================

const CONTENT = {

  // --- SITE SETTINGS ---
  site: {
    name: "مُهيب",
    tagline: "ثوبك المثالي، من بيتك",
    lang: "ar",
    dir: "rtl",
    whatsapp: "966500000000",
    basePrice: 220,
    deliveryDays: 4,
  },

  // --- NAVBAR ---
  nav: {
    links: [
      { label: "اطلب الان", href: "order.html" },
    ],
  },

  // --- HERO SECTION ---
  hero: {
    headline: ["ثوبك المثالي", "", "يوصلك للبيت"],
    subtext: "اختر قماشك، أعطنا مقاساتك — نوصله لك في ٤ أيام",
    cta: "ابدأ طلبك ←",
    scrollHint: "↓",
  },

  // --- VIDEO SECTION ---
  video: {
    badge: "فيديو تعريفي",
    caption: "شاهد كيف نفصّل ثوبك",
    youtubeId: null,
  },

  // --- ABOUT SECTION ---
  about: {
    eyebrow: "عن مُهيب",
    pullQuote: "نؤمن أن كل رجل يستحق ثوباً يناسبه تماماً — لا أقل",
    paragraphs: [
      "مُهيب خدمة سعودية متخصصة في تفصيل الثياب من راحة بيتك. بدلاً من رحلات المحلات والانتظار الطويل، نوصل لك ثوباً مفصلاً على مقاسك في ٤ أيام فقط.",
      "نختار أفضل الأقمشة السعودية ونعتني بكل تفصيلة من الياقة للطول. فريقنا يتواصل معك مباشرةً على واتساب لضمان نتيجة تعجبك.",
    ],
  },

  // --- IMAGE GRID LABELS ---
  imageGrid: {
    label1: "ثوب مُهيب",
    label2: "أقمشة فاخرة",
    label3: "تغليف أنيق",
  },

  // --- HOW IT WORKS ---
  how: {
    headline: "٣ خطوات فقط",
  },

  steps: [
    {
      number: "٠١",
      title: "اختر قماشك ولونك",
      body: "ربع وقفة، نص، طايح، أو وقفة — وأبيض أو أصفر. أنت تختار، حنا ننفّذ.",
      imagePlaceholder: "images/step-1-fabric.jpg",
      imageAlt: "اختيار القماش",
    },
    {
      number: "٠٢",
      title: "أعطنا مقاساتك",
      body: "طولك من الكتف للقدم، وزنك، وشكل جسمك. لا شريط قياس ولا تعقيد.",
      imagePlaceholder: "images/step-2-measurements.jpg",
      imageAlt: "المقاسات",
    },
    {
      number: "٠٣",
      title: "استلم في ٤ أيام",
      body: "نفصّل ثوبك ونوصله لبابك. وإذا احتجت تعديل، فريقنا على واتساب.",
      imagePlaceholder: "images/step-3-delivery.jpg",
      imageAlt: "التوصيل",
    },
  ],

  // --- STATS ---
  stats: [
    { number: 4,   unit: "أيام",   label: "متوسط وقت التوصيل" },
    { number: 3,   unit: "خطوات", label: "كل ما تحتاجه للطلب" },
    { number: 100, unit: "٪",     label: "ضمان الرضا" },
  ],

  // --- WIDE IMAGE OVERLAY ---
  wideImage: {
    headline: "تفاصيل تصنع الفرق",
    sub: "من الياقة للكم — كل شي مضبوط",
  },

  // --- FINAL CTA SECTION ---
  finalCta: {
    headline: "جاهز تطلب ثوبك؟",
    subtext: "بدون تسجيل. بدون تطبيق.",
    primaryBtn: { label: "ابدأ طلبك الآن", href: "order.html" },
    secondaryBtn: { label: "تواصل على واتساب" },
    note: "يتواصل معك فريقنا خلال ساعتين",
  },

  // --- FOOTER ---
  footer: {
    links: [
      { label: "اطلب الان", href: "order.html" },
    ],
    copyright: "© 2026 مُهيب. جميع الحقوق محفوظة.",
    sub: "تفصيل ثياب سعودية",
  },

  // --- ORDER FLOW (order.html) ---
  order: {
    tabs: ["اللون والياقة", "المقاسات", "شكل الجسم", "تأكيد الطلب"],

    // Landing
    landingHeadline: "ثوبك المثالي، يبدأ هنا",
    landingSub: "اختر قماشك، أعطنا مقاساتك، وحنا نوصله لك",
    landingCta: "ابدأ طلبك الآن ←",

    // Step 1 — Color + Collar
    colors: [
      { id: "white",  label: "أبيض",       image: "images/new-thob-white.png" },
      { id: "yellow", label: "أصفر فاتح",  image: "images/new-thob-yellow.png" },
    ],
    collars: [
      { id: "qalabi", label: "قلابي",     image: "images/collar-removebg-preview.png" },
      { id: "no",     label: "بدون قلابي", image: "images/no-collar-removebg-preview.png" },
    ],

    // Step 2 — Measurements
    heightLabel: "الطول",
    heightUnit: "سم",
    weightLabel: "الوزن",
    weightUnit: "كيلو",

    // Step 3 — Body shape
    bodyShapes: [
      { id: "slim",   label: "صدري أعرض من خصري",              badge: null },
      { id: "normal", label: "صدري وخصري بنفس العرض تقريباً",  badge: "الأكثر شيوعاً" },
      { id: "full",   label: "خصري أعرض من صدري",              badge: null },
    ],

    // Step 4 — Contact
    nameLabel: "الاسم",
    namePlaceholder: "اسمك",
    phoneLabel: "رقم الجوال",
    phonePlaceholder: "05XXXXXXXX",
    cityLabel: "المدينة",
    cities: ["اختر مدينتك", "الرياض", "جدة", "الخبر"],

    // Summary
    summaryTitle: "ملخص طلبك",
    summaryGroups: {
      thoob: "تفاصيل الثوب",
      measurements: "المقاسات",
      body: "شكل الجسم",
    },
    summaryLabels: {
      color: "اللون",
      collar: "الياقة",
      height: "الطول",
      weight: "الوزن",
      bodyType: "الجسم",
      price: "السعر التقديري",
    },
    priceUnit: "ريال",
    editLabel: "تعديل",

    // Confirmation
    confirmTitle: "شكرا",
    confirmSub: "سيتواصل معك فريق مُهيب على واتساب خلال ساعتين",
    confirmRefLabel: "رقم طلبك",
    confirmWhatsapp: "تواصل معنا على واتساب",
  },
};
