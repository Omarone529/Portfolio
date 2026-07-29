// i18n: Italian lives in the HTML, English here. On load the Italian
// strings are captured from the DOM so they never have to be duplicated.
// A single shared dictionary covers the home page and every project page;
// each page only queries the data-i18n elements it actually has.
//
// The active language is part of the URL (?lang=en), so an English page can
// be shared and crawled. Resolution order is: ?lang= param, then the visitor's
// stored choice, then Italian. Browser-language sniffing is deliberately left
// out: it would serve English at the Italian canonical URL, which is exactly
// the ambiguity hreflang is there to prevent.
const translations = {
  en: {
    'nav.works': 'works',
    'nav.about': 'about',
    'nav.contact': 'contact',
    'hero.desc': `Building digital solutions from logic
                    to interface, with a strong feel for <em>design</em>
                    and close attention to detail.`,
    'about.label': 'About me',
    'about.desc': `I like projects with personality, not just features. I work across the
                    whole stack: a solid backend, a considered frontend, a containerized
                    deploy. From REST APIs in Django to Flutter apps, all the way to bots
                    that talk to their users, what interests me is understanding the
                    problem before writing the solution.`,
    'about.stack.label': 'Tools I reach for most',
    'link.live': 'View the project',
    'link.repo': 'Source code',
    'a11y.backToTop': 'Back to top',
    'a11y.nav': 'Main navigation',
    'proj.timesheet.type': 'Desktop & Mobile App · Flutter',
    'proj.timesheet.core': 'Logs hours worked and estimates net pay from payslip deductions.',
    'proj.timesheet.lead': 'A personal tool so you never lose track of hours worked again.',
    'proj.timesheet.solution': `Timesheet Manager is a desktop and mobile app that lets you log hours day by day, generate monthly and yearly reports with clear charts, and estimate net salary based on actual hours worked and payslip deductions.`,
    'proj.timesheet.f1': 'Quick logging of hours worked, including retroactively',
    'proj.timesheet.f2': 'Monthly and yearly charts to visualize trends over time',
    'proj.timesheet.f3': 'Automatic salary estimation based on hours and payslip deductions',
    'proj.timesheet.f4': 'Sync between the desktop and mobile versions',
    'proj.mbm.type': 'Showcase Website · React',
    'proj.mbm.core': 'Presents the services, workmanship and contacts of a metalworking company.',
    'proj.mbm.lead': 'A showcase website built to tell the story of a metalworking company’s craft and precision.',
    'proj.mbm.solution': `A showcase site with dedicated sections for services, workmanship and contacts, built with React and Tailwind CSS. The frontend architecture is deliberately lightweight, so the first screen appears immediately and moving between sections is instant.`,
    'proj.mbm.f1': 'Responsive design optimized for every device',
    'proj.mbm.f2': 'Dedicated sections for services, workmanship and contacts',
    'proj.mbm.f3': 'High performance thanks to a lightweight frontend architecture',
    'proj.apex.type': 'Web App · Django & React',
    'proj.apex.core': 'Computes scenic, twisty routes for people who drive for pleasure.',
    'proj.apex.lead': 'A service that calculates routes meant to be enjoyed, not just traveled.',
    'proj.apex.solution': `ApexGPS is a routing engine that computes scenic, twisty routes, meant for driving for pleasure rather than for getting there quickly. The main part of the project is the backend API service: it computes the routes, handles authentication with JWT and OAuth, and takes care of saving and syncing each user's tracks. It exposes a single data interface, used by both the mobile and the web application. Road data is processed with PostGIS, while the React frontend shows the routes on the map.`,
    'proj.apex.hard': `The engine's two goals conflict with each other: the more you look for twisty, scenic roads, the longer the route gets, and past a certain point it becomes a route nobody would actually drive. The calculation therefore works with a limit of 40 minutes over the normal route. So the problem is not finding the finest road in absolute terms, but the best one among those that fit within that margin.`,
    'proj.apex.f1': 'Custom scoring algorithm based on curvature and points of interest',
    'proj.apex.f2': 'Scenic route search starting from any given point',
    'proj.apex.f5': 'Time tolerance set so the scenic route never exceeds the fastest one by more than roughly forty minutes',
    'proj.apex.f6': 'Universal API: a single data interface serving both the mobile and the web app',
    'proj.apex.f7': 'JWT and OAuth authentication, with per-user route saving and syncing',
    'proj.apex.f3': 'Containerized REST API deployed on Azure cloud',
    'proj.apex.f4': 'Reactive map interface built in React',
    'proj.synapsi.type': 'Web/Desktop App · Python & React',
    'proj.synapsi.core': 'A management suite for freelancers, from e-invoicing to the books, usable from Telegram too.',
    'proj.synapsi.lead': 'A command center for freelancers, reachable just by sending a message.',
    'proj.synapsi.solution': `Synapsi is a management suite for freelancers and craftspeople. It gathers clients, projects, quotes, invoices, hours, collaborators, expenses and payments into a single desktop app, and derives the books and the cash-flow forecast from that data. The invoicing cycle is complete, going as far as the XML required for electronic invoicing. There are then two things that set it apart from an ordinary management suite. The first is that every installation runs entirely on the computer of the person using it, backend, database and credentials included, with no central server. The second is that it can also be used from a Telegram bot, with written or voice messages, so without opening the application.`,
    'proj.synapsi.hard1': `The bot interprets voice messages, so every now and then it gets something wrong. The problem is that a wrong entry looks identical to a correct one until someone goes and checks it. That is why every confirmation from the bot includes a screenshot of the section it wrote into, so you can see immediately what was recorded, along with a button to undo the operation.`,
    'proj.synapsi.hard2': `The button only appears on creations, and that is a deliberate choice: undoing a creation means deleting a row that was just inserted, whereas undoing an edit would require rebuilding the previous state, which is not saved anywhere. Creations cover almost everything the bot writes anyway, namely hours, payments, expenses, clients, projects, quotes and invoices. Collecting them does not require every handler to declare what it created: a SQLAlchemy hook watches the session used for the operation and records the inserted rows, so functions added later turn out to be undoable without any changes.`,
    'proj.synapsi.hard3': `A similar problem affects the books. Being cash-based, they only count money actually received, which means a user who has entered everything correctly can still see a total different from the one they expect when looking at the invoices they issued. The app therefore does not just show the number, but tries to explain where the difference comes from, listing the entries that make it up and the most common data-entry mistakes: accepted quotes never invoiced, unbilled hours, payments not linked to an invoice, overpaid invoices and quotes left pending for too long.`,
    'proj.synapsi.f1': 'Records for clients, projects and collaborators, each with the status, dates and rates that apply to it, and the outstanding balance always in view',
    'proj.synapsi.f2': 'The full sales cycle from quote to invoice, with PDF, electronic-invoicing XML, withholding tax, virtual stamp duty and recurring invoices that issue themselves',
    'proj.synapsi.f3': 'Working hours and incoming payments, with a suggested tax set-aside on everything received',
    'proj.synapsi.f4': 'Expenses logged from a photo of the receipt, with the AI picking out amount, supplier, date and category',
    'proj.synapsi.f5': 'Books by category, receivables and a cash-flow forecast by due-date window, with a PDF report and an export for the accountant',
    'proj.synapsi.f6': 'Deadline agenda, including days overdue on the ones already past, and global search across the whole archive',
    'proj.synapsi.f7': 'A Telegram bot that looks up, creates and edits any data by voice or in writing, answers questions about the books and expenses and chases deadlines, attaching a screenshot of whichever section it is talking about',
    'proj.synapsi.f8': 'Encrypted automatic backups to an external folder of your choice, with guided restore: the copy reopens by itself on the machine of origin, anywhere else it needs the password',
    'back.all': 'All projects',
    'case.solution': 'The project',
    'case.hard': 'The hard part',
    'case.features': 'Key features',
    'case.stack': 'Tech stack',
    'footer.role': 'Full-stack developer',
    // Per-page metadata. Keys are built as meta.<data-page>.<slot>, so each
    // page only needs the four entries that match its own <head>.
    'meta.home.title': 'Omar Bayadi 👋🏼',
    'meta.home.ogtitle': 'Omar Bayadi · Full-stack Developer',
    'meta.home.desc': 'Omar Bayadi, full-stack developer. I build digital solutions from logic to interface, with a strong feel for design and close attention to detail. Python, Django, React, Flutter, Docker.',
    'meta.home.ogdesc': 'I build digital solutions from logic to interface, with a strong feel for design and close attention to detail.',
    'meta.timesheet.title': 'Timesheet Manager · Omar Bayadi',
    'meta.timesheet.ogtitle': 'Timesheet Manager · Omar Bayadi',
    'meta.timesheet.desc': 'Timesheet Manager: a desktop and mobile app for tracking hours, reporting and estimating net pay. A project by Omar Bayadi, full-stack developer.',
    'meta.timesheet.ogdesc': 'A desktop and mobile app for tracking hours, reporting and estimating net pay.',
    'meta.mbm.title': 'MBM Meccanica · Omar Bayadi',
    'meta.mbm.ogtitle': 'MBM Meccanica · Omar Bayadi',
    'meta.mbm.desc': 'MBM Meccanica: a showcase website for a metalworking company, built with React and Tailwind. A project by Omar Bayadi, full-stack developer.',
    'meta.mbm.ogdesc': 'A showcase website for a metalworking company, built with React and Tailwind.',
    'meta.apex.title': 'ApexGPS · Omar Bayadi',
    'meta.apex.ogtitle': 'ApexGPS · Omar Bayadi',
    'meta.apex.desc': 'ApexGPS: a web service that computes scenic routes based on points of interest and how twisty the roads are. A project by Omar Bayadi, full-stack developer.',
    'meta.apex.ogdesc': 'A web service that computes scenic routes based on points of interest and how twisty the roads are.',
    'meta.synapsi.title': 'Synapsi · Omar Bayadi',
    'meta.synapsi.ogtitle': 'Synapsi · Omar Bayadi',
    'meta.synapsi.desc': 'Synapsi: a management suite for freelancers with an AI bot on Telegram, from electronic invoicing to the books. A project by Omar Bayadi, full-stack developer.',
    'meta.synapsi.ogdesc': 'A management suite for freelancers with an AI bot on Telegram: clients, projects, quotes, electronic invoicing, expenses and the books.'
  },
  it: {}
};

