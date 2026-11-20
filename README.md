# Dag 5 · Events och formulär

*Modul 5, UI/UX & Frontendutveckling (TypeScript), Lexicon IT-Proffs*

## Vad du ska göra idag

Du får kaféets sida att **reagera på användaren**: en klickbar filtrering av menyn, en beställning som växer, och ett bokningsformulär som kontrollerar sig självt med tydliga, tillgängliga felmeddelanden. Logiken ligger i små funktioner som du testar, och själva kopplingen till sidan ligger i `src/main.ts` och `src/kontakt.ts`.

## Bakgrund

Hittills har dina program körts en gång när sidan laddas. Nu får de **lyssna**. En *händelse* (event) är något som sker: ett klick, en tangent, ett formulär som skickas. Du säger "när det här händer, kör den här funktionen". Det är sidans interaktivitet i ett nötskal. Idag lär du dig också att validera formulär så att användaren får hjälp på rätt sätt, vilket är något du har tränat på att tänka på sedan modul 2 och 3.

## TypeScript idag: händelser, unioner och typade formulär

- **Händelser:** `handelse.target` är av typen `EventTarget | null`. Kolla vad det är innan du använder det:

```ts
if (!(handelse.target instanceof HTMLElement)) {
  return;
}
const knapp = handelse.target.closest<HTMLButtonElement>("button[data-filter]");
```

- **Union av texter:** `type Filter = "alla" | "vegetarisk" | Kategori`. Skriver du `filtreraMeny(meny, "pizza")` säger TypeScript ifrån direkt. I JavaScript får du bara en tom lista.
- **Hjälpfunktionen `hamta("#id")`** (i `src/dom.ts`) ger elementet eller kastar ett tydligt fel, så du slipper kontrollera `null` överallt.
- **Formulär:** `new FormData(form)` ger värden som är `string | File`. Kontrollera med `typeof varde === "string"` innan du lägger dem i ett `Record<string, string>`.
- **`as`** (typpåstående) säger "jag vet bättre än TypeScript". Använd det sparsamt. TypeScript kontrollerar inte att du har rätt.

## Så arbetar du (samma som alltid)

1. **Forka** dagens repo på GitHub (*Fork → Create fork*).
2. **Klona din fork:** *Code → HTTPS → kopiera adressen*. I terminalen (Ctrl+ö i VS Code): `git clone <adressen>`. Öppna den nya mappen i VS Code.
3. **Installera verktygen, en gång per repo:** `npm install` i terminalen.
4. **Starta servern:** `npm run dev`. Öppna adressen den skriver ut (oftast `http://localhost:5173/`). Tryck F12 och välj fliken *Console*. Stoppa med Ctrl+C. Testsidan öppnar du på samma server: `http://localhost:5173/tests.html` (lägg till `/tests.html` efter adressen).
5. **Gör uppgiften.** Spara och kontrollera i webbläsaren och Console efter varje steg. Gör en commit efter varje avslutat steg: `git add .` och `git commit -m "Beskriv vad du gjorde"`.
6. **Kontrollera typerna:** `npm run typecheck`. Tyst betyder att alla typer stämmer. Röda understrykningar i VS Code är TypeScript som varnar.
7. **Skicka upp** när du är klar: `git push`.
8. **Lämna in i Microsoft Forms.**

Fastnar du: skriv ner exakt var och vad du försökt (och vilket felmeddelande du fick), och ta det först i nästa handledda pass. Problem med `npm` eller Node? Läs *Elevguide: Node, Vite och TypeScript*.

> Vite tar bara bort typerna och kör koden. Den kontrollerar dem inte. Sidan kan alltså köras trots röda understrykningar.

## Uppgiften steg för steg

### Steg 1. Din första händelse

Öppna `src/main.ts`, del 1. Lägg en lyssnare på knappen i hero som skriver ut `handelse.type` och `handelse.target` i Console. Klicka, och titta. Prova sedan `handelse.preventDefault()` och se vad som händer med länken. Ta bort den igen.

### Steg 2. filtreraMeny

Skriv den rena funktionen `filtreraMeny(meny, filter)` i `src/filter.ts`. Filtret är `"alla"`, `"vegetarisk"` eller en kategori. Kör `tests.html`: fyra tester ska bli gröna.

### Steg 3. Event delegation: kopplaFilter

I `src/events.ts`: skriv `kopplaFilter`. En enda lyssnare på gruppen (inte en per knapp) som använder `handelse.target.closest(...)`. Den ska flytta `aria-pressed` och anropa en callback. Läs testerna: ett av dem klickar på en `span` *inuti* en knapp. Varför ska det fungera?

