import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";
import type { GameListItem } from "../../types/browse";
import { pickGameBadge } from "../../utils/gameBadges";

type RailProps = {
  title: string;
  items: GameListItem[];
  emptyText: string;
  compact?: boolean;
  onOpenGame: (id: string) => void;
};

export function Rail({ title, items, emptyText, compact = false, onOpenGame }: RailProps) {
  return (
    <View style={styles.rail}>
      <View style={styles.railHeader}>
        <AppText variant="label" style={styles.railTitle}>
          {title}
        </AppText>
        {items.length > 10 ? (
          <AppText variant="chip" style={styles.seeAll}>
            See all
          </AppText>
        ) : null}
      </View>
      {items.length === 0 ? (
        <View style={styles.railEmpty}>
          <AppText variant="hint" style={styles.railEmptyText}>
            {emptyText}
          </AppText>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.railItems}>
          {items.map((game) => {
            if (compact) {
              return (
                <Pressable
                  key={game.id}
                  onPress={() => onOpenGame(game.id)}
                  style={[styles.miniCard, styles.miniCompactCard]}
                  hitSlop={10}
                >
                  <AppText variant="label" style={styles.miniTitle}>
                    {game.name}
                  </AppText>
                </Pressable>
              );
            }

            const badge = pickGameBadge(game);
            return (
              <Pressable
                key={game.id}
                onPress={() => onOpenGame(game.id)}
                style={styles.miniCard}
                hitSlop={10}
              >
                <View style={[styles.vibeBadge, { backgroundColor: badge.tint }]}>
                  <Ionicons name={badge.icon} size={18} color={badge.color} />
                </View>
                <AppText variant="label" style={styles.miniTitle}>
                  {game.name}
                </AppText>
                <AppText variant="hint" style={styles.miniMeta}>
                  {game.players ? `Players ${game.players}` : "Players: —"}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    ...Shadows.card,
  },
  railHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
  },
  railTitle: {
    color: Colors.deepTeal,
  },
  railItems: {
    flexDirection: "row",
  },
  railEmpty: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  railEmptyText: {
    color: Colors.mutedText,
  },
  seeAll: {
    color: Colors.deepTeal,
    fontWeight: "700",
  },
  miniCard: {
    width: 180,
    marginRight: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  miniCompactCard: {
    marginRight: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  vibeBadge: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xs,
    marginBottom: 8,
  },
  miniTitle: {
    fontSize: 16,
    marginBottom: 4,
    color: Colors.deepTeal,
    fontWeight: "700",
  },
  miniMeta: {
    color: Colors.mutedText,
  },
});
