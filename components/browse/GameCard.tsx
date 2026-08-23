import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Tag } from "./Tag";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";
import type { GameListItem } from "../../types/browse";
import { pickGameBadge } from "../../utils/gameBadges";

type GameCardProps = {
  game: GameListItem;
  isFavorite: boolean;
  onPress: (id: string) => void;
  onToggleFavorite: (id: string) => void;
};

type FeatureTag = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export function GameCard({ game, isFavorite, onPress, onToggleFavorite }: GameCardProps) {
  const badge = pickGameBadge(game);
  const meta = [
    game.ages?.length ? `Ages ${game.ages.join(", ")}` : null,
    game.players ? `Players ${game.players}` : null,
  ].filter(Boolean);
  const featureTags: FeatureTag[] = [];
  if (game.activity) {
    featureTags.push({ icon: "flash-outline", label: game.activity });
  }
  if (game.noise) {
    featureTags.push({ icon: "volume-medium-outline", label: game.noise });
  }
  if (game.supplies?.length) {
    featureTags.push({
      icon: "cube-outline",
      label:
        game.supplies.length === 1
          ? game.supplies[0]
          : `${game.supplies.slice(0, 2).join(", ")}${game.supplies.length > 2 ? " +" : ""}`,
    });
  }
  const visibleFeatureTags = featureTags.slice(0, 2);

  return (
    <Pressable onPress={() => onPress(game.id)} style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.vibeBadge, { backgroundColor: badge.tint }]}>
          <Ionicons name={badge.icon} size={22} color={badge.color} />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <AppText variant="title" style={styles.title}>
              {game.name}
            </AppText>

            <Pressable
              onPress={() => onToggleFavorite(game.id)}
              hitSlop={10}
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
            >
              <Ionicons
                name={isFavorite ? "star" : "star-outline"}
                size={18}
                color={isFavorite ? Colors.text : Colors.deepTeal}
              />
            </Pressable>
          </View>

          {meta.length ? (
            <AppText variant="hint" style={styles.meta}>
              {meta.join(" · ")}
            </AppText>
          ) : null}

          <View style={styles.tagsRow}>
            {game.isCustom ? <Tag icon="create-outline" label="Custom" /> : null}
            {visibleFeatureTags.map((tag) => (
              <Tag key={`${tag.icon}-${tag.label}`} icon={tag.icon} label={tag.label} />
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs - 2,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  cardBody: {
    flex: 1,
  },
  vibeBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xs,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    color: Colors.deepTeal,
    fontSize: 18,
    fontWeight: "700",
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoriteButtonActive: {
    backgroundColor: Colors.warmAccent,
    borderColor: Colors.warmAccent,
  },
  meta: {
    color: Colors.mutedText,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
