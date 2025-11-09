const API_URL = "http://localhost:3000/categorias";

// Lista as categorias na pagina inicial
async function carregarCategorias() {
  try {
    const res = await fetch(API_URL);
    const categorias = await res.json();

    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    categorias.forEach(cat => {
      container.innerHTML += `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${cat.imagem}" class="card-img-top" alt="${cat.nome}">
            <div class="card-body d-flex flex-column">
              <span class="pill mb-2">${cat.tipo}</span>
              <h5 class="card-title">${cat.nome}</h5>
              <p class="card-text text-muted">${cat.descricao}</p>
              <div class="mt-auto">
                <a href="detalhes.html?id=${cat.id}" class="btn btn-outline-dark btn-sm">Ver detalhes</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Erro ao carregar categorias:", err);
  }
}

// mostra detalhe por id
async function carregarDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {

    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar categoria");
    const cat = await res.json();

    const area = document.getElementById("detailArea");
    area.innerHTML = `
      <div class="detail-hero mb-5">
        <div>
          <img src="${cat.imagem}" class="img-fluid rounded mb-4" alt="${cat.nome}">
        </div>
        <div>
          <h2 class="brand">${cat.nome}</h2>
          <p class="text-muted">${cat.descricao}</p>
          <hr>
          <h5>Descrição detalhada</h5>
          <p>${cat.descricaodetalhada}</p>
          <a href="index.html" class="btn btn-outline-primary mt-3">Voltar</a>
        </div>
      </div>

      <section class="mt-5">
        <h4>Outras categorias</h4>
        <div class="row row-cols-1 row-cols-md-4 g-4" id="galleryArea"></div>
      </section>
    `;

    // mostrar galeria
    const resOutros = await fetch(API_URL);
    const todas = await resOutros.json();

    const outras = todas.filter(c => String(c.id) !== String(id));
    const gallery = document.getElementById("galleryArea");

    gallery.innerHTML = outras.map(a => `
      <div class="col">
        <div class="card h-100 shadow-sm">
          <img src="${a.imagem}" class="card-img-top" alt="${a.nome}">
          <div class="card-body p-2 text-center">
            <h6 class="card-title mb-0">${a.nome}</h6>
            <p class="text-muted small">${a.tipo}</p>
            <a href="detalhes.html?id=${a.id}" class="stretched-link"></a>
          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error("Erro ao carregar detalhes:", err);
  }
}


// CRUD de categorias
async function inicializarCRUD() {
  const API_URL = "http://localhost:3000/categorias";
  const form = document.getElementById("formCategoria");
  const lista = document.getElementById("listaCategorias");
  const btnAtualizar = document.getElementById("btnAtualizar");
  const btnExcluir = document.getElementById("btnExcluir");

  let categoriaSelecionada = null;

  async function listar() {
    const res = await fetch(API_URL);
    const categorias = await res.json();
    lista.innerHTML = "";

    categorias.forEach(cat => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <div>
          <strong>${cat.nome}</strong>
          <br><small class="text-muted">${cat.tipo}</small>
        </div>
        <button class="btn btn-sm btn-outline-primary">Selecionar</button>
      `;
      li.querySelector("button").addEventListener("click", () => selecionar(cat));
      lista.appendChild(li);
    });
  }

  // Selecionar para editar/excluir 
  function selecionar(cat) {
    categoriaSelecionada = cat;
    document.getElementById("tipo").value = cat.tipo;
    document.getElementById("nome").value = cat.nome;
    document.getElementById("descricao").value = cat.descricao;
    document.getElementById("descricaodetalhada").value = cat.descricaodetalhada || "";
    document.getElementById("imagem").value = cat.imagem;
  }

  // POST
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const novaCat = {
      tipo: tipo.value,
      nome: nome.value,
      descricao: descricao.value,
      descricaodetalhada: descricaodetalhada.value,
      imagem: imagem.value
    };
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaCat)
    });
    alert("Categoria cadastrada com sucesso!");
    form.reset();
    listar();
  });

  // PUT
  btnAtualizar.addEventListener("click", async () => {
    if (!categoriaSelecionada) return alert("Selecione uma categoria primeiro!");
    const atualizada = {
      tipo: tipo.value,
      nome: nome.value,
      descricao: descricao.value,
      descricaodetalhada: descricaodetalhada.value,
      imagem: imagem.value
    };
    await fetch(`${API_URL}/${categoriaSelecionada.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(atualizada)
    });
    alert("Categoria atualizada!");
    form.reset();
    categoriaSelecionada = null;
    listar();
  });

  // DELETE
  btnExcluir.addEventListener("click", async () => {
    if (!categoriaSelecionada) return alert("Selecione uma categoria primeiro!");
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;
    await fetch(`${API_URL}/${categoriaSelecionada.id}`, { method: "DELETE" });
    alert("Categoria excluída!");
    form.reset();
    categoriaSelecionada = null;
    listar();
  });

  listar();
}
