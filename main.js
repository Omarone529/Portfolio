// Smooth scroll for links
document.querySelectorAll('nav a, .contact-email').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Navbar hide/show on scroll
let lastScrollTop = 0;
let scrollTimeout;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);

  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > 50) {
    nav.classList.add('nav-hidden');
  } else if (currentScroll < lastScrollTop) {
    nav.classList.remove('nav-hidden');
  }

  scrollTimeout = setTimeout(() => {
    nav.classList.remove('nav-hidden');
  }, 1500);

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// Animation reveal with Intersection Observer
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    } else {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(40px)';
    }
  });
}, observerOptions);

document.querySelectorAll('.project, .about-container, .contact-content, .hero-inner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'opacity 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
  observer.observe(el);
});