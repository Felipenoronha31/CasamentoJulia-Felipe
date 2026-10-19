/* ===== Config ===== */
const WEDDING_DATE = new Date("2027-07-04T16:00:00-03:00");
const PIX_KEY = "julia.felipe@casamento.com";

/* Senhas de convite aceitas (case-insensitive).
   Observação: por ser um site estático (GitHub Pages), a validação acontece no
   navegador — não é segurança real, apenas organização dos convidados.
   Adicione quantas quiser à lista. */
const INVITE_PASSWORDS = ["F4J45"];

/* URL do Google Apps Script que recebe as confirmações e grava na planilha.
   Siga o passo a passo no README (seção "Coletar confirmações no Google Sheets")
   e cole aqui a URL que termina em /exec. Enquanto estiver vazio, as
   confirmações ficam salvas apenas no navegador (localStorage) como backup. */
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyWFVQg7nDxCNb_OCaeq-3ddBZapTEvq2-FjRfZFDYgK56fstnFvBheqA68pajwYDZsNA/exec";

/* Lista de presentes com sistema de COTAS.
   - valorCota: valor de CADA cota (o que o convidado paga).
   - cotas: em quantas partes o presente foi dividido (total).
   - restam: quantas cotas ainda faltam (atualize à mão quando receber um Pix).
   - priority: true marca os itens mais desejados com um selo.
   - img: troque pela sua foto, ex: "img/cama.jpg".

   Como o site é estático (GitHub Pages), a contagem NÃO muda sozinha.
   Quando receber uma contribuição, diminua "restam" e dê push. */
