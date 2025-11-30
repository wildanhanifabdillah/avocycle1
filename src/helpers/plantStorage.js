// Lightweight localStorage helper for plants list
// Schema per item: { id:number, code:string, type:string, date:string(yyyy-mm-dd), period:number, health?:string, phase?:string, image?:string, updatedAt:string }

const LIST_KEY = "plants:list";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function loadPlants() {
  const raw = localStorage.getItem(LIST_KEY);
  const arr = safeParse(raw, []);
  return Array.isArray(arr) ? arr : [];
}

export function savePlants(plants) {
  try {
    localStorage.setItem(LIST_KEY, JSON.stringify(plants || []));
  } catch {
    // ignore
  }
}

export function addPlant(plant) {
  const list = loadPlants();
  // simple id generator: 1 + max existing id
  const nextId = (list.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) || 0) + 1;
  const item = {
    id: nextId,
    code: plant?.code || `P${String(nextId).padStart(3, "0")}`,
    type: plant?.type || "",
    date: plant?.date || "",
    period: Number(plant?.period || 0),
    health: plant?.health || "Sehat",
    phase: plant?.phase || "Fase Berbuah",
    image: plant?.image || "/avocado1.png",
    updatedAt: new Date().toISOString(),
  };
  list.push(item);
  savePlants(list);
  // notify listeners
  try { window.dispatchEvent(new Event("plants:changed")); } catch {
    // ignore
  }
  return item;
}

export function getPlant(id) {
  const list = loadPlants();
  return list.find((p) => String(p.id) === String(id)) || null;
}

export function updatePlant(id, updates) {
  const list = loadPlants();
  const idx = list.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return null;
  const merged = { ...list[idx], ...updates, updatedAt: new Date().toISOString() };
  list[idx] = merged;
  savePlants(list);
  try { window.dispatchEvent(new Event("plants:changed")); } catch {
    // ignore
  }
  return merged;
}

