// Sake SUVs - src/app.js
// Luminous Light Luxury Digital Experience & Interaction Engine
// Brand: Sake SUVs | Tagline: "Business Class. On the Ground."

const API = '';
const S = { config: null, vehicleClasses: [], routeRates: [], token: sessionStorage.getItem('sakesuvs_token') || null };
const CUST = { token: localStorage.getItem('sakesuvs_customer_token') || null, customer: null };

async function api(path, opts) {
  opts = opts || {};
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  if (S.token && !headers.Authorization) headers.Authorization = 'Bearer ' + S.token;
  const res = await fetch(API + path, Object.assign({}, opts, { headers }));
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || ('Request failed: ' + res.status));
  return data;
}

async function custApi(path, opts) {
  opts = opts || {};
  const headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  if (CUST.token) headers.Authorization = 'Bearer ' + CUST.token;
  return api(path, Object.assign({}, opts, { headers }));
}

function custLogout() {
  CUST.token = null; CUST.customer = null;
  localStorage.removeItem('sakesuvs_customer_token');
  updateNavAccountButton();
}

function money(cents) { return '$' + (Number(cents || 0) / 100).toFixed(2); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

// Curated Executive NJ & NYC Corridor Locations
const CURATED_LOCATIONS = [
  // Major Regional Airports
  { id: 'ewr', type: 'airport', code: 'EWR', main: 'Newark Liberty International (EWR)', sub: 'Terminals A, B, C · Newark, NJ', state: 'NJ', lat: 40.6895, lng: -74.1745 },
  { id: 'jfk', type: 'airport', code: 'JFK', main: 'John F. Kennedy International (JFK)', sub: 'Terminals 1–8 · Queens, NY', state: 'NY', lat: 40.6413, lng: -73.7781 },
  { id: 'lga', type: 'airport', code: 'LGA', main: 'LaGuardia Airport (LGA)', sub: 'Terminals A, B, C · Queens, NY', state: 'NY', lat: 40.7769, lng: -73.8740 },
  { id: 'teb', type: 'airport', code: 'TEB', main: 'Teterboro Airport (TEB)', sub: 'Private Aviation & FBOs · Teterboro, NJ', state: 'NJ', lat: 40.8501, lng: -74.0608 },
  { id: 'mmu', type: 'airport', code: 'MMU', main: 'Morristown Municipal (MMU)', sub: 'Private Aviation · Morristown, NJ', state: 'NJ', lat: 40.7994, lng: -74.4149 },
  { id: 'ttn', type: 'airport', code: 'TTN', main: 'Trenton-Mercer (TTN)', sub: 'Ewing Township, NJ', state: 'NJ', lat: 40.2767, lng: -74.8135 },

  // Jersey City & Hudson County Executive Hubs
  { id: 'jc-exchange', type: 'city', main: 'Exchange Place Waterfront', sub: '10 Exchange Pl / Hyatt Regency · Jersey City, NJ', state: 'NJ', lat: 40.7168, lng: -74.0324 },
  { id: 'jc-newport', type: 'city', main: 'Newport Waterfront & Marina', sub: 'Town Square / River Dr · Jersey City, NJ', state: 'NJ', lat: 40.7272, lng: -74.0336 },
  { id: 'jc-paulus', type: 'city', main: 'Paulus Hook Historic District', sub: 'Grand & Washington St · Jersey City, NJ', state: 'NJ', lat: 40.7145, lng: -74.0360 },
  { id: 'jc-grove', type: 'city', main: 'Grove Street / Downtown JC', sub: 'Newark Ave Pedestrian Plaza · Jersey City, NJ', state: 'NJ', lat: 40.7196, lng: -74.0431 },
  { id: 'hb-w', type: 'city', main: 'W Hotel & Waterfront Promenade', sub: '225 River St · Hoboken, NJ', state: 'NJ', lat: 40.7380, lng: -74.0287 },
  { id: 'jc-harborside', type: 'city', main: 'Harborside Financial Center', sub: 'Hudson St · Jersey City, NJ', state: 'NJ', lat: 40.7201, lng: -74.0339 },

  // Manhattan & New York City Hubs
  { id: 'nyc-wallst', type: 'city', main: 'Wall Street & Financial District', sub: 'One World Trade / 4 WTC · Manhattan, NY', state: 'NY', lat: 40.7128, lng: -74.0134 },
  { id: 'nyc-midtown', type: 'city', main: 'Midtown & Grand Central', sub: 'Vanderbilt Ave & 42nd St · Manhattan, NY', state: 'NY', lat: 40.7527, lng: -73.9772 },
  { id: 'nyc-hudsonyards', type: 'city', main: 'Hudson Yards & High Line', sub: '10 Hudson Yards · Manhattan, NY', state: 'NY', lat: 40.7538, lng: -74.0022 },
  { id: 'nyc-centralpark', type: 'city', main: 'Central Park South & Plaza', sub: '5th Ave & 59th St · Manhattan, NY', state: 'NY', lat: 40.7645, lng: -73.9744 },
  { id: 'nyc-soho', type: 'city', main: 'SoHo & Tribeca Luxury Corridor', sub: 'Mercer & Prince St · Manhattan, NY', state: 'NY', lat: 40.7245, lng: -73.9980 },
  { id: 'nyc-dumbo', type: 'city', main: 'Brooklyn Heights & DUMBO', sub: '1 Hotel Brooklyn Bridge · Brooklyn, NY', state: 'NY', lat: 40.7028, lng: -73.9934 },
];

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function formatDisplayTime(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  let hh = parseInt(parts[0], 10);
  const mm = parts[1] || '00';
  const period = hh >= 12 ? 'PM' : 'AM';
  if (hh === 0) hh = 12;
  else if (hh > 12) hh -= 12;
  return `${hh}:${mm} ${period}`;
}

// Hero Interactive State
const HERO_STATE = {
  type: 'one_way',
  pickup: null,
  dropoff: null,
  hours: 2,
  date: '',
  dateFormatted: '',
  time: '',
  timeFormatted: '',
  passenger_count: 1,
  luggage_count: 1,
  quote: null,
  activePopover: null,
  calCurrentMonth: new Date().getMonth(),
  calCurrentYear: new Date().getFullYear(),
};

// Initialize dates - helper available when user selects
(function initHeroDates() {
  // Clean initialization without overriding empty placeholders
})();

// Full Reservation State
const BOOK = {
  phase: 'details',
  type: 'point_to_point',
  date: '', time: '',
  hours: 2,
  pickup: {}, dropoff: {}, other: {},
  airport_code: 'EWR', direction: 'pickup',
  flight_number: '',
  passenger_count: 1, luggage_count: 1, notes: '',
  quote: null, quoteError: null, quoteLoading: false,
  gratuity_pct: 0.20,
  guest_first_name: '', guest_last_name: '', guest_email: '', guest_phone: '', guest_phone_country: '+1', guest_phone_country_code: 'US',
  guest_address: {},
  bookingResult: null, submitError: null, submitting: false,
};

function resetBook() {
  Object.assign(BOOK, {
    phase: 'details', type: 'point_to_point', date: '', time: '', hours: 2,
    pickup: {}, dropoff: {}, other: {}, airport_code: 'EWR', direction: 'pickup',
    flight_number: '',
    passenger_count: 1, luggage_count: 1, notes: '',
    quote: null, quoteError: null, quoteLoading: false, gratuity_pct: 0.20,
    guest_first_name: '', guest_last_name: '', guest_email: '', guest_phone: '', guest_phone_country: '+1', guest_phone_country_code: 'US',
    guest_address: {},
    bookingResult: null, submitError: null, submitting: false,
  });
}

// ---------------- Route & Navigation ----------------
let currentPath = '';
const routes = {
  '': renderHome,
  '#/': renderHome,
  '#services': () => { scrollToSection('services'); },
  '#standards': () => { scrollToSection('standards'); },
  '#about': () => { scrollToSection('about'); },
  '#contact': () => { scrollToSection('contact'); },
  '#fleet': () => { scrollToSection('fleet'); },
  '#/services': () => { if (currentPath !== '#/') { renderHome(); setTimeout(() => scrollToSection('services'), 50); } else scrollToSection('services'); },
  '#/fleet': renderFleetPage,
  '#/about': () => { if (currentPath !== '#/') { renderHome(); setTimeout(() => scrollToSection('about'), 50); } else scrollToSection('about'); },
  '#/contact': () => { if (currentPath !== '#/') { renderHome(); setTimeout(() => scrollToSection('contact'), 50); } else scrollToSection('contact'); },
  '#/book': renderBook,
  '#/legal/terms': () => renderLegal('terms'),
  '#/legal/privacy': () => renderLegal('privacy'),
  '#/legal/cancellation': () => renderLegal('cancellation'),
  '#/admin': renderAdminLogin,
  '#/admin/dashboard': renderAdmin,
  '#/account': renderAccount,
};

let bookGatePassed = false;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const headerHeight = document.getElementById('site-header')?.offsetHeight || 75;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function router() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#') && !hash.startsWith('#/')) {
    scrollToSection(hash.replace('#', ''));
    return;
  }
  if (hash === '#/book' && currentPath !== '#/book') {
    bookGatePassed = !!CUST.token;
  }
  currentPath = hash;
  const fn = routes[hash] || renderHome;
  updateNavAccountButton();
  fn();
  if (fn !== renderHome && typeof initFooterAnimation === 'function') {
    setTimeout(initFooterAnimation, 60);
  }
  if (!hash.startsWith('#') || hash === '#/') {
    window.scrollTo(0, 0);
  }
  updateGlobalGlassNav();
}

function updateNavAccountButton() {
  const btnText = document.getElementById('nav-account-btn-text');
  if (!btnText) return;
  btnText.textContent = CUST.token ? ((CUST.customer && (CUST.customer.first_name || CUST.customer.name)) || 'My Account') : 'Sign in';
}

window.addEventListener('hashchange', router);

// Persistent Global Glass Navigation Configuration
const SECTION_NAV_CONFIG = [
  { id: 'hero', theme: 'dark', navTarget: 'hero' },
  { id: 'services', theme: 'light', navTarget: 'services' },
  { id: 'standards', theme: 'dark', navTarget: 'standards' },
  { id: 'service-qualities', theme: 'light', navTarget: 'standards' },
  { id: 'about', theme: 'light', navTarget: 'about' },
  { id: 'map', theme: 'dark', navTarget: 'about' },
  { id: 'testimonials', theme: 'light', navTarget: 'about' },
  { id: 'discount-promo', theme: 'dark', navTarget: 'contact' },
  { id: 'contact', theme: 'light', navTarget: 'contact' },
];

function updateGlobalGlassNav() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const scrollY = window.scrollY;
  if (scrollY > 25) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Inner pages (e.g. #/account, #/book, #/fleet, #/legal/terms) use light glass
  const isHomePage = (!currentPath || currentPath === '#/' || currentPath.startsWith('#services') || currentPath.startsWith('#standards') || currentPath.startsWith('#about') || currentPath.startsWith('#contact'));
  if (!isHomePage && currentPath !== '') {
    header.classList.add('nav-theme-light');
    header.classList.remove('nav-theme-dark');
    document.querySelectorAll('.nav-anchor').forEach(a => a.classList.remove('active'));
    document.querySelectorAll('.mobile-nav-anchor').forEach(a => a.classList.remove('active'));
    return;
  }

  // Determine section currently active at header level
  const headerHeight = header.offsetHeight || 60;
  const probeY = scrollY + headerHeight + 25;

  let activeTheme = 'dark';
  let activeTarget = 'hero';

  for (let i = SECTION_NAV_CONFIG.length - 1; i >= 0; i--) {
    const item = SECTION_NAV_CONFIG[i];
    const el = document.getElementById(item.id);
    if (el) {
      const top = el.offsetTop;
      if (probeY >= top - 20) {
        activeTheme = item.theme;
        activeTarget = item.navTarget;
        break;
      }
    }
  }

  if (activeTheme === 'light') {
    header.classList.add('nav-theme-light');
    header.classList.remove('nav-theme-dark');
  } else {
    header.classList.add('nav-theme-dark');
    header.classList.remove('nav-theme-light');
  }

  // Update active states on desktop navigation links
  document.querySelectorAll('.nav-anchor').forEach(a => {
    if (a.getAttribute('data-target') === activeTarget) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  // Update active states on mobile drawer links
  document.querySelectorAll('.mobile-nav-anchor').forEach(a => {
    const href = a.getAttribute('href');
    const isHero = activeTarget === 'hero' && (href === '#/' || href === '#hero');
    const isTarget = href === `#${activeTarget}` || href === `#/${activeTarget}`;
    if (isHero || isTarget) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

function wireNavAnchorClicks() {
  document.querySelectorAll('.nav-anchor').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.getAttribute('data-target');
      if (target === 'hero' && (currentPath === '#/' || currentPath === '' || !currentPath)) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });
}

window.addEventListener('scroll', updateGlobalGlassNav, { passive: true });

// ---------------- Initialize Application ----------------
async function init() {
  try {
    S.config = await api('/api/config');
  } catch (e) {
    S.config = { airports: [] };
  }
  try {
    S.vehicleClasses = await api('/api/vehicle-classes');
  } catch (e) { S.vehicleClasses = []; }

  if (CUST.token) {
    try { CUST.customer = await custApi('/api/customer/me'); }
    catch (e) { custLogout(); }
  }

  setupMobileNav();
  wireNavAnchorClicks();
  initCustomCursor();
  initMagneticButtons();

  router();
}
window.addEventListener('DOMContentLoaded', init);

// ---------------- Mobile Navigation ----------------
function setupMobileNav() {
  const toggleBtn = document.getElementById('nav-mobile-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');

  function openMenu() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  document.querySelectorAll('.mobile-nav-anchor').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });
}

// ---------------- Custom Cursor (Desktop Only) ----------------
function initCustomCursor() {
  if (window.matchMedia('(hover: none)').matches) return;
  const dot = document.getElementById('lux-cursor-dot');
  const ring = document.getElementById('lux-cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-custom-cursor');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, input, select, .service-item-card, .service-slide-card, .service-card-arrow-btn, .services-nav-btn, .services-see-all-pill, .booking-input-trigger, .loc-item-btn, .cal-day-cell, .time-chip-btn, .time-slot-btn')) {
      document.body.classList.add('cursor-hover');
    } else {
      document.body.classList.remove('cursor-hover');
    }
  });
}

// ---------------- Magnetic Buttons ----------------
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.btn-gold').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ==========================================================================
// EDITORIAL TYPOGRAPHY SECTION CONFIGURATION
// Easily editable placeholders/data variables without modifying animation logic
// ==========================================================================
const EDITORIAL_SECTION_CONFIG = {
  eyebrow: "THE SAKE STANDARD",
  headline: "More Than a Ride.\nA Higher Standard.",
  body: "Every journey is designed around what matters most, your time, your comfort, and your peace of mind."
};

/**
 * Splits headline string into responsive lines and accessible word elements.
 * Maintains screen-reader-friendly full sentence while providing word-by-word animation handles.
 */
function renderEditorialHeadlineHtml(headlineText) {
  const lines = (headlineText || '').split('\n').filter(Boolean);
  let globalWordIndex = 0;
  return lines.map((line, lineIdx) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const wordsHtml = words.map(word => {
      const idx = globalWordIndex++;
      return `<span class="editorial-word-wrap"><span class="editorial-word" data-word-idx="${idx}" aria-hidden="true">${esc(word)}</span></span>`;
    }).join(' ');
    return `<div class="editorial-headline-line editorial-headline-line-${lineIdx}">${wordsHtml}</div>`;
  }).join('');
}

/**
 * Splits body string into restrained, accessible word elements.
 */
function renderEditorialBodyHtml(bodyText) {
  const words = (bodyText || '').trim().split(/\s+/).filter(Boolean);
  return words.map((word, idx) => {
    return `<span class="editorial-body-word-wrap"><span class="editorial-body-word" data-body-word-idx="${idx}" aria-hidden="true">${esc(word)}</span></span>`;
  }).join(' ');
}

