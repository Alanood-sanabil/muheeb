// ============================================================
//  MUHEEB — ORDER FLOW (4-step + landing + confirmation)
//  Supabase is imported lazily inside submit() to avoid blocking
//  the module load if the CDN is slow or unavailable.
// ============================================================

const orderState = { color: null, collar: null, height: 170, weight: 80, shoeSize: 42, bodyShape: null, name: null, phone: null, city: null };
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
});

// ---- POPULATE ----
function populate() {
  const O = CONTENT.order;
  const S = CONTENT.site;

  // Landing
  document.getElementById('order-sub').textContent = O.landingSub;
  document.getElementById('order-landing-cta').textContent = O.landingCta;


  // Slider labels
  document.getElementById('s-height-label').textContent = O.heightLabel;
  document.getElementById('s-weight-label').textContent = O.weightLabel;
  document.getElementById('s-shoe-label').textContent = O.shoeSizeLabel;
  document.getElementById('s-height-val').textContent = toAr(170) + ' ' + O.heightUnit;
  document.getElementById('s-weight-val').textContent = toAr(80) + ' ' + O.weightUnit;
  document.getElementById('s-shoe-val').textContent = toAr(42) + ' ' + O.shoeSizeUnit;

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
  document.getElementById('sum-shoe-label').textContent = O.summaryLabels.shoeSize;
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
  buildColorSwatches();
  buildCollarCards();
  buildShapeCards();
}

const swatchBg = { white: '#FFFFFF', yellow: '#FAF3DC' };

function buildColorSwatches() {
  const container = document.getElementById('color-swatches');
  const heroImg = document.getElementById('step1-hero-img');
  const nameEl = document.getElementById('selected-color-name');
  const colors = CONTENT.order.colors;

  // Default: first color pre-selected
  orderState.color = colors[0].label;
  if (nameEl) nameEl.textContent = colors[0].label;
  if (heroImg) heroImg.src = colors[0].image;

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

      if (heroImg) {
        heroImg.style.opacity = '0';
        setTimeout(() => {
          heroImg.src = color.image;
          heroImg.style.opacity = '1';
        }, 200);
      }
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
    btn = document.getElementById('submit-btn');
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
  // Hide all screens via class only (CSS !important handles display)
  document.querySelectorAll('.screen').forEach(function(s) {
    s.classList.remove('active');
  });

  // Show target screen
  const target = document.getElementById('screen-' + n);
  if (target) target.classList.add('active');

  currentScreen = n;

  // Update progress
  updateProgress(n);

  // Toggle sticky footer — only visible on step 4 (screen 5)
  const stickyFooter = document.getElementById('sticky-footer');
  if (stickyFooter) stickyFooter.classList.toggle('visible', n === 5);

  // Update summary and footer price on step 4
  if (n === 5) updateSummary();
  if (n === 5) updateFooterPrice();

  // Update button state for the arriving step
  if (n === 2) updateBtn(1);
  if (n === 4) updateBtn(3);
  if (n === 5) updateBtn(4);
}

function goToStep(stepNum) {
  showScreen(stepNum + 1);
}

// ---- PROGRESS BAR ----
function updateProgress(screenNumber) {
  const container = document.getElementById('progress-container');
  if (!container) return;

  // Hide on landing and confirmation
  if (screenNumber === 1 || screenNumber === 6) {
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    return;
  }

  container.style.opacity = '1';
  container.style.pointerEvents = '';

  // screenNumber 2 = step 1, 3 = step 2, 4 = step 3, 5 = step 4
  const activeStep = screenNumber - 1;

  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('step-dot-' + i);
    if (!dot) continue;

    dot.classList.remove('active', 'completed', 'clickable');

    if (i < activeStep) {
      dot.classList.add('completed', 'clickable');
      dot.style.cursor = 'pointer';
      dot.onclick = (function(stepIndex) {
        return function() { showScreen(stepIndex + 1); };
      })(i);
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
  document.getElementById('sum-shoe').textContent = toAr(orderState.shoeSize) + ' ' + O.shoeSizeUnit;
  document.getElementById('sum-body').textContent = orderState.bodyShape || '—';
  document.getElementById('sum-price').textContent = toAr(S.basePrice) + ' ' + O.priceUnit;
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
      }]);
    if (error) console.error('Error saving order:', error);
    else console.log('Order saved successfully');
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
  const O = CONTENT.order;
  const S = CONTENT.site;
  const msg = [
    `طلب جديد من ${S.name}:`,
    `${O.summaryLabels.color}: ${orderState.color}`,
    `${O.summaryLabels.collar}: ${orderState.collar}`,
    `${O.summaryLabels.height}: ${orderState.height} ${O.heightUnit}`,
    `${O.summaryLabels.weight}: ${orderState.weight} ${O.weightUnit}`,
    `${O.summaryLabels.shoeSize}: ${orderState.shoeSize} ${O.shoeSizeUnit}`,
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

// ---- FOOTER PRICE ----
function updateFooterPrice() {
  const el = document.getElementById('footer-price');
  if (!el) return;
  const S = CONTENT.site;
  const O = CONTENT.order;
  el.textContent = toAr(S.basePrice) + ' ' + O.priceUnit;
}

// ---- EXPOSE FUNCTIONS TO WINDOW (for inline onclick handlers in module mode) ----
window.showScreen = showScreen;
window.validateStep1 = validateStep1;
window.validateStep2 = validateStep2;
window.validateStep3 = validateStep3;
window.validateStep4 = validateStep4;
window.handleSubmit = validateStep4;
window.goToStep = goToStep;
