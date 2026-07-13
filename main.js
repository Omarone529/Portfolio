// i18n: Italian lives in the HTML, English here. On load the Italian
// strings are captured from the DOM so they never have to be duplicated.
const translations = {
  en: {
    'nav.works': 'Works',
    'nav.contacts': 'Contacts',
    'hero.desc': `Building digital solutions from logic
                    to interface, with a strong feel for <em>design</em>
                    and close attention to detail.`,
    'hero.scroll': 'Scroll',
    'work.commissioned': 'Commissioned work',
    'work.personal': 'Personal projects',
    'proj.timesheet.type': 'Desktop & Mobile App',
    'proj.timesheet.desc': `Time-tracking tool with charts and detailed monthly and yearly reports.
                        Salary estimation based on hours worked and payslip deductions.`,
    'proj.mbm.type': 'Showcase Website',
    'proj.comingSoon': 'Coming soon',
    'proj.mbm.desc': 'Showcase website for a metalworking company. Clean, modern design and smooth navigation.',
    'proj.apex.desc': `Web service that computes scenic routes based on
                        points of interest and how twisty the roads are.
                        A custom algorithm that puts the beauty of the ride before speed.`,
    'proj.synapsi.desc': `Desktop app for freelancers that centralizes the management of clients, projects, quotes, worked hours, collaborators and payments.
                        The whole system is also accessible through a proactive AI bot integrated with Telegram,
                        which lets you look up and enter information via both text and voice messages,
                        making day-to-day operations faster and more immediate without necessarily
                        going through the graphical interface. The bot can also remind the user of any pending tasks.`,
    'about.label': 'How I work',
    'about.title': 'Turning<br>ideas<br><em>into code.</em>',
    'about.desc': `I love projects with personality, not just functionality.
                    I work across the whole stack. Solid backend, polished frontend,
                    containerized deploys. Below, some of my favorite technologies.`,
    'contact.call': 'Where to find me',
    'contact.title': 'Let’s work <em>together</em>'
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

  // Scrolled state (compact nav + border)
  nav.classList.toggle('nav-scrolled', currentScroll > 20);

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

// Staggered reveal on scroll
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll(
  '.project, .section-header, .about-container, .contact-content'
);

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  revealEls.forEach(el => el.classList.add('reveal'));

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
