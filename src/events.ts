// Dag 5: Funktioner som kopplar händelser (events). Gör testerna gröna på tests.html.
import type { Filter } from "./typer";
// Båda använder EVENT DELEGATION: EN lyssnare på parent, inte en per knapp.

// 1. grupp är elementet som innehåller filterknapparna: <button data-filter="bakverk" aria-pressed="false">
//    Vid klick på en knapp (eller något inuti den):
//      - sätt aria-pressed="true" på knappen som klickades och "false" på alla andra knappar i gruppen
//      - anropa vidVal(knappens data-filter)
//    Klick på något annat i gruppen ska inte göra något.
//    Tips: handelse.target.closest('button[data-filter]')
export function kopplaFilter(grupp: HTMLElement, vidVal: (filter: Filter) => void): void {
  grupp.addEventListener("click", (handelse) => {
    if (!(handelse.target instanceof HTMLElement)) {
      return;
    }
    const knapp = handelse.target.closest<HTMLButtonElement>("button[data-filter]");
    if (!knapp) {
      return;
    }
    // Hämta alla knappar
    const knappar = grupp.querySelectorAll("button[data-filter]");
    knappar.forEach((knapp) => knapp.setAttribute("aria-pressed", "false"));

    // klickade knappen är true
    knapp.setAttribute("aria-pressed", "true");

    const filter = knapp.dataset.filter;
    if (!filter) {
      return;
    }
    // anropa vidVal(knappens data-filter)
    vidVal(filter as Filter);
  });
}

// 2. container innehåller kort med knappar: <button class="lagg-i-order" data-id="3">
//    Vid klick på en sådan knapp: anropa vidLaggTill(id) där id är ett TAL (dataset ger text!).
//    Klick på något annat ska inte göra något.
export function kopplaLaggTill(container: HTMLElement, vidLaggTill: (id: number) => void): void {
  container.addEventListener("click", (handelse) => {
    if (!(handelse.target instanceof HTMLElement)) {
      return;
    }
    const knapp = handelse.target.closest<HTMLButtonElement>("button.lagg-i-order");
    if (!knapp) {
      return;
    }

    vidLaggTill(Number(knapp.dataset.id));
  })
}
