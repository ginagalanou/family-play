import type { PlayerFilter } from "./games";

export type PresetKey =
  | "noSupplies"
  | "quiet"
  | "highEnergy"
  | "solo"
  | "group"
  | "fiveMinute"
  | "ageUnder2"
  | "age2to4"
  | "age5to7"
  | "age8plus";

export type PresetConfig = {
  query?: string;
  supplies?: string[];
  ages?: string[];
  noise?: string[];
  activity?: string[];
  players?: PlayerFilter;
};

export const presetFilters: Record<PresetKey, PresetConfig> = {
  noSupplies: { supplies: ["none"] },
  quiet: { noise: ["Low"] },
  highEnergy: { activity: ["Physical"] },
  solo: { players: "1" },
  group: { players: "5+" },
  fiveMinute: { activity: ["5-minute"] },
  ageUnder2: { ages: ["0–3"] },
  age2to4: { ages: ["0–3", "4–5"] },
  age5to7: { ages: ["4–5", "6–8"] },
  age8plus: { ages: ["6–8", "9–12", "13+"] },
};

export function normalizePresetKey(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}
