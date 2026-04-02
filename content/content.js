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
    fabricUpcharge: 20,
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
    steps: ["تفاصيل الثوب", "المقاسات", "بياناتك"],

    // Landing
    landingHeadline: "ثوبك المثالي، يبدأ هنا",
    landingSub: "اختر قماشك، أعطنا مقاساتك، وحنا نوصله لك",
    landingCta: "ابدأ طلبك الآن ←",
    landingBadges: [
      { icon: "", label: "من راحة بيتك" },
      { icon: "", label: "توصيل سريع" },
      { icon: "", label: "ضمان الجودة" },
    ],

    // Step 1 — Thoob customization
    colorLabel: "لون الثوب",
    colors: [
      { id: "yellow", label: "أصفر فاتح", sub: "لون دافي مميز",    hex: "#FAF3DC" },
      { id: "white",  label: "أبيض",       sub: "الكلاسيكي الأنيق", hex: "#FFFFFF" },
    ],

    fabricLabel: "نوع القماش",
    fabricSub: "كل نوع يختلف في وقفة الثوب وثقله",
    fabrics: [
      { id: "rub3",  label: "ربع وقفة", sub: "خفيف وناعم",   upcharge: 0 },
      { id: "nus",   label: "نص وقفة",  sub: "متوازن وخفيف", upcharge: 0 },
      { id: "tayeh", label: "طايح",      sub: "ناعم ومريح",   upcharge: 0 },
      { id: "waqfa", label: "وقفة",      sub: "ثقيل وواقف",  upcharge: 20 },
    ],

    collarLabel: "نوع الياقة",
    collars: [
      { id: "qalabi", label: "بقلابة",     sub: "الياقة التقليدية" },
      { id: "no",     label: "بدون قلابة", sub: "ياقة مدورة حديثة" },
    ],

    nextBtn: "التالي",
    backBtn: "رجوع →",

    // Step 2 — Measurements
    measurementsTitle: "المقاسات",
    measurementsIntro: "لا تحتاج خبرة! فقط أدخل هالمعلومات البسيطة",
    heightLabel: "الطول (من الكتف للقدم)",
    heightPlaceholder: "مثال: ١٦٥",
    heightUnit: "سم",
    heightHelper: "قِس من أعلى كتفك لأسفل قدمك",
    weightLabel: "الوزن",
    weightPlaceholder: "مثال: ٨٠",
    weightUnit: "كيلو",
    bodyTypeLabel: "شكل الجسم",
    bodyTypeSubtext: "ساعدنا نضبط القصة المناسبة لك",
    bodyTypes: [
      { id: "slim", label: "نحيف / عادي" },
      { id: "full", label: "ممتلئ" },
    ],

    // Step 3 — Contact
    contactTitle: "بياناتك",
    nameLabel: "الاسم الكريم",
    namePlaceholder: "اسمك الكريم",
    phoneLabel: "رقم الجوال",
    phonePlaceholder: "05XXXXXXXX",
    phoneNote: "سيتم التواصل معك على هذا الرقم عبر واتساب",
    cityLabel: "المدينة",
    cities: ["اختر مدينتك", "الرياض", "جدة", "الدمام", "مكة المكرمة", "المدينة المنورة", "الطائف", "أخرى"],
    summaryTitle: "ملخص طلبك",
    summaryLabels: {
      color: "اللون",
      fabric: "القماش",
      collar: "الياقة",
      height: "الطول",
      weight: "الوزن",
      bodyType: "الجسم",
      price: "السعر التقديري",
    },
    priceUnit: "ريال",
    submitBtn: "تأكيد الطلب",
    validationMsg: "الرجاء اختيار جميع الخيارات",

    // Confirmation screen
    confirmTitle: "تم إرسال طلبك!",
    confirmSub: "سيتواصل معك فريق مُهيب على واتساب خلال ساعتين لتأكيد الطلب وتنسيق التوصيل",
    confirmRefLabel: "رقم طلبك",
    confirmWhatsapp: "تواصل معنا على واتساب",
  },
};
