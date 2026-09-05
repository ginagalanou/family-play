import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";

type EmptyStateProps = {
  onClearFilters: () => void;
  onAddGame: () => void;
  title?: string;
  subtitle?: string;
  addActionLabel?: string;
  showClearAction?: boolean;
};

export function EmptyState({
  onClearFilters,
  onAddGame,
  title = "No games match... yet.",
  subtitle = "Clear filters or add your own game to keep the fun going.",
  addActionLabel = "Add your game",
  showClearAction = true,
}: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <AppText variant="title" style={styles.emptyTitle}>
        {title}
      </AppText>
      <AppText variant="subtitle" style={styles.emptySubtitle}>
        {subtitle}
      </AppText>
      <View style={styles.emptyActions}>
        {showClearAction ? (
          <Pressable style={styles.clearBtn} onPress={onClearFilters}>
            <AppText variant="label" style={styles.clearBtnText}>
              Clear filters
            </AppText>
          </Pressable>
        ) : null}
        <Pressable style={styles.applyBtn} onPress={onAddGame}>
          <AppText variant="label" style={styles.applyBtnText}>
            {addActionLabel}
          </AppText>
        </Pressable>
      </View>
      <AppText variant="hint" style={styles.emptyHint}>
        Offline? All games are stored on your device, so everything still works.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "flex-start",
    gap: Spacing.sm,
    ...Shadows.card,
  },
  emptyTitle: {
    color: Colors.deepTeal,
    fontSize: 18,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: Colors.text,
    lineHeight: 20,
  },
  emptyActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  emptyHint: {
    color: Colors.mutedText,
  },
  clearBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearBtnText: {
    color: Colors.deepTeal,
    fontWeight: "600",
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.warmAccent,
  },
  applyBtnText: {
    color: Colors.text,
    fontWeight: "700",
  },
});
