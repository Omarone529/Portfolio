// i18n: Italian lives in the HTML, English here. On load the Italian
// strings are captured from the DOM so they never have to be duplicated.
// A single shared dictionary covers the home page and every project page;
// each page only queries the data-i18n elements it actually has.
const translations = {
  en: {
    'nav.works': 'works',
    'nav.contact': 'contact',
    'hero.desc': `Building digital solutions from logic
                    to interface, with a strong feel for <em>design</em>
                    and close attention to detail.`,
    'hero.scroll': 'Scroll',
    'proj.comingSoon': 'Coming soon',
    'proj.timesheet.type': 'Desktop & Mobile App · Flutter',
    'proj.timesheet.lead': 'A personal tool so you never lose track of hours worked again.',
    'proj.timesheet.solution': `Timesheet Manager is a desktop and mobile app that lets you log hours day by day, generate monthly and yearly reports with clear charts, and estimate net salary based on actual hours worked and payslip deductions.`,
    'proj.timesheet.f1': 'Quick logging of hours worked, including retroactively',
    'proj.timesheet.f2': 'Monthly and yearly charts to visualize trends over time',
    'proj.timesheet.f3': 'Automatic salary estimation based on hours and payslip deductions',
    'proj.timesheet.f4': 'Sync between the desktop and mobile versions',
    'proj.mbm.type': 'Showcase Website · React',
    'proj.mbm.lead': 'A showcase website built to tell the story of a metalworking company’s craft and precision.',
    'proj.mbm.solution': `A light, fast, modern showcase site built with React and Tailwind CSS, designed to present the company's services with smooth navigation and a clean design that conveys professionalism from the first load.`,
    'proj.mbm.f1': 'Responsive design optimized for every device',
    'proj.mbm.f2': 'Dedicated sections for services, workmanship and contacts',
    'proj.mbm.f3': 'High performance thanks to a lightweight frontend architecture',
    'proj.apex.type': 'Web App · Django & React',
    'proj.apex.lead': 'A service that calculates routes meant to be enjoyed, not just traveled.',
    'proj.apex.solution': `ApexGPS computes scenic routes based on points of interest and how twisty the roads are, through a custom algorithm that puts the beauty of the ride before speed. The geospatial backend processes road data with PostGIS, while the frontend delivers a smooth, immediate experience.`,
    'proj.apex.f1': 'Custom scoring algorithm based on curvature and points of interest',
    'proj.apex.f2': 'Scenic route search starting from any given point',
    'proj.apex.f3': 'Containerized REST API deployed on Azure cloud',
    'proj.apex.f4': 'Reactive map interface built in React',
    'proj.synapsi.type': 'Web/Desktop App · Python & React',
    'proj.synapsi.lead': 'A command center for freelancers, reachable just by sending a message.',
    'proj.synapsi.solution': `Synapsi centralizes clients, projects, quotes, worked hours, collaborators and payments in a single desktop app. The system is backed by an always-on AI bot on Telegram, which lets you look up and enter data through both text and voice messages, so work can be managed on the go without necessarily going through the graphical interface.`,
    'proj.synapsi.f1': 'Centralized management of clients, projects and quotes',
    'proj.synapsi.f2': 'Telegram bot with AI (Gemini) for voice and text input',
    'proj.synapsi.f3': 'Automatic reminders for pending tasks',
    'proj.synapsi.f4': 'Native desktop app built with Electron',
    'back.all': 'All projects',
    'case.solution': 'The project',
    'case.features': 'Key features',
    'case.stack': 'Tech stack'
  },
  it: {}
};

const i18nEls = document.querySelectorAll('[data-i18n], [data-i18n-html]');

// Capture the Italian defaults from the markup
i18nEls.forEach(el => {
  const isHtml = el.hasAttribute('data-i18n-html');
  const key = el.getAttribute(isHtml ? 'data-i18n-html' : 'data-i18n');
  translations.it[key] = isHtml ? el.innerHTML : el.textContent;
});

function setLang(lang) {
  const dict = translations[lang] || translations.it;
  i18nEls.forEach(el => {
    const isHtml = el.hasAttribute('data-i18n-html');
    const key = el.getAttribute(isHtml ? 'data-i18n-html' : 'data-i18n');
    const value = dict[key];
    if (value === undefined) return;
    if (isHtml) {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });

  try {
    localStorage.setItem('lang', lang);
  } catch (e) { /* storage unavailable (e.g. private mode) */ }
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

let savedLang = null;
try {
  savedLang = localStorage.getItem('lang');
} catch (e) { /* storage unavailable */ }
if (savedLang === 'en') {
  setLang('en');
}

// Smooth scroll for in-page anchor links
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

// Navbar: hide on scroll down, reveal on scroll up + scrolled state + progress bar
const nav = document.querySelector('nav');
const progress = document.querySelector('.scroll-progress span');
let lastScrollTop = 0;
let scrollTimeout;
let ticking = false;

function onScroll() {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  // Scroll progress
  if (progress) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }

  // Hide/show
  clearTimeout(scrollTimeout);
  if (currentScroll > lastScrollTop && currentScroll > 80) {
    nav.classList.add('nav-hidden');
  } else if (currentScroll < lastScrollTop) {
    nav.classList.remove('nav-hidden');
  }
  scrollTimeout = setTimeout(() => nav.classList.remove('nav-hidden'), 1500);

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

// Staggered reveal on scroll (elements already carry the .reveal class in markup)
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
