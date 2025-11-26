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

    // Lista expandida de universidades com coordenadas + links oficiais
    const universidades = [
      { nome: "Universidade de Lisboa", coords: [38.7528, -9.1564], distrito: "Lisboa", link: "https://www.ulisboa.pt/" },
      { nome: "ISCTE - Instituto Universitário de Lisboa", coords: [38.7486, -9.1537], distrito: "Lisboa", link: "https://www.iscte-iul.pt/" },
      { nome: "Universidade Nova de Lisboa", coords: [38.7370, -9.1540], distrito: "Lisboa", link: "https://www.unl.pt/" },
      { nome: "Universidade Aberta", coords: [38.7169, -9.1390], distrito: "Lisboa", link: "https://www.uab.pt/" },
      { nome: "Universidade Católica Portuguesa", coords: [38.7238, -9.1604], distrito: "Lisboa", link: "https://www.ucp.pt/" },

      { nome: "Universidade do Porto", coords: [41.1500, -8.6100], distrito: "Porto", link: "https://www.up.pt/" },
      { nome: "Universidade Fernando Pessoa", coords: [41.1800, -8.6000], distrito: "Porto", link: "https://www.ufp.pt/" },

      { nome: "Universidade de Coimbra", coords: [40.2070, -8.4229], distrito: "Coimbra", link: "https://www.uc.pt/" },
      { nome: "Politécnico de Coimbra", coords: [40.2100, -8.4300], distrito: "Coimbra", link: "https://www.ipc.pt/" },

      { nome: "Universidade do Minho", coords: [41.5600, -8.3960], distrito: "Braga", link: "https://www.uminho.pt/" },
      { nome: "Universidade de Trás-os-Montes e Alto Douro", coords: [41.3000, -7.7400], distrito: "Vila Real", link: "https://www.utad.pt/" },

      { nome: "Universidade da Beira Interior", coords: [40.2800, -7.5000], distrito: "Covilhã", link: "https://www.ubi.pt/" },

      { nome: "Universidade de Évora", coords: [38.5667, -7.9000], distrito: "Évora", link: "https://www.uevora.pt/" },
      { nome: "Universidade do Algarve", coords: [37.0200, -7.9300], distrito: "Faro", link: "https://www.ualg.pt/" },

      { nome: "Universidade dos Açores", coords: [37.7412, -25.6756], distrito: "Açores", link: "https://www.uac.pt/" },
      { nome: "Universidade da Madeira", coords: [32.6669, -16.9241], distrito: "Madeira", link: "https://www.uma.pt/" }
    ];

    universidades.forEach(u => {
      L.marker(u.coords, {
        icon: L.icon({
          iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        })
      }).addTo(map)
        .bindPopup(`<b>${u.nome}</b><br>${u.distrito}<br><a href="${u.link}" target="_blank">Visitar site</a>`);
    });
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

// Exibe universidades por distrito (lista textual)
function mostrarUniversidades(distrito) {
  const painel = document.getElementById('painel-universidades');
  const universidades = {
    Lisboa: ['Universidade de Lisboa', 'ISCTE', 'NOVA', 'Universidade Aberta', 'Universidade Católica Portuguesa'],
    Porto: ['Universidade do Porto', 'Universidade Fernando Pessoa'],
    Coimbra: ['Universidade de Coimbra', 'Politécnico de Coimbra'],
    Braga: ['Universidade do Minho'],
    VilaReal: ['Universidade de Trás-os-Montes e Alto Douro'],
    Covilha: ['Universidade da Beira Interior'],
    Evora: ['Universidade de Évora'],
    Faro: ['Universidade do Algarve'],
    Acores: ['Universidade dos Açores'],
    Madeira: ['Universidade da Madeira']
  };

  const lista = universidades[distrito] || [];
  painel.innerHTML = `<h3>${distrito}</h3><ul>` + 
    lista.map(u => `<li>${u}</li>`).join('') + '</ul>';
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