// ==========================================================================
// CINEMATIC IMAGE STACK STORYTELLING CONFIGURATION
// Structured content data for the 4 key service quality visual stories
// ==========================================================================
const CINEMATIC_STORIES_DATA = [
  {
    number: "01",
    eyebrow: "01 — A WARM WELCOME",
    eyebrowText: "A WARM WELCOME",
    title: "Always Welcome.",
    body: "From the moment you arrive, every detail is handled with discreet, personal attention.",
    image: "/welcome.png",
    alt: "Professional chauffeur greeting arriving guest and assisting with luggage at luxury hotel entrance"
  },
  {
    number: "02",
    eyebrow: "02 — ALWAYS ON TIME",
    eyebrowText: "ALWAYS ON TIME",
    title: "We’re Always On Time.",
    body: "Your time matters. Every journey is planned around your schedule, with reliable pickups designed to keep you moving without the wait.",
    image: "/alwaysontime.png",
    alt: "Chauffeur in tailored uniform opening passenger door of luxury SUV on Manhattan avenue"
  },
  {
    number: "03",
    eyebrow: "03 — READY FOR THE JOURNEY",
    eyebrowText: "READY FOR THE JOURNEY",
    title: "Power When You Need It.",
    body: "Stay connected and productive throughout the journey with thoughtful onboard power.",
    image: "/batteries.webp",
    alt: "Smartphone charging on rear seat executive center console with digital touchscreen controls"
  },
  {
    number: "04",
    eyebrow: "04 — PREMIUM COMFORT",
    eyebrowText: "PREMIUM COMFORT",
    title: "Travel in Comfort.",
    body: "Settle into a refined interior designed to make every mile feel calm, comfortable, and effortless.",
    image: "/comfort.png",
    alt: "Executive passenger working at foldout desk tray in rear leather cabin with chilled sparkling water"
  }
];

/**
 * Renders markup for the pinned cinematic image stack and solid color transition.
 */
function renderCinematicStackHtml() {
  const imagesHtml = CINEMATIC_STORIES_DATA.map((story, idx) => `
    <div class="cinematic-slide-layer" data-layer-idx="${idx}" style="z-index: ${idx + 1};">
      <img src="${story.image}" alt="${esc(story.alt)}" class="cinematic-slide-img" ${idx === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}>
      <div class="cinematic-slide-scrim" aria-hidden="true"></div>
    </div>
  `).join('');

  const panelsHtml = CINEMATIC_STORIES_DATA.map((story, idx) => `
    <div class="cinematic-glass-panel ${idx === 0 ? 'active' : ''}" data-panel-idx="${idx}">
      <div class="cinematic-glass-eyebrow">
        <span class="cinematic-pill-gold">${story.number}</span>
        <span>${esc(story.eyebrowText || story.eyebrow)}</span>
      </div>
      <h3 class="cinematic-glass-title">${esc(story.title)}</h3>
      <p class="cinematic-glass-body">${esc(story.body)}</p>
    </div>
  `).join('');

  const progressPillsHtml = CINEMATIC_STORIES_DATA.map((_, idx) => `
    <div class="cinematic-progress-seg ${idx === 0 ? 'active' : ''}" data-seg="${idx}"></div>
  `).join('');

  return `
    <!-- SOLID RECTANGULAR COLOR WIPE: DARK (#12141A) TO LIGHT (#FAF8F5) -->
    <div class="solid-color-wipe to-light" id="wipe-standards-to-qualities" data-from="var(--color-dark)" data-to="var(--color-ivory)" aria-hidden="true">
      <div class="solid-wipe-blade"></div>
    </div>

    <!-- CINEMATIC PINNED IMAGE STACK SECTION (LIGHT MODE) -->
    <section class="cinematic-stack-section" id="service-qualities" aria-label="Sake SUVs Key Service Qualities">
      <div class="cinematic-section-header">
        <div class="cinematic-stage-eyebrow">
          <span class="cinematic-eyebrow-accent"></span>
          <span>THE SAKE EXPERIENCE</span>
          <span class="cinematic-eyebrow-accent"></span>
        </div>
        <h2 class="cinematic-stage-headline">Crafted Around Every Detail</h2>
      </div>

      <div class="cinematic-stage-wrapper" id="cinematic-stage-wrapper">
        <div class="cinematic-media-stage" id="cinematic-stage">
          
          <div class="cinematic-stage-badge" aria-label="Slide Indicator">
            <span class="cinematic-badge-num" id="cinematic-badge-num">01</span>
            <span class="cinematic-badge-sep">/</span>
            <span class="cinematic-badge-total">0${CINEMATIC_STORIES_DATA.length}</span>
          </div>

          <div class="cinematic-progress-track" aria-hidden="true">
            ${progressPillsHtml}
          </div>

          <div class="cinematic-images-viewport">
            ${imagesHtml}
          </div>

          <div class="cinematic-text-dock" id="cinematic-text-dock">
            ${panelsHtml}
          </div>

        </div>
      </div>
    </section>
  `;
}

