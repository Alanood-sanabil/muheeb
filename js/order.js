// ============================================================
//  MUHEEB — ORDER FLOW (4-step + landing + confirmation)
//  Supabase is imported lazily inside submit() to avoid blocking
//  the module load if the CDN is slow or unavailable.
// ============================================================

const orderState = { color: null, collar: null, height: 170, weight: 80, shoeSize: 42, bodyShape: null, fitPreference: null, name: null, phone: null, city: 'الرياض' };
let currentScreen = 1;

document.addEventListener('DOMContentLoaded', function() {
  if (typeof CONTENT === 'undefined') {
    console.error('CONTENT not loaded — check script order in order.html');
    return;
  }

  // Ensure landing screen is active, all others hidden
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });
  const landing = document.getElementById('screen-1');
  if (landing) landing.classList.add('active');

  // Hide progress bar on landing
  const progressContainer = document.getElementById('progress-container');
  if (progressContainer) progressContainer.style.opacity = '0';

  // Initialize content and interactions
  populate();
  buildCards();
  initSliders();
  attachInputWatchers();

  const defaultImg = document.getElementById('fit-img-normal');
  if (defaultImg) defaultImg.classList.add('visible');
  orderState.fitPreference = 'normal';
  document.querySelector('.fit-opt-btn[data-fit="normal"]')?.classList.add('selected');
  const btn4bInit = document.getElementById('btn-next-4b');
  if (btn4bInit) { btn4bInit.classList.add('ready'); btn4bInit.textContent = 'التالي'; }
  const fitDescEl = document.getElementById('fit-desc');
  if (fitDescEl) { fitDescEl.textContent = ''; fitDescEl.style.opacity = '0'; }

  const ctaBtn = document.getElementById('order-landing-cta');
  if (!ctaBtn) {
    console.error('[Muheeb] order-landing-cta button not found in DOM');
  } else {
    console.log('[Muheeb] CTA button found:', ctaBtn);
    ctaBtn.onclick = function() {
      console.log('[Muheeb] CTA clicked — starting loader');
      gtag('event', 'start_order', { event_category: 'funnel' });
      const loader = document.getElementById('loader-screen');
      const bar = document.getElementById('loader-bar');
      loader.classList.add('visible');
      loader.classList.remove('hide');
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
      setTimeout(() => {
        console.log('[Muheeb] Loader done — switching to screen-2');
        document.getElementById('screen-1').classList.remove('active');
        loader.classList.add('hide');
        setTimeout(() => {
          loader.classList.remove('visible', 'hide');
          showScreen(2);
          console.log('[Muheeb] showScreen(2) called, currentScreen =', currentScreen);
        }, 400);
      }, 950);
    };
  }
});

// ---- POPULATE ----
function populate() {
  const O = CONTENT.order;
  const S = CONTENT.site;

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setPlaceholder(id, val) {
    const el = document.getElementById(id);
    if (el) el.placeholder = val;
  }

  // Landing
  setText('order-sub', O.landingSub);
  setText('order-landing-cta', O.landingCta);

  // Slider labels
  setText('s-height-label', O.heightLabel);
  setText('s-weight-label', O.weightLabel);
  setText('s-shoe-label', O.shoeSizeLabel);
  setText('s-height-val', toAr(170) + ' ' + O.heightUnit);
  setText('s-weight-val', toAr(80) + ' ' + O.weightUnit);
  setText('s-shoe-val', toAr(42) + ' ' + O.shoeSizeUnit);

  // Contact
  setText('name-label', O.nameLabel);
  setPlaceholder('input-name', O.namePlaceholder);
  setText('phone-label', O.phoneLabel);
  setPlaceholder('input-phone', O.phonePlaceholder);

  // Summary
  setText('summary-title', O.summaryTitle);
  setText('sum-grp-thoob', O.summaryGroups.thoob);
  setText('sum-grp-meas', O.summaryGroups.measurements);
  setText('sum-grp-body', O.summaryGroups.body);
  setText('sum-color-label', O.summaryLabels.color);
  setText('sum-collar-label', O.summaryLabels.collar);
  setText('sum-height-label', O.summaryLabels.height);
  setText('sum-weight-label', O.summaryLabels.weight);
  setText('sum-shoe-label', O.summaryLabels.shoeSize);
  setText('sum-body-label', O.summaryLabels.bodyType);

  // Edit links
  document.querySelectorAll('.sum-edit').forEach(a => { a.textContent = O.editLabel; });

  // Confirmation
  setText('confirm-title', O.confirmTitle);
  setText('confirm-sub', O.confirmSub);
  setText('confirm-ref-label', O.confirmRefLabel);
  setText('confirm-wa-text', O.confirmWhatsapp);
}

