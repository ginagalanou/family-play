import { router, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BrowseHeader } from "../../components/browse/BrowseHeader";
import { BrowseRails } from "../../components/browse/BrowseRails";
import { EmptyState } from "../../components/browse/EmptyState";
import { FiltersModal } from "../../components/browse/FiltersModal";
import { GameCard } from "../../components/browse/GameCard";
import { ResultsSummary } from "../../components/browse/ResultsSummary";
import SmoothScreen from "../../components/SmoothScreen";
import gamesData from "../../data/games.json";
import { useBrowseFilters } from "../../hooks/useBrowseFilters";
import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/layout";
import type { FilterMap, GameListItem, ListRenderable } from "../../types/browse";
import {
  type FavoritesMap,
  loadFavorites,
  saveFavorites,
  toggleFavorite as toggleFavoriteId,
} from "../../utils/favorites";
import { presetFilters, type PresetKey } from "../../utils/presets";
import { type CustomGame, loadCustomGames } from "../../utils/customGames";
import { pruneFilterMap } from "../../utils/games";
import { loadRecentlyPlayed } from "../../utils/recent";

const baseGames = gamesData as GameListItem[];
type CollectionMode = "all" | "saved" | "created";

function listToMap(values?: string[]) {
  return (values ?? []).reduce<FilterMap>((acc, value) => {
    acc[value] = true;
    return acc;
  }, {});
}