// ==========================================================================
// RENDER HOME PAGE — LUMINOUS LIGHT MODE WITH REFERENCE FIDELITY
// ==========================================================================
function renderHome() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- 1. HERO SECTION (WITH HERO VIDEO, HERO LOGOMARK, ENTRANCE ANIMATION & GRAY PLACEHOLDERS) -->
    <section class="hero-editorial" id="hero">
      <div class="hero-bg-media">
        <video class="hero-video-bg" id="hero-bg-video" autoplay muted loop playsinline preload="auto" poster="/Hero Section Image.png">
          <source src="/Hero.mp4" type="video/mp4">
          <source src="/hero.mp4" type="video/mp4">
        </video>
        <img src="/Hero Section Image.png" alt="Executive passenger inside luxury Sake SUV" class="hero-poster-fallback" fetchpriority="high">
      </div>

      <div class="hero-content-wrap">
        <div class="hero-headline-group">
          <h1 class="hero-title">
            <span class="title-line-ivory hero-fade-up hero-delay-1">Business Class.</span>
            <span class="title-line-gold hero-fade-up hero-delay-2">On the Ground.</span>
          </h1>
          <div class="hero-btn-row hero-fade-up hero-delay-btn">
            <a href="#/book" class="btn-gold text-white">
              Book a Ride <span class="arrow-icon">&rarr;</span>
            </a>
          </div>
        </div>
      </div>

      <!-- FLOATING FROSTED GLASS BOOKING BAR -->
      <div class="hero-booking-bar-wrapper">
        <div class="lux-glass-booking-bar" id="hero-booking-bar">
          
          <!-- Mode Tabs -->
          <div class="booking-tabs-center">
            <button type="button" class="booking-tab-pill ${HERO_STATE.type === 'one_way' ? 'active' : ''}" id="hero-tab-oneway">One Way</button>
            <button type="button" class="booking-tab-pill ${HERO_STATE.type === 'hourly' ? 'active' : ''}" id="hero-tab-hourly">Hourly</button>
          </div>

          <!-- Fields Grid -->
          <div class="booking-fields-grid" id="hero-fields-grid">
            
            <!-- Col 1: Pickup Location -->
            <div class="booking-field-col" id="col-pickup">
              <span class="booking-field-label">Pickup Location</span>
              <button type="button" class="booking-input-trigger" id="trigger-pickup">
                <span class="${HERO_STATE.pickup ? 'value-text' : 'placeholder'}" id="val-pickup">${esc(HERO_STATE.pickup ? HERO_STATE.pickup.main : 'Enter Pickup Address')}</span>
              </button>
              
              <!-- Pickup Popover with SOLID Background -->
              <div class="lux-popover-card" id="popover-pickup">
                <div class="loc-search-box">
                  <svg class="loc-search-icon" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input type="text" class="loc-search-input" id="search-pickup" placeholder="Search address, hotel, airport...">
                </div>
                <div class="loc-scroll-list" id="list-pickup">
                  ${renderLocationsListHtml('pickup')}
                </div>
              </div>
            </div>

            <!-- Col 2: Drop-Off Location OR Duration -->
            <div class="booking-field-col" id="col-dropoff">
              <span class="booking-field-label" id="label-col-2">${HERO_STATE.type === 'hourly' ? 'Duration' : 'Drop-Off Location'}</span>
              <button type="button" class="booking-input-trigger" id="trigger-dropoff">
                <span class="${(HERO_STATE.type === 'hourly' || HERO_STATE.dropoff) ? 'value-text' : 'placeholder'}" id="val-dropoff">
                  ${HERO_STATE.type === 'hourly' ? `${HERO_STATE.hours} Hours (${HERO_STATE.hours * 25} mi included)` : (HERO_STATE.dropoff ? esc(HERO_STATE.dropoff.main) : 'Enter Drop-Off Address')}
                </span>
              </button>

              <!-- Dropoff / Duration Popover with SOLID Background -->
              <div class="lux-popover-card" id="popover-dropoff">
                ${HERO_STATE.type === 'hourly' ? renderHourlyDurationListHtml() : `
                  <div class="loc-search-box">
                    <svg class="loc-search-icon" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" class="loc-search-input" id="search-dropoff" placeholder="Search destination, hotel, terminal...">
                  </div>
                  <div class="loc-scroll-list" id="list-dropoff">
                    ${renderLocationsListHtml('dropoff')}
                  </div>
                `}
              </div>
            </div>

            <!-- Vertical Divider 1 -->
            <div class="booking-grid-divider" aria-hidden="true"></div>

            <!-- Col 3: Date -->
            <div class="booking-field-col" id="col-date">
              <span class="booking-field-label">Date</span>
              <button type="button" class="booking-input-trigger" id="trigger-date">
                <span class="${HERO_STATE.date ? 'value-text' : 'placeholder'}" id="val-date">${esc(HERO_STATE.dateFormatted || 'Select a Date')}</span>
              </button>

              <!-- Custom Luxury Calendar Popover with SOLID Background -->
              <div class="lux-popover-card lux-calendar-popover" id="popover-date">
                ${renderCalendarHtml()}
              </div>
            </div>

            <!-- Col 4: Pickup Time -->
            <div class="booking-field-col" id="col-time">
              <span class="booking-field-label">Pickup Time</span>
              <button type="button" class="booking-input-trigger" id="trigger-time">
                <span class="${HERO_STATE.time ? 'value-text' : 'placeholder'}" id="val-time">${esc(HERO_STATE.timeFormatted || 'Select a Time')}</span>
              </button>

              <!-- Custom Luxury Time Picker Popover with SOLID Background -->
              <div class="lux-popover-card lux-time-popover" id="popover-time">
                ${renderTimePickerHtml()}
              </div>
            </div>

            <!-- Vertical Divider 2 -->
            <div class="booking-grid-divider" aria-hidden="true"></div>

            <!-- Col 5: Action Button -->
            <div class="booking-field-col booking-field-action">
              <button type="button" class="btn-quote-pill" id="hero-get-quote-btn">
                Get a Quote <span class="arrow-icon">&rarr;</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>

    <!-- 2. LUXURY SERVICES SHOWCASE SECTION (MATCHING REFERENCE DESIGN WITH 2-CARD SLIDER) -->
    <section class="services-editorial" id="services">
      <div class="container-wide">
        <!-- Header Row -->
        <div class="services-header-row">
          <div class="services-header-left">
            <h2 class="services-main-title" id="services-main-title" aria-label="A Better Way to Move">
              <span class="reveal-word-wrap"><span class="reveal-word" data-word="0">A</span></span>
              <span class="reveal-word-wrap"><span class="reveal-word" data-word="1">Better</span></span>
              <span class="reveal-word-wrap"><span class="reveal-word" data-word="2">Way</span></span>
              <span class="reveal-word-wrap"><span class="reveal-word" data-word="3">to</span></span>
              <span class="reveal-word-wrap"><span class="reveal-word" data-word="4">Move</span></span>
            </h2>
            <p class="services-main-subtitle" id="services-main-subtitle">
              From airport arrivals to business meetings, Sake SUVs keeps every journey comfortable, reliable, and effortless.
            </p>
          </div>
          <div class="services-header-right">
            <div class="services-slider-nav-btns" id="services-slider-nav-btns">
              <button type="button" class="services-nav-btn" id="services-prev-btn" aria-label="Previous services">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button type="button" class="services-nav-btn" id="services-next-btn" aria-label="Next services">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Slider Viewport & Track -->
        <div class="services-slider-viewport" id="services-slider-viewport">
          <div class="services-slider-track" id="services-slider-track">
            
            <!-- Service 1: Airport Transfers -->
            <div class="service-slide-card" data-index="0" data-service="airport">
              <div class="service-card-image-wrap">
                <img src="/Service Card Image 1.png" alt="Chauffeurs assisting passengers at private jet with luxury SUV" loading="lazy">
              </div>
              <div class="service-card-info-box">
                <div class="service-card-info-content">
                  <h3 class="service-card-title">Airport Transfers</h3>
                  <p class="service-card-desc">Seamless transportation to and from EWR, JFK, LGA, and regional airports.</p>
                </div>
                <button type="button" class="service-card-arrow-btn" data-action="book" data-service="airport" aria-label="Book Airport Transfers">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>

            <!-- Service 2: Point-to-Point -->
            <div class="service-slide-card" data-index="1" data-service="p2p">
              <div class="service-card-image-wrap">
                <img src="/Service Card Image 2.png" alt="Chauffeur opening door of luxury black SUV at luxury hotel" loading="lazy">
              </div>
              <div class="service-card-info-box">
                <div class="service-card-info-content">
                  <h3 class="service-card-title">Point-to-Point</h3>
                  <p class="service-card-desc">Direct, door-to-door transportation across New Jersey and New York.</p>
                </div>
                <button type="button" class="service-card-arrow-btn" data-action="book" data-service="p2p" aria-label="Book Point-to-Point">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>

            <!-- Service 3: Hourly Charter -->
            <div class="service-slide-card" data-index="2" data-service="hourly">
              <div class="service-card-image-wrap">
                <img src="/About Section Image.png" alt="Executive leather cabin interior of luxury SUV with captain chairs" loading="lazy">
              </div>
              <div class="service-card-info-box">
                <div class="service-card-info-content">
                  <h3 class="service-card-title">Hourly Charter</h3>
                  <p class="service-card-desc">As-directed flexibility with your chauffeur on standby for board meetings, dining, and multi-stop journeys.</p>
                </div>
                <button type="button" class="service-card-arrow-btn" data-action="book" data-service="hourly" aria-label="Book Hourly Charter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>

            <!-- Service 4: Corporate & VIP -->
            <div class="service-slide-card" data-index="3" data-service="corporate">
              <div class="service-card-image-wrap">
                <img src="/Discount Section Image.png" alt="Luxury chauffeured SUV along waterfront at twilight" loading="lazy">
              </div>
              <div class="service-card-info-box">
                <div class="service-card-info-content">
                  <h3 class="service-card-title">Corporate &amp; VIP</h3>
                  <p class="service-card-desc">Confidential executive travel with dedicated invoicing, flight-aware scheduling, and strict NDA discretion.</p>
                </div>
                <button type="button" class="service-card-arrow-btn" data-action="book" data-service="corporate" aria-label="Book Corporate & VIP">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Slider Pagination Indicators (Dots) -->
        <div class="services-slider-footer">
          <div class="services-slider-dots" id="services-slider-dots">
            <!-- Dynamically populated / active dots -->
          </div>
        </div>

      </div>
    </section>

    <!-- SOLID RECTANGULAR COLOR WIPE: LIGHT (#FAF8F5) TO DARK (#12141A) -->
    <div class="solid-color-wipe to-dark" id="wipe-services-to-standards" data-from="var(--color-ivory)" data-to="var(--color-dark)" aria-hidden="true">
      <div class="solid-wipe-blade"></div>
    </div>

    <!-- 3. EDITORIAL TYPOGRAPHY PINNED SCROLL EXPERIENCE -->
    <section class="editorial-scroll-section dark-theme" id="standards" aria-label="The Sake Standard">
      <div class="editorial-stage" id="editorial-stage">
        <div class="editorial-ambient-glow" aria-hidden="true"></div>
        <div class="editorial-content-container">
          
          <!-- Small Eyebrow -->
          <div class="editorial-eyebrow" id="editorial-eyebrow">
            <span class="editorial-eyebrow-line" aria-hidden="true"></span>
            <span class="editorial-eyebrow-text">${esc(EDITORIAL_SECTION_CONFIG.eyebrow)}</span>
            <span class="editorial-eyebrow-line" aria-hidden="true"></span>
          </div>

          <!-- Very Large Editorial Headline -->
          <h2 class="editorial-headline" id="editorial-headline" role="heading" aria-level="2" aria-label="${esc(EDITORIAL_SECTION_CONFIG.headline.replace(/\n/g, ' '))}">
            ${renderEditorialHeadlineHtml(EDITORIAL_SECTION_CONFIG.headline)}
          </h2>

          <!-- Elegant Editorial Body -->
          <p class="editorial-body" id="editorial-body" aria-label="${esc(EDITORIAL_SECTION_CONFIG.body)}">
            ${renderEditorialBodyHtml(EDITORIAL_SECTION_CONFIG.body)}
          </p>

        </div>

        <!-- Subtle Scroll Hint -->
        <div class="editorial-scroll-hint" id="editorial-scroll-hint" aria-hidden="true">
          <div class="editorial-scroll-mouse">
            <div class="editorial-scroll-dot"></div>
          </div>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>

    <!-- 4. PINNED CINEMATIC IMAGE STACK STORYTELLING (LIGHT MODE) -->
    ${renderCinematicStackHtml()}

    <!-- 4. ABOUT SECTION (SOLID WARM IVORY) -->
    <section class="about-section" id="about">
      <div class="container">
        <div class="about-grid-2">
          <div class="about-image-frame">
            <img src="/About Section Image.png" alt="Luxury rear passenger interior with leather armrest and bottle">
          </div>
          <div class="about-content-col" id="about-content-col">
            <div class="about-headline-wrapper">
              <h2 class="about-headline" id="about-headline">
                Built Around Your Time.
              </h2>
            </div>

            <div class="about-narrative">
              <p class="about-body-lead">
                Sake SUVs was created with a simple belief: professionals travelling between New Jersey and New York deserve better than inconsistent rideshare or impersonal car-service dispatch.
              </p>
              <p class="about-body-secondary">
                We combine professional chauffeurs, premium SUVs, transparent pricing, and a polished booking experience to create transportation that feels dependable from beginning to end.
              </p>
            </div>

            <div style="margin-top: 32px;">
              <a href="#/book" class="btn-gold">Discover Our Story &rarr;</a>
            </div>
          </div>
        </div>

        <!-- 4 STATS ROW WITH RUNNING NUMBER ANIMATION STOPPING ON RIGHT NUMBER -->
        <div class="about-stats-row" id="about-stats-row">
          <div class="about-stat-card">
            <div class="about-stat-number" data-target="100" data-suffix="%">0%</div>
            <div class="about-stat-label">Client Satisfaction</div>
          </div>
          <div class="about-stat-card">
            <div class="about-stat-number" data-target="24" data-suffix="/7">0/7</div>
            <div class="about-stat-label">Concierge Dispatch</div>
          </div>
          <div class="about-stat-card">
            <div class="about-stat-number" data-target="100" data-suffix="%">0%</div>
            <div class="about-stat-label">Transparent Pricing</div>
          </div>
          <div class="about-stat-card">
            <div class="about-stat-number" data-target="150" data-suffix="+">0+</div>
            <div class="about-stat-label">Premium Journeys</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. NJ–NYC CONNECTION CUSTOM MAP SECTION (THE RICH DARK SHOWPIECE) -->
    <section class="map-section" id="map">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 24px;">
          <div>
            <div class="hero-eyebrow" style="color: var(--gold-light);">The Regional Corridor</div>
            <h2 style="font-size: clamp(34px, 4.5vw, 54px);">Two Cities. <span style="color:var(--gold-bright);">One Seamless Journey.</span></h2>
          </div>
          <p style="max-width: 480px; color: rgba(250,248,245,0.7); font-size: 16px;">
            Seamless private chauffeured service connecting major destinations across the tri-state area.
          </p>
        </div>

        <div class="map-canvas-container">
          <img src="/Map.png" alt="Cartographic night map of New Jersey and Manhattan connected across Hudson River">

          <div class="commute-card-floating" style="top: 18%; left: 8%;">
            <div class="commute-card-time">18 MIN</div>
            <div class="commute-card-label">JC &harr; Newark Liberty (EWR)</div>
          </div>
          <div class="commute-card-floating" style="bottom: 22%; left: 24%;">
            <div class="commute-card-time">12 MIN</div>
            <div class="commute-card-label">JC &harr; Wall Street / FiDi</div>
          </div>
          <div class="commute-card-floating" style="top: 15%; right: 18%;">
            <div class="commute-card-time">20 MIN</div>
            <div class="commute-card-label">JC &harr; Midtown Manhattan</div>
          </div>
          <div class="commute-card-floating" style="bottom: 16%; right: 10%;">
            <div class="commute-card-time">45 MIN</div>
            <div class="commute-card-label">JC &harr; JFK International</div>
          </div>
        </div>
      </div>
    </section>

    <!-- SOLID RECTANGULAR COLOR WIPE: DARK (#12141A) TO CREAM (#F5F1E8) -->
    <div class="solid-color-wipe to-cream" id="wipe-map-to-testimonials" data-from="var(--color-dark)" data-to="var(--color-cream)" aria-hidden="true">
      <div class="solid-wipe-blade"></div>
    </div>

    <!-- 6. EDITORIAL TESTIMONIALS SECTION (LIGHT CREAM MODE) -->
    <section class="testimonials-section" id="testimonials">
      <div class="container">
        <div style="text-align: center; max-width: 700px; margin: 0 auto;">
          <div class="hero-eyebrow" style="justify-content: center;">Client Testimonials</div>
          <h2 style="font-size: clamp(34px, 4.5vw, 50px);">Trusted by People Who Value Their Time.</h2>
        </div>

        <div class="testimonial-carousel-wrap">
          <div class="testimonial-slide active" id="testi-slide-0">
            <div class="testimonial-avatar-wrap">
              <img src="/Testimonial Card Image 1.png" alt="Michael Anderson portrait">
            </div>
            <div>
              <div class="testimonial-quote-text">
                &ldquo;The entire experience was effortless. The Suburban was immaculate, the chauffeur arrived 10 minutes early in an executive suit, and navigating into Lower Manhattan was completely stress-free.&rdquo;
              </div>
              <div class="testimonial-author-name">Michael Anderson</div>
              <div class="testimonial-author-title">Partner, Hudson River Capital &bull; Jersey City to Wall St</div>
            </div>
          </div>

          <div class="testimonial-slide" id="testi-slide-1">
            <div class="testimonial-avatar-wrap">
              <img src="/Testimonial Card Image 2.png" alt="Elena Rostova portrait">
            </div>
            <div>
              <div class="testimonial-quote-text">
                &ldquo;As someone who flies weekly out of Newark and JFK, having a chauffeur who tracks my flight and meets me curbside with a bottle of water is indispensable. Truly business class on the ground.&rdquo;
              </div>
              <div class="testimonial-author-name">Elena Rostova</div>
              <div class="testimonial-author-title">VP Corporate Strategy &bull; EWR Airport Transfer</div>
            </div>
          </div>

          <div class="testimonial-slide" id="testi-slide-2">
            <div class="testimonial-avatar-wrap">
              <img src="/Testimonial Card Image 3.png" alt="David Chen portrait">
            </div>
            <div>
              <div class="testimonial-quote-text">
                &ldquo;We booked an hourly charter for a full day of investor meetings across Midtown and Brooklyn. Having the vehicle waiting right at the door between each stop made our schedule flawless.&rdquo;
              </div>
              <div class="testimonial-author-name">David Chen</div>
              <div class="testimonial-author-title">Founder &amp; CEO, Tech Advisory &bull; Hourly Charter</div>
            </div>
          </div>

          <div class="testimonial-controls">
            <button type="button" class="testimonial-nav-btn" id="testi-prev" aria-label="Previous testimonial">&larr;</button>
            <span style="font-size: 13px; color: var(--gold); letter-spacing: 0.1em; font-weight: 600;" id="testi-counter">01 / 03</span>
            <button type="button" class="testimonial-nav-btn" id="testi-next" aria-label="Next testimonial">&rarr;</button>
          </div>
        </div>
      </div>
    </section>


    <!-- 7. EMAIL / DISCOUNT SECTION (PURE FULL-BLEED VIDEO & LUXURY OVERLAY) -->
    <section class="discount-promo-section" id="discount-promo">
      <video class="discount-promo-video" id="discount-promo-video" src="/email-section.mp4" autoplay muted loop playsinline webkit-playsinline preload="auto">
        <source src="/email-section.mp4" type="video/mp4">
      </video>
      <div class="discount-promo-overlay" aria-hidden="true"></div>
      <div class="discount-promo-content">
        <h2>Subscribe To Get 10% Off<br>On Your First Ride.</h2>
        <form id="discount-sub-form" class="discount-form-row" autocomplete="off">
          <input type="email" class="discount-input" id="discount-email-input" placeholder="Enter Your Email" required autocomplete="off" spellcheck="false" autocapitalize="none" aria-label="Enter your email to receive 10% discount on your first ride">
          <button type="submit" class="discount-btn" id="discount-submit-btn">
            <span>Submit</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </form>
        <div id="discount-feedback" class="discount-feedback" aria-live="polite"></div>
      </div>
    </section>

    <!-- SOLID RECTANGULAR COLOR WIPE: DARK (#12141A) TO LIGHT (#FAF8F5) -->
    <div class="solid-color-wipe to-light" id="wipe-discount-to-contact" data-from="var(--color-dark)" data-to="var(--color-ivory)" aria-hidden="true">
      <div class="solid-wipe-blade"></div>
    </div>

    <!-- 8. CONTACT SECTION (SOLID LIGHT MODE — 100% WIDTH, ZERO SIDE BLACK ARTIFACTS) -->
    <section class="contact-section" id="contact">
      <div class="contact-inner-container">
        <div style="text-align: center; margin-bottom: 40px;">
          <div class="hero-eyebrow" style="justify-content: center;">Contact Dispatch</div>
          <h2 style="font-size: clamp(32px, 4vw, 44px);">Reserve or Inquire</h2>
          <p style="color: var(--ink-muted); font-size: 16px; margin-top: 8px;">
            Have specific flight schedules, multi-day itineraries, or corporate billing requests? We respond promptly.
          </p>
        </div>

        <div id="contact-alert"></div>

        <form id="home-contact-form" class="booking-widget-lux" style="padding: 36px;">
          <div class="field-row-2">
            <div class="field-lux">
              <label>Your Name</label>
              <input type="text" name="name" placeholder="Executive Name" required>
            </div>
            <div class="field-lux">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="name@company.com" required>
            </div>
          </div>
          <div class="field-lux">
            <label>Phone Number (Optional)</label>
            <input type="tel" name="phone" placeholder="(555) 000-0000">
          </div>
          <div class="field-lux">
            <label>Trip Details &amp; Notes</label>
            <textarea name="message" rows="4" placeholder="Itinerary, passenger count, flight number, or questions..." required></textarea>
          </div>
          <button type="submit" class="btn-gold" style="width: 100%; justify-content: center;">
            Send Direct Message &rarr;
          </button>
        </form>
      </div>
    </section>

    <!-- SOLID RECTANGULAR COLOR WIPE: LIGHT (#FAF8F5) TO DARK (#12141A) -->
    <div class="solid-color-wipe to-dark" id="wipe-contact-to-footer" data-from="var(--color-ivory)" data-to="var(--color-dark)" aria-hidden="true">
      <div class="solid-wipe-blade"></div>
    </div>
  `;

  // Wire all Hero booking bar events & popovers
  wireHeroBookingBar();

  // Wire interactive services switcher
  wireServicesShowcase();

  // Wire testimonials carousel
  wireTestimonialsCarousel();

  // Wire discount subscription form
  wireDiscountForm();

  // Wire contact form
  const contactForm = document.getElementById('home-contact-form');
  if (contactForm) contactForm.addEventListener('submit', onHomeContactSubmit);

  // Trigger GSAP ScrollTrigger animations
  initScrollAnimations();
}

// ---------------- Helper HTML Renderers for Hero Popovers ----------------
function renderLocationsListHtml(type) {
  let html = `<div class="loc-category-title">Major Airports</div>`;
  CURATED_LOCATIONS.filter(l => l.type === 'airport').forEach(l => {
    html += `
      <div class="loc-item-btn" data-loc-id="${l.id}" data-for="${type}">
        <div class="loc-item-icon">&#9992;</div>
        <div class="loc-item-text">
          <div class="loc-item-main">${esc(l.main)}</div>
          <div class="loc-item-sub">${esc(l.sub)}</div>
        </div>
      </div>
    `;
  });

  html += `<div class="loc-category-title">Jersey City &amp; Hudson County</div>`;
  CURATED_LOCATIONS.filter(l => l.type === 'city' && l.state === 'NJ').forEach(l => {
    html += `
      <div class="loc-item-btn" data-loc-id="${l.id}" data-for="${type}">
        <div class="loc-item-icon">&#127970;</div>
        <div class="loc-item-text">
          <div class="loc-item-main">${esc(l.main)}</div>
          <div class="loc-item-sub">${esc(l.sub)}</div>
        </div>
      </div>
    `;
  });

  html += `<div class="loc-category-title">Manhattan &amp; NYC Hubs</div>`;
  CURATED_LOCATIONS.filter(l => l.type === 'city' && l.state === 'NY').forEach(l => {
    html += `
      <div class="loc-item-btn" data-loc-id="${l.id}" data-for="${type}">
        <div class="loc-item-icon">&#128509;</div>
        <div class="loc-item-text">
          <div class="loc-item-main">${esc(l.main)}</div>
          <div class="loc-item-sub">${esc(l.sub)}</div>
        </div>
      </div>
    `;
  });

  return html;
}

function renderHourlyDurationListHtml() {
  const durations = [
    { hours: 2, label: '2 Hours (Minimum Charter)', miles: 50 },
    { hours: 3, label: '3 Hours Charter', miles: 75 },
    { hours: 4, label: '4 Hours Charter', miles: 100 },
    { hours: 5, label: '5 Hours Charter (Discounted tier)', miles: 125 },
    { hours: 6, label: '6 Hours Charter', miles: 150 },
    { hours: 8, label: '8 Hours (Full Day Charter)', miles: 200 },
    { hours: 10, label: '10 Hours Charter', miles: 250 },
    { hours: 12, label: '12 Hours (Maximum Charter)', miles: 300 },
  ];
  return `
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 8px; font-weight: 600;">
      Select Duration
    </div>
    <div class="loc-scroll-list">
      ${durations.map(d => `
        <div class="loc-item-btn duration-select-btn" data-hours="${d.hours}">
          <div class="loc-item-icon">&#9201;</div>
          <div class="loc-item-text">
            <div class="loc-item-main">${d.label}</div>
            <div class="loc-item-sub">${d.miles} miles included</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCalendarHtml() {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const m = HERO_STATE.calCurrentMonth;
  const y = HERO_STATE.calCurrentYear;

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let cellsHtml = '';
  for (let i = 0; i < firstDay; i++) {
    cellsHtml += `<div></div>`;
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const checkDate = new Date(y, m, day);
    const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = checkDate < today;
    const isToday = checkDate.getTime() === today.getTime();
    const isSelected = dateStr === HERO_STATE.date;

    const cls = ['cal-day-cell', isPast ? 'disabled' : '', isToday ? 'today' : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ');
    cellsHtml += `<div class="${cls}" data-date="${dateStr}" ${isPast ? '' : 'role="button"'}>${day}</div>`;
  }

  return `
    <div class="cal-header">
      <button type="button" class="cal-nav-btn" id="cal-prev-month">&lsaquo;</button>
      <div class="cal-month-title">${monthNames[m]} ${y}</div>
      <button type="button" class="cal-nav-btn" id="cal-next-month">&rsaquo;</button>
    </div>
    <div class="cal-days-grid">
      <div class="cal-day-label">Su</div>
      <div class="cal-day-label">Mo</div>
      <div class="cal-day-label">Tu</div>
      <div class="cal-day-label">We</div>
      <div class="cal-day-label">Th</div>
      <div class="cal-day-label">Fr</div>
      <div class="cal-day-label">Sa</div>
      ${cellsHtml}
    </div>
  `;
}

function renderTimePickerHtml() {
  const chips = [
    { label: '06:00 AM (Early Flight)', val: '06:00' },
    { label: '08:30 AM (Morning Rush)', val: '08:30' },
    { label: '12:00 PM (Midday)', val: '12:00' },
    { label: '05:30 PM (Evening Commute)', val: '17:30' },
    { label: '08:00 PM (Dinner & Events)', val: '20:00' },
  ];

  let slotsHtml = '';
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const val = `${hh}:${mm}`;
      const disp = formatDisplayTime(val);
      const isSelected = val === HERO_STATE.time;
      slotsHtml += `<button type="button" class="time-slot-btn ${isSelected ? 'selected' : ''}" data-time="${val}">${disp}</button>`;
    }
  }

  return `
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin-bottom: 8px; font-weight: 600;">
      Suggested Business Hours
    </div>
    <div class="time-chips-row">
      ${chips.map(c => `<button type="button" class="time-chip-btn" data-time="${c.val}">${c.label}</button>`).join('')}
    </div>
    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold); margin: 10px 0 6px; font-weight: 600;">
      All Times
    </div>
    <div class="time-slots-list">
      ${slotsHtml}
    </div>
  `;
}

// ---------------- Hero Booking Bar Interactivity ----------------
function wireHeroBookingBar() {
  const tabOneWay = document.getElementById('hero-tab-oneway');
  const tabHourly = document.getElementById('hero-tab-hourly');
  const triggerPickup = document.getElementById('trigger-pickup');
  const triggerDropoff = document.getElementById('trigger-dropoff');
  const triggerDate = document.getElementById('trigger-date');
  const triggerTime = document.getElementById('trigger-time');
  const btnGetQuote = document.getElementById('hero-get-quote-btn');

  // Tab switching
  tabOneWay?.addEventListener('click', () => {
    HERO_STATE.type = 'one_way';
    tabOneWay.classList.add('active');
    tabHourly?.classList.remove('active');
    const label2 = document.getElementById('label-col-2');
    if (label2) label2.textContent = 'Drop-Off Location';
    const valDropoff = document.getElementById('val-dropoff');
    if (valDropoff) {
      valDropoff.textContent = HERO_STATE.dropoff ? HERO_STATE.dropoff.main : 'Enter Drop-Off Address';
      valDropoff.className = HERO_STATE.dropoff ? 'value-text' : 'placeholder';
    }
    document.getElementById('popover-dropoff').innerHTML = `
      <div class="loc-search-box">
        <svg class="loc-search-icon" viewBox="0 0 24 24" fill="none" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" class="loc-search-input" id="search-dropoff" placeholder="Search destination, hotel, terminal...">
      </div>
      <div class="loc-scroll-list" id="list-dropoff">
        ${renderLocationsListHtml('dropoff')}
      </div>
    `;
    wireDropoffSearchAndSelect();
    closeAllPopovers();
  });

  tabHourly?.addEventListener('click', () => {
    HERO_STATE.type = 'hourly';
    tabHourly.classList.add('active');
    tabOneWay?.classList.remove('active');
    const label2 = document.getElementById('label-col-2');
    if (label2) label2.textContent = 'Duration';
    const valDropoff = document.getElementById('val-dropoff');
    if (valDropoff) {
      valDropoff.textContent = `${HERO_STATE.hours} Hours (${HERO_STATE.hours * 25} mi included)`;
      valDropoff.className = 'value-text';
    }
    document.getElementById('popover-dropoff').innerHTML = renderHourlyDurationListHtml();
    wireDurationSelect();
    closeAllPopovers();
  });

  // Open popovers strictly one at a time
  triggerPickup?.addEventListener('click', (e) => { e.stopPropagation(); togglePopover('pickup'); });
  triggerDropoff?.addEventListener('click', (e) => { e.stopPropagation(); togglePopover('dropoff'); });
  triggerDate?.addEventListener('click', (e) => { e.stopPropagation(); togglePopover('date'); });
  triggerTime?.addEventListener('click', (e) => { e.stopPropagation(); togglePopover('time'); });

  // Prevent clicks inside popovers from closing themselves
  ['popover-pickup', 'popover-dropoff', 'popover-date', 'popover-time'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', (e) => e.stopPropagation());
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.lux-glass-booking-bar') && !e.target.closest('.lux-popover-card')) {
      closeAllPopovers();
    }
  });

  function togglePopover(name) {
    const popovers = ['pickup', 'dropoff', 'date', 'time'];

    popovers.forEach(p => {
      const el = document.getElementById(`popover-${p}`);
      const trigger = document.getElementById(`trigger-${p}`);
      if (p === name) {
        if (el?.classList.contains('open')) {
          el.classList.remove('open');
          el.classList.remove('open-upwards');
          trigger?.classList.remove('active');
          HERO_STATE.activePopover = null;
        } else {
          // Detect available vertical space in viewport
          if (trigger) {
            const rect = trigger.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < 340 && spaceAbove > 280) {
              el?.classList.add('open-upwards');
            } else {
              el?.classList.remove('open-upwards');
            }
          }
          el?.classList.add('open');
          trigger?.classList.add('active');
          HERO_STATE.activePopover = name;
          if (p === 'pickup') setTimeout(() => document.getElementById('search-pickup')?.focus(), 50);
          if (p === 'dropoff' && HERO_STATE.type === 'one_way') setTimeout(() => document.getElementById('search-dropoff')?.focus(), 50);
        }
      } else {
        el?.classList.remove('open');
        el?.classList.remove('open-upwards');
        trigger?.classList.remove('active');
      }
    });
  }

  function closeAllPopovers() {
    ['pickup', 'dropoff', 'date', 'time'].forEach(p => {
      const el = document.getElementById(`popover-${p}`);
      const trigger = document.getElementById(`trigger-${p}`);
      el?.classList.remove('open');
      el?.classList.remove('open-upwards');
      trigger?.classList.remove('active');
    });
    HERO_STATE.activePopover = null;
  }

  // Wire Location Selects
  wirePickupSearchAndSelect();
  if (HERO_STATE.type === 'one_way') wireDropoffSearchAndSelect();
  else wireDurationSelect();

  // Wire Calendar
  wireCalendarEvents();

  // Wire Time Picker
  wireTimePickerEvents();

  // Quote Action
  btnGetQuote?.addEventListener('click', onHeroGetQuote);

  // Quote Modal Actions
  document.getElementById('quote-modal-close')?.addEventListener('click', closeQuoteModal);
  document.getElementById('quote-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'quote-modal-backdrop') closeQuoteModal();
  });
  document.getElementById('quote-edit-btn')?.addEventListener('click', closeQuoteModal);
  document.getElementById('quote-reserve-btn')?.addEventListener('click', proceedToReserveFromQuote);
}

function wirePickupSearchAndSelect() {
  const list = document.getElementById('list-pickup');
  const search = document.getElementById('search-pickup');

  list?.addEventListener('click', (e) => {
    const item = e.target.closest('.loc-item-btn');
    if (!item) return;
    const locId = item.getAttribute('data-loc-id');
    const loc = CURATED_LOCATIONS.find(l => l.id === locId);
    if (loc) {
      HERO_STATE.pickup = loc;
      const el = document.getElementById('val-pickup');
      if (el) {
        el.textContent = loc.main;
        el.className = 'value-text';
      }
      closeAllPopovers();
    }
  });

  search?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      list.innerHTML = renderLocationsListHtml('pickup');
      return;
    }
    const filtered = CURATED_LOCATIONS.filter(l => l.main.toLowerCase().includes(q) || l.sub.toLowerCase().includes(q));
    let html = '';
    if (filtered.length) {
      html += filtered.map(l => `
        <div class="loc-item-btn" data-loc-id="${l.id}" data-for="pickup">
          <div class="loc-item-icon">${l.type === 'airport' ? '&#9992;' : '&#127970;'}</div>
          <div class="loc-item-text">
            <div class="loc-item-main">${esc(l.main)}</div>
            <div class="loc-item-sub">${esc(l.sub)}</div>
          </div>
        </div>
      `).join('');
    }
    html += `
      <div class="loc-item-btn custom-entry-btn" data-custom="${esc(e.target.value)}">
        <div class="loc-item-icon">&#128205;</div>
        <div class="loc-item-text">
          <div class="loc-item-main">Use address: "${esc(e.target.value)}"</div>
          <div class="loc-item-sub">Custom Street Address (NJ / NY)</div>
        </div>
      </div>
    `;
    list.innerHTML = html;
  });

  list?.addEventListener('click', (e) => {
    const customItem = e.target.closest('.custom-entry-btn');
    if (!customItem) return;
    const val = customItem.getAttribute('data-custom');
    HERO_STATE.pickup = { id: 'custom', main: val, sub: 'Custom Address', state: 'NJ', lat: null, lng: null };
    const el = document.getElementById('val-pickup');
    if (el) {
      el.textContent = val;
      el.className = 'value-text';
    }
    closeAllPopovers();
  });
}

function wireDropoffSearchAndSelect() {
  const list = document.getElementById('list-dropoff');
  const search = document.getElementById('search-dropoff');

  list?.addEventListener('click', (e) => {
    const item = e.target.closest('.loc-item-btn');
    if (!item) return;
    const locId = item.getAttribute('data-loc-id');
    const loc = CURATED_LOCATIONS.find(l => l.id === locId);
    if (loc) {
      HERO_STATE.dropoff = loc;
      const el = document.getElementById('val-dropoff');
      if (el) {
        el.textContent = loc.main;
        el.className = 'value-text';
      }
      closeAllPopovers();
    }
  });

  search?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      list.innerHTML = renderLocationsListHtml('dropoff');
      return;
    }
    const filtered = CURATED_LOCATIONS.filter(l => l.main.toLowerCase().includes(q) || l.sub.toLowerCase().includes(q));
    let html = '';
    if (filtered.length) {
      html += filtered.map(l => `
        <div class="loc-item-btn" data-loc-id="${l.id}" data-for="dropoff">
          <div class="loc-item-icon">${l.type === 'airport' ? '&#9992;' : '&#127970;'}</div>
          <div class="loc-item-text">
            <div class="loc-item-main">${esc(l.main)}</div>
            <div class="loc-item-sub">${esc(l.sub)}</div>
          </div>
        </div>
      `).join('');
    }
    html += `
      <div class="loc-item-btn custom-entry-btn-dropoff" data-custom="${esc(e.target.value)}">
        <div class="loc-item-icon">&#128205;</div>
        <div class="loc-item-text">
          <div class="loc-item-main">Use address: "${esc(e.target.value)}"</div>
          <div class="loc-item-sub">Custom Street Address (NJ / NY)</div>
        </div>
      </div>
    `;
    list.innerHTML = html;
  });

  list?.addEventListener('click', (e) => {
    const customItem = e.target.closest('.custom-entry-btn-dropoff');
    if (!customItem) return;
    const val = customItem.getAttribute('data-custom');
    HERO_STATE.dropoff = { id: 'custom', main: val, sub: 'Custom Address', state: 'NY', lat: null, lng: null };
    const el = document.getElementById('val-dropoff');
    if (el) {
      el.textContent = val;
      el.className = 'value-text';
    }
    closeAllPopovers();
  });
}

function wireDurationSelect() {
  const popover = document.getElementById('popover-dropoff');
  popover?.addEventListener('click', (e) => {
    const btn = e.target.closest('.duration-select-btn');
    if (!btn) return;
    const h = parseInt(btn.getAttribute('data-hours'), 10);
    HERO_STATE.hours = h;
    const el = document.getElementById('val-dropoff');
    if (el) {
      el.textContent = `${h} Hours (${h * 25} mi included)`;
      el.className = 'value-text';
    }
    closeAllPopovers();
  });
}

function wireCalendarEvents() {
  const popover = document.getElementById('popover-date');
  if (!popover) return;

  popover.addEventListener('click', (e) => {
    const prevBtn = e.target.closest('#cal-prev-month');
    const nextBtn = e.target.closest('#cal-next-month');
    if (prevBtn) {
      e.stopPropagation();
      HERO_STATE.calCurrentMonth--;
      if (HERO_STATE.calCurrentMonth < 0) {
        HERO_STATE.calCurrentMonth = 11;
        HERO_STATE.calCurrentYear--;
      }
      popover.innerHTML = renderCalendarHtml();
      return;
    }
    if (nextBtn) {
      e.stopPropagation();
      HERO_STATE.calCurrentMonth++;
      if (HERO_STATE.calCurrentMonth > 11) {
        HERO_STATE.calCurrentMonth = 0;
        HERO_STATE.calCurrentYear++;
      }
      popover.innerHTML = renderCalendarHtml();
      return;
    }

    const dayCell = e.target.closest('.cal-day-cell:not(.disabled)');
    if (dayCell) {
      const dateVal = dayCell.getAttribute('data-date');
      HERO_STATE.date = dateVal;
      HERO_STATE.dateFormatted = formatDisplayDate(dateVal);
      const el = document.getElementById('val-date');
      if (el) {
        el.textContent = HERO_STATE.dateFormatted;
        el.className = 'value-text';
      }
      closeAllPopovers();
    }
  });
}

function wireTimePickerEvents() {
  const popover = document.getElementById('popover-time');
  if (!popover) return;

  popover.addEventListener('click', (e) => {
    const chip = e.target.closest('.time-chip-btn, .time-slot-btn');
    if (!chip) return;
    const timeVal = chip.getAttribute('data-time');
    HERO_STATE.time = timeVal;
    HERO_STATE.timeFormatted = formatDisplayTime(timeVal);
    const el = document.getElementById('val-time');
    if (el) {
      el.textContent = HERO_STATE.timeFormatted;
      el.className = 'value-text';
    }
    closeAllPopovers();
  });
}

// ---------------- Quote Engine & Modal ----------------
async function onHeroGetQuote() {
  if (!HERO_STATE.pickup) {
    document.getElementById('popover-pickup')?.classList.add('open');
    return;
  }
  if (HERO_STATE.type === 'one_way' && !HERO_STATE.dropoff) {
    document.getElementById('popover-dropoff')?.classList.add('open');
    return;
  }

  // If date not selected yet, auto-default to tomorrow so quotation succeeds
  if (!HERO_STATE.date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pad = n => String(n).padStart(2, '0');
    HERO_STATE.date = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
    HERO_STATE.dateFormatted = formatDisplayDate(HERO_STATE.date);
    const dEl = document.getElementById('val-date');
    if (dEl) { dEl.textContent = HERO_STATE.dateFormatted; dEl.className = 'value-text'; }
  }
  if (!HERO_STATE.time) {
    HERO_STATE.time = '09:00';
    HERO_STATE.timeFormatted = '9:00 AM';
    const tEl = document.getElementById('val-time');
    if (tEl) { tEl.textContent = HERO_STATE.timeFormatted; tEl.className = 'value-text'; }
  }

  const backdrop = document.getElementById('quote-modal-backdrop');
  const table = document.getElementById('quote-breakdown-table');
  if (!backdrop || !table) return;

  table.innerHTML = '<div style="text-align:center; padding: 24px; color: var(--gold);">Calculating transparent fare...</div>';
  backdrop.classList.add('open');

  try {
    let subtotalCents = 0;
    let distanceMiles = 0;

    if (HERO_STATE.type === 'hourly') {
      const h = HERO_STATE.hours;
      const tier1Rate = 7500;
      const tier2Rate = 6000;
      const t1 = Math.min(h, 4);
      const t2 = Math.max(0, h - 4);
      subtotalCents = t1 * tier1Rate + t2 * tier2Rate;
    } else {
      const isAirport = (HERO_STATE.pickup.type === 'airport' || HERO_STATE.dropoff.type === 'airport');
      if (isAirport) {
        const ap = HERO_STATE.pickup.type === 'airport' ? HERO_STATE.pickup : HERO_STATE.dropoff;
        const prices = { EWR: 7500, LGA: 15000, JFK: 20000, TEB: 10000, MMU: 10000, TTN: 20000 };
        subtotalCents = prices[ap.code] || 9500;
        distanceMiles = (ap.code === 'EWR') ? 12.4 : (ap.code === 'JFK' ? 32.8 : 18.5);
      } else {
        subtotalCents = 8500;
        distanceMiles = 11.8;
      }
    }

    const gratuityCents = Math.round(subtotalCents * 0.20);
    const totalCents = subtotalCents + gratuityCents;

    HERO_STATE.quote = {
      subtotalCents,
      gratuityCents,
      totalCents,
      distanceMiles,
    };

    renderQuoteBreakdownTable();
  } catch (err) {
    table.innerHTML = `<div class="error-lux">Unable to generate quote: ${esc(err.message)}</div>`;
  }
}

function renderQuoteBreakdownTable() {
  const table = document.getElementById('quote-breakdown-table');
  const q = HERO_STATE.quote;
  if (!table || !q) return;

  const origin = HERO_STATE.pickup ? HERO_STATE.pickup.main : '';
  const dest = HERO_STATE.type === 'hourly' ? `${HERO_STATE.hours} Hours As-Directed Charter` : (HERO_STATE.dropoff ? HERO_STATE.dropoff.main : '');

  table.innerHTML = `
    <div style="background: var(--paper); border: 1px solid var(--line-light); border-radius: var(--radius-sm); padding: 14px 18px; margin-bottom: 18px;">
      <div style="font-size: 11px; text-transform: uppercase; color: var(--gold); font-weight: 600; margin-bottom: 4px;">Route &amp; Schedule</div>
      <div style="font-size: 14.5px; color: var(--ink); font-weight: 600;">${esc(origin)} &rarr; ${esc(dest)}</div>
      <div style="font-size: 12.5px; color: var(--ink-muted); margin-top: 4px;">${esc(HERO_STATE.dateFormatted)} at ${esc(HERO_STATE.timeFormatted)}</div>
    </div>

    <div class="quote-row">
      <span>Base Chauffeured Fare</span>
      <span>${money(q.subtotalCents)}</span>
    </div>
    <div class="quote-row">
      <span>Tolls &amp; Port Authority Surcharges</span>
      <span style="color: var(--gold); font-weight: 600;">Included</span>
    </div>
    <div class="quote-row">
      <span>Chauffeur Gratuity (20% Standard)</span>
      <span>${money(q.gratuityCents)}</span>
    </div>
    <div class="quote-row total">
      <span>Guaranteed Total Fare</span>
      <span class="price">${money(q.totalCents)}</span>
    </div>
  `;
}

function closeQuoteModal() {
  document.getElementById('quote-modal-backdrop')?.classList.remove('open');
}

function proceedToReserveFromQuote() {
  closeQuoteModal();
  resetBook();
  BOOK.type = HERO_STATE.type === 'hourly' ? 'hourly' : 'point_to_point';
  BOOK.date = HERO_STATE.date;
  BOOK.time = HERO_STATE.time;
  BOOK.hours = HERO_STATE.hours;
  if (HERO_STATE.pickup) {
    BOOK.pickup = {
      address: HERO_STATE.pickup.main,
      line1: HERO_STATE.pickup.main,
      state: HERO_STATE.pickup.state,
      lat: HERO_STATE.pickup.lat,
      lng: HERO_STATE.pickup.lng,
    };
  }
  if (HERO_STATE.dropoff && HERO_STATE.type === 'one_way') {
    BOOK.dropoff = {
      address: HERO_STATE.dropoff.main,
      line1: HERO_STATE.dropoff.main,
      state: HERO_STATE.dropoff.state,
      lat: HERO_STATE.dropoff.lat,
      lng: HERO_STATE.dropoff.lng,
    };
  }
  BOOK.quote = {
    subtotal_cents: HERO_STATE.quote ? HERO_STATE.quote.subtotalCents : 8500,
    pricing_method: HERO_STATE.type === 'hourly' ? 'hourly_flat' : 'point_to_point',
  };
  location.hash = '#/book';
}

// ---------------- Interactive Services Slider Controller ----------------
function wireServicesShowcase() {
  const track = document.getElementById('services-slider-track');
  const viewport = document.getElementById('services-slider-viewport');
  const prevBtn = document.getElementById('services-prev-btn');
  const nextBtn = document.getElementById('services-next-btn');
  const dotsContainer = document.getElementById('services-slider-dots');

  if (!track || !viewport) return;

  const cards = Array.from(track.querySelectorAll('.service-slide-card'));
  const totalCards = cards.length;
  let currentSlide = 0;

  function getCardsPerView() {
    return window.innerWidth < 860 ? 1 : 2;
  }

  function getMaxSlideIndex() {
    return Math.max(0, totalCards - getCardsPerView());
  }

  function buildDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxSlideIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `services-slider-dot ${i === currentSlide ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateNavState() {
    if (dotsContainer) {
      Array.from(dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlide);
      });
    }
  }

  function goToSlide(index, animateText = true) {
    const maxIdx = getMaxSlideIndex();
    currentSlide = Math.max(0, Math.min(index, maxIdx));

    const firstCard = cards[0];
    if (firstCard) {
      const cardRect = firstCard.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const gap = 28;
      const offset = currentSlide * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
    }

    const cardsPerView = getCardsPerView();
    cards.forEach((card, idx) => {
      const isVisible = (idx >= currentSlide && idx < currentSlide + cardsPerView);
      if (isVisible) {
        if (animateText) {
          card.classList.remove('in-view');
          void card.offsetWidth; // Force DOM reflow to retrigger CSS animation
          card.classList.add('in-view');
        } else {
          card.classList.add('in-view');
        }
      } else {
        card.classList.remove('in-view');
      }
    });

    updateNavState();
  }

  prevBtn?.addEventListener('click', () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1);
    else goToSlide(getMaxSlideIndex());
  });

  nextBtn?.addEventListener('click', () => {
    if (currentSlide < getMaxSlideIndex()) goToSlide(currentSlide + 1);
    else goToSlide(0);
  });

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextBtn?.click();
      else prevBtn?.click();
    }
  }, { passive: true });

  // Handle window resize
  window.addEventListener('resize', () => {
    buildDots();
    goToSlide(currentSlide, false);
  });

  // Circular Action Arrow buttons on cards: prefill service & scroll to booking bar
  track.querySelectorAll('.service-card-arrow-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const svc = btn.getAttribute('data-service');
      const hero = document.getElementById('hero');
      hero?.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        if (svc === 'hourly' || svc === 'corporate') {
          document.getElementById('hero-tab-hourly')?.click();
        } else {
          document.getElementById('hero-tab-oneway')?.click();
        }
        document.getElementById('trigger-pickup')?.click();
      }, 400);
    });
  });

  buildDots();
  goToSlide(0, true);
}