// ---- BUILD CARDS ----
function buildCards() {
  buildColorSwatches();
  buildCollarCards();
  buildShapeCards();
}

const swatchBg = { white: '#FFFFFF', yellow: '#FAF3DC' };

const colorImages = {
  white: ['images/thob-white1.png','images/thob-white2.png','images/thob-white3.png','images/thob-white4.png','images/thob-white5.png','images/thob-white6.png'],
  yellow: ['images/thob-yellow1.png','images/thob-yellow2.png','images/thob-yellow3.png','images/thob-yellow4.png','images/thob-yellow5.png'],
};

let _carouselObserver = null;

function loadCarousel(colorId) {
  const track = document.getElementById('carousel-track');
  const dotsEl = document.getElementById('carousel-dots');
  const images = colorImages[colorId] || [];

  if (_carouselObserver) { _carouselObserver.disconnect(); _carouselObserver = null; }

  track.innerHTML = '';
  dotsEl.innerHTML = '';

  const dots = [];
  images.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.className = 'carousel-img';
    img.alt = 'ثوب';
    track.appendChild(img);
    const dot = document.createElement('div');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dotsEl.appendChild(dot);
    dots.push(dot);
  });

  track.scrollLeft = 0;

  _carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(track.children).indexOf(entry.target);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
      }
    });
  }, { root: track, threshold: 0.5 });

  Array.from(track.children).forEach(img => _carouselObserver.observe(img));
}

function buildColorSwatches() {
  const container = document.getElementById('color-swatches');
  const nameEl = document.getElementById('selected-color-name');
  const colors = CONTENT.order.colors;

  orderState.color = colors[0].label;
  if (nameEl) nameEl.textContent = colors[0].label;
  loadCarousel(colors[0].id);

  colors.forEach((color, idx) => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch' + (idx === 0 ? ' selected' : '');
    swatch.dataset.color = color.id;
    swatch.style.background = swatchBg[color.id] || '#FFFFFF';
    swatch.title = color.label;
    swatch.onclick = () => {
      container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      orderState.color = color.label;
      if (nameEl) nameEl.textContent = color.label;
      loadCarousel(color.id);
      updateBtn(1);
    };
    container.appendChild(swatch);
  });
  updateBtn(1);
}

function buildCollarCards() {
  const c = document.getElementById('collar-cards');
  CONTENT.order.collars.forEach(col => {
    const d = document.createElement('div');
    d.className = 'card collar-card';
    d.dataset.value = col.label;
    const img = col.id === 'qalabi'
      ? '<img src="images/collar-removebg-preview.png" alt="قلابي">'
      : '<img src="images/no-collar-removebg-preview.png" alt="بدون قلابي">';
    d.innerHTML = `${img}<div class="card-label">${col.label}</div>`;
    d.onclick = () => {
      c.querySelectorAll('.collar-card').forEach(card => card.classList.remove('selected'));
      d.classList.add('selected');
      orderState.collar = col.label;
      updateBtn(1);
    };
    c.appendChild(d);
  });
}