const PAGE = document.body.dataset.page || 'home';
const SUPPORTED = ['it', 'en'];

/* ---------- Text nodes and translatable attributes ---------- */

// Each entry maps a data-* attribute to how the string is written back.
const TEXT_BINDINGS = [
  { attr: 'data-i18n', apply: (el, v) => { el.textContent = v; }, read: el => el.textContent },
  { attr: 'data-i18n-html', apply: (el, v) => { el.innerHTML = v; }, read: el => el.innerHTML },
  { attr: 'data-i18n-aria', apply: (el, v) => el.setAttribute('aria-label', v), read: el => el.getAttribute('aria-label') }
];

const i18nEls = [];

TEXT_BINDINGS.forEach(binding => {
  document.querySelectorAll('[' + binding.attr + ']').forEach(el => {
    const key = el.getAttribute(binding.attr);
    // Capture the Italian default straight from the markup
    if (translations.it[key] === undefined) translations.it[key] = binding.read(el);
    i18nEls.push({ el, key, binding });
  });
});

/* ---------- Metadata ---------- */

// null selector means document.title. Several tags share one string, so the
// title/description written for humans also lands in the OG and Twitter cards.
const META_SLOTS = [
  { slot: 'title', sel: null },
  { slot: 'ogtitle', sel: 'meta[name="title"], meta[property="og:title"], meta[name="twitter:title"]' },
  { slot: 'desc', sel: 'meta[name="description"]' },
  { slot: 'ogdesc', sel: 'meta[property="og:description"], meta[name="twitter:description"]' }
];

