import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoritesMap = Record<string, true>;

export const FAVORITES_KEY = "favorites";

let favoritesCache: FavoritesMap | null = null;

function normalizeFavorites(value: unknown): FavoritesMap {
  if (Array.isArray(value)) {
    return value.reduce<FavoritesMap>((acc, id) => {
      if (typeof id === "string") acc[id] = true;
      return acc;
    }, {});
  }

  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).reduce<FavoritesMap>(
      (acc, [id, isSaved]) => {
        if (isSaved) acc[id] = true;
        return acc;
      },
      {}
    );
  }

  return {};
}

export async function loadFavorites(): Promise<FavoritesMap> {
  if (favoritesCache) return favoritesCache;

  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) {
      favoritesCache = {};
      return favoritesCache;
    }

    const parsed = JSON.parse(raw) as unknown;
    favoritesCache = normalizeFavorites(parsed);
    return favoritesCache;
  } catch (error) {
    console.warn("Failed to load favorites", error);
  }

  favoritesCache = {};
  return favoritesCache;
}

export async function saveFavorites(favorites: FavoritesMap) {
  favoritesCache = { ...favorites };

  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn("Failed to save favorites", error);
  }
}

export function toggleFavorite(id: string, current: FavoritesMap) {
  const next = { ...current };
  if (next[id]) delete next[id];
  else next[id] = true;
  return next;
}

export function removeFavorite(id: string, current: FavoritesMap) {
  if (!current[id]) return current;
  const next = { ...current };
  delete next[id];
  return next;
}
