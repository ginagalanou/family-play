import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../../components/AppText";
import SmoothScreen from "../../../components/SmoothScreen";
import gamesData from "../../../data/games.json";
import { Colors } from "../../../theme/colors";
import { Shadows } from "../../../theme/layout";
import { Game } from "../../../types/game";
import {
  CustomGame,
  deleteCustomGame,
  loadCustomGames,
} from "../../../utils/customGames";
import {
  FavoritesMap,
  loadFavorites,
  saveFavorites,
  toggleFavorite,
} from "../../../utils/favorites";
import { recordRecentlyPlayed } from "../../../utils/recent";
import { normalizeInstructions } from "../../../utils/games";
import { pickGameBadge } from "../../../utils/gameBadges";
import { parseInstructionBlocks } from "../../../utils/instructions";

const baseGames = gamesData as Game[];

export default function GameDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const gameId = Array.isArray(id) ? id[0] : id;
  const [favorites, setFavorites] = useState<FavoritesMap>({});
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);
  const [customLoaded, setCustomLoaded] = useState(false);

  useEffect(() => {
    loadFavorites().then(setFavorites);
  }, []);

  useEffect(() => {
    loadCustomGames().then((list) => {
      setCustomGames(list);
      setCustomLoaded(true);
    });
  }, []);

  const game = useMemo(() => {
    const allGames: (Game | CustomGame)[] = [...baseGames, ...customGames];
    return allGames.find((g) => g.id === gameId);
  }, [customGames, gameId]);

  useEffect(() => {
    if (!gameId) return;
    recordRecentlyPlayed(gameId);
  }, [gameId]);

  const steps = useMemo(() => normalizeInstructions(game?.instructions), [game]);
  const parsedInstructions = useMemo(() => parseInstructionBlocks(steps), [steps]);
  const isFav = !!(gameId && favorites[gameId]);

  const toggleFav = useCallback(() => {
    if (!gameId) return;
    setFavorites((current) => {
      const next = toggleFavorite(gameId, current);
      saveFavorites(next);
      return next;
    });
  }, [gameId]);

  if (!game) {
    if (!customLoaded) {
      return (
        <SafeAreaView style={styles.fallback} edges={["top", "bottom"]}>
          <AppText variant="body" style={styles.missingText}>
            Loading game...
          </AppText>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.fallback} edges={["top", "bottom"]}>
        <AppText variant="body" style={styles.missingText}>
          Game not found.
        </AppText>
        <Pressable
          onPress={() => router.push("/(tabs)/browse")}
          style={styles.backButton}
          hitSlop={10}
        >
          <AppText variant="label" style={styles.backButtonText}>
            Go back
          </AppText>
        </Pressable>
      </SafeAreaView>
    );
  }

  const playersLabel = game.players ? `Players: ${game.players}` : "Players: —";
  const suppliesLabel = game.supplies?.length ? game.supplies.join(", ") : "None";
  const badge = pickGameBadge(game);
  const isCustom = (game as CustomGame).isCustom;
  const tags = [
    { icon: "people-outline" as const, label: game.players ? `Players: ${game.players}` : null },
    {
      icon: "happy-outline" as const,
      label: game.ages?.length ? `Ages: ${game.ages.join(", ")}` : null,
    },
    { icon: "flash-outline" as const, label: game.activity ? `Activity: ${game.activity}` : null },
    {
      icon: "volume-medium-outline" as const,
      label: game.noise ? `Noise: ${game.noise}` : null,
    },
    {
      icon: "cube-outline" as const,
      label: game.supplies?.length ? `Supplies: ${game.supplies.join(", ")}` : null,
    },
  ].filter((t) => t.label);

  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => router.push("/(tabs)/browse")}
          style={styles.navButton}
          hitSlop={10}
        >
          <Ionicons
            name="chevron-back-outline"
            size={18}
            color={Colors.deepTeal}
            style={styles.navButtonIcon}
          />
          <AppText variant="label" style={styles.navButtonText}>
            Back
          </AppText>
        </Pressable>

        <View style={styles.headerRow}>
          <View style={[styles.vibeBadge, { backgroundColor: badge.tint }]}>
            <Ionicons name={badge.icon} size={24} color={badge.color} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="title" style={styles.title}>
              {game.name}
            </AppText>
            <AppText variant="subtitle" style={styles.meta}>
              Supplies: {suppliesLabel} · {playersLabel}
            </AppText>
          </View>
        </View>

        {tags.length > 0 ? (
          <View style={styles.tagsRow}>
            {tags.map((tag, idx) => (
              <Tag key={idx} icon={tag.icon} label={tag.label as string} />
            ))}
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable
            onPress={toggleFav}
            style={[styles.favorite, isFav && styles.favoriteActive]}
            hitSlop={10}
          >
            <Ionicons
              name={isFav ? "star" : "star-outline"}
              size={18}
              color={isFav ? Colors.text : Colors.deepTeal}
            />
            <AppText
              variant="label"
              style={[styles.favoriteText, isFav && styles.favoriteTextActive]}
            >
              {isFav ? "Favorited" : "Add to favorites"}
            </AppText>
          </Pressable>
        </View>

        <AppText variant="label" style={styles.sectionTitle}>
          Instructions
        </AppText>
        <View style={styles.instructionsCard}>
          {parsedInstructions.map((item, idx) => {
            if (item.type === "note") {
              return (
                <View key={`note-${idx}`} style={styles.noteBlock}>
                  <AppText variant="label" style={styles.noteLabel}>
                    Note
                  </AppText>
                  <AppText variant="body" style={styles.noteText}>
                    {item.text}
                  </AppText>
                </View>
              );
            }

            if (item.type === "category") {
              return (
                <View key={`cat-${idx}`} style={styles.categoryBlock}>
                  <AppText variant="label" style={styles.categoryLabel}>
                    {item.title ||
                      "Need help coming up with categories for your game? Below are some examples you can reference:"}
                  </AppText>
                  <View style={styles.categoryList}>
                    {item.items.map((val, cIdx) => (
                      <View key={cIdx} style={styles.categoryItem}>
                        <Ionicons name="pricetag-outline" size={14} color={Colors.deepTeal} />
                        <AppText variant="body" style={styles.categoryText}>
                          {val}
                        </AppText>
                      </View>
                    ))}
                  </View>
                </View>
              );
            }

            const stepNumber =
              parsedInstructions
                .slice(0, idx + 1)
                .filter((it) => it.type === "step").length;

            return (
              <View key={`step-${idx}`} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Ionicons name="checkmark-circle-outline" size={14} color={Colors.deepTeal} />
                  <AppText variant="chip" style={styles.stepBadgeText}>
                    {stepNumber}
                  </AppText>
                </View>
                <View style={styles.stepBody}>
                  <AppText variant="body" style={styles.stepText}>
                    {item.text}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>

        {isCustom ? (
          <View style={styles.bottomActions}>
            <Pressable
              style={styles.bottomButton}
              onPress={() =>
                router.push({ pathname: "/(tabs)/add", params: { editId: gameId } })
              }
              hitSlop={8}
            >
              <Ionicons name="create-outline" size={18} color={Colors.deepTeal} />
              <AppText variant="label" style={styles.bottomButtonText}>
                Edit
              </AppText>
            </Pressable>
            <Pressable
              style={styles.bottomButton}
              onPress={() => {
                if (!gameId) return;
                Alert.alert(
                  "Delete this game?",
                  "This will remove it from your custom list.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: async () => {
                        await deleteCustomGame(gameId);
                        router.replace("/(tabs)/browse");
                      },
                    },
                  ]
                );
              }}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
              <AppText variant="label" style={[styles.bottomButtonText, { color: Colors.danger }]}>
                Delete
              </AppText>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  </SmoothScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.pageBackground },
  container: { flex: 1, backgroundColor: Colors.pageBackground },
  content: { padding: 16, paddingBottom: 32 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 12,
  },
  vibeBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginBottom: 12,
  },
  navButtonIcon: {
    marginRight: 4,
  },
  navButtonText: { color: Colors.deepTeal },

  title: { marginBottom: 6 },
  meta: { color: Colors.mutedText, marginBottom: 12 },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.softTealTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: { color: Colors.deepTeal, fontSize: 12 },

  favorite: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  favoriteActive: { backgroundColor: Colors.warmAccent, borderColor: Colors.warmAccent },
  favoriteText: { color: Colors.deepTeal },
  favoriteTextActive: { color: Colors.text },

  actionRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },

  bottomActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  bottomButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  bottomButtonText: { color: Colors.deepTeal },

  sectionTitle: { marginBottom: 10, color: Colors.deepTeal },

  instructionsCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    gap: 10,
  },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  stepBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBadgeText: { color: Colors.deepTeal, fontWeight: "700" },
  stepBody: {
    flex: 1,
    borderLeftWidth: 2,
    borderLeftColor: Colors.softTealTint,
    paddingLeft: 10,
  },
  stepText: { color: Colors.text, lineHeight: 20, fontSize: 15 },

  noteBlock: {
    marginTop: 2,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  noteLabel: { color: Colors.deepTeal },
  noteText: { color: Colors.text, lineHeight: 19 },

  categoryBlock: {
    marginTop: 4,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.softOrange,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  categoryLabel: { color: Colors.deepTeal },
  categoryList: { gap: 6 },
  categoryItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  categoryText: { color: Colors.text, lineHeight: 19 },

  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: Colors.pageBackground,
  },
  missingText: { marginBottom: 12 },
  backButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  backButtonText: { color: Colors.deepTeal },
});

function Tag({
  label,
  icon,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.tag}>
      <Ionicons
        name={icon}
        size={14}
        color={Colors.deepTeal}
        style={{ marginRight: 6 }}
      />
      <AppText variant="chip" style={styles.tagText}>
        {label}
      </AppText>
    </View>
  );
}
