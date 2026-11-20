// Dag 5: Bokningsformuläret. Kopplas på kontakt.html.
import { valideraNamn, valideraEpost, valideraTelefon, valideraDatum, valideraAntal, valideraFormular, dagensDatum } from "./validering";

import { hamta } from "./dom";

type Falt = HTMLInputElement | HTMLSelectElement;

const form = hamta<HTMLFormElement>("#bokningsform");
const bekraftelse = hamta("#bekraftelse");

// elements.namedItem ger Element | RadioNodeList | null. Vi kollar att det är ett fält vi känner igen.
function hittaFalt(namn: string): Falt {
  const falt = form.elements.namedItem(namn);
  if (falt instanceof HTMLInputElement || falt instanceof HTMLSelectElement) {
    return falt;
  }
  throw new Error(`Fältet ${namn} saknas i formuläret`);
}

// Vilken regel hör till vilket fält? Nyckeln är fältets name-attribut.
const regler: Record<string, (text: string) => string> = {
  namn: valideraNamn,
  epost: valideraEpost,
  telefon: valideraTelefon,
  datum: (text: string) => valideraDatum(text, dagensDatum()),
  antal: valideraAntal,
};

// 1. visaFel(falt, meddelande): visa ett felmeddelande under fältet.
//    - Finns det inget <p class="falt-fel" id="NAMN-fel"> efter fältet? Skapa det (insertAdjacentElement("afterend", p)).
//    - p.textContent = meddelande
//    - Är meddelandet tomt: ta bort aria-invalid och aria-describedby från fältet.
//      Annars: falt.setAttribute("aria-invalid", "true") och aria-describedby = p:ts id.
function visaFel(falt: Falt, meddelande: string): void {
  let p = falt.nextElementSibling as HTMLParagraphElement | null;

  if (!p || !p.classList.contains("falt-fel")) {
    p = document.createElement("p");
    p.className = "falt-fel";
    p.id = `${falt.id}-fel`;

    falt.insertAdjacentElement("afterend", p);
  }

  p.textContent = meddelande;

  if (meddelande === "") {
    falt.removeAttribute("aria-invalid");
    falt.removeAttribute("aria-describedby");
  } else {
    falt.setAttribute("aria-invalid", "true");
    falt.setAttribute("aria-describedby", p.id);
  }
}

// 2. Koppla varje fält i regler: validera när användaren LÄMNAR fältet ("blur"),
//    och validera på nytt vid "input" men bara om fältet redan är markerat som fel (aria-invalid="true").
// Loopa regler
for (const namn in regler) {
  const falt = hittaFalt(namn);
  const validera = regler[namn];

  // Ibland måste man lyssna efter blur...
  falt.addEventListener("blur", () => {
    // Hämta värde i fältet och använd rätt validering
    const validering = validera(falt.value);
    // visa felet med fältet och meddelandet
    visaFel(falt, validering);
  });

  // Lyssna efter input
  falt.addEventListener("input", () => {
    if (falt.getAttribute("aria-invalid") === "true") {
      const validering = validera(falt.value);
      visaFel(falt, validering);
    }
  });
}
// 3. Vid "submit": preventDefault(). Validera hela formuläret med valideraFormular.
//    - Finns fel: visa dem alla med visaFel, flytta fokus till första felaktiga fältet.
//    - Annars: skriv "Tack! Vi bekräftar din bokning inom ett dygn." i #bekraftelse och töm formuläret (form.reset()).
//    Tips: new FormData(form) ger fält av typen string | File. valideraFormular vill ha Record<string, string>,
//    så loopa och ta bara värden där typeof varde === "string".
//    Använd hittaFalt(namn) för att hämta ett fält med rätt typ.
// Lyssna efter submit på formuläret
form.addEventListener("submit", (händelse) => {
  händelse.preventDefault();

  const allaFalt: Record<string, string> = {};

  // Behåll endast värden med string
  for (const [namn, varde] of new FormData(form)) {
    if (typeof varde === "string") {
      allaFalt[namn] = varde;
    }
  }
  // Håll koll på första felet
  let forstaFel: Falt | null = null;
  // Validera formuläret
  const validering = valideraFormular(allaFalt, dagensDatum());
  for (const [namn, meddelande] of Object.entries(validering)) {
    const falt = hittaFalt(namn);
    visaFel(falt, meddelande);
    if (forstaFel === null && meddelande !== "") {
      forstaFel = falt;
    }
  }
  // Ändra fokus till första felet om det finns
  forstaFel?.focus();
  // Annars om inga fel finns måste vi ge en bekräftelse och tömma formuläret
  if (forstaFel === null) {
    bekraftelse.textContent = "Tack! Vi bekräftar din bokning inom ett dygn."
    form.reset();
  }
})
