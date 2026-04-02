// ============================================================
//  MUHEEB — ORDER FLOW LOGIC
//  Reads all text from CONTENT (content/content.js)
// ============================================================

const orderState = {
  color: null,
  fabric: null,
  collar: null,
  height: null,
  weight: null,
  bodyType: null,
  name: null,
  phone: null,
  city: null,
};

let currentScreen = 1;

document.addEventListener('DOMContentLoaded', () => {
  populateOrderContent();
  buildOrderOptions();
  showScreen(1);
});

// --- POPULATE ORDER CONTENT ---
function populateOrderContent() {
  const O = CONTENT.order;
  const S = CONTENT.site;

  // Landing screen
  document.getElementById('order-logo').textContent = S.name;
  document.getElementById('order-tagline').textContent = S.tagline;
  document.getElementById('order-headline').textContent = O.landingHeadline;
  document.getElementById('order-sub').textContent = O.landingSub;
  document.getElementById('order-landing-cta').textContent = O.landingCta;

  // Badges
  const badgesContainer = document.getElementById('order-badges');
  O.landingBadges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge';
    div.innerHTML = `<div class="badge-icon">${b.icon}</div><div class="badge-label">${b.label}</div>`;
    badgesContainer.appendChild(div);
  });

  // Progress labels
  const labels = document.querySelectorAll('.progress-label');
  O.steps.forEach((stepLabel, i) => {
    if (labels[i]) labels[i].textContent = `${toArabicNum(i + 1)}. ${stepLabel}`;
  });

  // Step 1 titles
  document.getElementById('color-title').textContent = O.colorLabel;
  document.getElementById('fabric-title').textContent = O.fabricLabel;
  document.getElementById('fabric-sub').textContent = O.fabricSub;
  document.getElementById('collar-title').textContent = O.collarLabel;
  document.getElementById('step1-next').textContent = O.nextBtn;
  document.getElementById('step1-back').textContent = O.backBtn;

  // Step 2 titles
  document.getElementById('step2-intro').textContent = O.measurementsIntro;
  document.getElementById('height-label').textContent = O.heightLabel;
  document.getElementById('input-height').placeholder = O.heightPlaceholder;
  document.getElementById('height-unit').textContent = O.heightUnit;
  document.getElementById('height-helper').textContent = O.heightHelper;
  document.getElementById('weight-label').textContent = O.weightLabel;
  document.getElementById('input-weight').placeholder = O.weightPlaceholder;
  document.getElementById('weight-unit').textContent = O.weightUnit;
  document.getElementById('body-title').textContent = O.bodyTypeLabel;
  document.getElementById('body-sub').textContent = O.bodyTypeSubtext;
  document.getElementById('step2-next').textContent = O.nextBtn;
  document.getElementById('step2-back').textContent = O.backBtn;

  // Step 3 titles
  document.getElementById('name-label').textContent = O.nameLabel;
  document.getElementById('input-name').placeholder = O.namePlaceholder;
  document.getElementById('phone-label').textContent = O.phoneLabel;
  document.getElementById('input-phone').placeholder = O.phonePlaceholder;
  document.getElementById('phone-note').textContent = O.phoneNote;
  document.getElementById('city-label').textContent = O.cityLabel;
  document.getElementById('summary-title').textContent = O.summaryTitle;
  document.getElementById('step3-submit').textContent = O.submitBtn;
  document.getElementById('step3-back').textContent = O.backBtn;

  // City dropdown
  const citySelect = document.getElementById('input-city');
  O.cities.forEach((city, i) => {
    const opt = document.createElement('option');
    opt.value = i === 0 ? '' : city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });

  // Summary labels
  document.getElementById('sum-color-label').textContent = O.summaryLabels.color + ':';
  document.getElementById('sum-fabric-label').textContent = O.summaryLabels.fabric + ':';
  document.getElementById('sum-collar-label').textContent = O.summaryLabels.collar + ':';
  document.getElementById('sum-height-label').textContent = O.summaryLabels.height + ':';
  document.getElementById('sum-weight-label').textContent = O.summaryLabels.weight + ':';
  document.getElementById('sum-body-label').textContent = O.summaryLabels.bodyType + ':';
  document.getElementById('sum-price-label').textContent = O.summaryLabels.price + ':';

  // Confirmation
  document.getElementById('confirm-title').textContent = O.confirmTitle;
  document.getElementById('confirm-sub').textContent = O.confirmSub;
  document.getElementById('confirm-wa-btn').textContent = O.confirmWhatsapp;
}

