import type { Game } from "../types/game";
import type { FilterMap } from "../types/browse";

export type PlayerFilter = "Any" | "1" | "2" | "3" | "4" | "5+";

export const playerFilterOptions: PlayerFilter[] = ["Any", "1", "2", "3", "4", "5+"];
export const ageFilterOptions = ["0–3", "4–5", "6–8", "9–12", "13+"] as const;
export const noiseFilterOptions = ["Low", "Moderate", "High"] as const;
export const activityFilterOptions = [
  "5-minute",
  "Physical",
  "Language",
  "Math",
  "Problem-solving",
  "Fine motor",
  "Seated",
  "Creative",
  "Teamwork",
  "Strategy",
  "Calm",
  "Active",
] as const;

export function splitCSV(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

export function parsePlayers(raw?: string) {
  if (!raw) {
    return { min: undefined as number | undefined, max: undefined as number | undefined };
  }

  const cleaned = raw.replace(/\s+/g, "");
  if (/^\d+\+$/.test(cleaned)) {
    return { min: parseInt(cleaned, 10), max: undefined as number | undefined };
  }
  if (/^\d+$/.test(cleaned)) {
    const value = parseInt(cleaned, 10);
    return { min: value, max: value };
  }
  const match = cleaned.match(/^(\d+)[-–](\d+)$/);
  if (match) return { min: parseInt(match[1], 10), max: parseInt(match[2], 10) };
  return { min: undefined as number | undefined, max: undefined as number | undefined };
}

export function getDesiredPlayers(filter: string) {
  if (/^[1-4]$/.test(filter)) {
    const value = parseInt(filter, 10);
    return { min: value, max: value };
  }
  if (filter === "2+") return { min: 2, max: undefined as number | undefined };
  if (filter === "3-4") return { min: 3, max: 4 };
  if (filter === "5+") return { min: 5, max: undefined as number | undefined };
  return null;
}

export function playersMatchFilter(raw: string | undefined, filter: string) {
  const desired = getDesiredPlayers(filter);
  if (!desired) return true;

  const playerRanges = splitCSV(raw).map(parsePlayers);
  if (playerRanges.length === 0) return false;

  return playerRanges.some(({ min, max }) => {
    if (min === undefined && max === undefined) return false;
    if (desired.max !== undefined && min !== undefined && min > desired.max) return false;
    if (max !== undefined && desired.min !== undefined && max < desired.min) return false;
    if (desired.max === undefined && desired.min !== undefined && max !== undefined && max < desired.min) {
      return false;
    }
    return true;
  });
}

export function suppliesMatchAvailable(
  gameSupplies: string[] | undefined,
  selectedSupplies: Iterable<string>
) {
  const selected = new Set(
    Array.from(selectedSupplies)
      .map((supply) => supply.toLowerCase())
      .filter(Boolean)
  );
  if (selected.size === 0) return true;

  const available = new Set(Array.from(selected).filter((supply) => supply !== "none"));
  const required = (gameSupplies ?? [])
    .map((supply) => supply.toLowerCase())
    .filter((supply) => supply !== "none");

  if (required.length === 0) {
    return selected.has("none") || available.size > 0;
  }
  if (available.size === 0) return false;

  return required.every((supply) => available.has(supply));
}

export function normalizeAgeBand(value: string) {
  return value === "3–5" ? "4–5" : value;
}

export function sortByPreferredOrder(values: string[], preferredOrder: readonly string[]) {
  const order = new Map(preferredOrder.map((value, index) => [value, index]));
  return [...values].sort((a, b) => {
    const aOrder = order.get(a);
    const bOrder = order.get(b);

    if (aOrder !== undefined && bOrder !== undefined) return aOrder - bOrder;
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;
    return a.localeCompare(b);
  });
}

export function pruneFilterMap(currentMap: FilterMap, validValues: Iterable<string>): FilterMap {
  const valid = new Set(validValues);
  const next = Object.keys(currentMap).reduce<FilterMap>((acc, key) => {
    if (valid.has(key)) acc[key] = true;
    return acc;
  }, {});

  return Object.keys(next).length === Object.keys(currentMap).length ? currentMap : next;
}

export function normalizeInstructions(value?: Game["instructions"]) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}
