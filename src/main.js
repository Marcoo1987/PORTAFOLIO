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
  initScrollAnimations,
  initMagneticButtons,
  initTypewriter,
  initWhatsappAnimation
} from './modules/animations.js';

document.addEventListener('DOMContentLoaded', () => {
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
  initTypewriter();

  /* Delay scroll animations until after first render */
  requestAnimationFrame(() => {
    initScrollAnimations();
    initMagneticButtons();
  });

  /* 4 — Three.js WebGL background (Solo en index.html) */
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
    
    // Ejecutar animación de salto
    initWhatsappAnimation();
  }
});