const GIFTS = [
  { nome: "Cama de casal box",      valorCota: 150, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80", priority: true },
  { nome: "Geladeira frost free",   valorCota: 200, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=600&q=80", priority: true },
  { nome: "Máquina de lavar",       valorCota: 180, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80", priority: true },
  { nome: "Fogão 5 bocas",          valorCota: 120, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80", priority: false },
  { nome: "Micro-ondas",            valorCota: 100, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80", priority: false },
  { nome: "Jogo de panelas",        valorCota: 90,  cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1584990347449-39b3f3b2c38b?auto=format&fit=crop&w=600&q=80", priority: false },
  { nome: "Jogo de cama casal",     valorCota: 80,  cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80", priority: false },
  { nome: "Jogo de jantar",         valorCota: 100, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80", priority: false },
  { nome: "Cota para a Lua de Mel", valorCota: 150, cotas: 10, restam: 10, img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80", priority: true },
];

/* ===== Loader ===== */
window.addEventListener("load", () => {
  setTimeout(() => document.getElementById("loader").classList.add("hide"), 700);
});

/* ===== Navbar scroll + mobile menu ===== */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const navToggle = document.getElementById("navToggle");
const backToTop = document.getElementById("backToTop");

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 60);
  backToTop.classList.toggle("show", y > 500);
}
window.addEventListener("scroll", onScroll);
onScroll();

navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

/* ===== Countdown ===== */
const cd = {
  d: document.getElementById("cdDays"),
  h: document.getElementById("cdHours"),
  m: document.getElementById("cdMin"),
  s: document.getElementById("cdSec"),
};
function pad(n){ return String(n).padStart(2, "0"); }
function tick() {
  const diff = WEDDING_DATE - new Date();
  if (diff <= 0) {
    cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = "00";
    document.querySelector(".countdown__sub").textContent = "Chegou o grande dia! 💛";
    return;
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  cd.d.textContent = pad(days);
  cd.h.textContent = pad(hours);
  cd.m.textContent = pad(mins);
  cd.s.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

/* ===== Gallery (Unsplash placeholders, trocar pelas fotos reais) ===== */
const photos = [
  "1519741497674-611481863552",
  "1511285560929-80b456fea0bc",
  "1465495976277-4387d4b0b4c6",
  "1583939003579-730e3918a45a",
  "1522673607200-164d1b6ce486",
  "1526047932273-341f2a7631f9",
  "1537633552985-df8429e8048b",
  "1591604466107-ec97de577aff",
];
const galleryGrid = document.getElementById("galleryGrid");
photos.forEach((id, i) => {
  const fig = document.createElement("figure");
  fig.className = "reveal";
  fig.innerHTML = `<img loading="lazy" src="https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80" alt="Foto do casal ${i + 1}" />`;
  galleryGrid.appendChild(fig);
});

/* ===== Scroll reveal ===== */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ===== Gifts render ===== */
const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const giftsGrid = document.getElementById("giftsGrid");

function renderGifts(lista) {
  giftsGrid.innerHTML = "";
  lista.forEach((g) => {
    const pagas = g.cotas - g.restam;
    const pct = g.cotas > 0 ? Math.round((pagas / g.cotas) * 100) : 0;
    const esgotado = g.restam <= 0;

    const card = document.createElement("div");
    card.className = "gift__card reveal" + (esgotado ? " gift__card--done" : "");
    card.innerHTML = `
      ${g.priority ? '<span class="gift__badge" title="Item mais desejado">★</span>' : ""}
      <div class="gift__photo"><img loading="lazy" src="${g.img}" alt="${g.nome}" /></div>
      <h3>${g.nome}</h3>
      <p class="gift__price">${BRL.format(g.valorCota)}</p>
      <div class="gift__progress"><span style="width:${pct}%"></span></div>
      <p class="gift__count">${esgotado ? "Presente completo! 💛" : `Restam: ${g.restam} de ${g.cotas}`}</p>
      <button class="btn btn--outline" data-pix data-gift="${g.nome}" data-cota="${g.valorCota}" ${esgotado ? "disabled" : ""}>
        ${esgotado ? "Concluído" : "Fazer Pix"}
      </button>
    `;
    giftsGrid.appendChild(card);
    io.observe(card); // aplica a animação de reveal aos cards criados
  });
}

/* Mostra primeiro os valores locais (fallback) e, se a planilha responder,
   substitui pelos números atualizados de lá. */
renderGifts(GIFTS);

if (SHEETS_URL) {
  fetch(SHEETS_URL)
    .then((r) => r.json())
    .then((data) => {
      if (data && data.result === "ok" && Array.isArray(data.gifts) && data.gifts.length) {
        renderGifts(data.gifts);
      }
    })
    .catch(() => { /* mantém os valores locais se a planilha falhar */ });
}

/* ===== RSVP: gate de senha ===== */
const gate = document.getElementById("rsvpGate");
const gateFeedback = document.getElementById("gateFeedback");
const form = document.getElementById("rsvpForm");
const feedback = document.getElementById("rsvpFeedback");

const normalized = INVITE_PASSWORDS.map(p => p.trim().toLowerCase());

gate.addEventListener("submit", (e) => {
  e.preventDefault();
  const tentativa = document.getElementById("senha").value.trim().toLowerCase();
  if (normalized.includes(tentativa)) {
    gate.hidden = true;
    form.hidden = false;
    form.classList.add("in");
    document.getElementById("nome").focus();
  } else {
    gateFeedback.textContent = "Senha incorreta. Confira o convite e tente novamente.";
    gate.classList.remove("shake");
    void gate.offsetWidth; // reinicia a animação
    gate.classList.add("shake");
  }
});

/* ===== RSVP: envio ===== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const nome = document.getElementById("nome").value.trim();
  const presenca = form.querySelector('input[name="presenca"]:checked').value;
  const mensagem = document.getElementById("mensagem").value.trim();
  const dados = { nome, presenca, mensagem, data: new Date().toISOString() };

  // Backup local (caso a planilha falhe ou ainda não esteja configurada).
  const list = JSON.parse(localStorage.getItem("rsvp") || "[]");
  list.push(dados);
  localStorage.setItem("rsvp", JSON.stringify(list));

  const primeiroNome = nome.split(" ")[0];
  const sucesso = () => {
    feedback.textContent = presenca === "sim"
      ? `Obrigado, ${primeiroNome}! Sua presença foi confirmada. 💛`
      : `Que pena, ${primeiroNome}. Sentiremos sua falta, obrigado por avisar.`;
    form.reset();
  };

  // Sem planilha configurada: só o backup local.
  if (!SHEETS_URL) { sucesso(); return; }

  // Envia para o Google Sheets.
  btn.disabled = true;
  feedback.textContent = "Enviando...";
  try {
    await fetch(SHEETS_URL, {
      method: "POST",
      mode: "no-cors", // Apps Script não devolve CORS; o envio ocorre mesmo assim.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(dados),
    });
    sucesso();
  } catch (err) {
    feedback.textContent = "Não foi possível enviar agora. Tente novamente em instantes.";
  } finally {
    btn.disabled = false;
  }
});

/* ===== Pix modal ===== */
const modal = document.getElementById("pixModal");
const pixItem = document.getElementById("pixItem");
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-pix]");
  if (!btn || btn.disabled) return;
  const gift = btn.getAttribute("data-gift");
  const cota = btn.getAttribute("data-cota");
  if (gift) {
    const valor = cota ? ` · ${BRL.format(Number(cota))} por cota` : "";
    pixItem.textContent = `${gift}${valor}`;
    pixItem.style.display = "block";
  } else {
    pixItem.style.display = "none";
  }
  modal.classList.add("open");
});
document.getElementById("pixClose").addEventListener("click", () => modal.classList.remove("open"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
document.getElementById("pixKey").textContent = PIX_KEY;
document.getElementById("pixCopy").addEventListener("click", async (e) => {
  try {
    await navigator.clipboard.writeText(PIX_KEY);
    e.target.textContent = "Copiado!";
    setTimeout(() => (e.target.textContent = "Copiar"), 1800);
  } catch {
    e.target.textContent = "Copie manualmente";
  }
});
