import { h } from "../dom.js";
import { icon } from "../icons.js";

export function chatLine(who, text, mine) {
  return h("div", { class: "chat-line" + (mine ? " mine" : "") }, h("b", {}, who + ": "), text);
}

export function chatInput(send) {
  const input = h("input.chat-input", { placeholder: "Escribe un mensaje", maxlength: 200, autocomplete: "off", "aria-label": "Mensaje" });
  const submit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    send(text);
    input.value = "";
  };
  return h("form.chat-form", { onsubmit: submit }, input, h("button.icon-btn", { type: "submit", "aria-label": "Enviar" }, icon("send", 22)));
}
