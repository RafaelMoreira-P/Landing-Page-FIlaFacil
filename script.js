const form = document.querySelector("[data-capture-form]");
const feedback = document.querySelector("[data-capture-feedback]");
const emailInput = form ? form.querySelector("input[type=email]") : null;
const STORAGE_KEY = "filafacil_leads";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function saveLead(email) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const leads = raw ? JSON.parse(raw) : [];
    if (!leads.includes(email)) {
      leads.push(email);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    }
  } catch {
    return;
  }
}

function showFeedback(message, isError) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.classList.toggle("error", Boolean(isError));
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      emailInput.classList.add("invalid");
      showFeedback("Digite um e-mail válido para continuarmos.", true);
      emailInput.focus();
      return;
    }
    emailInput.classList.remove("invalid");
    saveLead(email.toLowerCase());
    form.reset();
    form.querySelector("button").disabled = true;
    showFeedback("Pronto! Você entrou na lista e será avisado quando o FilaFácil abrir na sua região. 🎉");
  });

  emailInput.addEventListener("input", () => {
    emailInput.classList.remove("invalid");
    if (!feedback.classList.contains("error")) return;
    feedback.hidden = true;
    feedback.classList.remove("error");
  });
}

function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.4 }
);
counters.forEach((el) => observer.observe(el));

const waitTime = document.getElementById("wait-time");
const queueSize = document.getElementById("queue-size");
const priorityLabel = document.getElementById("priority-label");
const priorityFill = document.getElementById("priority-fill");

const mockFeed = [
  { wait: 22, queue: 14, priority: "Média", level: "level-medium" },
  { wait: 35, queue: 23, priority: "Média", level: "level-medium" },
  { wait: 8, queue: 5, priority: "Leve", level: "level-low" },
  { wait: 51, queue: 37, priority: "Urgente", level: "level-high" },
];

let feedIndex = 0;

if (waitTime && queueSize && priorityLabel && priorityFill) {
  setInterval(() => {
    feedIndex = (feedIndex + 1) % mockFeed.length;
    const item = mockFeed[feedIndex];
    waitTime.textContent = `${item.wait} min`;
    queueSize.textContent = item.queue;
    priorityLabel.textContent = item.priority;
    priorityLabel.style.color =
      item.level === "level-high" ? "#be123c" : item.level === "level-low" ? "#047857" : "#b45309";
    priorityFill.className = `priority-fill ${item.level}`;
  }, 4000);
}
