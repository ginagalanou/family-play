import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../AppText";
import { BrandLogo } from "../BrandLogo";
import { Chip } from "./Chip";
import { Colors } from "../../theme/colors";
import { Typography } from "../../theme/typography";
import type { DerivedFilters, FilterMap } from "../../types/browse";
import { playerFilterOptions } from "../../utils/games";

type FiltersModalProps = {
  visible: boolean;
  topInset: number;
  bottomInset: number;
  derived: DerivedFilters;
  supplies: FilterMap;
  ages: FilterMap;
  noise: FilterMap;
  activity: FilterMap;
  players: string;
  onClose: () => void;
  onClear: () => void;
  onApply: () => void;
  onToggleSupply: (value: string) => void;
  onToggleAge: (value: string) => void;
  onToggleNoise: (value: string) => void;
  onToggleActivity: (value: string) => void;
  onChangePlayers: (value: string) => void;
};

export function FiltersModal({
  visible,
  topInset,
  bottomInset,
  derived,
  supplies,
  ages,
  noise,
  activity,
  players,
  onClose,
  onClear,
  onApply,
  onToggleSupply,
  onToggleAge,
  onToggleNoise,
  onToggleActivity,
  onChangePlayers,
}: FiltersModalProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalWrap} edges={["top", "bottom"]}>
        <View style={[styles.modalHeader, { paddingTop: Math.max(topInset, 12) }]}>
          <Pressable onPress={onClose} style={styles.backBtn}>
            <Ionicons
              name="chevron-back-outline"
              size={18}
              color={Colors.white}
              style={styles.backIcon}
            />
            <AppText variant="label" style={styles.backBtnText}>
              Back
            </AppText>
          </Pressable>

          <View style={styles.modalTitleCenter}>
            <AppText variant="title" style={styles.modalTitle}>
              Filters
            </AppText>
          </View>

          <View style={styles.modalLogoWrap}>
            <BrandLogo size={46} imageSize={32} borderRadius={12} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.modalContent}>
          <AppText variant="label" style={styles.groupTitle}>
            Materials
          </AppText>
          <View style={styles.chipsWrap}>
            {derived.supplies.map((supply) => (
              <Chip
                key={supply}
                label={supply}
                active={!!supplies[supply]}
                onPress={() => onToggleSupply(supply)}
                section="materials"
              />
            ))}
          </View>

          <AppText variant="label" style={styles.groupTitle}>
            Number of Players
          </AppText>
          <View style={styles.chipsWrap}>
            {playerFilterOptions.map((value) => (
              <Chip
                key={value}
                label={value}
                active={players === value}
                onPress={() => onChangePlayers(value)}
                section="players"
              />
            ))}
          </View>

          <AppText variant="label" style={styles.groupTitle}>
            Noise
          </AppText>
          <View style={styles.chipsWrap}>
            {derived.noise.map((value) => (
              <Chip
                key={value}
                label={value}
                active={!!noise[value]}
                onPress={() => onToggleNoise(value)}
                section="noise"
              />
            ))}
          </View>

          <AppText variant="label" style={styles.groupTitle}>
            Activity
          </AppText>
          <View style={styles.chipsWrap}>
            {derived.activity.map((value) => (
              <Chip
                key={value}
                label={value}
                active={!!activity[value]}
                onPress={() => onToggleActivity(value)}
                section="activity"
              />
            ))}
          </View>

          <AppText variant="label" style={styles.groupTitle}>
            Ages
          </AppText>
          <View style={styles.chipsWrap}>
            {derived.ages.map((age) => (
              <Chip
                key={age}
                label={age}
                active={!!ages[age]}
                onPress={() => onToggleAge(age)}
                section="ages"
              />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.modalFooter, { paddingBottom: 16 + bottomInset }]}>
          <Pressable style={styles.clearBtn} onPress={onClear}>
            <AppText variant="label" style={styles.clearBtnText}>
              Clear
            </AppText>
          </Pressable>

          <Pressable style={styles.applyBtn} onPress={onApply}>
            <AppText variant="label" style={styles.applyBtnText}>
              Apply
            </AppText>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.pageBackground,
    position: "relative",
  },
  modalTitleCenter: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.primaryTeal,
    borderRadius: 10,
  },
  backIcon: {
    marginRight: 4,
  },
  backBtnText: {
    color: Colors.white,
    fontWeight: "600",
  },
  modalTitle: {
    color: Colors.deepTeal,
    fontWeight: "700",
    fontSize: 18,
  },
  modalLogoWrap: {
    width: 58,
    alignItems: "flex-end",
  },
  modalContent: {
    padding: 16,
  },
  groupTitle: {
    color: Colors.deepTeal,
    fontWeight: "700",
    marginTop: 6,
    fontSize: Typography.size.lg,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.pageBackground,
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