function paramToString(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

const presetSummaryTitles: Record<PresetKey, string> = {
  noSupplies: "No-supplies games",
  quiet: "Quiet games",
  highEnergy: "High-energy games",
  solo: "Single-player games",
  group: "Group games",
  fiveMinute: "Fast-play games",
  ageUnder2: "Games for little ones",
  age2to4: "Games for ages 2-4",
  age5to7: "Games for ages 5-7",
  age8plus: "Games for older kids",
};

export default function GamesScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<ListRenderable>>(null);

  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<FavoritesMap>({});
  const [collectionMode, setCollectionMode] = useState<CollectionMode>("all");
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [activePreset, setActivePreset] = useState<PresetKey | null>(null);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [fSupplies, setFSupplies] = useState<FilterMap>({});
  const [fAges, setFAges] = useState<FilterMap>({});
  const [fNoise, setFNoise] = useState<FilterMap>({});
  const [fActivity, setFActivity] = useState<FilterMap>({});
  const [fPlayers, setFPlayers] = useState<string>("Any");
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);

  const { openFilters, filterSession, preset, highlightId } = useLocalSearchParams<{
    openFilters?: string;
    filterSession?: string | string[];
    preset?: string | string[];
    highlightId?: string | string[];
  }>();
  const lastHighlightId = useRef<string | null>(null);
  const lastFilterSession = useRef<string | null>(null);

  const allGames = useMemo<GameListItem[]>(
    () => [...baseGames, ...customGames],
    [customGames]
  );

  const { data, derived, totalSelectedFilters } = useBrowseFilters({
    allGames,
    favorites,
    query,
    supplies: fSupplies,
    ages: fAges,
    noise: fNoise,
    activity: fActivity,
    players: fPlayers,
    collectionMode,
  });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadFavorites().then((loadedFavorites) => {
        if (active) setFavorites(loadedFavorites);
      });
      loadRecentlyPlayed().then((ids) => {
        if (active) setRecentIds(ids);
      });
      loadCustomGames().then((list) => {
        if (active) setCustomGames(list);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const scrollToTop = useCallback((animated = true) => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated });
    });
  }, []);

  const clearFilterControls = useCallback(() => {
    setActivePreset(null);
    setFSupplies({});
    setFAges({});
    setFNoise({});
    setFActivity({});
    setFPlayers("Any");
  }, []);

  const clearBrowseState = useCallback(() => {
    clearFilterControls();
    setQuery("");
    setCollectionMode("all");
    scrollToTop();
  }, [clearFilterControls, scrollToTop]);

  useEffect(() => {
    const session = paramToString(filterSession);
    if (!session || lastFilterSession.current === session) return;

    lastFilterSession.current = session;
    clearBrowseState();
    setFiltersOpen(true);
  }, [filterSession, clearBrowseState]);

  useEffect(() => {
    if (openFilters === "1" && !paramToString(filterSession)) {
      setFiltersOpen(true);
    }
  }, [openFilters, filterSession]);

  useEffect(() => {
    setFSupplies((current) => pruneFilterMap(current, derived.supplies));
  }, [derived.supplies]);

  useEffect(() => {
    setFAges((current) => pruneFilterMap(current, derived.ages));
  }, [derived.ages]);

  useEffect(() => {
    setFNoise((current) => pruneFilterMap(current, derived.noise));
  }, [derived.noise]);

  useEffect(() => {
    setFActivity((current) => pruneFilterMap(current, derived.activity));
  }, [derived.activity]);

  const applyPreset = useCallback((key: PresetKey) => {
    const config = presetFilters[key];
    if (!config) return;

    setActivePreset(key);
    setCollectionMode("all");
    setQuery(config.query ?? "");
    setFSupplies(listToMap((config.supplies ?? []).map((s) => s.toLowerCase())));
    setFAges(listToMap(config.ages));
    setFNoise(listToMap(config.noise));
    setFActivity(listToMap(config.activity));
    setFPlayers(config.players ?? "Any");
  }, []);

  const handlePreset = useCallback(
    (key: PresetKey) => {
      applyPreset(key);
      scrollToTop();
    },
    [applyPreset, scrollToTop]
  );

  useEffect(() => {
    const key = paramToString(preset) as PresetKey | undefined;
    if (paramToString(filterSession)) return;
    if (!key) return;
    applyPreset(key);
    scrollToTop();
  }, [preset, filterSession, applyPreset, scrollToTop]);

  const openGame = useCallback((id: string) => {
    router.push({ pathname: "/(tabs)/game/[id]", params: { id } });
  }, []);

  useEffect(() => {
    if (paramToString(filterSession)) {
      lastHighlightId.current = null;
      return;
    }

    const id = paramToString(highlightId);
    if (!id) {
      lastHighlightId.current = null;
      return;
    }
    if (lastHighlightId.current === id) return;
    lastHighlightId.current = id;
    openGame(id);
  }, [highlightId, filterSession, openGame]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = toggleFavoriteId(id, current);
      saveFavorites(next);
      return next;
    });
  }, []);

  const recentItems = useMemo(() => {
    const map = new Map(allGames.map((game) => [game.id, game]));
    return recentIds
      .map((id) => map.get(id))
      .filter((game): game is GameListItem => !!game)
      .slice(0, 10);
  }, [recentIds, allGames]);
  const hasCreatedGames = useMemo(() => allGames.some((game) => game.isCustom), [allGames]);

  const handleSurprise = useCallback(() => {
    if (allGames.length === 0) return;
    const random = allGames[Math.floor(Math.random() * allGames.length)];
    if (!random) return;
    openGame(random.id);
  }, [allGames, openGame]);

  const hasSearch = query.trim().length > 0;
  const isFilteredView = collectionMode !== "all" || hasSearch || totalSelectedFilters > 0;
  const summaryTitle = useMemo(() => {
    if (collectionMode === "saved") return "Saved games";
    if (collectionMode === "created") return "Your Created Games";
    if (activePreset) return presetSummaryTitles[activePreset];
    if (hasSearch) return "Search results";
    return "Filtered games";
  }, [activePreset, collectionMode, hasSearch]);

  const listData: ListRenderable[] = useMemo(() => {
    const items: ListRenderable[] = isFilteredView
      ? [{ type: "summary", id: "summary", title: summaryTitle, count: data.length }]
      : [{ type: "rails", id: "rails" }];

    if (data.length === 0) {
      items.push({ type: "empty", id: "empty" });
      return items;
    }
    return items.concat(data.map((game) => ({ type: "game", id: game.id, game })));
  }, [data, isFilteredView, summaryTitle]);

  const toggleSet = useCallback(
    (setter: React.Dispatch<React.SetStateAction<FilterMap>>, key: string) => {
      setter((current) => {
        const next = { ...current };
        if (next[key]) delete next[key];
        else next[key] = true;
        return next;
      });
    },
    []
  );

  const handleOpenCollection = useCallback(
    (mode: Exclude<CollectionMode, "all">) => {
      clearFilterControls();
      setQuery("");
      setCollectionMode(mode);
      setFiltersOpen(false);
      scrollToTop();
    },
    [clearFilterControls, scrollToTop]
  );

  const handleOpenSaved = useCallback(() => {
    handleOpenCollection("saved");
  }, [handleOpenCollection]);

  const handleOpenCreated = useCallback(() => {
    handleOpenCollection("created");
  }, [handleOpenCollection]);

  const handleBackToAllGames = useCallback(() => {
    clearBrowseState();
  }, [clearBrowseState]);

  const handleChangeQuery = useCallback(
    (value: string) => {
      setActivePreset(null);
      setQuery(value);
    },
    []
  );

  const handleOpenFilters = useCallback(() => {
    setFiltersOpen(true);
  }, []);

  const handleCloseFilters = useCallback(() => {
    setFiltersOpen(false);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setFiltersOpen(false);
    scrollToTop();
  }, [scrollToTop]);

  const handleAddGame = useCallback(() => {
    router.push("/(tabs)/add");
  }, []);

  const handleToggleSupply = useCallback(
    (value: string) => {
      setActivePreset(null);
      toggleSet(setFSupplies, value);
    },
    [toggleSet]
  );

  const handleToggleAge = useCallback(
    (value: string) => {
      setActivePreset(null);
      toggleSet(setFAges, value);
    },
    [toggleSet]
  );

  const handleToggleNoise = useCallback(
    (value: string) => {
      setActivePreset(null);
      toggleSet(setFNoise, value);
    },
    [toggleSet]
  );

  const handleToggleActivity = useCallback(
    (value: string) => {
      setActivePreset(null);
      toggleSet(setFActivity, value);
    },
    [toggleSet]
  );

  const renderItem = useCallback(
    ({ item }: { item: ListRenderable }) => {
      if (item.type === "rails") {
        return (
          <BrowseRails
            recentItems={recentItems}
            activePreset={activePreset}
            onSurprise={handleSurprise}
            onPreset={handlePreset}
            onOpenGame={openGame}
          />
        );
      }

      if (item.type === "summary") {
        return (
          <ResultsSummary
            title={item.title}
            count={item.count}
            onClear={clearBrowseState}
          />
        );
      }

      if (item.type === "empty") {
        if (collectionMode === "created" && !hasCreatedGames) {
          return (
            <EmptyState
              title="You haven't created any games yet."
              subtitle="Create a game to see it here."
              addActionLabel="Create a Game"
              showClearAction={false}
              onClearFilters={clearBrowseState}
              onAddGame={handleAddGame}
            />
          );
        }

        return <EmptyState onClearFilters={clearBrowseState} onAddGame={handleAddGame} />;
      }

      return (
        <GameCard
          game={item.game}
          isFavorite={!!favorites[item.game.id]}
          onPress={openGame}
          onToggleFavorite={toggleFavorite}
        />
      );
    },
    [
      clearBrowseState,
      collectionMode,
      favorites,
      handleAddGame,
      hasCreatedGames,
      activePreset,
      handlePreset,
      handleSurprise,
      openGame,
      recentItems,
      toggleFavorite,
    ]
  );

  return (
    <SmoothScreen style={styles.screenWrapper}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <BrowseHeader
          query={query}
          collectionMode={collectionMode}
          totalSelectedFilters={totalSelectedFilters}
          onBackToAllGames={handleBackToAllGames}
          onOpenSaved={handleOpenSaved}
          onOpenCreated={handleOpenCreated}
          onOpenFilters={handleOpenFilters}
          onChangeQuery={handleChangeQuery}
        />
        <FlatList
          ref={listRef}
          data={listData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: 16 + insets.bottom },
          ]}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
        />

        <FiltersModal
          visible={filtersOpen}
          topInset={insets.top}
          bottomInset={insets.bottom}
          derived={derived}
          supplies={fSupplies}
          ages={fAges}
          noise={fNoise}
          activity={fActivity}
          players={fPlayers}
          onClose={handleCloseFilters}
          onClear={clearFilterControls}
          onApply={handleApplyFilters}
          onToggleSupply={handleToggleSupply}
          onToggleAge={handleToggleAge}
          onToggleNoise={handleToggleNoise}
          onToggleActivity={handleToggleActivity}
          onChangePlayers={(value) => {
            setActivePreset(null);
            setFPlayers(value);
          }}
        />
      </SafeAreaView>
    </SmoothScreen>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
    paddingHorizontal: Spacing.md,
  },
  listContent: {
    paddingVertical: Spacing.xs,
  },
});
