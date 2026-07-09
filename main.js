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
