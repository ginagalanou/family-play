import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { AppText } from "../AppText";
import { Colors, FilterColors } from "../../theme/colors";

export type FilterSection = "materials" | "players" | "noise" | "activity" | "ages";

const filterSectionStyles: Record<
  FilterSection,
  {
    background: string;
    activeBackground: string;
    text: string;
    activeText: string;
  }
> = {
  materials: {
    background: FilterColors.materials.background,
    activeBackground: FilterColors.materials.activeBackground,
    text: Colors.deepTeal,
    activeText: Colors.white,
  },
  players: {
    background: FilterColors.players.background,
    activeBackground: FilterColors.players.activeBackground,
    text: Colors.deepTeal,
    activeText: Colors.white,
  },
  noise: {
    background: FilterColors.noise.background,
    activeBackground: FilterColors.noise.activeBackground,
    text: Colors.deepTeal,
    activeText: Colors.white,
  },
  activity: {
    background: FilterColors.activity.background,
    activeBackground: FilterColors.activity.activeBackground,
    text: Colors.deepTeal,
    activeText: Colors.white,
  },
  ages: {
    background: FilterColors.ages.background,
    activeBackground: FilterColors.ages.activeBackground,
    text: Colors.deepTeal,
    activeText: Colors.white,
  },
};

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  section?: FilterSection;
};

export function Chip({ label, active, onPress, section }: ChipProps) {
  const variant = section ? filterSectionStyles[section] : filterSectionStyles.materials;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? variant.activeBackground : variant.background,
          borderColor: active ? variant.activeBackground : variant.background,
        },
      ]}
    >
      <AppText
        variant="chip"
        style={[
          styles.chipText,
          {
            color: active ? variant.activeText : variant.text,
            fontWeight: active ? "600" : "500",
            opacity: active ? 1 : 0.85,
          },
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.softTealTint,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    color: Colors.deepTeal,
  },
});
