import AsyncStorage from "@react-native-async-storage/async-storage";

export type FavoritesMap = Record<string, true>;

export const FAVORITES_KEY = "favorites";

export async function loadFavorites(): Promise<FavoritesMap> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.reduce<FavoritesMap>((acc, id) => {
        if (typeof id === "string") acc[id] = true;
        return acc;
      }, {});
    }

    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed as Record<string, unknown>).reduce<FavoritesMap>(
        (acc, [id, isSaved]) => {
          if (isSaved) acc[id] = true;
          return acc;
        },
        {}
      );
    }
  } catch (error) {
    console.warn("Failed to load favorites", error);
  }

  return {};
}

export async function saveFavorites(favorites: FavoritesMap) {
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
