import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Rail } from "./Rail";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";
import type { GameListItem } from "../../types/browse";
import type { PresetKey } from "../../utils/presets";

type BrowseRailsProps = {
  recentItems: GameListItem[];
  activePreset?: PresetKey | null;
  onSurprise: () => void;
  onPreset: (key: PresetKey) => void;
  onOpenGame: (id: string) => void;
};

const quickPicks: {
  key: PresetKey;
  label: string;
  hint: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "noSupplies", label: "No supplies", hint: "Start right now", icon: "cube-outline" },
  { key: "quiet", label: "Quiet", hint: "Low-noise play", icon: "volume-mute-outline" },
  { key: "highEnergy", label: "High energy", hint: "Move around", icon: "flash-outline" },
  { key: "fiveMinute", label: "Fast play", hint: "Short ideas", icon: "time-outline" },
];

export function BrowseRails({
  recentItems,
  activePreset,
  onSurprise,
  onPreset,
  onOpenGame,
}: BrowseRailsProps) {
  return (
    <View style={styles.railsWrap}>
      <View style={styles.quickStartSection}>
        <View style={styles.quickStartHeader}>
          <AppText variant="label" style={styles.quickStartTitle}>
            Quick starts
          </AppText>
          <AppText variant="hint" style={styles.quickStartHint}>
            Pick a starting point
          </AppText>
        </View>

        <View style={styles.quickPickGrid}>
          {quickPicks.map((item) => {
            const active = activePreset === item.key;
            return (
              <Pressable
                key={item.key}
                style={[styles.quickPickCard, active && styles.quickPickCardActive]}
                onPress={() => onPreset(item.key)}
                hitSlop={8}
              >
                <View style={[styles.quickPickIconWrap, active && styles.quickPickIconWrapActive]}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={active ? Colors.white : Colors.deepTeal}
                  />
                </View>
                <AppText
                  variant="label"
                  style={[styles.quickPickText, active && styles.quickPickTextActive]}
                >
                  {item.label}
                </AppText>
                <AppText
                  variant="hint"
                  style={[styles.quickPickHint, active && styles.quickPickHintActive]}
                >
                  {item.hint}
                </AppText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.surprisePill} onPress={onSurprise} hitSlop={10}>
        <Ionicons
          name="sparkles-outline"
          size={18}
          color={Colors.deepTeal}
          style={styles.surpriseIcon}
        />
        <AppText variant="label" style={styles.surpriseText}>
          Surprise me with a game
        </AppText>
      </Pressable>

      <Rail
        title="Recently played"
        items={recentItems}
        emptyText="Your recent games will show up here."
        compact
        onOpenGame={onOpenGame}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  railsWrap: {
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  quickStartSection: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.sm,
    ...Shadows.card,
  },
  quickStartHeader: {
    marginBottom: Spacing.xs,
  },
  quickStartTitle: {
    color: Colors.deepTeal,
    fontWeight: "800",
    fontSize: 16,
  },
  quickStartHint: {
    color: Colors.mutedText,
    marginTop: 2,
  },
  quickPickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  quickPickCard: {
    width: "48.5%",
    minHeight: 96,
    padding: Spacing.sm,
    backgroundColor: Colors.softTealTint,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickPickCardActive: {
    backgroundColor: Colors.primaryTeal,
    borderColor: Colors.primaryTeal,
  },
  quickPickIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickPickIconWrapActive: {
    backgroundColor: Colors.deepTeal,
  },
  quickPickText: {
    color: Colors.deepTeal,
    fontWeight: "800",
  },
  quickPickTextActive: {
    color: Colors.white,
  },
  quickPickHint: {
    color: Colors.mutedText,
    marginTop: 2,
    fontStyle: "normal",
  },
  quickPickHintActive: {
    color: Colors.mint,
  },
  surprisePill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.warmAccent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  surpriseIcon: {
    marginRight: 8,
  },
  surpriseText: {
    color: Colors.text,
    fontWeight: "700",
  },
});
