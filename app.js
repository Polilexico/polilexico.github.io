const VERBS = ["jugar", "aprender", "estudiar", "amar"];
const GAMES = ["Léxico", "Scrabble"];
const SWAP_MS = 350;
const CAROUSEL_MS = 3500;

startRouter();
startRotation(".verb", VERBS, 2200, 0);
startRotation(".game", GAMES, 3300, 1100);
startCarousel(document.querySelector(".shots"), document.querySelector(".dots"));
startReel(document.querySelector(".reel-section"));

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

function startCarousel(track, dots) {
  const items = [...track.children];
  const marks = items.map(() => dots.appendChild(makeDot()));
  let touched = false;
  track.addEventListener("pointerdown", () => (touched = true), { once: true });
  track.addEventListener("scroll", () => markDot(marks, items, currentItem(track, items)));
  markDot(marks, items, 0);
  setInterval(() => touched || advance(track, items), CAROUSEL_MS);
}

function makeDot() {
  const dot = document.createElement("span");
  dot.className = "dot";
  return dot;
}

function currentItem(track, items) {
  const center = track.scrollLeft + track.clientWidth / 2;
  const distances = items.map((item) => Math.abs(item.offsetLeft + item.offsetWidth / 2 - center));
  return distances.indexOf(Math.min(...distances));
}

function markDot(marks, items, index) {
  marks.forEach((dot, i) => dot.classList.toggle("active", i === index));
  items.forEach((item, i) => item.classList.toggle("current", i === index));
}

function advance(track, items, step = 1) {
  if (track.scrollWidth <= track.clientWidth) return;
  const next = items[(currentItem(track, items) + step + items.length) % items.length];
  track.scrollTo({ left: next.offsetLeft - (track.clientWidth - next.offsetWidth) / 2, behavior: "smooth" });
}

function startReel(section) {
  const track = section.querySelector(".reel");
  const items = [...track.children];
  startCarousel(track, section.querySelector(".reel-dots"));
  section.querySelectorAll(".reel-arrow").forEach((arrow) => {
    arrow.addEventListener("click", () => {
      track.dispatchEvent(new Event("pointerdown"));
      advance(track, items, Number(arrow.dataset.dir));
    });
  });
}