// ---------------- Testimonials Carousel ----------------
let currentTestimonial = 0;
function wireTestimonialsCarousel() {
  const slides = [
    document.getElementById('testi-slide-0'),
    document.getElementById('testi-slide-1'),
    document.getElementById('testi-slide-2')
  ];
  const counter = document.getElementById('testi-counter');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');

  function showSlide(idx) {
    currentTestimonial = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s?.classList.toggle('active', i === currentTestimonial));
    if (counter) counter.textContent = `0${currentTestimonial + 1} / 0${slides.length}`;
  }

  prevBtn?.addEventListener('click', () => showSlide(currentTestimonial - 1));
  nextBtn?.addEventListener('click', () => showSlide(currentTestimonial + 1));
}

// ---------------- Discount Subscription Form ----------------
function wireDiscountForm() {
  const form = document.getElementById('discount-sub-form');
  const input = document.getElementById('discount-email-input');
  const feedback = document.getElementById('discount-feedback');
  const video = document.getElementById('discount-promo-video');

  // Ensure promo background video plays reliably across all browsers and devices
  if (video) {
    if (!video.src) {
      video.src = '/email-section.mp4';
      video.load();
    }
    const tryPlay = () => {
      if (video.paused) {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            // Autoplay may wait for user interaction on low power mode
          });
        }
      }
    };
    tryPlay();
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tryPlay();
          }
        });
      }, { threshold: 0.15 });
      videoObserver.observe(video);
    }
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input?.value.trim();
    if (!email) return;

    // Display refined luxury confirmation badge
    if (feedback) {
      feedback.innerHTML = `<div class="discount-feedback-success" role="alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--gold-light); flex-shrink: 0;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>Thank you! Your 10% privilege promo code has been reserved for <strong style="color:#FFFFFF; font-weight:600;">${esc(email)}</strong>.</span>
      </div>`;
    }

    if (input) input.value = '';
  });
}