// --- BUILD ORDER OPTIONS ---
function buildOrderOptions() {
  buildColorCards();
  buildFabricCards();
  buildCollarCards();
  buildBodyTypeCards();
}

function buildColorCards() {
  const container = document.getElementById('color-cards');
  CONTENT.order.colors.forEach(color => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = color.label;
    card.dataset.field = 'color';

    const borderStyle = color.hex === '#FFFFFF' ? `border: 1px solid var(--border)` : '';
    card.innerHTML = `
      <div class="color-circle" style="background:${color.hex}; ${borderStyle}"></div>
      <div class="card-label">${color.label}</div>
      <div class="card-sub">${color.sub}</div>
    `;
    card.addEventListener('click', () => selectCard('color', card, container));
    container.appendChild(card);
  });
}

function buildFabricCards() {
  const container = document.getElementById('fabric-cards');
  CONTENT.order.fabrics.forEach(fabric => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = fabric.label;
    card.dataset.field = 'fabric';
    card.dataset.upcharge = fabric.upcharge;

    const priceClass = fabric.upcharge > 0 ? 'price-tag gold' : 'price-tag';
    const priceText = fabric.upcharge > 0
      ? `+${toArabicNum(fabric.upcharge)} ${CONTENT.order.priceUnit}`
      : 'السعر الأساسي';

    card.innerHTML = `
      <div class="card-label">${fabric.label}</div>
      <div class="card-sub">${fabric.sub}</div>
      <span class="${priceClass}">${priceText}</span>
    `;
    card.addEventListener('click', () => selectCard('fabric', card, container));
    container.appendChild(card);
  });
}

function buildCollarCards() {
  const container = document.getElementById('collar-cards');
  CONTENT.order.collars.forEach(collar => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = collar.label;
    card.dataset.field = 'collar';

    // SVG icons
    const svg = collar.id === 'qalabi'
      ? `<svg class="collar-icon" width="60" height="50" viewBox="0 0 60 50"><path d="M10 40 L30 15 L50 40" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 40 L5 45" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M50 40 L55 45" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`
      : `<svg class="collar-icon" width="60" height="50" viewBox="0 0 60 50"><circle cx="30" cy="28" r="16" stroke="currentColor" stroke-width="2.5" fill="none"/></svg>`;

    card.innerHTML = `
      ${svg}
      <div class="card-label">${collar.label}</div>
      <div class="card-sub">${collar.sub}</div>
    `;
    card.addEventListener('click', () => selectCard('collar', card, container));
    container.appendChild(card);
  });
}

function buildBodyTypeCards() {
  const container = document.getElementById('body-cards');
  CONTENT.order.bodyTypes.forEach(bt => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.value = bt.label;
    card.dataset.field = 'bodyType';

    const svg = bt.id === 'slim'
      ? `<svg class="body-svg" width="60" height="90" viewBox="0 0 60 90">
           <circle class="body-shape" cx="30" cy="14" r="10"/>
           <rect class="body-shape" x="22" y="26" width="16" height="38" rx="6"/>
           <rect class="body-shape" x="22" y="64" width="7" height="22" rx="3"/>
           <rect class="body-shape" x="31" y="64" width="7" height="22" rx="3"/>
         </svg>`
      : `<svg class="body-svg" width="60" height="90" viewBox="0 0 60 90">
           <circle class="body-shape" cx="30" cy="14" r="11"/>
           <ellipse class="body-shape" cx="30" cy="48" rx="16" ry="22"/>
           <rect class="body-shape" x="19" y="64" width="9" height="22" rx="4"/>
           <rect class="body-shape" x="32" y="64" width="9" height="22" rx="4"/>
         </svg>`;

    card.innerHTML = `${svg}<div class="card-label">${bt.label}</div>`;
    card.addEventListener('click', () => selectCard('bodyType', card, container));
    container.appendChild(card);
  });
}

// --- SELECT CARD ---
function selectCard(field, card, container) {
  container.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  orderState[field] = card.dataset.value;
}

// --- SHOW SCREEN ---
function showScreen(n, back) {
  currentScreen = n;
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active', 'slide-back');
  });
  const target = document.getElementById('screen-' + n);
  if (back) target.classList.add('slide-back');
  target.classList.add('active');
  window.scrollTo(0, 0);

  // Update progress bar for screens 2-4
  if (n >= 2 && n <= 4) {
    updateProgress(n - 1); // step index 1-3
  }

  // Update summary when entering step 3
  if (n === 4) updateSummary();
}

