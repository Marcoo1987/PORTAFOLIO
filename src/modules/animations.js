import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

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
   2. Custom Teal Cursor + Soft Particle Trail
───────────────────────────────────────────────────────────── */
class TealParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    // Tamaño pequeño y suave para que parezca humo/llama difuminada
    this.size = Math.random() * 4 + 1.5;
    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = -Math.random() * 2.5 - 0.5;
    this.life = 0.9;
    this.decay = Math.random() * 0.03 + 0.018;
    // Gradiente celeste: #1CB698 → #60efff → blanco difuminado
    this.hue = 165 + Math.random() * 25; // rango teal/cyan
    this.sat = 80 + Math.random() * 20;
    this.lit = 55 + Math.random() * 25;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.97;
    this.lit += 0.4; // aclarar suavemente
  }

  draw(ctx) {
    ctx.beginPath();
    // Difuminado con radialGradient en lugar de círculo sólido
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    grad.addColorStop(0, `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${this.life})`);
    grad.addColorStop(1, `hsla(${this.hue}, ${this.sat}%, ${this.lit + 20}%, 0)`);
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }
}

class TealSystem {
  constructor() {
    this.canvas = document.getElementById('flame-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  add(x, y) {
    // Solo 2 partículas por frame para que sea sutil
    for (let i = 0; i < 2; i++) {
      this.particles.push(new TealParticle(x, y));
    }
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'screen';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update();
      if (p.life <= 0 || p.size <= 0.5) {
        this.particles.splice(i, 1);
      } else {
        p.draw(this.ctx);
      }
    }
  }
}