function buildShapeCards() {
  const c = document.getElementById('shape-cards');
  const svgs = {
    slim:   '<svg viewBox="0 0 60 60" width="44" height="44"><polygon points="8,12 52,12 44,48 16,48" fill="none" stroke="#0A0A0A" stroke-width="1.5"/></svg>',
    normal: '<svg viewBox="0 0 60 60" width="44" height="44"><rect x="14" y="12" width="32" height="36" fill="none" stroke="#0A0A0A" stroke-width="1.5"/></svg>',
    full:   '<svg viewBox="0 0 60 60" width="44" height="44"><polygon points="16,12 44,12 52,48 8,48" fill="none" stroke="#0A0A0A" stroke-width="1.5"/></svg>',
  };
  CONTENT.order.bodyShapes.forEach(shape => {
    const d = document.createElement('div');
    d.className = 'body-shape-card';
    d.dataset.value = shape.label;
    const badge = shape.badge ? `<div class="most-common-badge">${shape.badge}</div>` : '';
    d.innerHTML = `${badge}${svgs[shape.id]}<span class="body-shape-label">${shape.label}</span>`;
    d.onclick = () => {
      c.querySelectorAll('.body-shape-card').forEach(s => s.classList.remove('selected'));
      d.classList.add('selected');
      orderState.bodyShape = shape.label;
      updateBtn(3);
    };
    c.appendChild(d);
  });
}

function mk(cls, val) {
  const d = document.createElement('div');
  d.className = cls;
  d.dataset.value = val;
  return d;
}

// ---- CARD SELECT ----
function pick(field, card, container, step) {
  container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  card.classList.remove('bounce');
  void card.offsetWidth;
  card.classList.add('selected', 'bounce');
  orderState[field] = card.dataset.value;
  updateBtn(step);
}

// ---- SLIDERS ----
function initSliders() {
  const O = CONTENT.order;
  setupSlider('slider-height', 's-height-val', O.heightUnit, 'height');
  setupSlider('slider-weight', 's-weight-val', O.weightUnit, 'weight');
  setupSlider('slider-shoe', 's-shoe-val', O.shoeSizeUnit, 'shoeSize');
}

function setupSlider(sliderId, valId, unit, field) {
  const sl = document.getElementById(sliderId);
  const valEl = document.getElementById(valId);
  const update = () => {
    updateSliderFill(sl);
    valEl.textContent = toAr(sl.value) + ' ' + unit;
    orderState[field] = sl.value;
  };
  sl.addEventListener('input', update);
  update();
}

function updateSliderFill(slider) {
  const min = parseFloat(slider.min);
  const max = parseFloat(slider.max);
  const val = parseFloat(slider.value);
  const pct = ((val - min) / (max - min)) * 100;
  // direction: ltr wrapper ensures left = min, right = max
  slider.style.background = `linear-gradient(to right, #0A0A0A ${pct}%, #E5E5E5 ${pct}%)`;
}

// ---- INPUT WATCHERS ----
function attachInputWatchers() {
  const n = document.getElementById('input-name');
  const p = document.getElementById('input-phone');
  [n, p].forEach(inp => inp.addEventListener('input', () => updateBtn(5)));

  document.querySelectorAll('.line-input-wrap input, .line-input-wrap select').forEach(inp => {
    const label = inp.closest('.input-row')?.querySelector('label');
    if (!label) return;
    inp.addEventListener('focus', () => label.classList.add('float'));
    inp.addEventListener('blur', () => { if (!inp.value) label.classList.remove('float'); });
  });
}

// ---- BUTTON STATE ----
function updateBtn(step) {
  let btn, ready = false, readyText = '';
  if (step === 1) {
    btn = document.getElementById('btn-next-1');
    ready = orderState.color && orderState.collar;
    readyText = 'التالي';
  } else if (step === 3) {
    btn = document.getElementById('btn-next-3');
    ready = !!orderState.bodyShape;
    readyText = 'التالي';
  } else if (step === 5) {
    btn = document.getElementById('submit-btn');
    ready = document.getElementById('input-name').value.trim()
         && document.getElementById('input-phone').value.trim();
    readyText = 'أرسل الطلب';
  }
  if (!btn) return;
  if (ready) { btn.classList.add('ready'); btn.textContent = readyText; }
  else { btn.classList.remove('ready'); btn.textContent = step === 5 ? 'أرسل الطلب' : 'اختر جميع الخيارات'; }
}