META_SLOTS.forEach(m => {
  const key = 'meta.' + PAGE + '.' + m.slot;
  if (!m.sel) {
    translations.it[key] = document.title;
    return;
  }
  const el = document.querySelector(m.sel);
  if (el) translations.it[key] = el.getAttribute('content');
});

// The canonical href in the markup is the Italian URL; the English one is the
// same address plus ?lang=en, which is what hreflang already declares.
const canonicalEl = document.querySelector('link[rel="canonical"]');
const BASE_URL = canonicalEl ? canonicalEl.getAttribute('href') : location.href.split('?')[0];

function urlFor(lang) {
  return lang === 'en' ? BASE_URL + '?lang=en' : BASE_URL;
}

function applyMeta(dict, lang) {
  META_SLOTS.forEach(m => {
    const value = dict['meta.' + PAGE + '.' + m.slot];
    if (value === undefined) return;
    if (!m.sel) {
      document.title = value;
      return;
    }
    document.querySelectorAll(m.sel).forEach(el => el.setAttribute('content', value));
  });

  if (canonicalEl) canonicalEl.setAttribute('href', urlFor(lang));
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', urlFor(lang));
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.setAttribute('content', lang === 'en' ? 'en_US' : 'it_IT');
}

/* ---------- Internal links carry the language ---------- */

