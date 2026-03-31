import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────
   1. Smooth Scroll (Lenis)
───────────────────────────────────────────────────────────── */
export function initSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/* ─────────────────────────────────────────────────────────────
   2. Custom Cursor
───────────────────────────────────────────────────────────── */
export function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    gsap.set(dot,  { x: mx, y: my });
    gsap.to(ring, { x: mx, y: my, duration: 0.18, ease: 'power2.out' });
  });

  // Scale up on interactive elements
  const interactives = 'a, button, [data-tilt], .plan-cta, .btn-send, .hero-cta';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      gsap.to(dot,  { scale: 2.5, duration: 0.2 });
      gsap.to(ring, { scale: 1.6, borderColor: '#3b82f6', duration: 0.2 });
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      gsap.to(dot,  { scale: 1, duration: 0.2 });
      gsap.to(ring, { scale: 1, borderColor: '#1cb698', duration: 0.2 });
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   3. Navbar scroll effect
───────────────────────────────────────────────────────────── */
export function initNavbar() {
  const nav  = document.getElementById('navbar');
  const ham  = document.getElementById('hamburger');
  const menu = document.getElementById('navLinks');

  ScrollTrigger.create({
    start: 100,
    onEnter:  () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });

  if (ham && menu) {
    ham.addEventListener('click', () => {
      menu.classList.toggle('open');
      ham.classList.toggle('active');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { menu.classList.remove('open'); ham.classList.remove('active'); });
    });
  }

  // (Scroll spy removido ya que ahora es Multi-Page y las clases activas están en el HTML)
}

/* ─────────────────────────────────────────────────────────────
   4. Hero entrance
───────────────────────────────────────────────────────────── */
export function initHeroAnimation() {
  if (!document.querySelector('.hero-avatar')) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-avatar',  { opacity: 0, scale: 0.6, duration: 1 }, 0.3)
    .from('.hero-title',   { opacity: 0, y: 60, duration: 1 }, 0.5)
    .from('.hero-role',    { opacity: 0, y: 30, duration: 0.7 }, 0.8)
    .from('.hero-sub',     { opacity: 0, y: 20, duration: 0.7 }, 1)
    .from('.hero-cta',     { opacity: 0, scale: 0.8, duration: 0.6 }, 1.1)
    .from('.social-links', { opacity: 0, y: 15, duration: 0.6 }, 1.3)
    .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, 1.6);
}

/* ─────────────────────────────────────────────────────────────
   5. Section reveal — text + elements
───────────────────────────────────────────────────────────── */
export function initScrollAnimations() {
  // Section titles
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    });
  });

  // reveal-up cards
  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 60, duration: 0.8,
      delay: (i % 3) * 0.12,
      ease: 'power3.out',
    });
  });

  // Skill bars — animate on scroll
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.dataset.width || bar.style.width || '0%';
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%',
      onEnter: () => gsap.to(bar, { width: w, duration: 1.5, ease: 'power2.out' }),
    });
  });

  // Progress bars in project cards
  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    const w = bar.dataset.width + '%';
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%',
      onEnter: () => gsap.to(bar, { width: w, duration: 1.4, ease: 'power2.out' }),
    });
  });

  // Bio text card
  if (document.querySelector('.bio-card')) {
    gsap.from('.bio-card', {
      scrollTrigger: { trigger: '.bio-card', start: 'top 85%' },
      opacity: 0, x: -40, duration: 1, ease: 'power3.out',
    });
  }

  // Timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, x: -30, duration: 0.8, delay: i * 0.15, ease: 'power2.out',
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   6. Magnetic buttons
───────────────────────────────────────────────────────────── */
export function initMagneticButtons() {
  document.querySelectorAll('.hero-cta, .btn-send, .plan-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   7. Typewriter for bio
───────────────────────────────────────────────────────────── */
const BIO = 'Hola, soy Marco Yañez. Con un enfoque pragmático y orientado a resultados, me especializo en el desarrollo de aplicaciones web modernas y la creación de agentes inteligentes autónomos (IA) diseñados para optimizar procesos y escalar impacto. Mi camino en el mundo TI es una evolución constante entre el comportamiento humano y las arquitecturas Full Stack, donde combino mi pasión por el diseño UX/UI con lógica sólida. Me esfuerzo día a día por dominar las tecnologías que definen el estándar de la industria.';

export function initTypewriter() {
  const el     = document.getElementById('bioText');
  const cursor = document.getElementById('bioCursor');
  if (!el || !cursor) return;

  cursor.style.display = 'none';
  let started = false;

  ScrollTrigger.create({
    trigger: el, start: 'top 85%',
    onEnter: () => {
      if (started) return;
      started = true;
      cursor.style.display = 'inline';
      let i = 0;
      el.textContent = '';
      const step = () => {
        if (i < BIO.length) { el.textContent += BIO[i++]; setTimeout(step, 22); }
      };
      step();
    },
  });
}

/* ─────────────────────────────────────────────────────────────
   8. WhatsApp Floating Animation
───────────────────────────────────────────────────────────── */
export function initWhatsappAnimation() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;

  const socialLinksParams = document.querySelectorAll('.social-link');
  
  if (socialLinksParams.length > 0) {
    // Si estamos en la Home (existen links sociales en el Hero)
    // Extraer el último enlace (el propio logo WA estático del hero)
    const sourceIcon = socialLinksParams[socialLinksParams.length - 1];
    
    // Retrasar hasta que el Hero haya entrado (aprox 1.6s del JS + CSS)
    setTimeout(() => {
      const btnRect = wsp.getBoundingClientRect();
      const sourceRect = sourceIcon.getBoundingClientRect();
      
      const dx = sourceRect.left - btnRect.left;
      const dy = sourceRect.top - btnRect.top;

      gsap.fromTo(wsp, 
        { x: dx, y: dy, scale: 0.1, opacity: 0 },
        { 
          x: 0, y: 0, scale: 1, opacity: 1, 
          duration: 1.5, 
          ease: "bounce.out",
          delay: 0.2
        }
      );
    }, 1500); // Darle tiempo a HeroAnimation a posicionar todo en pantalla

  } else {
    // Sub-páginas sin el Hero: Float-in simple
    gsap.from(wsp, {
      opacity: 0, y: 100, scale: 0.5, 
      duration: 1, delay: 0.5, 
      ease: 'back.out(1.7)'
    });
  }
}