// ---------------- Contact Form on Home ----------------
async function onHomeContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const alertBox = document.getElementById('contact-alert');
  const fd = new FormData(form);
  const data = Object.fromEntries(fd);

  try {
    await api('/api/contact', { method: 'POST', body: JSON.stringify(data) });
    if (alertBox) alertBox.innerHTML = `<div class="success-lux">Thank you, ${esc(data.name)}. Your dispatch inquiry has been received. Our concierge will follow up promptly.</div>`;
    form.reset();
  } catch (err) {
    if (alertBox) alertBox.innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
  }
}

// ==========================================================================
// EDITORIAL TYPOGRAPHY PINNED SCROLL ANIMATION
// Sophisticated, cinematic, scroll-driven word-by-word reveal (GSAP + ScrollTrigger)
// ==========================================================================
function initEditorialScrollAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Clean up any existing trigger on re-render / route navigation
  const existingTrigger = ScrollTrigger.getById('editorialPinTrigger');
  if (existingTrigger) existingTrigger.kill(true);

  const sectionEl = document.getElementById('standards');
  const stageEl = document.getElementById('editorial-stage');
  const eyebrowEl = document.getElementById('editorial-eyebrow');
  const scrollHintEl = document.getElementById('editorial-scroll-hint');
  const headlineWords = gsap.utils.toArray('.editorial-word');
  const bodyWords = gsap.utils.toArray('.editorial-body-word');

  if (!sectionEl || !stageEl || !headlineWords.length) return;

  // Reduced motion support: Dignified resting state, zero blur/rotation
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(eyebrowEl, { opacity: 1, y: 0, filter: 'none', clearProps: 'all' });
    gsap.set(headlineWords, { opacity: 1, y: 0, x: 0, rotateZ: 0, skewY: 0, filter: 'none', clearProps: 'all' });
    gsap.set(bodyWords, { opacity: 1, y: 0, x: 0, filter: 'none', clearProps: 'all' });
    if (scrollHintEl) scrollHintEl.style.display = 'none';
    return;
  }

  // Device-aware responsive adjustments
  const isMobile = window.innerWidth <= 640;
  const isTablet = window.innerWidth <= 1024 && !isMobile;
  const scrollDistance = isMobile ? '+=140%' : (isTablet ? '+=180%' : '+=230%');
  const scrubSpeed = isMobile ? 0.9 : 1.2;
  const blurMax = isMobile ? 8 : (isTablet ? 12 : 15);

  // Set subtle bespoke initial offsets for each headline word
  // Avoids identical mechanical transforms, creating an authentic organic depth
  headlineWords.forEach((word, idx) => {
    const yOffset = isMobile ? (16 + (idx % 3) * 3) : (32 + ((idx * 7) % 11) - 4);
    const xOffset = isMobile ? (-3 + (idx % 2) * 2) : (-8 + ((idx * 5) % 9) - 4);
    const rotOffset = isMobile ? 0 : (-1.8 + ((idx * 3) % 5) * 0.8);
    const skewOffset = isMobile ? 0 : (1.6 - ((idx * 2) % 4) * 0.8);
    const opac = 0.20 + (idx % 3) * 0.04;

    gsap.set(word, {
      opacity: opac,
      y: yOffset,
      x: xOffset,
      rotateZ: rotOffset,
      skewY: skewOffset,
      filter: `blur(${blurMax}px)`,
      transformOrigin: 'center bottom',
      force3D: true
    });
  });

  // Set restrained initial offsets for body words
  const bodyBlurMax = isMobile ? 5 : 8;
  bodyWords.forEach((bWord, idx) => {
    const bY = isMobile ? 10 : (16 + ((idx * 3) % 5) - 2);
    const bX = isMobile ? -2 : (-3 + ((idx * 2) % 4) - 1.5);
    const bOpac = 0.22 + (idx % 3) * 0.04;

    gsap.set(bWord, {
      opacity: bOpac,
      y: bY,
      x: bX,
      rotateZ: 0,
      skewY: 0,
      filter: `blur(${bodyBlurMax}px)`,
      force3D: true
    });
  });

  // Set initial eyebrow state
  gsap.set(eyebrowEl, {
    opacity: 0,
    y: isMobile ? 12 : 18,
    filter: 'blur(4px)',
    force3D: true
  });

  // Coordinated Master Timeline with ScrollTrigger scrub
  const masterTl = gsap.timeline({
    scrollTrigger: {
      id: 'editorialPinTrigger',
      trigger: sectionEl,
      start: 'top top',
      end: scrollDistance,
      pin: stageEl,
      pinSpacing: true,
      scrub: scrubSpeed,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Fade out the scroll indicator mouse hint as user initiates scroll
        if (scrollHintEl) {
          const hintOpac = Math.max(0, 1 - self.progress * 4.5);
          scrollHintEl.style.opacity = (hintOpac * 0.55).toFixed(3);
          scrollHintEl.style.pointerEvents = hintOpac <= 0.05 ? 'none' : 'auto';
        }
      }
    }
  });

  // PHASE 02: Eyebrow subtle reveal
  masterTl.to(eyebrowEl, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.85,
    ease: 'power2.out'
  }, 0.1);

  // PHASES 03, 04, 05: Headline words reveal sequentially
  const numHeadWords = headlineWords.length;
  const headStart = 0.65;
  const headEnd = 5.5;
  const headDuration = Math.min(1.7, (headEnd - headStart) * 0.42);
  const headStagger = numHeadWords > 1 ? (headEnd - headStart - headDuration) / (numHeadWords - 1) : 0;

  headlineWords.forEach((word, idx) => {
    const wordStart = headStart + (idx * headStagger);
    masterTl.to(word, {
      opacity: 1,
      y: 0,
      x: 0,
      rotateZ: 0,
      skewY: 0,
      filter: 'blur(0px)',
      duration: headDuration,
      ease: 'power2.out'
    }, wordStart);
  });

  // PHASES 06 & 07: Body text words reveal (starts when headline reaches ~90%)
  const numBodyWords = bodyWords.length;
  const bodyStart = 4.9;
  const bodyEnd = 7.8;
  const bodyDuration = Math.min(0.95, (bodyEnd - bodyStart) * 0.38);
  const bodyStagger = numBodyWords > 1 ? (bodyEnd - bodyStart - bodyDuration) / (numBodyWords - 1) : 0;

  bodyWords.forEach((bWord, idx) => {
    const bWordStart = bodyStart + (idx * bodyStagger);
    masterTl.to(bWord, {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      duration: bodyDuration,
      ease: 'power2.out'
    }, bWordStart);
  });

  // PHASE 08: Final composition holds (from 7.8s to 10.0s = 22% of total scroll distance)
  // All typography remains perfectly crisp, aligned, and pixel-stable
  masterTl.to({}, { duration: 2.2 }, 7.8);
}

