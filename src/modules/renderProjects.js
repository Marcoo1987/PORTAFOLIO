import PROJECTS from '../data/projects.js';
import { openDetail, openGallery } from './modal.js';

export function renderProjects() {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  console.log('Rendering projects...', PROJECTS.length, 'found.');
  container.innerHTML = ''; // Limpiar antes de inyectar
  
  container.innerHTML = PROJECTS.map(p => `
    <div class="proyecto" style="opacity: 1 !important;">
      ${p.image 
        ? `<img src="${p.image}" alt="${p.title}" onerror="this.src='/img/placeholder.png'">` 
        : `<div class="proyecto-placeholder"><i class="${p.icon || 'fa-solid fa-code'}"></i><span>${p.title}</span></div>`
      }
      <div class="proyecto-overlay">
        <h3>${p.title}</h3>
        <p>${p.description.length > 100 ? p.description.substring(0, 97) + '...' : p.description}</p>
        <div class="proyecto-tags">
          ${p.tags.map(t => `<span class="proyecto-tag">${t}</span>`).join('')}
        </div>
        <div class="proyecto-btns">
          <button class="btn-overlay" onclick="handleDetail('${p.id}')">DETALLES</button>
          <button class="btn-overlay" onclick="handleGallery('${p.id}')">FOTOS</button>
        </div>
      </div>
    </div>`).join('');

  // Expose handlers to global scope (called from inline onclick)
  window.handleDetail  = (id) => openDetail(id);
  window.handleGallery = (id) => openGallery(id);
}
