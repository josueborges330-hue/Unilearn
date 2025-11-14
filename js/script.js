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

  // Observador para animações de entrada
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

  // Ativa envio de mensagem se existir botão
  const btnEnviar = document.getElementById("btnEnviar");
  if (btnEnviar) {
    btnEnviar.addEventListener("click", enviarMensagem);
  }

  // Ativa seletor de idioma se existir
  const idiomaSelect = document.querySelector(".idioma-select");
  if (idiomaSelect) {
    idiomaSelect.addEventListener("change", () => {
      traduzirPagina(idiomaSelect.value);
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

// Exibe universidades por distrito
function mostrarUniversidades(distrito) {
  const painel = document.getElementById('painel-universidades');
  const universidades = {
    Lisboa: ['Universidade de Lisboa', 'ISCTE', 'NOVA'],
    Porto: ['Universidade do Porto', 'ISMAI', 'Fernando Pessoa'],
    Coimbra: ['Universidade de Coimbra', 'Politécnico de Coimbra']
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

// 🌐 Tradução automática da página (corrigida)
function traduzirPagina(idiomaDestino) {
  if (!idiomaDestino) return;
  const urlAtual = window.location.href;
  const urlTraduzida = `https://translate.google.com/translate?hl=${idiomaDestino}&sl=pt&tl=${idiomaDestino}&u=${encodeURIComponent(urlAtual)}`;
  window.open(urlTraduzida, "_blank");
}
