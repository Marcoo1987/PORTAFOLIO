import PRICING from '../data/pricing.js';

export function renderPricing() {
  const container = document.getElementById('pricingGrid');
  const tabsWrapper = document.getElementById('pricingTabs')?.closest('.pricing-tabs-wrapper');

  if (!container) return;

  // Ocultar el bloque de tabs — ya no se usa
  if (tabsWrapper) tabsWrapper.style.display = 'none';

  // Renderizar todas las categorías verticalmente
  container.innerHTML = Object.entries(PRICING).map(([key, cat]) => `
    <div class="pricing-category" id="pricing-${key}">
      <!-- Encabezado de categoría -->
      <div class="pricing-category-header">
        <div class="category-icon-badge" style="--cat-color: ${cat.color};">
          <i class="${cat.icon}"></i>
        </div>
        <div>
          <h3 class="category-title" style="color: ${cat.color};">${cat.label}</h3>
          <p class="category-subtitle">${cat.description}</p>
        </div>
      </div>

      <!-- Tarjetas de la categoría -->
      <div class="plans-grid">
        ${cat.plans.map(p => `
          <div class="pricing-card glass ${p.popular ? 'popular' : ''}" style="--plan-color: ${cat.color};">
            ${p.popular ? `<div class="badge-popular">⭐ MÁS POPULAR</div>` : ''}

            <div class="plan-icon-wrap">
              <i class="${p.icon}"></i>
            </div>

            <div class="plan-name">${p.name}</div>

            <div class="plan-price-block">
              <span class="price-amount">${p.price}</span>
              <span class="price-period">${p.period}</span>
            </div>

            <div class="plan-desc">${p.description}</div>

            <ul class="features-list">
              ${p.features.map(f => `
                <li class="${f.ok ? '' : 'missing'}">
                  <i class="${f.ok ? 'fa-solid fa-check' : 'fa-solid fa-xmark'}"></i>
                  ${f.text}
                </li>`).join('')}
            </ul>

            <button class="btn-plan ${p.popular ? 'btn-plan-primary' : ''}"
              onclick="handlePlanCTA('${p.id}', '${p.name}', '${cat.label}')"
            >
              ${p.cta}
            </button>
          </div>`).join('')}
      </div>
    </div>`).join('');

  // CTA → WhatsApp
  window.handlePlanCTA = (id, name, category) => {
    const msg = encodeURIComponent(`¡Hola Marco! Vi tu portafolio y estoy interesado en el "${name}" (${category}). ¿Podemos conversar?`);
    window.open(`https://wa.me/56984117478?text=${msg}`, '_blank');
  };
}
