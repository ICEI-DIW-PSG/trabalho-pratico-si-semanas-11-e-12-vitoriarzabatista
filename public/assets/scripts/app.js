const App = (function () {
  const dados = {
    "lugares": [
      {
        "id": 1,
        "tipo": "Eventos",
        "nome": "Casamento Clássico",
        "descricao": "Cerimônia entre jardins e recepção no pátio central.",
        "descricaodetalhada": "Realizar um casamento na Villa Cetinale é viver um conto de fadas em meio à história. Os jardins renascentistas servem de palco para cerimônias banhadas pela luz dourada da Toscana, enquanto os salões históricos recebem os convidados com música, flores e vinhos locais. A equipe personaliza cada detalhe — do menu à decoração — garantindo uma celebração única e inesquecível. À noite, o local se transforma em um cenário mágico, iluminado por velas e estrelas.",
        "imagem": "img/evento1.jpg"
      },
      {
        "id": 2,
        "tipo": "Eventos",
        "nome": "Aniversário Privado",
        "descricao": "Celebração intimista com menu degustação.",
        "descricaodetalhada": "Celebre a vida com exclusividade e charme. Os aniversários na Villa Cetinale acontecem em ambientes reservados, com jantares intimistas e menus degustação preparados pelo chef. É possível escolher entre o pátio interno, cercado por colunas de pedra e heras, ou o salão principal, decorado com tapeçarias originais. A experiência é completa: música ambiente, vinhos harmonizados e o calor acolhedor da hospitalidade italiana.",
        "imagem": "img/evento2.jpg"
      },
      {
        "id": 3,
        "tipo": "Eventos",
        "nome": "Retiro Gourmet",
        "descricao": "Oficinas de cozinha e degustação de vinhos.",
        "descricaodetalhada": "O Retiro Gourmet é uma imersão sensorial no universo da gastronomia toscana. Durante alguns dias, os participantes aprendem com chefs locais a preparar massas frescas, molhos clássicos e sobremesas típicas. As aulas acontecem nas cozinhas antigas da Villa, seguidas de degustações de vinhos e azeites da propriedade. É uma experiência que une aprendizado, prazer e convivência, ideal para quem ama a culinária e o estilo de vida italiano.",
        "imagem": "img/evento3.jpg"
      },
      {
        "id": 4,
        "tipo": "Eventos",
        "nome": "Noite de Gala",
        "descricao": "Jantar ao ar livre em nossos jardins.",
        "descricaodetalhada": "A Noite de Gala na Villa Cetinale é o auge da elegância. O evento é montado nos jardins iluminados por centenas de velas e lustres suspensos. Convidados desfrutam de um jantar sofisticado ao som de uma orquestra local, enquanto o pôr do sol se dissolve nas colinas da Toscana. É uma celebração inesquecível de arte, cultura e sofisticação — o verdadeiro espírito italiano em sua forma mais pura.",
        "imagem": "img/evento4.jpg"
      },
      
    ]
  };

  function qS(param) {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  }

  function renderCards() {
    const container = document.getElementById('cardsContainer');
    if (!container) return;

    container.innerHTML = `
        ${dados.lugares.map(lugar => `
          <div class="col">
            <div class="card h-100">
              <img src="${lugar.imagem}" class="card-img-top" alt="${escapeHtml(lugar.nome)}">
              <div class="card-body d-flex flex-column">
                <span class="pill mb-2">${capitalize(lugar.tipo)}</span>
                <h5 class="card-title">${escapeHtml(lugar.nome)}</h5>
                <p class="card-text text-muted">${escapeHtml(lugar.descricao)}</p>
                <div class="mt-auto">
                  <a href="detalhes.html?lugar=${lugar.id}" class="btn btn-outline-primary btn-sm">Ver detalhes</a>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderDetail() {
    const lugarId = Number(qS('lugar'));
    const area = document.getElementById('detailArea');
    if (!area) return;

    const lugar = dados.lugares.find(l => l.id === lugarId);
    if (!lugar) {
      area.innerHTML = '<p>Local não encontrado.</p>';
      return;
    }

    area.innerHTML = `
      <div class="detail-hero">
        <div>
          <img src="${lugar.imagem}" alt="${escapeHtml(lugar.nome)}">
        </div>
        <aside>
          <h2 class="brand">${escapeHtml(lugar.nome)}</h2>
          <p class="text-muted">${escapeHtml(lugar.descricao)}</p>
          <div class="mt-4">
            <h5>Descrição Detalhada</h5>
            <p class="text-muted">${escapeHtml(lugar.descricaodetalhada)}</p>
          </div>
          <a href="index.html" class="btn btn-primary mt-3">Voltar à página inicial</a>
        </aside>
      </div>

      <section class="mt-4">
        <h4>Outros eventos</h4>
        <div class="gallery-grid" id="galleryArea"></div>
      </section>
    `;

    const gallery = document.getElementById('galleryArea');
    const outros = dados.lugares.filter(l => l.id !== lugarId);

    gallery.innerHTML = outros.map(a => `
      <div class="card h-100">
        <img src="${a.imagem}" class="card-img-top" alt="${escapeHtml(a.nome)}">
        <div class="card-body p-2 text-center">
          <h6 class="card-title mb-0">${escapeHtml(a.nome)}</h6>
          <a href="detalhes.html?lugar=${a.id}" class="stretched-link"></a>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );
  }

  function capitalize(s) {
    if (!s) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return {
    initHome: function () {
      renderCards();
    },
    initDetail: function () {
      renderDetail();
    },
    _dados: dados
  };
})();
