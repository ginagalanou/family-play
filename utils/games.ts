import type { Game } from "../types/game";

export type PlayerFilter = "Any" | "1" | "2+" | "3-4" | "5+";

export const playerFilterOptions: PlayerFilter[] = ["Any", "1", "2+", "3-4", "5+"];

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
  if (filter === "1") return { min: 1, max: 1 };
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

export function normalizeInstructions(value?: Game["instructions"]) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value];
  }
  return [];
}
