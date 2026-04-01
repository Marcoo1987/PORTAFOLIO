import PRICING from '../data/pricing.js';

export function renderPricing() {
  const container = document.getElementById('pricingGrid');
  if (!container) return;

  container.innerHTML = PRICING.map(p => `
    <div class="pricing-card glass ${p.popular ? 'popular' : ''}">
      ${p.popular ? '<div class="badge-popular">⭐ MÁS RECOMENDADO</div>' : ''}
      <div class="plan-icon"><i class="${p.icon}"></i></div>
      <div class="plan-name">${p.name}</div>
      <div class="plan-price">${p.price}<span>${p.period}</span></div>
      <div class="plan-desc">${p.description}</div>
      <ul class="features-list">
        ${p.features.map(f => `
          <li class="${f.ok ? '' : 'missing'}">
            <i class="${f.ok ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}"></i>
            ${f.text}
          </li>`).join('')}
      </ul>
      <button class="btn-plan" onclick="handlePlanCTA('${p.id}', '${p.name}')">
        ${p.cta}
      </button>
    </div>`).join('');

  window.handlePlanCTA = (id, name) => {
    const msg = encodeURIComponent(`¡Hola Marco! Estoy interesado en el ${name}. ¿Podemos conversar?`);
    window.open(`https://wa.me/56984117478?text=${msg}`, '_blank');
  };
}
