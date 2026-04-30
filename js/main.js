// ===== SHARED COMPONENTS =====

const path = window.location.pathname;
const segments = path.split('/').filter(Boolean);
let base = '';
if (segments.length === 0 || (segments.length === 1 && segments[0].endsWith('.html'))) {
  base = '';
} else {
  const dirCount = segments[segments.length - 1].endsWith('.html')
    ? segments.length - 1
    : segments.length;
  base = '../'.repeat(dirCount);
}

// ===== FAVICON =====
// Injected dynamically so a single change in main.js updates favicons site-wide
function injectFavicon() {
  // Remove any existing favicon links to avoid conflicts
  document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());

  const head = document.head;

  // Primary: SVG favicon with auto dark/light mode adaptation via internal CSS
  const svg = document.createElement('link');
  svg.rel = 'icon';
  svg.type = 'image/svg+xml';
  svg.href = base + 'images/favicon.svg';
  head.appendChild(svg);

  // Fallback PNG for older browsers
  const png32 = document.createElement('link');
  png32.rel = 'icon';
  png32.type = 'image/png';
  png32.setAttribute('sizes', '32x32');
  png32.href = base + 'images/favicon-32.png';
  head.appendChild(png32);

  const png16 = document.createElement('link');
  png16.rel = 'icon';
  png16.type = 'image/png';
  png16.setAttribute('sizes', '16x16');
  png16.href = base + 'images/favicon-16.png';
  head.appendChild(png16);

  // Apple touch icon
  const apple = document.createElement('link');
  apple.rel = 'apple-touch-icon';
  apple.setAttribute('sizes', '180x180');
  apple.href = base + 'images/apple-touch-icon.png';
  head.appendChild(apple);
}

// ===== NAV =====
function renderNav() {
  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.innerHTML = `<div class="ni">
<a class="nl" href="${base}index.html"><img src="${base}images/logo.png" alt="Dr Yousra El Khadri"></a>
<div class="nm" id="navLinks">
<a href="${base}index.html">Accueil</a>
<div class="dd">
  <a class="dd-trigger">Nos Services</a>
  <div class="ddm mega">
    <div class="mega-col">
      <h5>Injections</h5>
      <a href="${base}soins/injections/botox.html">Botox</a>
      <a href="${base}soins/injections/filler.html">Filler / Acide hyaluronique</a>
      <a href="${base}soins/injections/skinbooster.html">Skin Booster</a>
      <a href="${base}soins/injections/dissoudre-filler.html">Dissolution de filler</a>
    </div>
    <div class="mega-col">
      <h5>Stimulation collagène</h5>
      <a href="${base}soins/stimulation-collagene/sculptura.html">Sculptura</a>
      <a href="${base}soins/stimulation-collagene/radiesse.html">Radiesse</a>
      <a href="${base}soins/stimulation-collagene/harmonica.html">Harmonica</a>
    </div>
    <div class="mega-col">
      <h5>Soins du visage</h5>
      <a href="${base}soins/soins-visage/hydrafacial.html">Hydrafacial</a>
      <a href="${base}soins/soins-visage/microneedling.html">Microneedling</a>
      <a href="${base}soins/soins-visage/peeling.html">Peeling</a>
      <a href="${base}soins/soins-visage/exosomes.html">Exosomes</a>
      <a href="${base}soins/soins-visage/baby-lips.html">Baby Lips</a>
    </div>
    <div class="mega-col">
      <h5>Corps & Laser</h5>
      <a href="${base}soins/soins-corps/lipolyse.html">Lipolyse</a>
      <a href="${base}soins/soins-corps/peeling-corps.html">Peeling corps</a>
      <a href="${base}soins/laser/laser-medical.html">Laser médical</a>
      <a href="${base}soins/laser/detatouage.html">Détatouage laser</a>
    </div>
  </div>
</div>
<div class="dd">
  <a class="dd-trigger">Vos Besoins</a>
  <div class="ddm simple">
    <a href="${base}besoins/rajeunir.html">Rajeunir le visage</a>
    <a href="${base}besoins/levres.html">Repulper les lèvres</a>
    <a href="${base}besoins/rides.html">Traiter les rides</a>
    <a href="${base}besoins/taches.html">Effacer les taches</a>
    <a href="${base}besoins/texture.html">Améliorer la texture</a>
    <a href="${base}besoins/affiner.html">Affiner visage / corps</a>
    <a href="${base}besoins/tatouage.html">Enlever un tatouage</a>
    <a href="${base}besoins/mariage.html">Préparation mariage</a>
  </div>
</div>
<a href="${base}avant-apres.html">Avant / Après</a>
<a href="${base}partenaires.html">Partenaires</a>
<a href="${base}a-propos.html">À Propos</a>
<a href="${base}index.html#contact-sec" class="nav-cta">Rendez-vous</a>
</div>
<button class="mt" id="menuToggle" aria-label="Menu"><span></span><span></span><span></span></button>
</div>`;
  document.body.prepend(nav);
}

