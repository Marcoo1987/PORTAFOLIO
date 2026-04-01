import PROJECTS from '../data/projects.js';

let modal, modalBody, modalCloseBtn;

export function initModal() {
  modal = document.getElementById('projectModal');
  modalBody = document.getElementById('modalBody');
  modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modal || !modalBody || !modalCloseBtn) return;

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

export function openDetail(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  modalBody.innerHTML = `
    ${p.image ? `<img src="${p.image}" class="modal-img" alt="${p.title}">` : ''}
    <div class="modal-body">
      <div style="display:flex;gap:1rem;align-items:center;margin-bottom:1.2rem;flex-wrap:wrap;">
        <h2 class="modal-title" style="margin:0">${p.title}</h2>
        <span class="badge-version">${p.version}</span>
        <span class="${p.status === 'COMPLETADO' ? 'badge-completado' : 'badge-progreso'}">${p.status}</span>
      </div>
      <p style="color:var(--clr-muted);font-size:0.95rem;line-height:1.8;margin-bottom:1.5rem">${p.description}</p>
      <div class="progress-block">
        <div class="progress-meta"><span>Progreso General</span><span>${p.progress}%</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${p.progress}%"></div></div>
      </div>
      <div class="project-tags" style="margin-top:1rem">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>`;
  openModal();
}

export function openGallery(id) {
  const p = PROJECTS.find(x => x.id === id);
  if (!p) return;
  const imgs = p.gallery.length > 0 ? p.gallery : (p.image ? [p.image] : []);
  modalBody.innerHTML = `
    <div class="modal-body">
      <h2 class="modal-title">${p.title} — Galería</h2>
      ${imgs.length > 0
        ? `<div class="modal-gallery">${imgs.map(src => `<img src="${src}" alt="${p.title}">`).join('')}</div>`
        : `<p style="color:var(--clr-muted);text-align:center;padding:3rem 0"><i class="fa-solid fa-images" style="font-size:3rem;display:block;margin-bottom:1rem;color:var(--clr-primary)"></i>Sin imágenes disponibles aún</p>`
      }
    </div>`;
  openModal();
}

function openModal() {
  modal.style.display = 'flex';
  requestAnimationFrame(() => modal.classList.add('open'));
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  setTimeout(() => { modal.style.display = 'none'; document.body.style.overflow = ''; }, 320);
}
