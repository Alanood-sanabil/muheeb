import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://mwcmfzzukqiutztkgagg.supabase.co',
  'sb_publishable_8zuxMDAcYGIozcmi8CS8sg_ZnjLmb6V'
)

// ============================================================
//  MUHEEB — ORDER FLOW (4-step + landing + confirmation)
// ============================================================

const orderState = { color: null, collar: null, height: 170, weight: 80, bodyShape: null, name: null, phone: null, city: null };
let currentScreen = 1;

document.addEventListener('DOMContentLoaded', () => {
  populate();
  buildCards();
  initSliders();
  attachInputWatchers();
  const bar = document.getElementById('tab-bar');
  if (bar) bar.style.display = 'none';
  showScreen(1);
});

// ---- POPULATE ----
function populate() {
  const O = CONTENT.order;
  const S = CONTENT.site;

  // Landing
  document.getElementById('order-sub').textContent = O.landingSub;
  document.getElementById('order-landing-cta').textContent = O.landingCta;

  // Tab labels
  O.tabs.forEach((label, i) => {
    document.getElementById('tab-' + (i + 1)).querySelector('span').textContent = label;
  });

  // Slider labels
  document.getElementById('s-height-label').textContent = O.heightLabel;
  document.getElementById('s-weight-label').textContent = O.weightLabel;
  document.getElementById('s-height-val').textContent = toAr(170) + ' ' + O.heightUnit;
  document.getElementById('s-weight-val').textContent = toAr(80) + ' ' + O.weightUnit;

  // Contact
  document.getElementById('name-label').textContent = O.nameLabel;
  document.getElementById('input-name').placeholder = O.namePlaceholder;
  document.getElementById('phone-label').textContent = O.phoneLabel;
  document.getElementById('input-phone').placeholder = O.phonePlaceholder;
  document.getElementById('city-label').textContent = O.cityLabel;
  const sel = document.getElementById('input-city');
  O.cities.forEach((c, i) => {
    const o = document.createElement('option');
    o.value = i === 0 ? '' : c;
    o.textContent = c;
    sel.appendChild(o);
  });

  // Summary
  document.getElementById('summary-title').textContent = O.summaryTitle;
  document.getElementById('sum-grp-thoob').textContent = O.summaryGroups.thoob;
  document.getElementById('sum-grp-meas').textContent = O.summaryGroups.measurements;
  document.getElementById('sum-grp-body').textContent = O.summaryGroups.body;
  document.getElementById('sum-color-label').textContent = O.summaryLabels.color;
  document.getElementById('sum-collar-label').textContent = O.summaryLabels.collar;
  document.getElementById('sum-height-label').textContent = O.summaryLabels.height;
  document.getElementById('sum-weight-label').textContent = O.summaryLabels.weight;
  document.getElementById('sum-body-label').textContent = O.summaryLabels.bodyType;
  document.getElementById('sum-price-label').textContent = O.summaryLabels.price;

  // Edit links
  document.querySelectorAll('.sum-edit').forEach(a => { a.textContent = O.editLabel; });

  // Confirmation
  document.getElementById('confirm-title').textContent = O.confirmTitle;
  document.getElementById('confirm-sub').textContent = O.confirmSub;
  document.getElementById('confirm-ref-label').textContent = O.confirmRefLabel;
  document.getElementById('confirm-wa-text').textContent = O.confirmWhatsapp;
}

// ---- BUILD CARDS ----
function buildCards() {
  buildColorCards();
  buildCollarCards();
  buildShapeCards();
}

function buildColorCards() {
  const c = document.getElementById('color-cards');
  CONTENT.order.colors.forEach(color => {
    const d = mk('card card-color', color.label);
    d.innerHTML = `<div class="card-ck"></div><img src="${color.image}" alt="${color.label}" class="color-thob-img"><div class="card-label">${color.label}</div>`;
    d.onclick = () => pick('color', d, c, 1);
    c.appendChild(d);
  });
}

