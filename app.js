const VERBS = ["jugar", "aprender", "estudiar", "amar"];
const GAMES = ["Léxico", "Scrabble"];
const SWAP_MS = 350;

startRouter();
startRotation(".verb", VERBS, 2200, 0);
startRotation(".game", GAMES, 3300, 1100);

function startRouter() {
  window.addEventListener("hashchange", showCurrentView);
  showCurrentView();
}

function showCurrentView() {
  const name = location.hash.slice(1) || "home";
  const known = document.querySelector(`[data-view="${name}"]`) ? name : "home";
  toggleViews(known);
  markTab(known);
  window.scrollTo(0, 0);
}

function toggleViews(name) {
  document.querySelectorAll("[data-view]").forEach((view) => {
    view.hidden = view.dataset.view !== name;
  });
}

function markTab(name) {
  document.querySelectorAll("[data-tab]").forEach((tab) => {
    if (tab.dataset.tab === name) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
}

function startRotation(selector, words, everyMs, delayMs) {
  const slot = document.querySelector(selector);
  let index = 0;
  followWordWidth(slot);
  setTimeout(() => {
    setInterval(() => {
      index = (index + 1) % words.length;
      swapWord(slot, words[index]);
    }, everyMs);
  }, delayMs);
}

function swapWord(slot, text) {
  const word = slot.querySelector(".word");
  word.classList.add("leaving");
  setTimeout(() => enterWord(slot, word, text), SWAP_MS);
}

function enterWord(slot, word, text) {
  word.classList.remove("leaving");
  word.classList.add("entering");
  word.textContent = text;
  fitSlot(slot, word);
  word.offsetWidth;
  word.classList.remove("entering");
}

function followWordWidth(slot) {
  const word = slot.querySelector(".word");
  new ResizeObserver(() => fitSlot(slot, word)).observe(word);
}

function fitSlot(slot, word) {
  slot.style.width = `${word.offsetWidth}px`;
}