export function initCursor() {
  // Ocultar SVG llama naranja
  const flame = document.getElementById('cursor-flame');
  if (flame) flame.style.display = 'none';

  const dot = document.getElementById('cursor-dot');
  if (!dot) return;

  const tealSystem = new TealSystem();
  const mouse = { x: -200, y: -200 };

  dot.style.display = 'block';

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    gsap.set(dot, { x: mouse.x, y: mouse.y });

    if (tealSystem.canvas) {
      tealSystem.add(mouse.x, mouse.y - 4);
      tealSystem.update();
    }
  });

  // Dot crece ligeramente en hover
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .clickable, .hero-cta, .social-link, .project-card, label, input')) {
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.boxShadow = '0 0 16px rgba(28,182,152,1), 0 0 32px rgba(96,239,255,0.5)';
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .clickable, .hero-cta, .social-link, .project-card, label, input')) {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.boxShadow = '0 0 10px rgba(28,182,152,0.9), 0 0 20px rgba(28,182,152,0.4)';
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
  if (!nav || !ham || !menu) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
      gsap.to(nav, { backgroundColor: 'rgba(2,6,23,0.92)', backdropFilter: 'blur(20px)', duration: 0.4 });
    } else {
      nav.classList.remove('scrolled');
      gsap.to(nav, { backgroundColor: 'transparent', backdropFilter: 'blur(0px)', duration: 0.4 });
    }
  });

  ham.addEventListener('click', () => {
    menu.classList.toggle('open');
    ham.classList.toggle('active');
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('active');
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   4. Hero entrance
───────────────────────────────────────────────────────────── */
export function initHeroAnimation() {
  if (!document.querySelector('.hero-avatar')) return;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero-avatar',        { opacity: 0, scale: 0.6, duration: 1 }, 0.3)
    .from('.hero-role',          { opacity: 0, y: 30, duration: 0.7 }, 0.8)
    .from('.hero-slider-wrap',   { opacity: 0, y: 20, duration: 0.7 }, 1)
    .from('.hero-cta',           { scale: 0.8, y: 20, duration: 0.6 }, 1.1)
    .from('.social-links',       { opacity: 0, y: 15, duration: 0.6 }, 1.3)
    .from('.scroll-indicator',   { opacity: 0, duration: 0.8 }, 1.6);
}

/* ─────────────────────────────────────────────────────────────
   5. Hero Name — Letter Drop + Plasma Effect
───────────────────────────────────────────────────────────── */
export function initHeroNameEffect() {
  const nameEl = document.getElementById('heroName');
  if (!nameEl) return;

  const rawText = nameEl.textContent;
  nameEl.innerHTML = Array.from(rawText).map((char) => {
    if (char === ' ') return `<span class="hero-char hero-space">&nbsp;</span>`;
    return `<span class="hero-char">${char}</span>`;
  }).join('');

  const chars = Array.from(nameEl.querySelectorAll('.hero-char'));

  gsap.set(chars, { opacity: 0, y: -700, rotationX: -120, rotationZ: 15, scale: 0.3 });

  gsap.to(chars, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    rotationZ: 0,
    scale: 1,
    duration: 1.8,
    stagger: { each: 0.25, ease: 'power1.inOut' },
    ease: 'bounce.out',
    delay: 0.5,
    onComplete: () => attachPlasmaEffect(nameEl, chars),
  });
}

function attachPlasmaEffect(container, chars) {
  const RADIUS    = 140;
  const STRENGTH  = 38;
  const SPEED     = 0.008;
  const PLASMA_COLORS = ['#00ffff', '#7b2fff', '#ff00aa', '#00ff88', '#ffe600', '#ff4d00'];
  const positions = [];

  function refreshPositions() {
    chars.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      positions[i] = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  }

  container.addEventListener('mouseenter', refreshPositions);
  container.addEventListener('mousemove', (e) => {
    const mx  = e.clientX;
    const my  = e.clientY;
    const now = Date.now();

    chars.forEach((char, i) => {
      if (!positions[i]) return;
      const dx   = mx - positions[i].x;
      const dy   = my - positions[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        const falloff  = 1 - dist / RADIUS;
        const wave     = Math.sin(dist * 0.035 - now * SPEED) * STRENGTH * falloff;
        const waveX    = Math.cos(dist * 0.05  - now * SPEED * 0.6) * 12 * falloff;
        const rotZ     = Math.sin(dist * 0.04  - now * SPEED * 0.8) * 18 * falloff;
        const sc       = 1 + falloff * 0.28;
        const colorIdx = Math.floor((now * 0.002 + i * 0.4) % PLASMA_COLORS.length);
        const color    = PLASMA_COLORS[colorIdx];
        const glowSize = 12 + falloff * 30;

        gsap.to(char, {
          y: wave, x: waveX, rotationZ: rotZ, scale: sc,
          duration: 0.12, ease: 'power2.out', overwrite: true,
          onUpdate: () => {
            char.style.textShadow = `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}88`;
            char.style.filter = `brightness(${1 + falloff * 1.2})`;
          },
        });
      } else {
        gsap.to(char, {
          y: 0, x: 0, rotationZ: 0, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.38)', overwrite: true,
          onUpdate: () => { char.style.textShadow = ''; char.style.filter = ''; },
        });
      }
    });
  });

  container.addEventListener('mouseleave', () => {
    chars.forEach((char, i) => {
      gsap.to(char, {
        y: 0, x: 0, rotationZ: 0, scale: 1, duration: 1.0, delay: i * 0.03, ease: 'elastic.out(1, 0.42)', overwrite: true,
        onComplete: () => { char.style.textShadow = ''; char.style.filter = ''; },
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   6. Hero Mission/Vision Slider
───────────────────────────────────────────────────────────── */
export function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length <= 1) return;

  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4500);
}

/* ─────────────────────────────────────────────────────────────
   7. Scroll Trigger Reveal Animations
───────────────────────────────────────────────────────────── */
export function initScrollAnimations() {
  document.querySelectorAll('.section-title').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      opacity: 0, y: 50, duration: 0.9, ease: 'power3.out',
    });
  });

  document.querySelectorAll('.reveal-up').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none', once: true },
      opacity: 0, y: 60, duration: 0.8, delay: (i % 3) * 0.12, ease: 'power3.out',
    });
  });

  document.querySelectorAll('.skill-fill').forEach(bar => {
    const w = bar.dataset.width || bar.style.width || '0%';
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%',
      onEnter: () => gsap.to(bar, { width: w, duration: 1.5, ease: 'power2.out' }),
    });
  });

  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    const w = bar.dataset.width + '%';
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, start: 'top 90%',
      onEnter: () => gsap.to(bar, { width: w, duration: 1.4, ease: 'power2.out' }),
    });
  });

  if (document.querySelector('.bio-card')) {
    gsap.from('.bio-card', {
      scrollTrigger: { trigger: '.bio-card', start: 'top 85%' },
      opacity: 0, x: -40, duration: 1, ease: 'power3.out',
    });
  }

  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity: 0, x: -30, duration: 0.8, delay: i * 0.15, ease: 'power2.out',
    });
  });

  ScrollTrigger.refresh();
}

