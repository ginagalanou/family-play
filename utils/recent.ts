import AsyncStorage from "@react-native-async-storage/async-storage";

const RECENT_KEY = "recently-played";
const MAX_RECENT = 20;

export async function loadRecentlyPlayed(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === "string");
    }
  } catch (error) {
    console.warn("Failed to load recently played", error);
  }
  return [];
}

export async function saveRecentlyPlayed(ids: string[]) {
  try {
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn("Failed to save recently played", error);
  }
}

export async function recordRecentlyPlayed(id: string) {
  try {
    const existing = await loadRecentlyPlayed();
    const next = [id, ...existing.filter((item) => item !== id)].slice(0, MAX_RECENT);
    await saveRecentlyPlayed(next);
    return next;
  } catch (error) {
    console.warn("Failed to record recently played", error);
  }
}
