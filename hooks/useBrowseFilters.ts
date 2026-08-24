import { useMemo } from "react";
import type { DerivedFilters, FilterMap, GameListItem } from "../types/browse";
import type { FavoritesMap } from "../utils/favorites";
import { playersMatchFilter, splitCSV, suppliesMatchAvailable } from "../utils/games";

type UseBrowseFiltersInput = {
  allGames: GameListItem[];
  favorites: FavoritesMap;
  query: string;
  supplies: FilterMap;
  ages: FilterMap;
  noise: FilterMap;
  activity: FilterMap;
  players: string;
  showOnlyFavorites: boolean;
};

export function useBrowseFilters({
  allGames,
  favorites,
  query,
  supplies,
  ages,
  noise,
  activity,
  players,
  showOnlyFavorites,
}: UseBrowseFiltersInput) {
  const selectedCounts = useMemo(() => {
    return {
      supplies: Object.keys(supplies).length,
      ages: Object.keys(ages).length,
      noise: Object.keys(noise).length,
      activity: Object.keys(activity).length,
      players: players === "Any" ? 0 : 1,
    };
  }, [supplies, ages, noise, activity, players]);

  const totalSelectedFilters = useMemo(
    () => Object.values(selectedCounts).reduce((sum, count) => sum + count, 0),
    [selectedCounts]
  );

  const derived = useMemo<DerivedFilters>(() => {
    const bannedSupplies = new Set(["marker"]);
    const allSupplies = Array.from(
      new Set(
        allGames
          .flatMap((game) => (game.supplies || []).map((supply) => supply.toLowerCase()))
          .filter((supply) => !bannedSupplies.has(supply))
      )
    ).sort((a, b) => {
      if (a === "none") return -1;
      if (b === "none") return 1;
      return a.localeCompare(b);
    });
    const allAges = Array.from(new Set(allGames.flatMap((game) => game.ages || [])));
    const allNoise = Array.from(new Set(allGames.flatMap((game) => splitCSV(game.noise))));
    const allActivity = Array.from(new Set(allGames.flatMap((game) => splitCSV(game.activity))));

    return { supplies: allSupplies, ages: allAges, noise: allNoise, activity: allActivity };
  }, [allGames]);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const wantsSupplies = Object.keys(supplies).length > 0;
    const wantsAges = Object.keys(ages).length > 0;
    const wantsNoise = Object.keys(noise).length > 0;
    const wantsActivity = Object.keys(activity).length > 0;
    const wantFavs = showOnlyFavorites;

    const list = allGames.filter((game) => {
      if (wantFavs && !favorites[game.id]) return false;

      if (q) {
        const hay =
          [
            game.name,
            ...(game.supplies ?? []),
            ...(game.ages ?? []),
            typeof game.instructions === "string"
              ? game.instructions
              : (game.instructions ?? []).join(" "),
            game.players ?? "",
            game.activity ?? "",
            game.noise ?? "",
          ]
            .join(" ")
            .toLowerCase() || "";
        if (!hay.includes(q)) return false;
      }

      if (wantsSupplies) {
        if (!suppliesMatchAvailable(game.supplies, Object.keys(supplies))) return false;
      }

      if (wantsAges) {
        const selected = new Set(Object.keys(ages));
        const ok = (game.ages || []).some((age) => selected.has(age));
        if (!ok) return false;
      }

      if (wantsNoise) {
        const selected = new Set(Object.keys(noise));
        const values = splitCSV(game.noise);
        if (values.length === 0) return false;
        const ok = values.some((value) => selected.has(value));
        if (!ok) return false;
      }

      if (wantsActivity) {
        const selected = new Set(Object.keys(activity));
        const values = splitCSV(game.activity);
        if (values.length === 0) return false;
        const ok = values.some((value) => selected.has(value));
        if (!ok) return false;
      }

      if (!playersMatchFilter(game.players, players)) {
        return false;
      }

      return true;
    });

    list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [
    query,
    supplies,
    ages,
    noise,
    activity,
    players,
    showOnlyFavorites,
    favorites,
    allGames,
  ]);

  return { data, derived, selectedCounts, totalSelectedFilters };
}
