import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Colors } from "../../theme/colors";
import { Radius, Spacing } from "../../theme/layout";

type ResultsSummaryProps = {
  title: string;
  count: number;
  onClear: () => void;
};

export function ResultsSummary({ title, count, onClear }: ResultsSummaryProps) {
  const countLabel = `${count} ${count === 1 ? "game" : "games"}`;

  return (
    <View style={styles.summary}>
      <View style={styles.copy}>
        <AppText variant="label" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="hint" style={styles.count}>
          {countLabel}
        </AppText>
      </View>

      <Pressable style={styles.clearButton} onPress={onClear} hitSlop={8}>
        <AppText variant="label" style={styles.clearText}>
          Clear
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
  },
  copy: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    color: Colors.deepTeal,
    fontSize: 16,
    fontWeight: "800",
  },
  count: {
    color: Colors.mutedText,
    marginTop: 2,
    fontStyle: "normal",
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.md,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearText: {
    color: Colors.deepTeal,
    fontWeight: "700",
  },
});
