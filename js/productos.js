document.addEventListener('DOMContentLoaded', () => {
  const catalog = document.getElementById('catalogo');
  const toppings = document.getElementById('toppings');
  const contact = document.getElementById('contacto');

  const cards = [
    {
      emoji: '🍕',
      tag: 'Promo',
      title: '3 muzzas',
      description: '3 pizzas + 1 lata de cerveza de 710 o 1 pepsi de regalo a elección.',
      price: '$32.000',
      unitPrice: '$12.000',
      list: ['3 pizzas', '1 lata de cerveza 710 o pepsi', 'a elección'],
      accent: 'product-card--accent',
      href: 'https://wa.me/5491156386563?text=Hola%20me%20interesa%20la%20promo%20de%203%20muzzas%20con%20lata%20o%20pepsi%20a%20elecci%C3%B3n'
    },
    {
      emoji: '🥟',
      tag: 'Empanadas',
      title: 'Docena',
      description: 'La opción perfecta para arrancar o compartir.',
      price: '$20.000',
      unitPrice: '$1.800',
      list: ['Docena completa', 'Ideal para reuniones'],
      accent: 'product-card--blue',
      href: 'https://wa.me/5491123491361?text=Hola%20me%20interesa%20la%20docena%20de%20empanadas'
    },
    {
      emoji: '🥟',
      tag: 'Empanadas',
      title: 'Media docena',
      description: 'Perfecta para una merienda o para acompañar la pizza.',
      price: '$10.000',
      unitPrice: '$1.800',
      list: ['Media docena', 'Mucho sabor'],
      accent: 'product-card--green',
      href: 'https://wa.me/5491123491361?text=Hola%20me%20interesa%20la%20media%20docena%20de%20empanadas'
    }
  ];
  
if (catalog) {
    cards.forEach((card) => {
      const article = document.createElement('article');
      article.className = `product-card ${card.accent}`;
      article.innerHTML = `
        <div class="product-card__top">
          <span class="product-emoji">${card.emoji}</span>
          <span class="product-tag">${card.tag}</span>
        </div>
        <div class="product-card__body">
          <h3>${card.title}</h3>
          <p>${card.description}</p>
          <span class="product-price">${card.price}</span>
          <div class="product-unit-price">
            <span class="product-unit-label">Precio por unidad</span>
            <strong>${card.unitPrice}</strong>
          </div>
          <ul class="product-list">
            ${card.list.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
        <div class="product-card__footer">
          <a class="product-button" href="${card.href}" target="_blank" rel="noopener noreferrer">Pedir</a>
        </div>
      `;
      catalog.appendChild(article);
    });
  }

  if (toppings) {
    const infoPanels = [
      {
        title: 'Variedades de empanadas',
        items: flavors,
        type: 'default'
      },
      {
        title: 'Las pizzas pueden ser',
        items: pizzaStyles,
        type: 'pizza'
      }
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'info-grid';

    infoPanels.forEach((panel) => {
      const panelEl = document.createElement('div');
      panelEl.className = `info-panel ${panel.type === 'pizza' ? 'info-panel--pizza' : 'info-panel--empanadas'}`;
      panelEl.innerHTML = panel.type === 'pizza'
        ? `
          <h3>${panel.title}</h3>
          <ul class="info-list info-list--pizza">
            ${panel.items.map((item) => `
              <li>
                <span class="info-bullet">•</span>
                <span class="info-name">${item.name}</span>
                <strong class="info-price">${item.price}</strong>
              </li>
            `).join('')}
          </ul>
        `
        : `
          <h3>${panel.title}</h3>
          <ul class="info-list info-list--simple">
            ${panel.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        `;
      wrapper.appendChild(panelEl);
    });

    toppings.appendChild(wrapper);
  }

  if (contact) {
    contact.innerHTML = `
      <div class="info-panel contact-box">
        <div class="contact-box__content">
          <div class="contact-box__details">
            <div class="contact-box__label">Pedidos</div>
            <h3 class="contact-box__title">Contáctanos su consulta no molesta</h3>
            <div class="contact-box__meta">
              <div class="contact-box__item">
                <span class="contact-box__text">WhatsApp:</span>
                <a href="https://wa.me/5491161976387?text=Hola%20quiero%20hacer%20mi%20pedido" target="_blank" rel="noopener noreferrer">11 56386563 - 1123491361</a>
              </div>
              <div class="contact-box__item">
                <span class="contact-box__text">Llamanos:</span>
                <a href="tel:+541156386563">+54 9 11 56386563</a>
              </div>
              <div class="contact-box__item">
                <span class="contact-box__text">Dirección:</span>
                <span>La Porteña 4675</span>
              </div>
            </div>
          </div>

          <div class="contact-map" aria-label="Mapa de la dirección La Porteña 4675">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13119.34629724788!2d-58.573565739080216!3d-34.70930172315595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc5fd9fd1fd6d%3A0xc3c6c3fccccf49b4!2sLa%20Porte%C3%B1a%204675%2C%20B1754EJG%20San%20Justo%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1ses!2sar!4v1793727052412!5m2!1ses!2sar" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
          </div>
        </div>
      </div>
    `;
  }
});
