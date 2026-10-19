/* ===== Config ===== */
const WEDDING_DATE = new Date("2027-07-04T16:00:00-03:00");
const PIX_KEY = "julia.felipe@casamento.com";

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

/* ===== RSVP form ===== */
const form = document.getElementById("rsvpForm");
const feedback = document.getElementById("rsvpFeedback");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const presenca = form.querySelector('input[name="presenca"]:checked').value;
  // Persiste localmente (demo). Para produção, enviar para um backend/planilha.
  const list = JSON.parse(localStorage.getItem("rsvp") || "[]");
  list.push({
    nome,
    presenca,
    mensagem: document.getElementById("mensagem").value.trim(),
    data: new Date().toISOString(),
  });
  localStorage.setItem("rsvp", JSON.stringify(list));
  feedback.textContent = presenca === "sim"
    ? `Obrigado, ${nome.split(" ")[0]}! Sua presença foi confirmada. 💛`
    : `Que pena, ${nome.split(" ")[0]}. Sentiremos sua falta, obrigado por avisar.`;
  form.reset();
});

/* ===== Pix modal ===== */
const modal = document.getElementById("pixModal");
document.querySelectorAll("[data-pix]").forEach(btn =>
  btn.addEventListener("click", () => modal.classList.add("open"))
);
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