// ===== FOOTER BAR =====
function renderFooterBar() {
  const bar = document.createElement('div');
  bar.className = 'fbar';
  bar.innerHTML = `
<a href="tel:+212660148108" aria-label="Téléphone"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 10C18.5 10 20 10.5 21 13l1 2.5c.5 1.5 0 2.5-1.2 3.3l-1.3 1c-.5.4-.5 1.2 0 2 1.5 2.7 4 5.2 6.7 6.7.8.5 1.6.5 2 0l1-1.3c.8-1.2 1.8-1.7 3.3-1.2l2.5 1c2.5 1 3 2.5 3 2.5s0 2.5-1.5 4.5-4 3-7.5 2c-5-1.5-10-5.5-13.5-10.5S10.5 16 11 13c.5-3 2.5-4 6.5-3z"/></g></svg></a>
<a href="https://wa.me/212660148108" aria-label="WhatsApp"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6C14.1 6 6 14.1 6 24c0 4 1.3 7.7 3.5 10.7L7 42l7.5-2.4c2.8 1.7 6 2.6 9.5 2.6 9.9 0 18-8.1 18-18S33.9 6 24 6z"/><path d="M18 16.5c.5-1 1.5-1.5 2-1l1.5 1.5c.5.5.5 1.5 0 2l-1 1c-.3.3-.3.8 0 1.3 1 1.9 2.7 3.7 4.7 4.9.5.3 1 .3 1.3 0l1-1c.5-.5 1.5-.5 2 0l1.5 1.5c.5.5 0 1.5-1 2-1.5.8-3.5.8-6-.7s-4.5-3.5-6-6-1.5-4.5 0-6z"/></g></svg></a>
<a href="https://www.instagram.com/dr.yousra.elkhadri/" target="_blank" aria-label="Instagram"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="32" height="32" rx="9"/><circle cx="24" cy="24" r="8.5"/><circle cx="34" cy="14" r="1.8" fill="currentColor" stroke="none" opacity=".6"/></g></svg></a>
<a href="https://www.tiktok.com/@dryousraelkhadri" target="_blank" aria-label="TikTok"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6v24c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8v-6c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14V18c2.5 2 5.5 3.2 8 3.5v-6c-4.5-.5-8-4.5-8-9.5h-6z" stroke-width="0"/></g></svg></a>`;
  document.body.appendChild(bar);
}

function renderStaticFooter() {
  const footer = document.createElement('footer');
  footer.className = 'sfooter';
  footer.innerHTML = `<div class="sfin"><p>&copy; 2026 Dr Yousra El Khadri · Médecine Esthétique à Casablanca</p></div>`;
  const fbar = document.querySelector('.fbar');
  if (fbar) document.body.insertBefore(footer, fbar);
  else document.body.appendChild(footer);
}