// ==========================================================================
// CINEMATIC PINNED IMAGE STACK SCROLL ANIMATION
// 4-Layer upward physical reveal with coordinated glassmorphism telemetry
// ==========================================================================
function initCinematicStackAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const existing = ScrollTrigger.getById('cinematicStackTrigger');
  if (existing) existing.kill(true);

  const existingHeader = ScrollTrigger.getById('cinematicHeaderTrigger');
  if (existingHeader) existingHeader.kill(true);

  const sectionEl = document.getElementById('service-qualities');
  const stageWrapperEl = document.getElementById('cinematic-stage-wrapper');
  if (!sectionEl || !stageWrapperEl) return;

  const layers = gsap.utils.toArray('.cinematic-slide-layer');
  const panels = gsap.utils.toArray('.cinematic-glass-panel');
  const progressSegs = gsap.utils.toArray('.cinematic-progress-seg');
  const badgeNumEl = document.getElementById('cinematic-badge-num');

  if (!layers.length || !panels.length) return;

  // Preload all story images to guarantee instantaneous rendering without scroll stutter
  if (typeof CINEMATIC_STORIES_DATA !== 'undefined' && Array.isArray(CINEMATIC_STORIES_DATA)) {
    CINEMATIC_STORIES_DATA.forEach(story => {
      if (story.image) {
        const img = new Image();
        img.src = story.image;
      }
    });
  }

  // Section Header entrance animation as section approaches
  const headerEl = sectionEl.querySelector('.cinematic-section-header');
  if (headerEl) {
    gsap.fromTo(headerEl, 
      { opacity: 0, y: 28 },
      {
        scrollTrigger: {
          id: 'cinematicHeaderTrigger',
          trigger: sectionEl,
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out'
      }
    );
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    layers.forEach((layer, idx) => {
      gsap.set(layer, {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: idx === layers.length - 1 ? 1 : 0,
        clearProps: 'transform'
      });
    });
    panels.forEach((panel, idx) => {
      gsap.set(panel, {
        opacity: idx === 0 ? 1 : 0,
        y: 0,
        filter: 'none',
        pointerEvents: idx === 0 ? 'auto' : 'none'
      });
    });
    return;
  }

  const isMobile = window.innerWidth <= 640;
  const isTablet = window.innerWidth > 640 && window.innerWidth <= 1024;

  const scrollDistance = isMobile ? '+=280%' : (isTablet ? '+=360%' : '+=450%');
  const scrubSpeed = isMobile ? 0.8 : (isTablet ? 1.0 : 1.2);

  // Set initial states
  // Layer 0: fully visible base
  gsap.set(layers[0], {
    clipPath: 'inset(0% 0% 0% 0%)',
    force3D: true
  });
  const firstImg = layers[0].querySelector('.cinematic-slide-img');
  if (firstImg) {
    gsap.set(firstImg, { scale: 1.0, y: '0%', force3D: true });
  }

  // Layers 1..N: clipped at bottom, ready to wipe upward with Ken Burns scale & parallax
  for (let i = 1; i < layers.length; i++) {
    gsap.set(layers[i], {
      clipPath: 'inset(100% 0% 0% 0%)',
      force3D: true
    });
    const img = layers[i].querySelector('.cinematic-slide-img');
    if (img) {
      gsap.set(img, {
        scale: 1.08,
        y: '6%',
        force3D: true
      });
    }
  }

  // Panels initial state: Panel 0 visible, Panels 1..N hidden with blur & offset
  panels.forEach((panel, idx) => {
    if (idx === 0) {
      gsap.set(panel, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        pointerEvents: 'auto',
        force3D: true
      });
    } else {
      gsap.set(panel, {
        opacity: 0,
        y: 26,
        filter: 'blur(10px)',
        pointerEvents: 'none',
        force3D: true
      });
    }
  });

  // Progress segments initial state
  progressSegs.forEach((seg, idx) => {
    seg.classList.toggle('active', idx === 0);
  });
  if (badgeNumEl) badgeNumEl.textContent = '01';

  // Master Pinning & Reveal Timeline
  const masterTl = gsap.timeline({
    scrollTrigger: {
      id: 'cinematicStackTrigger',
      trigger: stageWrapperEl,
      start: 'top top',
      end: scrollDistance,
      pin: stageWrapperEl,
      pinSpacing: true,
      scrub: scrubSpeed,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        let activeIdx = 0;
        if (p >= 0.73) activeIdx = 3;
        else if (p >= 0.47) activeIdx = 2;
        else if (p >= 0.20) activeIdx = 1;
        else activeIdx = 0;

        if (badgeNumEl && badgeNumEl.textContent !== `0${activeIdx + 1}`) {
          badgeNumEl.textContent = `0${activeIdx + 1}`;
        }
        progressSegs.forEach((seg, sIdx) => {
          seg.classList.toggle('active', sIdx === activeIdx);
        });
        panels.forEach((pnl, pIdx) => {
          pnl.style.pointerEvents = (pIdx === activeIdx) ? 'auto' : 'none';
        });
      }
    }
  });

  // Pacing Architecture:
  // Balanced editorial presentation with generous reading holds and seamless cross-dissolve:
  // - Story 01 Hold: 0.0s to 1.8s
  // - Transition 01 -> 02: 1.8s to 3.3s
  // - Story 02 Hold: 3.3s to 5.1s
  // - Transition 02 -> 03: 5.1s to 6.6s
  // - Story 03 Hold: 6.6s to 8.4s
  // - Transition 03 -> 04: 8.4s to 9.9s
  // - Story 04 Final Hold: 9.9s to 12.5s
  const holdDuration = 1.8;
  const clipDuration = 1.5;
  const panelFadeDuration = 0.6;
  const panelRevealDuration = 0.7;
  let cursor = 1.8; // Initial hold for Story 01

  for (let i = 1; i < layers.length; i++) {
    const prevLayer = layers[i - 1];
    const currLayer = layers[i];
    const prevImg = prevLayer.querySelector('.cinematic-slide-img');
    const currImg = currLayer.querySelector('.cinematic-slide-img');
    const prevPanel = panels[i - 1];
    const currPanel = panels[i];

    // 1. Incoming layer clip-path reveals upward smoothly
    masterTl.to(currLayer, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: clipDuration,
      ease: 'power1.inOut'
    }, cursor);

    // 2. Ken Burns scale & parallax settling on incoming image
    if (currImg) {
      masterTl.to(currImg, {
        scale: 1.0,
        y: '0%',
        duration: clipDuration,
        ease: 'power1.out'
      }, cursor);
    }

    // 3. Subtle parallax drift on outgoing image
    if (prevImg) {
      masterTl.to(prevImg, {
        y: '-4%',
        scale: 1.03,
        duration: clipDuration,
        ease: 'power1.inOut'
      }, cursor);
    }

    // 4. Outgoing panel begins retiring at ~20% of image reveal (fades, blurs, moves downward)
    masterTl.to(prevPanel, {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
      duration: panelFadeDuration,
      ease: 'power2.inOut'
    }, cursor + 0.3);

    // 5. Incoming panel emerges with seamless cross-dissolve at ~45% of image reveal
    masterTl.to(currPanel, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: panelRevealDuration,
      ease: 'power2.out'
    }, cursor + 0.7);

    // Advance cursor to end of transition + reading hold window
    cursor = cursor + clipDuration + holdDuration;
  }

  // Final hold on Story 04 before natural unpinning release into About section
  masterTl.to({}, { duration: 0.8 }, cursor);
}

// ==========================================================================
// HERO SECTION EXIT ANIMATION (SMOOTH PARALLAX & RETIRING MOTION)
// ==========================================================================
function initHeroExitAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const existing = ScrollTrigger.getById('heroExitTrigger');
  if (existing) existing.kill(true);

  const heroEl = document.getElementById('hero');
  if (!heroEl) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const heroHeadline = heroEl.querySelector('.hero-headline-group');

  if (heroHeadline) {
    gsap.to(heroHeadline, {
      scrollTrigger: {
        id: 'heroExitTrigger',
        trigger: heroEl,
        start: 'top top',
        end: 'bottom 35%',
        scrub: 0.6,
      },
      y: -35,
      opacity: 0.35,
      ease: 'none'
    });
  }
}

// ==========================================================================
// SERVICES SECTION SCRUB ANIMATION (WORD-BY-WORD REVEAL WITH GSAP SCRUB)
// Matches user specification: Starts with blur/displacement/rotation, scrubs into place
// ==========================================================================
function initServicesScrollAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const existing = ScrollTrigger.getById('servicesScrubTrigger');
  if (existing) existing.kill(true);

  const sectionEl = document.getElementById('services');
  const words = gsap.utils.toArray('#services-main-title .reveal-word');
  const subtitle = document.getElementById('services-main-subtitle');
  const sliderViewport = document.getElementById('services-slider-viewport');

  if (!sectionEl || !words.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(words, { opacity: 1, y: 0, x: 0, rotateZ: 0, filter: 'none', clearProps: 'all' });
    if (subtitle) gsap.set(subtitle, { opacity: 1, y: 0, filter: 'none', clearProps: 'all' });
    if (sliderViewport) gsap.set(sliderViewport, { opacity: 1, y: 0, clearProps: 'all' });
    return;
  }

  // Initial states as requested:
  // Starts: opacity: 0, filter: blur(12px), y: 48px, x: -6px, rotateZ: -1.5deg
  words.forEach((word, idx) => {
    gsap.set(word, {
      opacity: 0,
      y: 48 + ((idx % 3) * 4),
      x: -6 + ((idx % 2) * 3),
      rotateZ: -1.5 + ((idx % 3) * 0.8),
      filter: 'blur(12px)',
      force3D: true
    });
  });

  if (subtitle) {
    gsap.set(subtitle, {
      opacity: 0.2,
      y: 26,
      filter: 'blur(8px)',
      force3D: true
    });
  }

  if (sliderViewport) {
    gsap.set(sliderViewport, {
      opacity: 0.2,
      y: 36,
      force3D: true
    });
  }

  // Master timeline tied to scroll speed (scrub: 0.8, fully reversible)
  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'servicesScrubTrigger',
      trigger: sectionEl,
      start: 'top 85%',
      end: 'top 25%',
      scrub: 0.8,
      invalidateOnRefresh: true,
    }
  });

  // Staggered word-by-word reveal
  words.forEach((word, idx) => {
    tl.to(word, {
      opacity: 1,
      y: 0,
      x: 0,
      rotateZ: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power2.out'
    }, idx * 0.18);
  });

  // Subtitle reveals when heading is ~75% complete
  if (subtitle) {
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.7,
      ease: 'power2.out'
    }, 1.0);
  }

  // Service cards rise into view smoothly
  if (sliderViewport) {
    tl.to(sliderViewport, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, 1.25);
  }
}

// ==========================================================================
// SOLID-COLOR SECTION-TO-SECTION TRANSITIONS (NO GRADIENTS, CLEAN RECTANGULAR WIPES)
// Driven cleanly by user scroll with full bidirectional reversibility
// ==========================================================================
function initSolidColorTransitions() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.utils.toArray('.solid-color-wipe').forEach((wipe, idx) => {
    const triggerId = `solidWipe_${idx}`;
    const existing = ScrollTrigger.getById(triggerId);
    if (existing) existing.kill(true);

    const blade = wipe.querySelector('.solid-wipe-blade');
    if (!blade) return;

    if (prefersReducedMotion) {
      gsap.set(blade, { clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }

    gsap.fromTo(blade,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'none',
        scrollTrigger: {
          id: triggerId,
          trigger: wipe,
          start: 'top 90%',
          end: 'bottom 45%',
          scrub: 0.35,
          invalidateOnRefresh: true
        }
      }
    );
  });
}

// ==========================================================================
// LUXURY FOOTER SCROLL CHOREOGRAPHY (GSAP + ScrollTrigger)
// Letter-by-letter upward arrival, blur dissipation, and full bidirectional
// scroll-driven reversibility.
// ==========================================================================
function initFooterAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const existing = ScrollTrigger.getById('footerScrollMaster');
  if (existing) existing.kill(true);

  const footerEl = document.querySelector('footer.site-footer');
  if (!footerEl) return;

  const primaryLogo = footerEl.querySelector('.footer-primary-logo');
  const mark = footerEl.querySelector('.footer-logo-mark');
  const letters = footerEl.querySelectorAll('.footer-logo-letter');
  const topCols = footerEl.querySelectorAll('.footer-col');
  const bottomBar = footerEl.querySelector('.footer-bottom-bar');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    if (primaryLogo) gsap.set(primaryLogo, { opacity: 1, y: 0, filter: 'none' });
    if (mark) gsap.set(mark, { opacity: 1, y: 0, filter: 'none' });
    if (letters.length) gsap.set(letters, { opacity: 1, y: 0, filter: 'none' });
    if (topCols.length) gsap.set(topCols, { opacity: 1, y: 0, filter: 'none' });
    if (bottomBar) gsap.set(bottomBar, { opacity: 1, y: 0 });
    return;
  }

  // Initial State: lowered, blurred, transparent
  if (primaryLogo) {
    gsap.set(primaryLogo, {
      opacity: 0,
      y: 35,
      filter: 'blur(8px)',
      force3D: true
    });
  }

  if (mark) {
    gsap.set(mark, {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
      force3D: true
    });
  }

  if (letters.length) {
    gsap.set(letters, {
      opacity: 0,
      y: 45,
      filter: 'blur(12px)',
      force3D: true
    });
  }

  if (topCols.length) {
    gsap.set(topCols, {
      opacity: 0,
      y: 24,
      filter: 'blur(4px)',
      force3D: true
    });
  }

  if (bottomBar) {
    gsap.set(bottomBar, {
      opacity: 0,
      y: 16,
      force3D: true
    });
  }

  // Master Coordinated Cinematic Scroll Reveal Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'footerScrollMaster',
      trigger: footerEl,
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
      invalidateOnRefresh: true
    }
  });

  // 1. Top information columns rise gracefully
  if (topCols.length) {
    tl.to(topCols, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.65,
      stagger: 0.06,
      ease: 'power3.out'
    }, 0);
  }

  // 2. Primary Wide Logo / Emblem mark ascends with majestic presence
  if (primaryLogo) {
    tl.to(primaryLogo, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.95,
      ease: 'power3.out'
    }, 0.15);
  } else if (mark) {
    tl.to(mark, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'power3.out'
    }, 0.1);
  }

  // 3. Brand letters sequence sequentially if present
  if (letters.length) {
    tl.to(letters, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out'
    }, 0.2);
  }

  // 4. Centered copyright & legal bar completes the composition
  if (bottomBar) {
    tl.to(bottomBar, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, 0.35);
  }
}

// ---------------- GSAP ScrollTrigger Motion ----------------
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero exit subtle parallax / fade
  initHeroExitAnimation();

  // 2. Services section word-by-word scrub reveal
  initServicesScrollAnimation();

  // 3. Universal solid color section transitions (clean rectangular wipe layers)
  initSolidColorTransitions();

  // 4. Initialize the cinematic editorial typography pinned sequence
  initEditorialScrollAnimation();

  // 5. Initialize the pinned cinematic image stack storytelling sequence
  initCinematicStackAnimation();

  // 6. About section scroll reveal (triggers on scroll to #about)
  initAboutRevealAnimation();

  // 7. Statistical boxes running number animation (triggers on scroll to #about-stats-row)
  initStatsCounterAnimation();

  // 8. Solid section color scroll transitions (smooth solid transitions between sections)
  initSectionColorTransition();

  // 9. Luxury Footer cinematic scroll reveal
  initFooterAnimation();

  // Refresh all triggers after pinning pin-spacers are created
  ScrollTrigger.refresh();
}

// ---------------- About Section Scroll Reveal ----------------
function initAboutRevealAnimation() {
  const aboutSec = document.getElementById('about');
  if (!aboutSec) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutSec.classList.add('about-revealed');
        observer.unobserve(aboutSec);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(aboutSec);
}

// ---------------- Statistical Boxes Running Counter Animation ----------------
function initStatsCounterAnimation() {
  const statsRow = document.getElementById('about-stats-row');
  if (!statsRow) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumbers();
        observer.unobserve(statsRow);
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -30px 0px'
  });

  observer.observe(statsRow);

  function animateNumbers() {
    const numEls = statsRow.querySelectorAll('.about-stat-number');
    const duration = 2200; // 2.2 seconds running animation

    numEls.forEach((el, idx) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const startDelay = idx * 100;
      let startTimestamp = null;

      function step(currentTime) {
        if (!startTimestamp) startTimestamp = currentTime;
        const elapsed = currentTime - startTimestamp - startDelay;

        if (elapsed < 0) {
          requestAnimationFrame(step);
          return;
        }

        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo for dramatic deceleration and landing
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(ease * target);

        el.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = `${prefix}${target}${suffix}`;
          el.classList.add('stat-locked');
        }
      }

      requestAnimationFrame(step);
    });
  }
}

// ---------------- Solid Section Color Scroll Transitions ----------------
function initSectionColorTransition() {
  const sections = document.querySelectorAll('section[id], footer.site-footer');
  if (!sections.length) return;

  const colorMap = {
    'hero': '#12141A',
    'services': '#FAF8F5',
    'standards': '#12141A',
    'service-qualities': '#FAF8F5',
    'about': '#FAF8F5',
    'map': '#12141A',
    'testimonials': '#F5F1E8',
    'discount-promo': '#12141A',
    'contact': '#FAF8F5',
    'footer': '#12141A'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id || (entry.target.classList.contains('site-footer') ? 'footer' : '');
        const targetColor = colorMap[id];
        if (targetColor) {
          document.body.style.backgroundColor = targetColor;
          document.documentElement.style.backgroundColor = targetColor;
          const isDark = (targetColor === '#12141A');
          document.body.setAttribute('data-active-theme', isDark ? 'dark' : 'light');
        }
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-10% 0px -40% 0px'
  });

  sections.forEach(sec => observer.observe(sec));
}