// --- UPDATE PROGRESS BAR ---
function updateProgress(step) {
  document.querySelectorAll('.progress-seg').forEach((seg, i) => {
    seg.classList.toggle('filled', i < step);
  });
  document.querySelectorAll('.progress-label').forEach((label, i) => {
    label.classList.toggle('active', i === step - 1);
  });
}

// --- VALIDATION ---
function validateStep1() {
  clearErrors();
  let valid = true;

  if (!orderState.color)  { showError('error-color');  valid = false; }
  if (!orderState.fabric) { showError('error-fabric'); valid = false; }
  if (!orderState.collar) { showError('error-collar'); valid = false; }
  if (!valid) showError('error-step1');

  if (valid) showScreen(3);
}

function validateStep2() {
  clearErrors();
  let valid = true;

  const h = document.getElementById('input-height').value.trim();
  const w = document.getElementById('input-weight').value.trim();

  if (!h) { showError('error-height'); valid = false; }
  if (!w) { showError('error-weight'); valid = false; }
  if (!orderState.bodyType) { showError('error-body'); valid = false; }

  if (valid) {
    orderState.height = h;
    orderState.weight = w;
    showScreen(4);
  }
}

function validateStep3() {
  clearErrors();
  let valid = true;

  const n = document.getElementById('input-name').value.trim();
  const p = document.getElementById('input-phone').value.trim();
  const c = document.getElementById('input-city').value;

  if (!n) { showError('error-name');  valid = false; }
  if (!p) { showError('error-phone'); valid = false; }
  if (!c) { showError('error-city');  valid = false; }

  if (valid) {
    orderState.name = n;
    orderState.phone = p;
    orderState.city = c;
    handleSubmit();
  }
}

function showError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function clearErrors() {
  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('show'));
}

// --- UPDATE SUMMARY ---
function updateSummary() {
  const O = CONTENT.order;
  const S = CONTENT.site;

  document.getElementById('sum-color').textContent = orderState.color || '—';

  const fabricEl = document.getElementById('sum-fabric');
  if (orderState.fabric) {
    const selectedFabric = O.fabrics.find(f => f.label === orderState.fabric);
    if (selectedFabric && selectedFabric.upcharge > 0) {
      fabricEl.innerHTML = `${orderState.fabric} <span class="upcharge-badge">+${toArabicNum(selectedFabric.upcharge)} ${O.priceUnit}</span>`;
    } else {
      fabricEl.textContent = orderState.fabric;
    }
  } else {
    fabricEl.textContent = '—';
  }

  document.getElementById('sum-collar').textContent = orderState.collar || '—';
  document.getElementById('sum-height').textContent = orderState.height ? `${orderState.height} ${O.heightUnit}` : '—';
  document.getElementById('sum-weight').textContent = orderState.weight ? `${orderState.weight} ${O.weightUnit}` : '—';
  document.getElementById('sum-body').textContent = orderState.bodyType || '—';

  // Calculate price
  const upcharge = getUpcharge();
  const total = S.basePrice + upcharge;
  document.getElementById('sum-price').textContent = `${toArabicNum(total)} ${O.priceUnit}`;
}

function getUpcharge() {
  if (!orderState.fabric) return 0;
  const fabric = CONTENT.order.fabrics.find(f => f.label === orderState.fabric);
  return fabric ? fabric.upcharge : 0;
}

// --- HANDLE SUBMIT ---
function handleSubmit() {
  const ref = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('order-ref').textContent = `${CONTENT.order.confirmRefLabel}: #${ref}`;

  // Build WhatsApp message
  const O = CONTENT.order;
  const S = CONTENT.site;
  const total = S.basePrice + getUpcharge();
  const msg = [
    `طلب جديد من ${S.name}:`,
    `${O.summaryLabels.color}: ${orderState.color}`,
    `${O.summaryLabels.fabric}: ${orderState.fabric}`,
    `${O.summaryLabels.collar}: ${orderState.collar}`,
    `${O.summaryLabels.height}: ${orderState.height} ${O.heightUnit}`,
    `${O.summaryLabels.weight}: ${orderState.weight} ${O.weightUnit}`,
    `${O.summaryLabels.bodyType}: ${orderState.bodyType}`,
    `الاسم: ${orderState.name}`,
    `الجوال: ${orderState.phone}`,
    `المدينة: ${orderState.city}`,
    `${O.summaryLabels.price}: ${total} ${O.priceUnit}`,
    `رقم الطلب: #${ref}`,
  ].join('\n');

  const waLink = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(msg)}`;
  document.getElementById('confirm-wa-btn').href = waLink;

  showScreen(5);
}

// --- ARABIC NUMBERS ---
function toArabicNum(n) {
  return String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
}
