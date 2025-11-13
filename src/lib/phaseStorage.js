// Lightweight localStorage helper for phases per plant
// Schema: { version: 1, updatedAt: string, berbunga: [], berbuah: [] }

const keyFor = (plantId) => `plant:${plantId}:phases`;

export function loadPhases(plantId) {
  try {
    const raw = localStorage.getItem(keyFor(plantId));
    if (!raw) return { version: 1, updatedAt: null, berbunga: [], berbuah: [] };
    const data = JSON.parse(raw);
    return {
      version: 1,
      updatedAt: data?.updatedAt || null,
      berbunga: Array.isArray(data?.berbunga) ? data.berbunga : [],
      berbuah: Array.isArray(data?.berbuah) ? data.berbuah : [],
    };
  } catch {
    return { version: 1, updatedAt: null, berbunga: [], berbuah: [] };
  }
}

export function savePhases(plantId, phases) {
  try {
    const payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      berbunga: phases?.berbunga ?? [],
      berbuah: phases?.berbuah ?? [],
    };
    localStorage.setItem(keyFor(plantId), JSON.stringify(payload));
    try {
      window.dispatchEvent(
        new CustomEvent("phases:changed", { detail: { plantId } })
      );
    } catch {
      // ignore event errors (e.g., SSR)
    }
  } catch {
    // ignore write errors (e.g., storage full or disabled)
  }
}

export function resetPhases(plantId) {
  try {
    localStorage.removeItem(keyFor(plantId));
  } catch {
    // ignore
  }
}

export function exportPhases(plantId) {
  try {
    return localStorage.getItem(keyFor(plantId)) || "";
  } catch {
    return "";
  }
}

export function importPhases(plantId, jsonString) {
  try {
    const data = JSON.parse(jsonString);
    savePhases(plantId, data);
  } catch {
    // ignore invalid json
  }
}