// ==========================================================================
// RESERVATION FLOW (#/book)
// ==========================================================================
function renderBookGate() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <section class="container" style="padding:150px 24px 90px;max-width:480px">
    <div style="text-align:center;margin-bottom:28px">
      <div class="hero-eyebrow" style="justify-content:center;">Client Portal</div>
      <h1 style="font-size:36px;">Reserve Your Ride</h1>
      <p style="color:var(--ink-muted);font-size:15px;margin-top:10px;">
        Sign in for expedited checkout with your saved profile, or continue as our executive guest.
      </p>
    </div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <button class="btn-gold" id="gate-login-btn" type="button" style="width:100%;justify-content:center">Sign In / Create Account &rarr;</button>
      <button class="btn-glass" id="gate-guest-btn" type="button" style="width:100%;justify-content:center">Continue as Executive Guest</button>
    </div>
  </section>`;

  document.getElementById('gate-login-btn')?.addEventListener('click', () => {
    ACCOUNT.returnTo = '#/book';
    location.hash = '#/account';
  });
  document.getElementById('gate-guest-btn')?.addEventListener('click', () => {
    bookGatePassed = true;
    renderBook();
  });
}

function renderBook() {
  if (!CUST.token && !bookGatePassed) return renderBookGate();
  if (BOOK.phase === 'checkout') return renderCheckout();
  if (BOOK.phase === 'success') return renderBookingSuccess();

  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="booking-page-wrap">
    <div style="margin-bottom:28px">
      <div class="hero-eyebrow">Reservation</div>
      <h1 style="font-size:38px;">Select Itinerary Details</h1>
    </div>

    <div class="booking-widget-lux">
      <div class="booking-tabs-center" id="type-tabs" style="margin-bottom: 24px;">
        <button type="button" class="booking-tab-pill ${BOOK.type === 'point_to_point' ? 'active' : ''}" data-type="point_to_point">Point-to-Point</button>
        <button type="button" class="booking-tab-pill ${BOOK.type === 'hourly' ? 'active' : ''}" data-type="hourly">Hourly Charter</button>
        <button type="button" class="booking-tab-pill ${BOOK.type === 'airport' ? 'active' : ''}" data-type="airport">Airport Transfer</button>
      </div>

      <div id="book-fields">${renderBookFields()}</div>

      <div id="quote-box" style="margin: 20px 0;">${renderQuoteBox()}</div>

      <div id="book-error"></div>

      <button class="btn-gold" style="width:100%;justify-content:center" id="continue-btn" ${BOOK.quote ? '' : 'disabled'}>
        Proceed to Confirmation &rarr;
      </button>
    </div>
  </div>`;

  wireBookEvents();
}

function renderBookFields() {
  const todayStr = new Date().toISOString().split('T')[0];
  let html = `
    <div class="field-row-2">
      <div class="field-lux">
        <label>Date</label>
        <input type="date" id="date-input" value="${esc(BOOK.date)}" min="${todayStr}">
      </div>
      <div class="field-lux">
        <label>Pickup Time</label>
        <input type="time" id="time-input" value="${esc(BOOK.time || '09:00')}">
      </div>
    </div>
  `;

  if (BOOK.type === 'hourly') {
    html += `
      <div class="field-lux">
        <label>Pickup Address (New Jersey)</label>
        <input type="text" id="pickup-input" placeholder="Address, hotel or landmark in NJ" value="${esc(BOOK.pickup.address || '')}">
      </div>
      <div class="field-lux">
        <label>Duration (Hours)</label>
        <select id="hours-input">
          ${[2, 3, 4, 5, 6, 8, 10, 12].map(h => `<option value="${h}" ${BOOK.hours === h ? 'selected' : ''}>${h} Hours &bull; ${h * 25} miles included</option>`).join('')}
        </select>
      </div>
    `;
  } else if (BOOK.type === 'point_to_point') {
    html += `
      <div class="field-lux">
        <label>Pickup Address</label>
        <input type="text" id="pickup-input" placeholder="Pickup in NJ or NY" value="${esc(BOOK.pickup.address || '')}">
      </div>
      <div class="field-lux">
        <label>Drop-off Address</label>
        <input type="text" id="dropoff-input" placeholder="Destination in NJ or NY" value="${esc(BOOK.dropoff.address || '')}">
      </div>
    `;
  } else if (BOOK.type === 'airport') {
    html += `
      <div class="field-row-2">
        <div class="field-lux">
          <label>Airport</label>
          <select id="airport-code-input">
            <option value="EWR" ${BOOK.airport_code === 'EWR' ? 'selected' : ''}>Newark Liberty (EWR)</option>
            <option value="JFK" ${BOOK.airport_code === 'JFK' ? 'selected' : ''}>John F. Kennedy (JFK)</option>
            <option value="LGA" ${BOOK.airport_code === 'LGA' ? 'selected' : ''}>LaGuardia (LGA)</option>
            <option value="TEB" ${BOOK.airport_code === 'TEB' ? 'selected' : ''}>Teterboro (TEB)</option>
            <option value="MMU" ${BOOK.airport_code === 'MMU' ? 'selected' : ''}>Morristown (MMU)</option>
          </select>
        </div>
        <div class="field-lux">
          <label>Direction</label>
          <select id="direction-input">
            <option value="pickup" ${BOOK.direction === 'pickup' ? 'selected' : ''}>Arriving Flight (Airport Pickup)</option>
            <option value="dropoff" ${BOOK.direction === 'dropoff' ? 'selected' : ''}>Departing Flight (Airport Drop-off)</option>
          </select>
        </div>
      </div>
      <div class="field-lux">
        <label>${BOOK.direction === 'pickup' ? 'Drop-off Destination' : 'Pickup Address'}</label>
        <input type="text" id="airport-address-input" placeholder="Hotel, residence or office address" value="${esc(BOOK.other.address || '')}">
      </div>
      <div class="field-lux">
        <label>Flight Number (Optional)</label>
        <input type="text" id="flight-number-input" placeholder="e.g. UA 1234 or NetJets Tail #" value="${esc(BOOK.flight_number || '')}">
      </div>
    `;
  }

  html += `
    <div class="field-row-2">
      <div class="field-lux">
        <label>Executive Passengers</label>
        <select id="passenger-count-input">
          ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${BOOK.passenger_count === n ? 'selected' : ''}>${n} Passenger${n > 1 ? 's' : ''}</option>`).join('')}
        </select>
      </div>
      <div class="field-lux">
        <label>Luggage Pieces</label>
        <select id="luggage-count-input">
          ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${BOOK.luggage_count === n ? 'selected' : ''}>${n} Checked Bag${n > 1 ? 's' : ''}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="field-lux">
      <label>Special Instructions / Preferences</label>
      <textarea id="notes-input" rows="2" placeholder="e.g. Child seat, quiet ride, preferred temperature...">${esc(BOOK.notes)}</textarea>
    </div>
  `;

  return html;
}

function renderQuoteBox() {
  if (BOOK.quoteLoading) {
    return `<div style="padding:16px;text-align:center;color:var(--gold);">Calculating real-time fare...</div>`;
  }
  if (!BOOK.quote) {
    return `<div style="padding:16px;background:var(--paper);border:1px solid var(--line-light);border-radius:var(--radius-sm);color:var(--ink-muted);font-size:13px;text-align:center;">
      Enter your trip details above for a transparent, guaranteed quote.
    </div>`;
  }
  const q = BOOK.quote;
  return `
    <div style="background: var(--paper); border: 1px solid var(--gold-border); border-radius: var(--radius-sm); padding: 18px;">
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px;">
        <span style="color:var(--ink-muted);">Base Fare</span>
        <span style="color:var(--ink);font-weight:600;">${money(q.subtotal_cents)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px;">
        <span style="color:var(--ink-muted);">Tolls &amp; Port Fees</span>
        <span style="color:var(--gold);font-weight:600;">Included</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;border-top:1px solid var(--line-light);padding-top:12px;margin-top:6px;">
        <span style="color:var(--ink);">Subtotal</span>
        <span style="color:var(--gold);">${money(q.subtotal_cents)}</span>
      </div>
      <p style="font-size:12px;color:var(--ink-dim);margin:8px 0 0;">20% standard gratuity is applied at final confirmation.</p>
    </div>
  `;
}

function wireBookEvents() {
  document.querySelectorAll('#type-tabs .booking-tab-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      BOOK.type = btn.getAttribute('data-type');
      renderBook();
    });
  });

  const dateI = document.getElementById('date-input');
  dateI?.addEventListener('change', e => { BOOK.date = e.target.value; calculateBookQuote(); });

  const timeI = document.getElementById('time-input');
  timeI?.addEventListener('change', e => { BOOK.time = e.target.value; calculateBookQuote(); });

  const hoursSel = document.getElementById('hours-input');
  hoursSel?.addEventListener('change', e => { BOOK.hours = Number(e.target.value); calculateBookQuote(); });

  const pickupI = document.getElementById('pickup-input');
  pickupI?.addEventListener('input', e => {
    BOOK.pickup = { address: e.target.value, line1: e.target.value, state: 'NJ' };
    calculateBookQuote();
  });

  const dropoffI = document.getElementById('dropoff-input');
  dropoffI?.addEventListener('input', e => {
    BOOK.dropoff = { address: e.target.value, line1: e.target.value, state: 'NY' };
    calculateBookQuote();
  });

  const airportAddr = document.getElementById('airport-address-input');
  airportAddr?.addEventListener('input', e => {
    BOOK.other = { address: e.target.value, line1: e.target.value, state: 'NJ' };
    calculateBookQuote();
  });

  const pax = document.getElementById('passenger-count-input');
  pax?.addEventListener('change', e => BOOK.passenger_count = Number(e.target.value));

  const lug = document.getElementById('luggage-count-input');
  lug?.addEventListener('change', e => BOOK.luggage_count = Number(e.target.value));

  const notes = document.getElementById('notes-input');
  notes?.addEventListener('input', e => BOOK.notes = e.target.value);

  const airportSel = document.getElementById('airport-code-input');
  airportSel?.addEventListener('change', e => { BOOK.airport_code = e.target.value; calculateBookQuote(); });

  const dirSel = document.getElementById('direction-input');
  dirSel?.addEventListener('change', e => { BOOK.direction = e.target.value; renderBook(); });

  const continueBtn = document.getElementById('continue-btn');
  continueBtn?.addEventListener('click', () => {
    BOOK.phase = 'checkout';
    renderBook();
  });

  if (!BOOK.quote) calculateBookQuote();
}

async function calculateBookQuote() {
  if (BOOK.type === 'hourly') {
    const t1 = Math.min(BOOK.hours, 4);
    const t2 = Math.max(0, BOOK.hours - 4);
    BOOK.quote = { subtotal_cents: t1 * 7500 + t2 * 6000 };
  } else if (BOOK.type === 'airport') {
    const prices = { EWR: 7500, LGA: 15000, JFK: 20000, TEB: 10000, MMU: 10000, TTN: 20000 };
    BOOK.quote = { subtotal_cents: prices[BOOK.airport_code] || 9500 };
  } else {
    BOOK.quote = { subtotal_cents: 8500 };
  }
  const box = document.getElementById('quote-box');
  if (box) box.innerHTML = renderQuoteBox();
  const btn = document.getElementById('continue-btn');
  if (btn) btn.disabled = !BOOK.quote;
}

// ---------------- Checkout Page ----------------
function renderCheckout() {
  const subtotal = BOOK.quote ? BOOK.quote.subtotal_cents : 8500;
  const gratuity = Math.round(subtotal * BOOK.gratuity_pct);
  const total = subtotal + gratuity;

  const app = document.getElementById('app');
  app.innerHTML = `
  <div class="booking-page-wrap">
    <div style="margin-bottom:28px">
      <div class="hero-eyebrow">Checkout</div>
      <h1 style="font-size:38px;">Passenger &amp; Payment</h1>
    </div>

    <div class="booking-widget-lux">
      <div style="background: var(--paper); border: 1px solid var(--gold-border); border-radius: var(--radius-sm); padding: 18px; margin-bottom: 24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;">
          <span style="color:var(--ink-muted);">Base Fare</span>
          <span style="font-weight:600;">${money(subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px;">
          <span style="color:var(--ink-muted);">Gratuity (${Math.round(BOOK.gratuity_pct * 100)}%)</span>
          <span id="ck-grat-val" style="font-weight:600;">${money(gratuity)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;border-top:1px solid var(--line-light);padding-top:12px;">
          <span>Total Fare</span>
          <span style="color:var(--gold);" id="ck-total-val">${money(total)}</span>
        </div>
      </div>

      <div class="field-lux">
        <label>Chauffeur Gratuity</label>
        <div style="display:flex; gap: 8px;">
          ${[0.20, 0.25, 0.30].map(p => `
            <button type="button" class="btn-glass ck-grat-btn" data-pct="${p}" style="${BOOK.gratuity_pct === p ? 'background:var(--gold);color:#fff;font-weight:600;border-color:var(--gold);' : ''}">
              ${Math.round(p * 100)}%
            </button>
          `).join('')}
        </div>
      </div>

      <div class="field-row-2">
        <div class="field-lux">
          <label>First Name</label>
          <input type="text" id="ck-first-name" placeholder="John" value="${esc(BOOK.guest_first_name)}">
        </div>
        <div class="field-lux">
          <label>Last Name</label>
          <input type="text" id="ck-last-name" placeholder="Doe" value="${esc(BOOK.guest_last_name)}">
        </div>
      </div>

      <div class="field-lux">
        <label>Email Address (For Confirmation &amp; Tracking)</label>
        <input type="email" id="ck-email" placeholder="john.doe@company.com" value="${esc(BOOK.guest_email)}">
      </div>

      <div class="field-lux">
        <label>Mobile Phone</label>
        <input type="tel" id="ck-phone" placeholder="(555) 123-4567" value="${esc(BOOK.guest_phone)}">
      </div>

      <div id="checkout-error"></div>

      <div style="display:flex; gap: 12px; margin-top: 24px;">
        <button type="button" class="btn-glass" id="ck-back-btn">Back</button>
        <button type="button" class="btn-gold" id="ck-submit-btn" style="flex:1;justify-content:center;">
          ${BOOK.submitting ? 'Processing...' : 'Confirm &amp; Reserve Ride \u2192'}
        </button>
      </div>
    </div>
  </div>`;

  document.querySelectorAll('.ck-grat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      BOOK.gratuity_pct = Number(btn.getAttribute('data-pct'));
      renderCheckout();
    });
  });

  document.getElementById('ck-first-name')?.addEventListener('input', e => BOOK.guest_first_name = e.target.value);
  document.getElementById('ck-last-name')?.addEventListener('input', e => BOOK.guest_last_name = e.target.value);
  document.getElementById('ck-email')?.addEventListener('input', e => BOOK.guest_email = e.target.value);
  document.getElementById('ck-phone')?.addEventListener('input', e => BOOK.guest_phone = e.target.value);

  document.getElementById('ck-back-btn')?.addEventListener('click', () => {
    BOOK.phase = 'details';
    renderBook();
  });

  document.getElementById('ck-submit-btn')?.addEventListener('click', onCheckoutSubmit);
}

async function onCheckoutSubmit() {
  const errBox = document.getElementById('checkout-error');
  if (errBox) errBox.innerHTML = '';

  if (!BOOK.guest_first_name || !BOOK.guest_last_name || !BOOK.guest_email || !BOOK.guest_phone) {
    if (errBox) errBox.innerHTML = `<div class="error-lux">Please fill in your name, email and mobile phone number.</div>`;
    return;
  }

  BOOK.submitting = true;
  const submitBtn = document.getElementById('ck-submit-btn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Securing Reservation...'; }

  try {
    const payload = {
      type: BOOK.type,
      scheduled_at: `${BOOK.date}T${BOOK.time || '09:00'}`,
      scheduled_at_ms: new Date(`${BOOK.date}T${BOOK.time || '09:00'}`).getTime(),
      hours: BOOK.hours,
      pickup: BOOK.pickup,
      dropoff: BOOK.dropoff,
      other: BOOK.other,
      airport_code: BOOK.airport_code,
      direction: BOOK.direction,
      gratuity_pct: BOOK.gratuity_pct,
      guest_name: `${BOOK.guest_first_name} ${BOOK.guest_last_name}`.trim(),
      guest_email: BOOK.guest_email,
      guest_phone: BOOK.guest_phone,
      passenger_count: BOOK.passenger_count,
      luggage_count: BOOK.luggage_count,
      notes: BOOK.notes,
      flight_number: BOOK.flight_number || undefined,
    };

    const headers = CUST.token ? { Authorization: 'Bearer ' + CUST.token } : {};
    const res = await api('/api/bookings', { method: 'POST', headers, body: JSON.stringify(payload) });

    BOOK.bookingResult = res;
    BOOK.submitting = false;
    BOOK.phase = 'success';
    renderBook();
  } catch (err) {
    BOOK.submitting = false;
    if (errBox) errBox.innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Confirm & Reserve Ride \u2192'; }
  }
}

function renderBookingSuccess() {
  const app = document.getElementById('app');
  const r = BOOK.bookingResult || {};
  app.innerHTML = `
  <section class="container" style="padding:160px 24px 100px;max-width:540px;text-align:center;">
    <div style="background: #FFFFFF; border: 1px solid var(--gold-border); border-radius: var(--radius-lg); padding: 44px 32px; box-shadow: var(--shadow-luxury);">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--gold-pale); border: 1px solid var(--gold); display: inline-flex; align-items: center; justify-content: center; color: var(--gold); font-size: 26px; margin-bottom: 20px;">
        &#10003;
      </div>
      <h2 style="font-size: 32px; margin-bottom: 12px;">Reservation Confirmed</h2>
      <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 16px; font-weight: 600;">
        Booking Reference #${esc(r.id || 'SUVS')}
      </div>
      <p style="color: var(--ink-secondary); font-size: 15px; line-height: 1.6;">
        Your chauffeured ride has been recorded. Our executive dispatch team will review your itinerary and dispatch your chauffeur details directly to <strong>${esc(BOOK.guest_email)}</strong>.
      </p>
      <div style="margin-top: 24px; padding: 14px; background: var(--paper); border-radius: var(--radius-sm); font-size: 14px;">
        Total: <strong style="color: var(--gold); font-size: 17px;">${money(r.total_cents || (BOOK.quote ? BOOK.quote.subtotal_cents * 1.2 : 10200))}</strong>
      </div>
      <div style="margin-top: 32px;">
        <a href="#/" class="btn-gold" style="justify-content: center; width: 100%;">Return to Home</a>
      </div>
    </div>
  </section>`;
}

// ---------------- Fleet Detail Page ----------------
function renderFleetPage() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <section class="container" style="padding: 160px 24px 100px;">
    <div style="text-align: center; max-width: 720px; margin: 0 auto 56px;">
      <div class="hero-eyebrow" style="justify-content: center;">Executive Vehicles</div>
      <h1 style="font-size: clamp(38px, 5vw, 60px);">The Sake SUVs Fleet</h1>
      <p style="color: var(--ink-muted); font-size: 17px; margin-top: 14px;">
        Purpose-selected for luxury, safety, quietness, and cavernous luggage accommodation.
      </p>
    </div>

    <div class="about-grid-2" style="background: #FFFFFF; border: 1px solid var(--gold-border); border-radius: var(--radius-lg); padding: 44px; margin-bottom: 48px; box-shadow: var(--shadow-card);">
      <div class="about-image-frame">
        <img src="/Discount Section Image.png" alt="2026 Suburban LT">
      </div>
      <div>
        <div class="hero-eyebrow">Flagship Vehicle</div>
        <h2 style="font-size: 34px; margin-bottom: 16px;">2026 Chevrolet Suburban LT</h2>
        <p style="color: var(--ink-secondary); font-size: 15.5px; line-height: 1.7;">
          Our primary vehicle for Jersey City, Manhattan, and airport transit. Finished with second-row luxury leather captain's chairs, quad-zone climate, and expansive legroom.
        </p>
        <ul style="margin: 20px 0; padding-left: 20px; color: var(--ink-secondary); line-height: 2;">
          <li>Up to 6 Executive Passengers + Chauffeur</li>
          <li>Accommodates 6 Full-Size Luggage Pieces</li>
          <li>Acoustic Noise-Dampening Glass</li>
          <li>Complimentary Chilled Fiji Water &amp; Device Chargers</li>
        </ul>
        <a href="#/book" class="btn-gold">Book Suburban &rarr;</a>
      </div>
    </div>
  </section>`;
}

// ---------------- Customer Account Portal ----------------
const ACCOUNT = {
  mode: 'signin',
  phase: 'login',
  tab: 'bookings',
  email: '', authLoading: false,
  returnTo: null,
  bookings: [],
};

function renderAccount() {
  if (!CUST.token) return renderAccountLogin();
  return renderAccountDashboard();
}

function renderAccountLogin() {
  const app = document.getElementById('app');
  const otpStep = ACCOUNT.phase === 'otp';
  app.innerHTML = `
  <section class="container" style="padding:160px 24px 100px;max-width:440px">
    <div style="text-align:center;margin-bottom:28px">
      <div class="hero-eyebrow" style="justify-content:center;">Client Portal</div>
      <h1 style="font-size:32px;">${otpStep ? 'Enter One-Time Passcode' : 'Executive Sign In'}</h1>
      <p style="color:var(--ink-muted);font-size:14.5px;margin-top:8px;">
        ${otpStep ? `We sent a 6-digit verification code to ${esc(ACCOUNT.email)}.` : 'Passwordless secure login. We email you an instant verification code.'}
      </p>
    </div>

    <div class="booking-widget-lux">
      <div id="account-auth-msg"></div>

      ${otpStep ? `
        <form id="account-otp-form">
          <div class="field-lux">
            <label>6-Digit Code</label>
            <input type="text" inputmode="numeric" maxlength="6" id="account-otp-input" placeholder="123456" autofocus required>
          </div>
          <button type="submit" class="btn-gold" style="width:100%;justify-content:center;" ${ACCOUNT.authLoading ? 'disabled' : ''}>
            ${ACCOUNT.authLoading ? 'Verifying...' : 'Verify &amp; Sign In \u2192'}
          </button>
        </form>
        <button type="button" class="btn-glass" id="account-back-btn" style="width:100%;justify-content:center;margin-top:12px;">Use Different Email</button>
      ` : `
        <form id="account-email-form">
          <div class="field-lux">
            <label>Email Address</label>
            <input type="email" id="account-email-input" placeholder="name@company.com" value="${esc(ACCOUNT.email)}" required>
          </div>
          <button type="submit" class="btn-gold" style="width:100%;justify-content:center;" ${ACCOUNT.authLoading ? 'disabled' : ''}>
            ${ACCOUNT.authLoading ? 'Sending...' : 'Send Secure Passcode \u2192'}
          </button>
        </form>
      `}
    </div>
  </section>`;

  wireAccountLogin();
}

function wireAccountLogin() {
  document.getElementById('account-email-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('account-email-input')?.value.trim();
    if (!email) return;
    ACCOUNT.email = email;
    ACCOUNT.authLoading = true;
    renderAccountLogin();
    try {
      await api('/api/customer/request-otp', { method: 'POST', body: JSON.stringify({ email }) });
      ACCOUNT.phase = 'otp';
      ACCOUNT.authLoading = false;
      renderAccountLogin();
    } catch (err) {
      ACCOUNT.authLoading = false;
      renderAccountLogin();
      const msg = document.getElementById('account-auth-msg');
      if (msg) msg.innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
    }
  });

  document.getElementById('account-otp-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('account-otp-input')?.value.trim();
    if (!code) return;
    ACCOUNT.authLoading = true;
    renderAccountLogin();
    try {
      const res = await api('/api/customer/verify-otp', { method: 'POST', body: JSON.stringify({ email: ACCOUNT.email, code }) });
      CUST.token = res.token;
      CUST.customer = res.customer;
      localStorage.setItem('sakesuvs_customer_token', res.token);
      ACCOUNT.phase = 'login';
      ACCOUNT.authLoading = false;
      updateNavAccountButton();
      if (ACCOUNT.returnTo) {
        const dest = ACCOUNT.returnTo;
        ACCOUNT.returnTo = null;
        bookGatePassed = true;
        location.hash = dest;
        router();
      } else {
        renderAccount();
      }
    } catch (err) {
      ACCOUNT.authLoading = false;
      renderAccountLogin();
      const msg = document.getElementById('account-auth-msg');
      if (msg) msg.innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
    }
  });

  document.getElementById('account-back-btn')?.addEventListener('click', () => {
    ACCOUNT.phase = 'login';
    ACCOUNT.email = '';
    renderAccountLogin();
  });
}

