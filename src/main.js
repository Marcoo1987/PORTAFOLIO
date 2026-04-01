import './style.css';
import { renderProjects } from './modules/renderProjects.js';
import { renderPricing }  from './modules/renderPricing.js';
import { initModal }      from './modules/modal.js';
import { initThreeBackground } from './modules/threeBackground.js';
import {
  initSmoothScroll,
  initCursor,
  initNavbar,
  initHeroAnimation,
  initHeroNameEffect,
  initHeroSlider,
  initScrollAnimations,
  initMagneticButtons,
  initTypewriter,
  initWhatsappAnimation
} from './modules/animations.js';

function initApp() {
  /* 1 — Render dynamic content */
  renderProjects();
  renderPricing();

  /* 2 — Init modal system */
  initModal();

  /* 3 — Animations & interactivity */
  initSmoothScroll();
  initCursor();
  initNavbar();
  initHeroAnimation();
  initHeroNameEffect();
  initHeroSlider();
  initTypewriter();

  /* Esperamos a que los componentes dinámicos finalicen el layout
     para evitar que ScrollTrigger mida posiciones a 0. */
  setTimeout(() => {
    initScrollAnimations();
    initMagneticButtons();
    
    // Forzamos recalcular todas las posiciones de scroll
    if (typeof window !== 'undefined' && window.gsap) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.ScrollTrigger.refresh();
    }
  }, 120);

  /* 4 — Three.js WebGL background (Global) */
  if (document.getElementById('three-canvas')) {
    initThreeBackground();
  }

  /* 5 — Global Floating WhatsApp Button */
  if (!document.getElementById('wsp-float')) {
    const wsp = document.createElement('a');
    wsp.href = "https://wa.me/56984117478?text=Hola Marco, vi tu portafolio y quiero conversar!";
    wsp.target = "_blank";
    wsp.className = "wsp-float";
    wsp.id = "wsp-float";
    wsp.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(wsp);
  }
  
  // Siempre intentar la animación errática del botón
  initWhatsappAnimation();
}

// Vite / Module compatibility
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ─── Anti-FOUC Total (CSS en vivo -> visible) ── */
// Ya el head.html oculta el body antes de cargar CSS y scripts
document.body.style.transition = 'opacity 0.45s ease, visibility 0.45s ease';

const showPage = () => {
  const foucStyle = document.getElementById('anti-fouc');
  document.body.style.setProperty('opacity', '1', 'important');
  document.body.style.setProperty('visibility', 'visible', 'important');
  if (foucStyle) {
    setTimeout(() => foucStyle.remove(), 200);
  }
};

window.addEventListener('load', showPage);
document.addEventListener('DOMContentLoaded', () => setTimeout(showPage, 50));
setTimeout(showPage, 1200); // Failsafe


/* ─── Transición de página con rayo eléctrico ────── */
(function initPageLightning() {
  const overlay = document.createElement('div');
  overlay.id = 'page-lightning';
  overlay.innerHTML = `
    <div class="lightning-bolt"></div>
    <div class="lightning-bolt b2"></div>
    <div class="lightning-bolt b3"></div>
  `;
  document.body.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = `
    #page-lightning {
      position: fixed; inset: 0; z-index: 99999;
      background: #020617; opacity: 0; pointer-events: none;
      display: flex; align-items: center; justify-content: center;
      transition: opacity 0.15s ease;
    }
    #page-lightning.active { opacity: 1; pointer-events: all; }
    .lightning-bolt {
      position: absolute; width: 4px; height: 100vh;
      background: linear-gradient(180deg, transparent 0%, #00ffff 30%, #7b2fff 60%, #00ffff 80%, transparent 100%);
      filter: blur(2px) brightness(2);
      animation: lightning-strike 0.4s ease-out forwards;
      left: 50%; transform: translateX(-50%); opacity: 0;
    }
    .lightning-bolt.b2 { width: 2px; left: 48%; animation-delay: 0.05s; background: linear-gradient(180deg, transparent 0%, #ff00aa 40%, #fff 70%, transparent 100%); }
    .lightning-bolt.b3 { width: 3px; left: 52%; animation-delay: 0.08s; background: linear-gradient(180deg, transparent 0%, #ffe600 50%, #ff4d00 80%, transparent 100%); }
    @keyframes lightning-strike {
      0%   { opacity: 0; transform: translateX(-50%) scaleY(0); transform-origin: top; }
      15%  { opacity: 1; transform: translateX(-50%) scaleY(1); filter: blur(2px) brightness(4); }
      60%  { opacity: 0.8; filter: blur(1px) brightness(2); }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || link.target === '_blank') return;

    e.preventDefault();
    overlay.classList.add('active');
    overlay.querySelectorAll('.lightning-bolt').forEach(b => {
      b.style.animation = 'none';
      b.offsetHeight;
      b.style.animation = '';
    });
    setTimeout(() => { window.location.href = href; }, 420);
  });
})();