function renderWhatsApp() {
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/212660148108';
  wa.className = 'waf';
  wa.setAttribute('aria-label', 'WhatsApp');
  wa.innerHTML = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(wa);
}

function initShared() {
  renderNav();
  renderFooterBar();
  renderStaticFooter();
  renderWhatsApp();

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navLinks');
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a:not(.dd-trigger)').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.querySelectorAll('.dd').forEach(d => d.classList.remove('mob-open'));
    });
  });

  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    }
  });

  document.querySelectorAll('.dd>.dd-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        e.stopPropagation();
        const parent = trigger.parentElement;
        const wasOpen = parent.classList.contains('mob-open');
        document.querySelectorAll('.dd').forEach(d => d.classList.remove('mob-open'));
        if (!wasOpen) parent.classList.add('mob-open');
      }
    });
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(x => { if (x.isIntersecting) x.target.classList.add('v'); });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  document.querySelectorAll('.fq').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });

  initCabinetLightbox();
  initBeforeAfterSliders();
}

// ===== BEFORE/AFTER SLIDERS =====
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.ba-slider');
  if (sliders.length === 0) return; // Only on avant-apres.html

  const hint = document.getElementById('baHint');
  let globalInteracted = false; // For hint visibility (any slider)

  function hideHintIfVisible() {
    if (!globalInteracted && hint) {
      globalInteracted = true;
      hint.classList.add('ba-hint-hidden');
    }
  }

  sliders.forEach(slider => {
    const clip = slider.querySelector('.ba-clip');
    const line = slider.querySelector('.ba-line');
    let pos = 50; // Percentage 0-100
    let interacted = false; // Per-slider flag for pulse + scroll-anim
    let pulseTimer = null;
    let scrollAnimRaf = null;

    function setPos(p, instant = false) {
      pos = Math.max(0, Math.min(100, p));
      const inverted = 100 - pos;
      if (instant) {
        clip.style.transition = 'none';
        line.style.transition = 'none';
      } else {
        clip.style.transition = 'clip-path .3s cubic-bezier(.22,1,.36,1)';
        line.style.transition = 'left .3s cubic-bezier(.22,1,.36,1)';
      }
      clip.style.clipPath = `inset(0 ${inverted}% 0 0)`;
      line.style.left = pos + '%';
      slider.dataset.pos = pos.toFixed(1);
    }

    function startPulseTimer() {
      if (interacted) return;
      pulseTimer = setTimeout(() => {
        if (!interacted) slider.classList.add('ba-pulse');
      }, 2000);
    }

    function markInteracted() {
      if (interacted) return;
      interacted = true;
      slider.classList.remove('ba-pulse');
      clearTimeout(pulseTimer);
      // Cancel any running scroll animation
      if (scrollAnimRaf) {
        cancelAnimationFrame(scrollAnimRaf);
        scrollAnimRaf = null;
      }
      hideHintIfVisible();
    }

    // Compute position from clientX
    function getPosFromX(clientX) {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      return (x / rect.width) * 100;
    }

    let dragging = false;

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
      e.preventDefault();
      markInteracted();
      dragging = true;
      slider.classList.add('ba-grabbing');
      setPos(getPosFromX(e.clientX), true);
    });

    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      setPos(getPosFromX(e.clientX), true);
    });

    document.addEventListener('mouseup', () => {
      if (dragging) {
        dragging = false;
        slider.classList.remove('ba-grabbing');
      }
    });

    // Touch events
    slider.addEventListener('touchstart', (e) => {
      markInteracted();
      dragging = true;
      slider.classList.add('ba-grabbing');
      setPos(getPosFromX(e.touches[0].clientX), true);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      e.preventDefault(); // Prevent page scroll while dragging slider
      setPos(getPosFromX(e.touches[0].clientX), true);
    }, { passive: false });

    slider.addEventListener('touchend', () => {
      dragging = false;
      slider.classList.remove('ba-grabbing');
    });

    // Keyboard navigation when focused
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        markInteracted();
        setPos(pos - 5);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        markInteracted();
        setPos(pos + 5);
      } else if (e.key === 'Home') {
        e.preventDefault();
        markInteracted();
        setPos(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        markInteracted();
        setPos(100);
      }
    });

    // Initialize position
    setPos(50, true);
    startPulseTimer();
  });

  // Intersection observer for scroll-triggered preview animation
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const slider = entry.target;
      // Only animate if not yet interacted
      if (slider.dataset.scrollAnimated === '1') return;
      slider.dataset.scrollAnimated = '1';
      // Don't start if user has interacted
      if (slider.classList.contains('ba-grabbing')) return;
      animateSliderPreview(slider);
    });
  }, { threshold: 0.4 });

  sliders.forEach(s => obs.observe(s));
}