### Steg 4. Koppla ihop menyn

I `src/main.ts`, del 2: skriv `uppdateraMeny(filter)` som filtrerar, visar kort, uppdaterar rubriken och markerar dagens rätt (billigaste lunchen, om det finns någon). Anropa den en gång direkt och koppla den till filterknapparna. Testa alla fem filter på sidan, och tryck på knapparna med *tangentbordet* (Tab och Enter).

### Steg 5. Lägg-i-beställning-knappen

I `src/ui.ts`: lägg en `button` sist i varje kort i `skapaRattKort` (klass `lagg-i-order`, `data-id`, och ett `aria-label` som nämner rätten så att skärmläsare kan skilja knapparna åt). Skriv `kopplaLaggTill` i `src/events.ts`.

### Steg 6. Fördjupning: beställningen

Skriv `laggTillIOrder`, `rensaOrder` och `antalIOrder` i `src/order.ts` (nya arrayer, ändra aldrig originalet) och `visaOrder` i `src/ui.ts`. Koppla ihop dem i `src/main.ts`, del 3. Det här steget är fördjupning, så hoppa över det om tiden tar slut. Gör då steg 7 och 8 först.

### Steg 7. Valideringsfunktionerna

I `src/validering.ts`: skriv `valideraNamn`, `valideraEpost`, `valideraTelefon`, `valideraDatum`, `valideraAntal` och `valideraFormular`. De är rena funktioner som returnerar ett meddelande eller en tom text. Meddelandena står i testerna, och du ska följa dem ordagrant.

### Steg 8. Koppla formuläret i kontakt.js

Skriv `visaFel` (skapar `p.falt-fel`, sätter `aria-invalid` och `aria-describedby`), validera vid `blur`, validera om vid `input` när fältet redan är markerat som fel, och hantera `submit`: `preventDefault`, flytta fokus till första felet, annars visa en bekräftelse i `#bekraftelse` (som är en `aria-live`-ruta).

### Steg 9. Testa som en användare

Öppna `kontakt.html`. Testa: skicka tomt, fyll i felaktig e-post, rätta, skicka giltigt. Testa sedan *enbart med tangentbordet*, och slå på en skärmläsare (NVDA på Windows) i två minuter och lyssna på ett felmeddelande. Skriv i en kommentar vad du hörde.

**Vad jag hörde**: Jag använde den inbyggda narratorn med win + ctrl + enter. Den läser upp felmeddelanden :D

## Kontrollista: så vet du att du är klar

- [X] Alla tester på `tests.html` är gröna, utom eventuellt fördjupningen (order).
- [X] Alla fem filterknappar fungerar, och `aria-pressed` följer den valda knappen.
- [X] Du använder event delegation, med en lyssnare på parent.
- [X] `kontakt.html` visar felmeddelanden vid blur och submit, och fokus flyttas till första felet.
- [X] Felmeddelanden är text (inte bara färg) och kopplade med `aria-describedby`.
- [X] Du har testat både filter och formulär med bara tangentbordet.
- [X] Du har gjort minst sex commits.

## Tips om du fastnar

- Inget händer vid klick? Skriv ut `console.log("klick")` allra först i funktionen. Kommer det? Då är det logiken. Kommer det inte? Då är det kopplingen (fel väljare, null, eller fel ordning).
- `handelse.target` är det du klickade på (kanske en `span` inuti knappen). `closest` letar uppåt och hittar knappen.
- `dataset.id` är alltid text. `Number(...)` gör om det till ett tal, annars matchar inte `===`.
- Formuläret laddar om sidan? Du har glömt `handelse.preventDefault()` i submit-lyssnaren.
- `form.elements.namn` hämtar fältet med `name="namn"`. `FormData` ger alla värden som text.
- Lyssnare på element som byggts om försvinner. Därför lyssnar vi på parent som aldrig byggs om.

## Inlämning

**Deadline: imorgon klockan 09.00.** Allt lämnas in i Microsoft Forms. Du behöver inte redovisa något muntligt.

I formuläret fyller du i:

1. Länk till din fork av det här repot.
2. Reflektion: Varför lyssnar vi på parent (event delegation) istället för på varje knapp? Och varför valideras formuläret både vid `blur` och vid `submit`? Varför måste TypeScript veta vad `handelse.target` är innan du använder det, och hur löste du det?

## Vill du mer? (frivilligt)

- Spara beställningen i `localStorage` (`JSON.stringify` och `JSON.parse`) så att den finns kvar efter omladdning.
- Validera också radioknapparna (`svar`) och lägg till `aria-invalid` på gruppen.
- Lägg till en tangentbordsgenväg: Escape rensar filtret.