/* ─────────────────────────────────────────────────────────────
   8. Magnetic buttons & Tilt effect
───────────────────────────────────────────────────────────── */
export function initMagneticButtons() {
  document.querySelectorAll('.hero-cta, .btn-send, .plan-cta, .btn-plan').forEach(btn => {
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

  document.querySelectorAll('.pricing-card, .bento-cell').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) / (r.width  / 2);
      const dy  = (e.clientY - cy) / (r.height / 2);
      gsap.to(card, {
        rotationX: dy * -10, rotationY: dx * 10,
        transformPerspective: 800, scale: 1.02,
        duration: 0.3, ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, scale: 1,
        duration: 0.6, ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   9. Typewriter for bio
───────────────────────────────────────────────────────────── */
export function initTypewriter() {
  const textEl = document.getElementById('bioText');
  const cursorEl = document.getElementById('bioCursor');
  if (!textEl || !cursorEl) return;
  let typed = false;
  const bioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !typed) {
        typed = true;
        const bioTextElement = document.getElementById('bioText');
        if (bioTextElement) {
          const fullText = "Hola, soy Marco Yañez. Soy un Psicólogo titulado (2013) con una trayectoria de más de 10 años en áreas críticas como Pericia Forense, Neuropsicología y Reclutamiento Minero. Como AI Engineer (Bootcamp Python 428h), mi enfoque es una evolución constante entre el comportamiento humano y las arquitecturas Full Stack. Me especializo en el desarrollo de agentes inteligentes autónomos diseñados para optimizar procesos y escalar impacto, fusionando la precisión analítica del peritaje con lógica sólida en el frontend y backend. Actualmente finalizo mi especialización en Full Stack JavaScript para seguir dominando las tecnologías que definen el estándar de la industria.";
          let i = 0;
          bioTextElement.innerHTML = '';
          
          function type() {
            if (i < fullText.length) {
              bioTextElement.innerHTML += fullText.charAt(i);
              i++;
              setTimeout(type, 15); // Velocidad de tipeo fluida
            } else {
              // Parpadeo del cursor al terminar
              const cursor = document.getElementById('bioCursor');
              if (cursor) {
                gsap.to(cursor, { opacity: 0, repeat: -1, yoyo: true, duration: 0.6 });
              }
            }
          }
          setTimeout(type, 800); 
        }
      }
    });
  }, { threshold: 0.05 });

  const sobreSection = document.getElementById('sobremi-hero');
  if (sobreSection) bioObserver.observe(sobreSection);
  else if (textEl) bioObserver.observe(textEl);
}

