// Dag 5 (fördjupning): Beställningen som data. En order är en array: [{ id: 1, antal: 2 }, ...]
import type { OrderRad } from "./typer";
// Alla funktioner ska returnera NYA arrayer och aldrig ändra order de får in.

// Lägg till en rätt. Finns id redan i ordern: öka antal med 1. Annars lägg till { id, antal: 1 }.
export function laggTillIOrder(order: OrderRad[], id: number): OrderRad[] {
  // Skapa en deep copy
  //const nyOrder = order.map(ord => ({...ord}));
  const nyOrder = structuredClone(order);
  for (const ord of nyOrder) {
    if (ord.id === id) {
      ord.antal++;
      return nyOrder;
    }
  }

  nyOrder.push({id, antal: 1});
  return nyOrder;
}

// En tom order.
export function rensaOrder(): OrderRad[] {
  return [];
}

// Totala antalet varor i ordern (summan av alla antal).
export function antalIOrder(order: OrderRad[]): number {
  return order.reduce((summa, x) => summa + x.antal, 0);
}