// ---- SCREEN NAV ----
function showScreen(n) {
  const current = document.querySelector('.screen.active');

  function doSwitch() {
    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
    });

    const target = document.getElementById('screen-' + n);
    if (target) target.classList.add('active');

    // GA: track funnel entry from landing
    if (n === 2 && currentScreen === 1) gtag('event', 'start_order', { event_category: 'funnel' });

    currentScreen = n;
    updateProgress(n);

    if (n === 2) updateBtn(1);
    if (n === 4) updateBtn(3);
    if (n === '4b') updateBtn('4b');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (current) {
    current.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
    current.style.opacity = '0';
    current.style.transform = 'translateY(-16px)';
    setTimeout(() => {
      current.style.transition = '';
      current.style.opacity = '';
      current.style.transform = '';
      doSwitch();
    }, 450);
  } else {
    doSwitch();
  }
}

function goToStep(stepNum) {
  showScreen(stepNum + 1);
}

// ---- PROGRESS BAR ----
function updateProgress(screenNumber) {
  const container = document.getElementById('progress-container');
  if (!container) return;

  // Hide on landing, processing, and confirmation
  if (screenNumber === 1 || screenNumber === 6 || screenNumber === 'processing') {
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    return;
  }

  container.style.opacity = '1';
  container.style.pointerEvents = '';

  // Map screen to activeStep (1-4)
  // screen 2=step1, 3=step2, 4=step3, '4b'=step4
  const stepMap = { 2: 1, 3: 2, 4: 3, '4b': 4 };
  const screenTargets = [null, 2, 3, 4, '4b']; // index = step number
  const activeStep = stepMap[screenNumber] || 1;

  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('step-dot-' + i);
    if (!dot) continue;

    dot.classList.remove('active', 'completed', 'clickable');

    if (i < activeStep) {
      dot.classList.add('completed', 'clickable');
      dot.style.cursor = 'pointer';
      dot.onclick = (function(target) {
        return function() { showScreen(target); };
      })(screenTargets[i]);
    } else if (i === activeStep) {
      dot.classList.add('active');
      dot.style.cursor = 'default';
      dot.onclick = null;
    } else {
      dot.style.cursor = 'default';
      dot.onclick = null;
    }
  }

  for (let i = 1; i <= 3; i++) {
    const line = document.getElementById('line-' + i + '-' + (i + 1));
    if (!line) continue;
    if (i < activeStep) line.classList.add('filled');
    else line.classList.remove('filled');
  }
}

// ---- VALIDATION ----
function validateStep1() {
  clearErr();
  let ok = true;
  if (!orderState.color) { showErr('error-color'); ok = false; }
  if (!orderState.collar) { showErr('error-collar'); ok = false; }
  if (ok) { gtag('event', 'complete_step1', { event_category: 'funnel' }); showScreen(3); }
}

function validateStep2() {
  // Sliders always have values, so always valid
  gtag('event', 'complete_step2', { event_category: 'funnel' });
  showScreen(4);
}

function validateStep3() {
  clearErr();
  if (!orderState.bodyShape) { showErr('error-body'); return; }
  gtag('event', 'complete_step3', { event_category: 'funnel' });
  showScreen('4b');
}

const fitDescriptions = {
  slim:   'يلتصق بالجسم — أنيق وعصري',
  normal: 'لا ضيق ولا واسع — الأنسب لمعظم الناس',
  loose:  'مريح وواسع — مناسب للجلسات الطويلة',
};

