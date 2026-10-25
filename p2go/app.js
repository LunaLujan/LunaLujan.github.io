const categories = [
  { id: "principal", label: "Principales", emoji: "⭐", color: "#f2f6ff", border: "#dbe6ff", description: "Palabras útiles para empezar a comunicarte." },
  { id: "personas", label: "Personas", emoji: "👥", color: "#fff2e7", border: "#ffdfc5", description: "Personas importantes en tu vida." },
  { id: "acciones", label: "Acciones", emoji: "🏃", color: "#eaf8ef", border: "#cdebd7", description: "Cosas que podés hacer o pedir." },
  { id: "comida", label: "Comida y bebida", emoji: "🍎", color: "#fff4e5", border: "#ffe1b4", description: "Comidas y bebidas." },
  { id: "emociones", label: "Emociones", emoji: "💗", color: "#fff0f4", border: "#ffd4e1", description: "Cómo te sentís." },
  { id: "lugares", label: "Lugares", emoji: "🏠", color: "#eef8ff", border: "#cdeaff", description: "Lugares cotidianos." },
  { id: "personal", label: "Mis palabras", emoji: "➕", color: "#f4efff", border: "#e1d5ff", description: "Palabras que agregaste." }
];

const starterWords = [
  { word: "Yo", emoji: "🙋", category: "principal", hint: "persona" },
  { word: "Quiero", emoji: "💛", category: "principal" },
  { word: "No", emoji: "✋", category: "principal" },
  { word: "Sí", emoji: "👍", category: "principal" },
  { word: "Más", emoji: "➕", category: "principal" },
  { word: "Terminé", emoji: "✅", category: "principal" },
  { word: "Ayuda", emoji: "🆘", category: "principal" },
  { word: "Por favor", emoji: "🙏", category: "principal" },
  { word: "Gracias", emoji: "💐", category: "principal" },
  { word: "Hola", emoji: "👋", category: "principal" },
  { word: "Mamá", emoji: "👩", category: "personas" },
  { word: "Papá", emoji: "👨", category: "personas" },
  { word: "Amigo/a", emoji: "🧑‍🤝‍🧑", category: "personas" },
  { word: "Familia", emoji: "👨‍👩‍👧‍👦", category: "personas" },
  { word: "Comer", emoji: "🍽️", category: "acciones" },
  { word: "Beber", emoji: "🥤", category: "acciones" },
  { word: "Jugar", emoji: "🧸", category: "acciones" },
  { word: "Dormir", emoji: "😴", category: "acciones" },
  { word: "Ir", emoji: "➡️", category: "acciones" },
  { word: "Parar", emoji: "🛑", category: "acciones" },
  { word: "Agua", emoji: "💧", category: "comida" },
  { word: "Comida", emoji: "🍲", category: "comida" },
  { word: "Manzana", emoji: "🍎", category: "comida" },
  { word: "Leche", emoji: "🥛", category: "comida" },
  { word: "Feliz", emoji: "😄", category: "emociones" },
  { word: "Triste", emoji: "😢", category: "emociones" },
  { word: "Enojado/a", emoji: "😠", category: "emociones" },
  { word: "Cansado/a", emoji: "🥱", category: "emociones" },
  { word: "Casa", emoji: "🏠", category: "lugares" },
  { word: "Escuela", emoji: "🏫", category: "lugares" },
  { word: "Baño", emoji: "🚻", category: "lugares" },
  { word: "Parque", emoji: "🌳", category: "lugares" }
];

const $ = (id) => document.getElementById(id);
let activeCategory = "principal";
let sentenceWords = [];
let customWords = loadCustomWords();
let selectedVoice = "";
let speechRate = 0.9;

function loadCustomWords() {
  try { return JSON.parse(localStorage.getItem("aac-custom-words") || "[]"); }
  catch { return []; }
}
function saveCustomWords() {
  localStorage.setItem("aac-custom-words", JSON.stringify(customWords));
}
function allWords() { return [...starterWords, ...customWords]; }

function renderCategories() {
  const nav = $("categories");
  nav.innerHTML = "";
  categories.forEach(cat => {
    const button = document.createElement("button");
    button.className = "category-button" + (activeCategory === cat.id ? " active" : "");
    button.innerHTML = `<span class="cat-emoji" aria-hidden="true">${cat.emoji}</span><span>${cat.label}</span>`;
    button.setAttribute("aria-pressed", String(activeCategory === cat.id));
    button.addEventListener("click", () => {
      activeCategory = cat.id;
      $("searchInput").value = "";
      renderCategories();
      renderBoard();
    });
    nav.appendChild(button);
  });
}