// So that following a link from a shared English page stays in English, for
// crawlers as much as for people with storage disabled.
function localizeLinks(lang) {
  document.querySelectorAll('a[href]').forEach(a => {
    const current = a.getAttribute('href');
    if (!current) return;
    // Off-site, in-page and download links are left exactly as they are
    if (/^(#|https?:|mailto:|tel:)/i.test(current) || a.hasAttribute('download')) return;

    const base = a.dataset.hrefBase || current;
    a.dataset.hrefBase = base;

    const hashAt = base.indexOf('#');
    const path = hashAt >= 0 ? base.slice(0, hashAt) : base;
    const hash = hashAt >= 0 ? base.slice(hashAt) : '';
    a.setAttribute('href', lang === 'en' ? path + '?lang=en' + hash : base);
  });
}

function syncUrl(lang) {
  if (!window.history || !history.replaceState) return;
  const url = new URL(location.href);
  if (lang === 'en') url.searchParams.set('lang', 'en');
  else url.searchParams.delete('lang');
  history.replaceState(null, '', url.pathname + url.search + url.hash);
}

/* ---------- Switching ---------- */

function setLang(lang, persist) {
  if (SUPPORTED.indexOf(lang) === -1) lang = 'it';
  const dict = translations[lang];

  i18nEls.forEach(({ el, key, binding }) => {
    const value = dict[key];
    if (value !== undefined) binding.apply(el, value);
  });

  applyMeta(dict, lang);
  localizeLinks(lang);
  syncUrl(lang);

  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  if (persist) {
    try {
      localStorage.setItem('lang', lang);
    } catch (e) { /* storage unavailable (e.g. private mode) */ }
  }

  // Revealed only once the page is showing the right language
  document.documentElement.classList.remove('i18n-pending');
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang, true));
});

// __i18nLang is resolved by the inline script in <head>, early enough to hide
// the Italian markup before it paints for a visitor arriving in English.
setLang(window.__i18nLang || 'it', false);

/* ---------- Smooth scroll for in-page anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

/* ---------- Navbar: hide on scroll down, reveal on scroll up ---------- */
const nav = document.querySelector('nav');
const progress = document.querySelector('.scroll-progress span');
const backToTop = document.querySelector('.back-to-top');
let lastScrollTop = 0;
let ticking = false;

function onScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (progress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }

  if (currentScroll > lastScrollTop && currentScroll > 80) {
    nav.classList.add('nav-hidden');
  } else if (currentScroll < lastScrollTop) {
    nav.classList.remove('nav-hidden');
  }

  // No point offering "back to top" while already at the top
  if (backToTop) backToTop.classList.toggle('is-visible', currentScroll > 400);

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

onScroll();

/* ---------- Staggered reveal on scroll ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

/* ---------- Cookie consent (Google Analytics) ---------- */
(function () {
  const KEY = 'cookieConsent';
  const stored = localStorage.getItem(KEY);

  function grantConsent() {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
    }
  }

  if (stored === 'granted') {
    grantConsent();
    return;
  }
  if (stored === 'denied') return;

  const lang = window.__i18nLang === 'en' ? 'en' : 'it';
  const copy = lang === 'en'
    ? {
        text: 'This site uses Google Analytics to understand how it’s used. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy policy</a>.',
        decline: 'Decline',
        accept: 'Accept',
      }
    : {
        text: 'Questo sito usa Google Analytics per capire come viene usato. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Privacy policy</a>.',
        decline: 'Rifiuta',
        accept: 'Accetto',
      };

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <p>${copy.text}</p>
    <div class="cookie-banner-actions">
      <button type="button" class="cookie-decline">${copy.decline}</button>
      <button type="button" class="cookie-accept">${copy.accept}</button>
    </div>
  `;
  document.body.appendChild(banner);

  banner.querySelector('.cookie-accept').addEventListener('click', () => {
    localStorage.setItem(KEY, 'granted');
    grantConsent();
    banner.remove();
  });
  banner.querySelector('.cookie-decline').addEventListener('click', () => {
    localStorage.setItem(KEY, 'denied');
    banner.remove();
  });
})();
