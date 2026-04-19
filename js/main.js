// ===== SHARED COMPONENTS =====

// Determine base path (for subpages in /soins/ and /besoins/)
const depth = window.location.pathname.split('/').filter(Boolean).length;
const isSubpage = window.location.pathname.includes('/soins/') || window.location.pathname.includes('/besoins/');
const base = isSubpage ? '../' : '';

// ===== NAV =====
function renderNav() {
  const nav = document.createElement('nav');
  nav.id = 'navbar';
  nav.innerHTML = `<div class="ni">
<a class="nl" href="${base}index.html">Dr El Khadri<span>.</span></a>
<div class="nm" id="navLinks">
<a href="${base}index.html">Accueil</a>
<div class="dd"><a class="dd-trigger">Nos Services</a><div class="ddm">
<a href="${base}soins/botox.html">Botox</a>
<a href="${base}soins/filler.html">Filler / Acide Hyalu.</a>
<a href="${base}soins/laser.html">Laser Médical</a>
<a href="${base}soins/exosomes.html">Exosomes</a>
<a href="${base}soins/skinbooster.html">Skin Booster</a>
<a href="${base}soins/hydrafacial.html">Hydrafacial</a>
<a href="${base}soins/detatouage.html">Détatouage Laser</a>
</div></div>
<div class="dd"><a class="dd-trigger">Vos Besoins</a><div class="ddm">
<a href="${base}besoins/rajeunir.html">Rajeunir le visage</a>
<a href="${base}besoins/levres.html">Repulper les lèvres</a>
<a href="${base}besoins/rides.html">Traiter les rides</a>
<a href="${base}besoins/taches.html">Effacer les taches</a>
<a href="${base}besoins/texture.html">Améliorer la texture</a>
<a href="${base}besoins/tatouage.html">Enlever un tatouage</a>
<a href="${base}besoins/mariage.html">Préparation mariage</a>
</div></div>
<a href="${base}index.html#about-sec">À Propos</a>
<a href="${base}index.html#contact-sec" class="nav-cta">Rendez-vous</a>
</div>
<button class="mt" id="menuToggle" aria-label="Menu"><span></span><span></span><span></span></button>
</div>`;
  document.body.prepend(nav);
}

// ===== FOOTER BAR (fixed) =====
function renderFooterBar() {
  const bar = document.createElement('div');
  bar.className = 'fbar';
  bar.innerHTML = `
<a href="tel:+212656769738" aria-label="Téléphone"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 10C18.5 10 20 10.5 21 13l1 2.5c.5 1.5 0 2.5-1.2 3.3l-1.3 1c-.5.4-.5 1.2 0 2 1.5 2.7 4 5.2 6.7 6.7.8.5 1.6.5 2 0l1-1.3c.8-1.2 1.8-1.7 3.3-1.2l2.5 1c2.5 1 3 2.5 3 2.5s0 2.5-1.5 4.5-4 3-7.5 2c-5-1.5-10-5.5-13.5-10.5S10.5 16 11 13c.5-3 2.5-4 6.5-3z"/></g></svg></a>
<a href="https://wa.me/212656769738" aria-label="WhatsApp"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M24 6C14.1 6 6 14.1 6 24c0 4 1.3 7.7 3.5 10.7L7 42l7.5-2.4c2.8 1.7 6 2.6 9.5 2.6 9.9 0 18-8.1 18-18S33.9 6 24 6z"/><path d="M18 16.5c.5-1 1.5-1.5 2-1l1.5 1.5c.5.5.5 1.5 0 2l-1 1c-.3.3-.3.8 0 1.3 1 1.9 2.7 3.7 4.7 4.9.5.3 1 .3 1.3 0l1-1c.5-.5 1.5-.5 2 0l1.5 1.5c.5.5 0 1.5-1 2-1.5.8-3.5.8-6-.7s-4.5-3.5-6-6-1.5-4.5 0-6z"/></g></svg></a>
<a href="https://www.instagram.com/dr.yousra.elkhadri/" target="_blank" aria-label="Instagram"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="32" height="32" rx="9"/><circle cx="24" cy="24" r="8.5"/><circle cx="34" cy="14" r="1.8" fill="currentColor" stroke="none" opacity=".6"/></g></svg></a>
<a href="https://www.tiktok.com/@dryousraelkhadri" target="_blank" aria-label="TikTok"><svg width="28" height="28" viewBox="0 0 48 48"><g stroke="currentColor" fill="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M28 6v24c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8v-6c-7.7 0-14 6.3-14 14s6.3 14 14 14 14-6.3 14-14V18c2.5 2 5.5 3.2 8 3.5v-6c-4.5-.5-8-4.5-8-9.5h-6z" stroke-width="0"/></g></svg></a>`;
  document.body.appendChild(bar);
}

// ===== STATIC FOOTER =====
function renderStaticFooter() {
  const footer = document.createElement('footer');
  footer.className = 'sfooter';
  footer.innerHTML = `<div class="sfin"><p>&copy; 2026 Dr Yousra El Khadri · Médecine Esthétique à Casablanca</p></div>`;
  // Insert before footer bar
  const fbar = document.querySelector('.fbar');
  if (fbar) document.body.insertBefore(footer, fbar);
  else document.body.appendChild(footer);
}

// ===== WHATSAPP FLOAT =====
function renderWhatsApp() {
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/212656769738';
  wa.className = 'waf';
  wa.setAttribute('aria-label', 'WhatsApp');
  wa.innerHTML = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
  document.body.appendChild(wa);
}

// ===== INIT =====
function initShared() {
  renderNav();
  renderFooterBar();
  renderStaticFooter();
  renderWhatsApp();

  // Nav scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navLinks');
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    menuToggle.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a:not(.dd-trigger)').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.querySelectorAll('.dd').forEach(d => d.classList.remove('mob-open'));
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navLinksEl.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('open');
      navLinksEl.classList.remove('open');
    }
  });

  // Mobile dropdown toggle - collapse others
  document.querySelectorAll('.dd>.dd-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const parent = trigger.parentElement;
        const wasOpen = parent.classList.contains('mob-open');
        document.querySelectorAll('.dd').forEach(d => d.classList.remove('mob-open'));
        if (!wasOpen) parent.classList.add('mob-open');
      }
    });
  });

  // Scroll reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(x => { if (x.isIntersecting) x.target.classList.add('v'); });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));

  // FAQ accordion
  document.querySelectorAll('.fq').forEach(q => {
    q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
  });
}

document.addEventListener('DOMContentLoaded', initShared);
