'use strict';

// Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

// Navbar scroll behaviour
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) { navbar.classList.add('scrolled'); }
  else                      { navbar.classList.remove('scrolled'); }
}, { passive: true });

// Hamburger / Mobile menu
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Active nav-link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Scroll to section helper
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.scrollToSection = scrollToSection;

// Fade-up scroll animations
const fadeEls = document.querySelectorAll('.fade-up');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));

// Image Slider
(function initSlider() {
  const slider    = document.getElementById('slider');
  if (!slider) return;
  const slides    = slider.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn   = document.getElementById('sliderPrev');
  const nextBtn   = document.getElementById('sliderNext');
  const wrapper   = document.querySelector('.slider-wrapper');

  let current   = 0;
  let autoTimer = null;
  const INTERVAL = 4000;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function getDots() { return dotsContainer.querySelectorAll('.dot'); }

  function goTo(idx) {
    slides[current].classList.remove('active');
    getDots()[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    getDots()[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { autoTimer = setInterval(next, INTERVAL); }
  function stopAuto()  { clearInterval(autoTimer); }

  prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  wrapper.addEventListener('mouseenter', stopAuto);
  wrapper.addEventListener('mouseleave', startAuto);

  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); stopAuto(); startAuto(); }
  }, { passive: true });

  startAuto();
})();

// Button ripple effect
document.querySelectorAll('.btn, .btn-consult, .contact-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.style.cssText =
      'position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);' +
      'width:80px;height:80px;' +
      'left:' + (e.offsetX - 40) + 'px;top:' + (e.offsetY - 40) + 'px;' +
      'transform:scale(0);animation:rippleAnim .55s linear;pointer-events:none;';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform:scale(4); opacity:0; } }';
document.head.appendChild(rippleStyle);