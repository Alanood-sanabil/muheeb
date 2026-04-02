// ============================================================
//  MUHEEB — LANDING PAGE LOGIC
//  Reads all text from CONTENT (content/content.js)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  populateContent();
  buildNavLinks();
  buildMobileLinks();
  buildSteps();
  buildStats();
  buildFooterLinks();
  buildScrollingImages();
  initNavbarScroll();
  initMobileMenu();
  initStatCounters();
  initReveal();
});

// --- POPULATE STATIC CONTENT ---
function populateContent() {
  const C = CONTENT;

  // Header logo
  document.getElementById('nav-logo').textContent = C.site.name;

  // Hero headline
  const h1 = document.getElementById('hero-headline');
  h1.innerHTML = C.hero.headline.map(line =>
    line === '' ? '<span class="line line-spacer"></span>' : `<span class="line">${line}</span>`
  ).join('');

  // Double column — about quote + body
  document.getElementById('about-quote').textContent = C.about.pullQuote;
  const aboutBody = document.getElementById('about-body');
  aboutBody.textContent = C.about.paragraphs.join(' ');

  // Image grid labels
  document.getElementById('img-label-1').textContent = C.imageGrid.label1;
  document.getElementById('img-label-2').textContent = C.imageGrid.label2;
  document.getElementById('img-label-3').textContent = C.imageGrid.label3;

  // Text section — hero subtext as centered quote
  document.getElementById('hero-subtext').textContent = C.hero.subtext;

  // Services text — second paragraph
  document.getElementById('about-paragraph').textContent = C.about.paragraphs[1] || C.about.paragraphs[0];
  document.getElementById('brand-sig').textContent = C.site.name;

  // Text 3 images — wide image text
  document.getElementById('wide-headline').textContent = C.wideImage.headline;
  document.getElementById('wide-sub').textContent = C.wideImage.sub;

  // How it works
  document.getElementById('how-headline').textContent = C.how.headline;

  // Final CTA
  document.getElementById('final-sub').textContent = C.finalCta.subtext;
  document.getElementById('final-headline').textContent = C.finalCta.headline;
  const ctaPrimary = document.getElementById('final-cta-primary');
  ctaPrimary.textContent = C.finalCta.primaryBtn.label;
  ctaPrimary.href = C.finalCta.primaryBtn.href;
  document.getElementById('final-note').textContent = C.finalCta.note;

  // Footer
  document.getElementById('footer-logo').textContent = C.site.name;
  document.getElementById('footer-tagline').textContent = C.site.tagline;
  document.getElementById('footer-copyright').textContent = C.footer.copyright;
  document.getElementById('footer-sub').textContent = C.footer.sub;

  // Footer WhatsApp
  const waLink = document.getElementById('footer-whatsapp-link');
  waLink.href = `https://wa.me/${C.site.whatsapp}`;
  waLink.textContent = C.site.whatsapp.replace('966', '966 ');
}

// --- BUILD NAV LINKS ---
function buildNavLinks() {
  const container = document.getElementById('nav-links');
  CONTENT.nav.links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    container.appendChild(a);
  });
}

// --- BUILD MOBILE LINKS ---
function buildMobileLinks() {
  const container = document.getElementById('mobile-links');
  CONTENT.nav.links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.addEventListener('click', closeMobileMenu);
    container.appendChild(a);
  });
}

// --- BUILD FOOTER LINKS ---
function buildFooterLinks() {
  const container = document.getElementById('footer-links');
  CONTENT.footer.links.forEach(link => {
    const a = document.createElement('a');
    a.textContent = link.label;
    a.href = link.href;
    container.appendChild(a);
  });
}

// --- BUILD STEPS (accordion style) ---
function buildSteps() {
  const container = document.getElementById('steps-container');
  CONTENT.steps.forEach(step => {
    const item = document.createElement('div');
    item.className = 'step-item reveal';
    item.innerHTML = `
      <div class="step-header">
        <span class="step-number">${step.number}</span>
        <span class="step-title">${step.title}</span>
      </div>
      <div class="step-body">${step.body}</div>
    `;
    container.appendChild(item);
  });
}

// --- BUILD STATS ---
function buildStats() {
  const container = document.getElementById('stats-grid');
  CONTENT.stats.forEach(stat => {
    const div = document.createElement('div');
    div.className = 'stat reveal';
    div.innerHTML = `
      <div>
        <span class="stat-number" data-target="${stat.number}">0</span>
        <span class="stat-unit">${stat.unit}</span>
      </div>
      <p class="stat-label">${stat.label}</p>
    `;
    container.appendChild(div);
  });
}

// --- BUILD SCROLLING IMAGES ---
function buildScrollingImages() {
  const topTrack = document.getElementById('scroll-track-top');
  const bottomTrack = document.getElementById('scroll-track-bottom');

  const topImages = [
    { bg: 'var(--img-1)' },
    { bg: 'var(--img-2)' },
    { bg: 'var(--img-3)' },
    { bg: 'var(--img-step-1)' },
    { bg: 'var(--img-step-2)' },
    { bg: 'var(--img-step-3)' },
    { bg: 'var(--img-wide)' },
  ];

  const bottomImages = [
    { bg: 'var(--img-step-3)' },
    { bg: 'var(--img-1)' },
    { bg: 'var(--img-step-1)' },
    { bg: 'var(--img-3)' },
    { bg: 'var(--img-2)' },
    { bg: 'var(--img-step-2)' },
    { bg: 'var(--img-wide)' },
  ];

  const createImages = (images, track) => {
    const all = [...images, ...images];
    all.forEach(img => {
      const div = document.createElement('div');
      div.className = 'scroll-img';
      div.style.backgroundColor = img.bg;
      track.appendChild(div);
    });
  };

  createImages(topImages, topTrack);
  createImages(bottomImages, bottomTrack);
}

// --- NAVBAR SCROLL ---
function initNavbarScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// --- MOBILE MENU ---
function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  const closeBtn = document.getElementById('mobile-close');

  hamburger.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.style.overflow = '';
}

// --- STAT COUNTER ANIMATION ---
function initStatCounters() {
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1400;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current;
    }, 16);
  });
}

// --- SCROLL REVEAL ---
function initReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}