function buildCollarCards() {
  const c = document.getElementById('collar-cards');
  CONTENT.order.collars.forEach(col => {
    const d = mk('card', col.label);
    d.classList.add('collar-card');
    const img = col.id === 'qalabi'
      ? '<img src="images/collar-removebg-preview.png" alt="قلابي">'
      : '<img src="images/no-collar-removebg-preview.png" alt="بدون قلابي">';
    d.innerHTML = `<div class="card-ck"></div>${img}<div class="card-label">${col.label}</div>`;
    d.onclick = () => pick('collar', d, c, 1);
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
  const c = document.getElementById('input-city');
  [n, p].forEach(inp => inp.addEventListener('input', () => updateBtn(4)));
  c.addEventListener('change', () => updateBtn(4));

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
  } else if (step === 4) {
    btn = document.getElementById('btn-next-4');
    ready = document.getElementById('input-name').value.trim()
         && document.getElementById('input-phone').value.trim()
         && document.getElementById('input-city').value;
    readyText = 'أرسل الطلب';
  }
  if (!btn) return;
  if (ready) { btn.classList.add('ready'); btn.textContent = readyText; }
  else { btn.classList.remove('ready'); btn.textContent = step === 4 ? 'أرسل الطلب' : 'اختر جميع الخيارات'; }
}

// ---- SCREEN NAV ----
function showScreen(n) {
  const prev = document.getElementById('screen-' + currentScreen);
  const next = document.getElementById('screen-' + n);

  if (prev && prev !== next) {
    prev.classList.add('leaving');
    prev.addEventListener('animationend', function h() {
      prev.classList.remove('active', 'leaving');
      prev.removeEventListener('animationend', h);
    });
  }

  currentScreen = n;
  next.classList.add('active', 'entering');
  next.addEventListener('animationend', function h() {
    next.classList.remove('entering');
    next.removeEventListener('animationend', h);
  });

  // Tab bar: visible on screens 2-5 (steps 1-4), hidden on landing (1) and confirmation (6)
  const bar = document.getElementById('tab-bar');
  if (n >= 2 && n <= 5) {
    bar.classList.add('visible');
    bar.style.display = 'flex';
    updateTabs(n - 1); // step = screen - 1
  } else {
    bar.classList.remove('visible');
    bar.style.display = 'none';
  }

  if (n === 5) updateSummary();
  // Update button state for the arriving step
  if (n === 2) updateBtn(1);
  if (n === 4) updateBtn(3);
  if (n === 5) updateBtn(4);
}

function goToStep(stepNum) {
  showScreen(stepNum + 1);
}

// ---- TABS ----
function updateTabs(activeStep) {
  for (let i = 1; i <= 4; i++) {
    const tab = document.getElementById('tab-' + i);
    tab.classList.remove('active', 'completed');
    tab.onclick = null;
    tab.style.cursor = 'default';

    if (i < activeStep) {
      tab.classList.add('completed');
      tab.style.cursor = 'pointer';
      tab.onclick = ((s) => () => goToStep(s))(i);
    } else if (i === activeStep) {
      tab.classList.add('active');
    }
  }
}

// ---- VALIDATION ----
function validateStep1() {
  clearErr();
  let ok = true;
  if (!orderState.color) { showErr('error-color'); ok = false; }
  if (!orderState.collar) { showErr('error-collar'); ok = false; }
  if (ok) showScreen(3);
}

function validateStep2() {
  // Sliders always have values, so always valid
  showScreen(4);
}

function validateStep3() {
  clearErr();
  if (!orderState.bodyShape) { showErr('error-body'); return; }
  showScreen(5);
}

function validateStep4() {
  clearErr();
  let ok = true;
  if (!document.getElementById('input-name').value.trim()) { showErr('error-name'); ok = false; }
  if (!document.getElementById('input-phone').value.trim()) { showErr('error-phone'); ok = false; }
  if (!document.getElementById('input-city').value) { showErr('error-city'); ok = false; }
  if (ok) {
    orderState.name = document.getElementById('input-name').value.trim();
    orderState.phone = document.getElementById('input-phone').value.trim();
    orderState.city = document.getElementById('input-city').value;
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
  document.getElementById('sum-body').textContent = orderState.bodyShape || '—';
  document.getElementById('sum-price').textContent = toAr(S.basePrice) + ' ' + O.priceUnit;
}

// ---- SUBMIT ----
async function submit() {
  const ref = Math.floor(100000 + Math.random() * 900000);

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
      body_type: orderState.bodyShape,
    }])

  if (error) {
    console.error('Error saving order:', error)
  } else {
    console.log('Order saved successfully')
  }

  document.getElementById('tab-bar').classList.remove('visible');
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
  const O = CONTENT.order;
  const S = CONTENT.site;
  const msg = [
    `طلب جديد من ${S.name}:`,
    `${O.summaryLabels.color}: ${orderState.color}`,
    `${O.summaryLabels.collar}: ${orderState.collar}`,
    `${O.summaryLabels.height}: ${orderState.height} ${O.heightUnit}`,
    `${O.summaryLabels.weight}: ${orderState.weight} ${O.weightUnit}`,
    `${O.summaryLabels.bodyType}: ${orderState.bodyShape}`,
    `الاسم: ${orderState.name}`,
    `الجوال: ${orderState.phone}`,
    `المدينة: ${orderState.city}`,
    `${O.summaryLabels.price}: ${S.basePrice} ${O.priceUnit}`,
    `رقم الطلب: #${ref}`,
  ].join('\n');
  document.getElementById('confirm-wa-btn').href = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;

  setTimeout(() => { document.getElementById('confirm-wa-btn').classList.add('pulse'); }, 1200);
}

// ---- HELPERS ----
function toAr(n) { return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); }

// ---- EXPOSE FUNCTIONS TO WINDOW (for inline onclick handlers in module mode) ----
window.showScreen = showScreen;
window.validateStep1 = validateStep1;
window.validateStep2 = validateStep2;
window.validateStep3 = validateStep3;
window.validateStep4 = validateStep4;
window.goToStep = goToStep;