/* ─────────────────────────────────────────────────────────────
   10. WhatsApp Teatral Animation (FIXED)
───────────────────────────────────────────────────────────── */
export function initWhatsappAnimation() {
  const wsp = document.getElementById('wsp-float');
  if (!wsp) return;

  const isHomePage = !!document.getElementById('inicio');
  const socialLinksCont = document.querySelector('.social-links');

  if (isHomePage && socialLinksCont) {
    const icons = Array.from(socialLinksCont.querySelectorAll('.social-link'));
    // Ocultar inicialmente en la esquina SUPERIOR IZQUIERDA
    gsap.set(wsp, { 
      autoAlpha: 0, 
      scale: 0.5, 
      left: -100, 
      top: -100, 
      rotation: -45,
      bottom: 'auto',
      position: 'fixed' 
    });

    const tl = gsap.timeline({ delay: 1.5 });

    // 1. ENTRADA DESDE LA ESQUINA SUPERIOR AL PRIMER ICONO
    if (icons.length > 0) {
      const firstRect = icons[0].getBoundingClientRect();
      const firstX = firstRect.left + (firstRect.width / 2) - 30;
      const firstY = firstRect.top - 60; // REBOTE INICIAL SOBRE EL PRIMERO

      tl.to(wsp, {
        autoAlpha: 1,
        left: firstX,
        top: firstY,
        rotation: 360,
        duration: 1.6,
        ease: "power2.out"
      });

      // REACCIÓN DE "PRESIÓN" EN EL PRIMER ICONO
      tl.to(icons[0], { y: 15, scale: 0.85, duration: 0.15, yoyo: true, repeat: 1 }, "-=0.2");

      // 2. SALTOS ACROBÁTICOS SOBRE CADA ICONO Restante
      for (let i = 1; i < icons.length; i++) {
        const rect = icons[i].getBoundingClientRect();
        const targetX = rect.left + (rect.width / 2) - 30;
        const targetY = rect.top - 50; // ALTURA DE "REBOTE" (SOBRE EL ICONO)

        // Trayectoria de arco fluido (parábola)
        tl.to(wsp, {
          left: targetX,
          top: targetY - 80, // Pico del arco entre iconos
          rotation: "+=120",
          duration: 0.4,
          ease: "power1.out"
        }, "-=0.05");

        // Punto de "impacto a distancia" sobre el icono
        tl.to(wsp, {
          top: targetY,
          duration: 0.3,
          ease: "power2.in"
        });

        // REACCIÓN DE "PRESIÓN FISICA" (El icono se hunde al pasar el botón)
        tl.to(icons[i], { 
          y: 20, 
          scale: 0.8, 
          filter: 'brightness(1.5)', 
          duration: 0.15, 
          yoyo: true, 
          repeat: 1 
        }, "-=0.2");
      }
    }

    // 3. GRAN SALTO FINAL A LA ESQUINA (bottom-right)
    const finalX = window.innerWidth - 34 - 60;
    const finalY = window.innerHeight - 115 - 60;

    tl.to(wsp, {
      left: finalX,
      top: finalY - 250, // Gran parábola final
      rotation: "+=360",
      duration: 1.8,
      ease: "power2.out"
    }, "+=0.2");

    tl.to(wsp, {
      top: finalY,
      duration: 1.2,
      ease: "bounce.out"
    });

    tl.add(() => {
      // Limpieza de estilos inline para que el CSS (bottom/right) tome el control
      gsap.set(wsp, { clearProps: "all" });
      wsp.classList.add('ready');
    });

  } else {
    // Restauramos el efecto original: entrada limpia desde abajo con rebote suave en otras páginas
    gsap.fromTo(wsp, 
      { 
        autoAlpha: 0, 
        y: 100, 
        scale: 0.5, 
        display: 'flex' 
      }, 
      { 
        autoAlpha: 1, 
        y: 0, 
        scale: 1, 
        duration: 1.2, 
        delay: 0.8, 
        ease: 'back.out(1.7)', 
        onComplete: () => {
          gsap.set(wsp, { clearProps: "all" });
          wsp.classList.add('ready');
        }
      }
    );
  }
}
