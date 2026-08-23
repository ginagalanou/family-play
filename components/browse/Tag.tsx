import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";
import { Colors } from "../../theme/colors";

type TagProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export function Tag({ label, icon }: TagProps) {
  return (
    <View style={styles.tag}>
      <Ionicons name={icon} size={14} color={Colors.deepTeal} style={styles.icon} />
      <AppText variant="chip" style={styles.tagText}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
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
  icon: {
    marginRight: 6,
  },
  tagText: {
    color: Colors.deepTeal,
    fontSize: 12,
  },
});
