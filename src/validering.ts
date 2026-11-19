// Dag 5: Validering av bokningsformuläret. Rena funktioner, lätta att testa.
// Varje valideraX-funktion tar ett värde (text) och returnerar ett felmeddelande som text,
// eller en tom text "" om värdet är giltigt. Meddelandena står i tests.js.

// Namn: obligatoriskt, minst 2 tecken efter trim().
export function valideraNamn(text: string): string {
  const namn = text.trim();
  if (namn === "") {
    return "Fyll i ditt namn.";
  }
  if (namn.length < 2) {
    return "Namnet måste vara minst 2 tecken.";
  }
  return "";
}

// E-post: obligatorisk, måste innehålla @, och ha formen text@text.text.
export function valideraEpost(text: string): string {
  const basicEpostRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (text.trim() === "") {
    return "Fyll i din e-postadress."
  }
  if (!text.includes("@")) {
    return "E-postadressen måste innehålla @.";
  }
  return basicEpostRegex.test(text) ? "" : "Ange en giltig e-postadress, till exempel namn@exempel.se.";
}

// Telefon: VALFRI (tom text är giltigt). Annars bara siffror, mellanslag, + och -, och minst 7 siffror.
export function valideraTelefon(text: string): string {
  const telRegex = /^[0-9+\s-]+$/;
  if (text === "") {
    return "";
  }
  if (!telRegex.test(text)) {
    return "Telefonnumret får bara innehålla siffror, mellanslag, plus och bindestreck.";
  }

  // Endast siffror (ersätt allt som inte är siffror till "")
  const antalSiffror = text.replace(/\D/g, "");
  if (antalSiffror.length < 7) {
    return "Telefonnumret är för kort.";
  }
  return "";
}

// Datum: obligatoriskt. text och idag är datum som "2026-10-19". Inte före idag.
export function valideraDatum(text: string, idag: string): string {
  if (text === "") {
    return "Välj ett datum.";
  }
  const datumText = new Date(text);
  const datumIdag = new Date(idag);

  if (datumText < datumIdag) {
    return "Datumet kan inte vara i det förflutna.";
  }
  return "";
}

// Antal personer: obligatoriskt (en tom text betyder att inget valts).
export function valideraAntal(text: string): string {
  if (text.trim() === "") {
    return "Välj antal personer.";
  }
  return "";
}

// Dagens datum som "2026-10-19" (färdig, du behöver inte ändra den).
export function dagensDatum(): string {
  return new Date().toLocaleDateString("sv-SE");
}

// Validera ett helt formulär. varden = { namn, epost, telefon, datum, antal } (texter).
// Returnera ett objekt med BARA de fält som har fel: { namn: "Fyll i ditt namn." }
// Giltigt formulär ger ett tomt objekt {}.
export function valideraFormular(varden: Record<string, string>, idag: string): Record<string, string> {
  const fel: Record<string, string> = {};

  fel.namn = valideraNamn(varden.namn);
  fel.epost = valideraEpost(varden.epost);
  fel.telefon = valideraTelefon(varden.telefon);
  fel.datum = valideraDatum(varden.datum, idag);
  fel.antal = valideraAntal(varden.antal);

  // Ta bort tomma fält (godkända)
  for (const falt in fel) {
    if (fel[falt] === "") {
      delete fel[falt];
    }
  }
  return fel;
}
