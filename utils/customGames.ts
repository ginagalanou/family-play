import AsyncStorage from "@react-native-async-storage/async-storage";
import { Game } from "../types/game";

export type CustomGame = Game & {
  createdAt: number;
  isCustom: true;
};

const STORAGE_KEY = "custom_games";

function sanitizeText(value: string) {
  return value.trim();
}

function sanitizeOptionalText(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

function normalizeInstructionLines(
  value: string | string[] | undefined
): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(sanitizeText).filter(Boolean);
  return value
    .split("\n")
    .map(sanitizeText)
    .filter(Boolean);
}

export async function loadCustomGames(): Promise<CustomGame[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const game = item as Partial<CustomGame>;
        if (!game.id || !game.name) return null;

        return {
          id: String(game.id),
          name: sanitizeText(game.name),
          supplies: (game.supplies ?? []).map(String),
          ages: (game.ages ?? []).map(String),
          instructions: normalizeInstructionLines(game.instructions),
          players: sanitizeOptionalText(game.players ? String(game.players) : undefined),
          activity: sanitizeOptionalText(game.activity ? String(game.activity) : undefined),
          noise: sanitizeOptionalText(game.noise ? String(game.noise) : undefined),
          createdAt: game.createdAt ?? Date.now(),
          isCustom: true as const,
        };
      })
      .filter(Boolean) as CustomGame[];
  } catch (error) {
    console.warn("Failed to load custom games", error);
    return [];
  }
}

export async function saveCustomGames(items: CustomGame[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to save custom games", error);
  }
}

export async function addCustomGame(
  partial: Omit<Game, "id"> & { id?: string }
): Promise<CustomGame[]> {
  const existing = await loadCustomGames();
  const now = Date.now();
  const newGame: CustomGame = {
    id: partial.id ?? `custom-${now}`,
    name: sanitizeText(partial.name),
    supplies: (partial.supplies ?? []).map(sanitizeText).filter(Boolean),
    ages: (partial.ages ?? []).map(sanitizeText).filter(Boolean),
    instructions: normalizeInstructionLines(partial.instructions),
    players: sanitizeOptionalText(partial.players),
    activity: sanitizeOptionalText(partial.activity),
    noise: sanitizeOptionalText(partial.noise),
    createdAt: now,
    isCustom: true,
  };

  const next = [...existing, newGame];
  await saveCustomGames(next);
  return next;
}

export async function updateCustomGame(
  id: string,
  updates: Partial<Omit<Game, "id">>
): Promise<CustomGame[]> {
  const existing = await loadCustomGames();
  const next = existing.map((game) => {
    if (game.id !== id) return game;
    return {
      ...game,
      name: updates.name ? sanitizeText(updates.name) : game.name,
      supplies:
        updates.supplies !== undefined
          ? (updates.supplies ?? []).map(sanitizeText).filter(Boolean)
          : game.supplies,
      ages:
        updates.ages !== undefined
          ? (updates.ages ?? []).map(sanitizeText).filter(Boolean)
          : game.ages,
      instructions:
        updates.instructions !== undefined
          ? normalizeInstructionLines(updates.instructions)
          : game.instructions,
      players:
        updates.players !== undefined ? sanitizeOptionalText(updates.players) : game.players,
      activity:
        updates.activity !== undefined ? sanitizeOptionalText(updates.activity) : game.activity,
      noise: updates.noise !== undefined ? sanitizeOptionalText(updates.noise) : game.noise,
    };
  });
  await saveCustomGames(next);
  return next;
}

export async function deleteCustomGame(id: string): Promise<CustomGame[]> {
  const existing = await loadCustomGames();
  const next = existing.filter((g) => g.id !== id);
  await saveCustomGames(next);
  return next;
}