function selectFit(btn) {
  document.querySelectorAll('.fit-opt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const fit = btn.dataset.fit;
  orderState.fitPreference = fit;

  const imgs = document.querySelectorAll('.fit-img');
  imgs.forEach(img => img.classList.remove('visible'));

  const target = document.getElementById('fit-img-' + fit);
  if (target) target.classList.add('visible');

  const desc = document.getElementById('fit-desc');
  if (desc) {
    desc.style.opacity = '0';
    setTimeout(() => {
      desc.textContent = fitDescriptions[fit];
      desc.style.opacity = '1';
    }, 180);
  }

  const btn4b = document.getElementById('btn-next-4b');
  if (btn4b) { btn4b.classList.add('ready'); btn4b.textContent = 'التالي'; }
}
window.selectFit = selectFit;

function validateStep4b() {
  if (!orderState.fitPreference) { showErr('error-fit'); return; }
  showScreen('processing');
  const bar = document.getElementById('processing-bar');
  const txt = document.getElementById('processing-text');
  bar.classList.remove('animate');
  void bar.offsetWidth;
  bar.classList.add('animate');

  if (txt) txt.textContent = 'جاري تجهيز مقاس ثوبك...';

  setTimeout(() => {
    openOrderModal();
  }, 4000);
}
window.validateStep4b = validateStep4b;

function openOrderModal() {
  const O = CONTENT.order;
  const S = CONTENT.site;
  const sumColor = document.getElementById('sum-color');
  const sumCollar = document.getElementById('sum-collar');
  const sumMeas = document.getElementById('modal-sum-meas');
  const sumPrice = document.getElementById('modal-sum-price');
  if (sumColor) sumColor.textContent = orderState.color || '—';
  if (sumCollar) sumCollar.textContent = orderState.collar || '—';
  if (sumMeas) sumMeas.textContent = toAr(orderState.height) + ' سم — ' + toAr(orderState.weight) + ' كيلو';
  if (sumPrice) sumPrice.textContent = toAr(S.basePrice) + ' ' + O.priceUnit;
  const overlay = document.getElementById('order-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
window.openOrderModal = openOrderModal;

function closeOrderModal() {
  const overlay = document.getElementById('order-modal-overlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}
window.closeOrderModal = closeOrderModal;

function validateStep4() {
  clearErr();
  let ok = true;
  if (!document.getElementById('input-name').value.trim()) { showErr('error-name'); ok = false; }
  if (!document.getElementById('input-phone').value.trim()) { showErr('error-phone'); ok = false; }
  if (ok) {
    orderState.name = document.getElementById('input-name').value.trim();
    orderState.phone = document.getElementById('input-phone').value.trim();
    submit();
  }
}

function showErr(id) { const e = document.getElementById(id); if (e) e.classList.add('show'); }
function clearErr() { document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('show')); }

// ---- SUMMARY ----
function updateSummary() {
  const O = CONTENT.order;
  const S = CONTENT.site;
  document.getElementById('sum-color').textContent = orderState.color || '—';
  document.getElementById('sum-collar').textContent = orderState.collar || '—';
  document.getElementById('sum-height').textContent = toAr(orderState.height) + ' ' + O.heightUnit;
  document.getElementById('sum-weight').textContent = toAr(orderState.weight) + ' ' + O.weightUnit;
  document.getElementById('sum-shoe').textContent = toAr(orderState.shoeSize) + ' ' + O.shoeSizeUnit;
  document.getElementById('sum-body').textContent = orderState.bodyShape || '—';
}

// ---- SUBMIT ----
async function submit() {
  const ref = Math.floor(100000 + Math.random() * 900000);

  // Lazy-load Supabase so a CDN failure never blocks page load
  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    const supabase = createClient(
      'https://mwcmfzzukqiutztkgagg.supabase.co',
      'sb_publishable_8zuxMDAcYGIozcmi8CS8sg_ZnjLmb6V'
    );
    const { error } = await supabase
      .from('orders')
      .insert([{
        order_number: String(ref),
        name: orderState.name,
        phone: orderState.phone,
        city: orderState.city,
        color: orderState.color,
        collar: orderState.collar,
        height: String(orderState.height),
        weight: String(orderState.weight),
        shoe_size: String(orderState.shoeSize),
        body_type: orderState.bodyShape,
        fit_preference: orderState.fitPreference,
      }]);
    if (error) console.error('Error saving order:', error);
    else { console.log('Order saved successfully'); gtag('event', 'order_submitted', { event_category: 'conversion' }); }
  } catch (e) {
    console.error('Supabase unavailable:', e);
  }

  showScreen(6);

  // Animate ref counter
  const refEl = document.getElementById('order-ref');
  let cur = 0;
  const step = Math.ceil(ref / 50);
  const timer = setInterval(() => {
    cur += step;
    if (cur >= ref) { cur = ref; clearInterval(timer); }
    refEl.textContent = '#' + String(cur).padStart(6, '0');
  }, 16);

  // WhatsApp
  const S = CONTENT.site;
  const msg = `ياهلا، رقم طلبي #${ref}`;
  document.getElementById('confirm-wa-btn').href = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  document.getElementById('confirm-wa-btn').addEventListener('click', () => {
    gtag('event', 'whatsapp_click', { event_category: 'engagement' });
  });

  setTimeout(() => { document.getElementById('confirm-wa-btn').classList.add('pulse'); }, 1200);
}

// ---- HELPERS ----
function toAr(n) { return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); }

// ---- FOOTER PRICE ----
function updateFooterPrice() {
  const el = document.getElementById('footer-price');
  if (!el) return;
  const S = CONTENT.site;
  const O = CONTENT.order;
  el.textContent = toAr(S.basePrice) + ' ' + O.priceUnit;
}

// ---- TOOLTIPS ----
const tooltips = {
  height: {
    title: 'لماذا نسأل عن طولك؟',
    body: 'طولك يساعدنا نحدد الطول الصحيح للثوب والكم بدقة تامة.'
  },
  weight: {
    title: 'لماذا نسأل عن وزنك؟',
    body: 'وزنك مع شكل الجسم يساعدنا نضبط اتساع الثوب على اكتافك وخصرك.'
  },
  shoeSize: {
    title: 'لماذا نسأل عن مقاس حذاءك؟',
    body: 'قدمك بنفس طول ساعدك — جرب وشوف! نستخدم مقاس الحذاء كقياس إضافي يساعدنا نطلع لك مقاس أدق بدون ما تحتاج شريط قياس.'
  }
};

function showTooltip(type) {
  const data = tooltips[type];
  if (!data) return;
  document.getElementById('tooltip-title').textContent = data.title;
  document.getElementById('tooltip-body').textContent = data.body;
  document.getElementById('tooltip-overlay').classList.add('active');
  document.getElementById('tooltip-sheet').classList.add('active');
}

function closeTooltip() {
  document.getElementById('tooltip-overlay').classList.remove('active');
  document.getElementById('tooltip-sheet').classList.remove('active');
}

// ---- EXPOSE FUNCTIONS TO WINDOW (for inline onclick handlers in module mode) ----
function handleSubmit() {
  clearErr();
  let ok = true;
  const nameEl = document.getElementById('input-name');
  const phoneEl = document.getElementById('input-phone');
  if (!nameEl || !nameEl.value.trim()) { showErr('error-name'); ok = false; }
  if (!phoneEl || !phoneEl.value.trim()) { showErr('error-phone'); ok = false; }
  if (ok) {
    orderState.name = nameEl.value.trim();
    orderState.phone = phoneEl.value.trim();
    closeOrderModal();
    submit();
  }
}

window.showScreen = showScreen;
window.validateStep1 = validateStep1;
window.validateStep2 = validateStep2;
window.validateStep3 = validateStep3;
window.validateStep4 = validateStep4;
window.handleSubmit = handleSubmit;
window.goToStep = goToStep;
window.showTooltip = showTooltip;
window.closeTooltip = closeTooltip;
