document.addEventListener("DOMContentLoaded", () => {
  // Ativa o link da página atual no menu
  const links = document.querySelectorAll("nav a");
  const currentPage = window.location.pathname.split("/").pop();
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("ativo");
    }
  });

  // Aplica modo escuro se estiver ativado
  const modoAtivo = localStorage.getItem("modoEscuro") === "true";
  if (modoAtivo) {
    document.body.classList.add("dark-mode");
  }

  // Atualiza texto do botão
  const botao = document.getElementById("modoToggle");
  if (botao) {
    botao.textContent = modoAtivo ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  }

  // Animação de entrada para elementos com .timeline-item
  const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("ativo");
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".timeline-item").forEach(item => {
    observador.observe(item);
  });

  // Inicializar mapa na aba Universidades
  const mapDiv = document.getElementById("map");
  if (mapDiv) {
    const map = L.map("map").setView([39.5, -8], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    // Lista de universidades com coordenadas + links oficiais + cursos
    const universidades = [
      { nome: "Universidade de Lisboa", coords: [38.7528, -9.1564], distrito: "Lisboa", link: "https://www.ulisboa.pt/", cursos: ["Engenharia Informática", "Direito", "Medicina"] },
      { nome: "ISCTE - Instituto Universitário de Lisboa", coords: [38.7486, -9.1537], distrito: "Lisboa", link: "https://www.iscte-iul.pt/", cursos: ["Gestão", "Sociologia", "Ciência Política"] },
      { nome: "Universidade Nova de Lisboa", coords: [38.7370, -9.1540], distrito: "Lisboa", link: "https://www.unl.pt/", cursos: ["Economia", "Ciências Biomédicas", "Arquitetura"] },
      { nome: "Universidade do Porto", coords: [41.1500, -8.6100], distrito: "Porto", link: "https://www.up.pt/", cursos: ["Farmácia", "Engenharia Civil", "Arquitetura"] },
      { nome: "Universidade de Coimbra", coords: [40.2070, -8.4229], distrito: "Coimbra", link: "https://www.uc.pt/", cursos: ["Direito", "Medicina", "Engenharia Química"] },
      { nome: "Universidade do Minho", coords: [41.5600, -8.3960], distrito: "Braga", link: "https://www.uminho.pt/", cursos: ["Engenharia Informática", "Psicologia", "Design"] },
      { nome: "Universidade da Beira Interior", coords: [40.2800, -7.5000], distrito: "Covilhã", link: "https://www.ubi.pt/", cursos: ["Engenharia Aeronáutica", "Ciências da Comunicação", "Medicina"] },
      { nome: "Universidade de Évora", coords: [38.5667, -7.9000], distrito: "Évora", link: "https://www.uevora.pt/", cursos: ["Agronomia", "História", "Biologia"] },
      { nome: "Universidade do Algarve", coords: [37.0200, -7.9300], distrito: "Faro", link: "https://www.ualg.pt/", cursos: ["Turismo", "Biologia Marinha", "Gestão"] },
      { nome: "Universidade dos Açores", coords: [37.7412, -25.6756], distrito: "Açores", link: "https://www.uac.pt/", cursos: ["Oceanografia", "Agronomia", "Educação"] },
      { nome: "Universidade da Madeira", coords: [32.6669, -16.9241], distrito: "Madeira", link: "https://www.uma.pt/", cursos: ["Matemática", "Engenharia Informática", "Gestão"] }
    ];

    // Lista lateral
    const lista = document.getElementById("lista");
    const marcadores = [];

    universidades.forEach(u => {
      const marker = L.marker(u.coords, {
        icon: L.icon({
          iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        })
      }).addTo(map)
        .bindPopup(`
          <b>${u.nome}</b><br>
          ${u.distrito}<br>
          <a href="${u.link}" target="_blank">Visitar site</a><br>
          <strong>Cursos principais:</strong>
          <ul>${u.cursos.map(c => `<li>${c}</li>`).join("")}</ul>
          <button onclick="adicionarFavorito('${u.nome}')">⭐ Favorito</button>
        `);

      marcadores.push(marker);

      // Adiciona item na lista lateral (apenas nome)
      if (lista) {
        const item = document.createElement("li");
        item.textContent = u.nome;
        item.style.cursor = "pointer";
        item.style.marginBottom = "0.5rem";
        item.onclick = () => {
          map.setView(u.coords, 13);
          marker.openPopup();
        };
        lista.appendChild(item);
      }
    });

    // Mostrar favoritos se existir secção
    mostrarFavoritos();
  }
});

// Alternar modo escuro
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  const modoAtivo = document.body.classList.contains("dark-mode");
  localStorage.setItem("modoEscuro", modoAtivo ? "true" : "false");
  const botao = document.getElementById("modoToggle");
  if (botao) {
    botao.textContent = modoAtivo ? "☀️ Modo Claro" : "🌙 Modo Escuro";
  }
}

// Filtro de recursos por categoria
function filtrarInteresses(categoria) {
  const cards = document.querySelectorAll("#interesses .card");
  cards.forEach(card => {
    if (categoria === "todos" || card.classList.contains(categoria)) {
      card.style.display = "block";
      card.style.opacity = "1";
    } else {
      card.style.display = "none";
      card.style.opacity = "0";
    }
  });
}

// Pesquisa rápida nos interesses
function pesquisarInteresses() {
  const termo = document.getElementById("searchInput")?.value.toLowerCase() || "";
  const cards = document.querySelectorAll("#interesses .card");
  cards.forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(termo) ? "block" : "none";
  });
}

// Simulador de mensagens na comunidade
function enviarMensagem() {
  const input = document.getElementById("mensagemInput");
  const container = document.getElementById("chatContainer");
  const texto = input.value.trim();

  if (texto !== "") {
    const msg = document.createElement("div");
    msg.className = "mensagem";
    const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    msg.innerHTML = `<strong>Tu</strong> <span>${hora}</span><p>${texto}</p>`;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
    input.value = "";
  }
}

// 🌐 Tradução automática da página
function traduzirPagina(idiomaDestino) {
  if (!idiomaDestino) return;
  const idiomaOrigem = 'pt';
  const url = `https://translate.google.com/translate?hl=${idiomaDestino}&sl=${idiomaOrigem}&tl=${idiomaDestino}&u=${window.location.href}`;
  window.location.href = url;
}

/* ⭐ Favoritos */
function adicionarFavorito(nome) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.includes(nome)) {
    favoritos.push(nome);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    alert(nome + " foi adicionado aos favoritos!");
  } else {
    alert(nome + " já está nos favoritos.");
  }
}

function mostrarFavoritos() {
  const listaEl = document.getElementById("listaFavoritos");
  if (!listaEl) return;
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  listaEl.innerHTML = "";

  favoritos.forEach(nome => {
    const li = document.createElement("li");
    li.textContent = nome;

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "❌ Remover";
    btnRemover.style.marginLeft = "0.5rem";
    btnRemover.onclick = () => removerFavorito(nome);

    li.appendChild(btnRemover);
    listaEl.appendChild(li);
  });
}

function removerFavorito(nome) {
  let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  favoritos = favoritos.filter(f => f !== nome);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  mostrarFavoritos();
}