function renderBoard() {
  const cat = categories.find(c => c.id === activeCategory) || categories[0];
  $("boardTitle").textContent = cat.label;
  $("boardDescription").textContent = cat.description;
  const query = $("searchInput").value.trim().toLocaleLowerCase("es");
  const words = allWords().filter(item => {
    const matchesCategory = item.category === activeCategory;
    const matchesQuery = !query || item.word.toLocaleLowerCase("es").includes(query);
    return matchesCategory && matchesQuery;
  });
  const board = $("board");
  board.innerHTML = "";
  words.forEach(item => {
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.style.setProperty("--tile-bg", cat.color);
    tile.style.setProperty("--tile-border", cat.border);
    tile.setAttribute("aria-label", `${item.word}. Agregar a mi frase`);
    tile.innerHTML = `<span class="tile-emoji" aria-hidden="true">${escapeHTML(item.emoji || "💬")}</span><span class="tile-word">${escapeHTML(item.word)}</span>`;
    tile.addEventListener("click", () => addToSentence(item));
    board.appendChild(tile);
  });
  $("emptyState").hidden = words.length > 0;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function addToSentence(item) {
  sentenceWords.push({ word: item.word, emoji: item.emoji || "💬" });
  renderSentence();
}
function renderSentence() {
  const area = $("sentence");
  area.innerHTML = "";
  if (!sentenceWords.length) {
    area.innerHTML = '<span class="placeholder">Tocá los pictogramas para formar una frase…</span>';
  } else {
    sentenceWords.forEach((item, index) => {
      const chip = document.createElement("span");
      chip.className = "sentence-word";
      chip.innerHTML = `<span class="emoji" aria-hidden="true">${escapeHTML(item.emoji)}</span><span>${escapeHTML(item.word)}</span>`;
      chip.title = "Tocar para quitar esta palabra";
      chip.tabIndex = 0;
      chip.setAttribute("role", "button");
      chip.setAttribute("aria-label", `Quitar ${item.word}`);
      const remove = () => { sentenceWords.splice(index, 1); renderSentence(); };
      chip.addEventListener("click", remove);
      chip.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); remove(); } });
      area.appendChild(chip);
    });
  }
  const count = sentenceWords.length;
  $("wordCount").textContent = `${count} ${count === 1 ? "palabra" : "palabras"}`;
  $("speakBtn").disabled = count === 0;
  $("undoBtn").disabled = count === 0;
  $("clearBtn").disabled = count === 0;
}
function speak(text) {
  if (!("speechSynthesis" in window)) {
    alert("Este navegador no admite voz automática. Probá con una versión reciente de Chrome, Edge o Safari.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-AR";
  utterance.rate = speechRate;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.name === selectedVoice) || voices.find(v => v.lang.toLowerCase().startsWith("es-ar")) || voices.find(v => v.lang.toLowerCase().startsWith("es"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

$("speakBtn").addEventListener("click", () => speak(sentenceWords.map(x => x.word).join(" ")));
$("undoBtn").addEventListener("click", () => { sentenceWords.pop(); renderSentence(); });
$("clearBtn").addEventListener("click", () => { sentenceWords = []; window.speechSynthesis?.cancel(); renderSentence(); });
$("searchInput").addEventListener("input", renderBoard);

const dialog = $("settingsDialog");
$("settingsBtn").addEventListener("click", () => { populateVoices(); dialog.showModal(); });
$("speedRange").addEventListener("input", () => {
  speechRate = Number($("speedRange").value);
  $("speedValue").textContent = `${speechRate.toFixed(1)}×`;
});
$("tileSize").addEventListener("change", () => {
  document.body.classList.remove("tiles-large", "tiles-xlarge");
  if ($("tileSize").value === "large") document.body.classList.add("tiles-large");
  if ($("tileSize").value === "xlarge") document.body.classList.add("tiles-xlarge");
});
function populateVoices() {
  if (!("speechSynthesis" in window)) return;
  const select = $("voiceSelect");
  const current = select.value || selectedVoice;
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("es"));
  select.innerHTML = '<option value="">Voz predeterminada</option>';
  voices.forEach(v => {
    const option = document.createElement("option");
    option.value = v.name;
    option.textContent = `${v.name} (${v.lang})`;
    select.appendChild(option);
  });
  select.value = current;
}
if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = populateVoices;
$("voiceSelect").addEventListener("change", () => { selectedVoice = $("voiceSelect").value; });

$("addWordBtn").addEventListener("click", () => {
  const word = $("newWord").value.trim();
  const emoji = $("newEmoji").value.trim() || "💬";
  const category = $("newCategory").value;
  if (!word) {
    $("settingsMessage").textContent = "Escribí una palabra antes de agregarla.";
    $("newWord").focus();
    return;
  }
  if (allWords().some(item => item.word.toLocaleLowerCase("es") === word.toLocaleLowerCase("es") && item.category === category)) {
    $("settingsMessage").textContent = "Esa palabra ya existe en esta categoría.";
    return;
  }
  customWords.push({ word, emoji, category });
  saveCustomWords();
  $("newWord").value = "";
  $("newEmoji").value = "";
  $("settingsMessage").textContent = `“${word}” se agregó correctamente.`;
  activeCategory = category;
  renderCategories();
  renderBoard();
});
$("newWord").addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); $("addWordBtn").click(); }
});

renderCategories();
renderBoard();
renderSentence();
populateVoices();