function animateSliderPreview(slider) {
  const clip = slider.querySelector('.ba-clip');
  const line = slider.querySelector('.ba-line');
  if (!clip || !line) return;

  const duration = 1800;
  const start = performance.now();
  // Keyframes: 50 -> 65 -> 35 -> 50
  const keyframes = [
    { t: 0, v: 50 },
    { t: 0.33, v: 65 },
    { t: 0.66, v: 35 },
    { t: 1, v: 50 }
  ];
  // Cubic ease-in-out
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function getValue(progress) {
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].t && progress <= keyframes[i + 1].t) {
        const local = (progress - keyframes[i].t) / (keyframes[i + 1].t - keyframes[i].t);
        const eased = ease(local);
        return keyframes[i].v + (keyframes[i + 1].v - keyframes[i].v) * eased;
      }
    }
    return 50;
  }

  function step(now) {
    // Stop if user started interacting
    if (slider.classList.contains('ba-grabbing')) return;
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const v = getValue(progress);
    clip.style.transition = 'none';
    line.style.transition = 'none';
    clip.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    line.style.left = v + '%';
    slider.dataset.pos = v.toFixed(1);
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ===== CABINET MOSAIC LIGHTBOX =====
function initCabinetLightbox() {
  const lb = document.getElementById('cmLightbox');
  if (!lb) return; // Only on a-propos.html

  const items = Array.from(document.querySelectorAll('.cm-item'));
  if (items.length === 0) return;

  const imgEl = lb.querySelector('.cm-lb-img');
  const captionEl = lb.querySelector('.cm-lb-caption');
  const btnClose = lb.querySelector('.cm-lb-close');
  const btnPrev = lb.querySelector('.cm-lb-prev');
  const btnNext = lb.querySelector('.cm-lb-next');

  // Build a list from the items in DOM order (signature first, then 4 vignettes)
  const photos = items.map(item => {
    const img = item.querySelector('img');
    return { src: img.src, alt: img.alt };
  });

  let currentIdx = 0;
  let lastFocused = null;

  function show(idx) {
    currentIdx = (idx + photos.length) % photos.length;
    imgEl.src = photos[currentIdx].src;
    imgEl.alt = photos[currentIdx].alt;
    captionEl.textContent = photos[currentIdx].alt;
  }

  function open(idx) {
    lastFocused = document.activeElement;
    show(idx);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  // Open on item click
  items.forEach((item, idx) => {
    item.addEventListener('click', () => open(idx));
  });

  // Lightbox controls
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(currentIdx - 1));
  btnNext.addEventListener('click', () => show(currentIdx + 1));

  // Click on dark backdrop closes (but not on image or controls)
  lb.addEventListener('click', (e) => {
    if (e.target === lb) close();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(currentIdx - 1);
    else if (e.key === 'ArrowRight') show(currentIdx + 1);
  });
}

// Inject favicon ASAP (before DOM is fully ready) to avoid showing default favicon briefly
injectFavicon();

// Initialize as early as possible to avoid FOUC
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initShared);
} else {
  initShared();
}
