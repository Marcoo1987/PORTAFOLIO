import PROJECTS from '../data/projects.js';
import { openDetail, openGallery } from './modal.js';
import VanillaTilt from 'vanilla-tilt';

export function renderProjects() {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  container.innerHTML = PROJECTS.map(p => `
    <div class="project-card reveal-up" data-tilt data-tilt-max="8" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.15">
      <div class="project-img-wrap">
        ${p.image
          ? `<img src="${p.image}" class="project-img" alt="${p.title}" loading="lazy">`
          : `<div class="project-placeholder">
               <i class="${p.icon}"></i>
               <span>${p.title}</span>
             </div>`
        }
      </div>
      <div class="project-body">
        <div class="project-row">
          <h3 class="project-title">${p.title}</h3>
          <span class="badge-version">${p.version}</span>
        </div>
        <div class="project-row" style="margin-top:-0.4rem;margin-bottom:0.8rem">
          <span class="${p.status === 'COMPLETADO' ? 'badge-completado' : 'badge-progreso'}">${p.status}</span>
        </div>
        <p class="project-desc">${p.description}</p>
        <div class="progress-block">
          <div class="progress-meta"><span>Progreso general</span><span>${p.progress}%</span></div>
          <div class="progress-track"><div class="progress-fill" data-width="${p.progress}"></div></div>
        </div>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-actions">
          <button class="btn-detail" onclick="handleDetail('${p.id}')">
            <i class="fa-solid fa-list"></i> VER DETALLES
          </button>
          <button class="btn-gallery" onclick="handleGallery('${p.id}')">
            <i class="fa-solid fa-images"></i> VER FOTOS
          </button>
        </div>
      </div>
    </div>`).join('');

  // Init VanillaTilt safely
  try {
    if (typeof VanillaTilt !== 'undefined' && VanillaTilt.init) {
      VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
        max: 8, speed: 400, glare: true, 'max-glare': 0.15,
      });
    }
  } catch (err) {
    console.warn('VanillaTilt no cargó correctamente:', err);
  }

  // Expose handlers to global scope (called from inline onclick)
  window.handleDetail  = (id) => openDetail(id);
  window.handleGallery = (id) => openGallery(id);
}