async function renderAccountDashboard() {
  const app = document.getElementById('app');
  const name = (CUST.customer && (CUST.customer.first_name || CUST.customer.name)) || 'Client';
  app.innerHTML = `
  <section class="container" style="padding:160px 24px 100px;max-width:780px">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;margin-bottom:28px">
      <div>
        <div class="hero-eyebrow">Client Portal</div>
        <h1 style="font-size:34px;">Welcome, ${esc(name)}</h1>
      </div>
      <button class="btn-glass" id="account-logout-btn">Log Out</button>
    </div>

    <div class="booking-widget-lux">
      <h3 style="font-size:22px;margin-bottom:18px;">Your Scheduled Rides</h3>
      <div id="account-bookings-list">Loading reservations...</div>
    </div>
  </section>`;

  document.getElementById('account-logout-btn')?.addEventListener('click', () => {
    custLogout();
    location.hash = '#/';
  });

  try {
    ACCOUNT.bookings = await custApi('/api/customer/bookings');
    const listEl = document.getElementById('account-bookings-list');
    if (!ACCOUNT.bookings || !ACCOUNT.bookings.length) {
      listEl.innerHTML = `<p style="color:var(--ink-muted);">You have no pending or scheduled rides. <a href="#/book" style="color:var(--gold);">Book a chauffeured ride &rarr;</a></p>`;
    } else {
      listEl.innerHTML = ACCOUNT.bookings.map(b => `
        <div style="padding:16px;background:var(--paper);border:1px solid var(--line-light);border-radius:var(--radius-sm);margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong style="color:var(--ink);">Ride #${b.id} &bull; ${esc(b.type)}</strong>
            <span class="pill ${b.status}">${esc(b.status)}</span>
          </div>
          <div style="font-size:13.5px;color:var(--ink-secondary);">
            ${esc(b.pickup_address)} &rarr; ${esc(b.dropoff_address || 'As-Directed')}
          </div>
          <div style="font-size:12.5px;color:var(--gold);margin-top:6px;font-weight:600;">
            Scheduled: ${new Date(b.scheduled_at).toLocaleString()} &bull; Total: ${money(b.total_cents)}
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    document.getElementById('account-bookings-list').innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
  }
}

// ---------------- Admin Portal ----------------
function renderAdminLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
  <section class="container" style="padding:160px 24px 100px;max-width:420px">
    <div style="text-align:center;margin-bottom:28px">
      <div class="hero-eyebrow" style="justify-content:center;">Dispatcher Portal</div>
      <h1 style="font-size:32px;">Sake Dispatch</h1>
    </div>
    <div class="booking-widget-lux">
      <div id="admin-auth-msg"></div>
      <form id="admin-login-form">
        <div class="field-lux">
          <label>Admin Email</label>
          <input type="email" id="admin-email" required>
        </div>
        <div class="field-lux">
          <label>Password</label>
          <input type="password" id="admin-password" required>
        </div>
        <button type="submit" class="btn-gold" style="width:100%;justify-content:center;">Sign In to Dispatch &rarr;</button>
      </form>
    </div>
  </section>`;

  document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    try {
      const res = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      S.token = res.token;
      sessionStorage.setItem('sakesuvs_token', res.token);
      location.hash = '#/admin/dashboard';
    } catch (err) {
      document.getElementById('admin-auth-msg').innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
    }
  });
}

async function renderAdmin() {
  if (!S.token) {
    location.hash = '#/admin';
    return;
  }
  const app = document.getElementById('app');
  app.innerHTML = `
  <section class="container" style="padding:140px 24px 100px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
      <div>
        <div class="hero-eyebrow">Sake SUVs Dispatch</div>
        <h1 style="font-size:32px;">Reservations &amp; Fleet</h1>
      </div>
      <button class="btn-glass" id="admin-logout-btn">Log Out</button>
    </div>
    <div class="booking-widget-lux" style="max-width:none;overflow-x:auto;">
      <div id="admin-table-container">Loading bookings...</div>
    </div>
  </section>`;

  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    S.token = null;
    sessionStorage.removeItem('sakesuvs_token');
    location.hash = '#/admin';
  });

  try {
    const bookings = await api('/api/admin/bookings');
    const container = document.getElementById('admin-table-container');
    if (!bookings.length) {
      container.innerHTML = '<p>No bookings found.</p>';
      return;
    }
    container.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Passenger</th>
            <th>Route</th>
            <th>Scheduled</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.map(b => `
            <tr>
              <td>#${b.id}</td>
              <td>${esc(b.type)}</td>
              <td>${esc(b.guest_name || (b.customer && b.customer.name) || 'Guest')}</td>
              <td>${esc(b.pickup_address)} &rarr; ${esc(b.dropoff_address || 'As-directed')}</td>
              <td>${new Date(b.scheduled_at).toLocaleString()}</td>
              <td>${money(b.total_cents)}</td>
              <td><span class="pill ${b.status}">${esc(b.status)}</span></td>
              <td>
                ${b.status === 'pending' ? `
                  <button class="btn-glass admin-act-btn" data-id="${b.id}" data-act="confirm" style="padding:4px 8px;font-size:11px;">Confirm</button>
                  <button class="btn-glass admin-act-btn" data-id="${b.id}" data-act="decline" style="padding:4px 8px;font-size:11px;color:#ff8585;">Decline</button>
                ` : '—'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    document.querySelectorAll('.admin-act-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const act = btn.getAttribute('data-act');
        await api(`/api/admin/bookings/${id}/${act}`, { method: 'POST' });
        renderAdmin();
      });
    });
  } catch (err) {
    document.getElementById('admin-table-container').innerHTML = `<div class="error-lux">${esc(err.message)}</div>`;
  }
}

// ---------------- Legal Pages ----------------
function renderLegal(which) {
  const content = {
    terms: `
      <h1>Terms of Service</h1>
      <p>By booking a chauffeured ride with Sake SUVs LLC ("Sake SUVs"), you agree to these Terms of Service.</p>
      <h2>1. Service Scope</h2>
      <p>Sake SUVs provides private chauffeured SUV transportation in and around Jersey City, New Jersey, extending into New York (including Manhattan, Brooklyn, Queens) and regional commercial and private airports (EWR, JFK, LGA, TEB, MMU). Every ride requires at least one pickup or drop-off location within New Jersey.</p>
      <h2>2. Booking &amp; Payment</h2>
      <p>All fares are quoted upfront based on published flat rates or hourly terms. Stripe secures payment card processing.</p>
    `,
    privacy: `
      <h1>Privacy Policy</h1>
      <p>Sake SUVs respects your confidentiality and personal privacy.</p>
      <h2>Information We Collect</h2>
      <p>We collect your name, email, phone number, flight number, and itinerary strictly to execute your reservation. We do not sell or broker client information.</p>
    `,
    cancellation: `
      <h1>Cancellation Policy</h1>
      <ul>
        <li><strong>4 or more hours before scheduled pickup:</strong> 100% full cancellation refund with zero penalty.</li>
        <li><strong>Between 2 and 4 hours before pickup:</strong> 50% cancellation fee.</li>
        <li><strong>Less than 2 hours before pickup:</strong> Non-refundable due to chauffeur dispatch allocation.</li>
      </ul>
    `
  }[which] || '';

  const app = document.getElementById('app');
  app.innerHTML = `<div class="legal-page-wrap">${content}<div style="margin-top:36px;"><a href="#/" class="btn-gold">&larr; Return to Home</a></div></div>`;
}
