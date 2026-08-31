import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "../AppText";
import { BrandLogo } from "../BrandLogo";
import { Colors } from "../../theme/colors";
import { Radius, Spacing } from "../../theme/layout";

type BrowseHeaderProps = {
  query: string;
  showOnlyFavorites: boolean;
  totalSelectedFilters: number;
  onBackToAllGames: () => void;
  onToggleFavorites: () => void;
  onOpenFilters: () => void;
  onChangeQuery: (value: string) => void;
};

export function BrowseHeader({
  query,
  showOnlyFavorites,
  totalSelectedFilters,
  onBackToAllGames,
  onToggleFavorites,
  onOpenFilters,
  onChangeQuery,
}: BrowseHeaderProps) {
  return (
    <View style={styles.stickyHeader}>
      <View style={styles.topBar}>
        {showOnlyFavorites ? (
          <Pressable onPress={onBackToAllGames} style={styles.backBtnSmall}>
            <Ionicons
              name="chevron-back-outline"
              size={20}
              color={Colors.deepTeal}
              style={styles.backIcon}
            />
            <AppText variant="label" style={styles.backBtnText}>
              All games
            </AppText>
          </Pressable>
        ) : null}
        <View style={styles.headerLeft}>
          <BrandLogo size={48} imageSize={32} borderRadius={14} />
          <AppText variant="title" style={styles.header}>
            Find a Game
          </AppText>
        </View>

        <Pressable style={styles.favToggle} onPress={onToggleFavorites} hitSlop={10}>
          <Ionicons
            name={showOnlyFavorites ? "star" : "star-outline"}
            size={18}
            color={Colors.deepTeal}
            style={styles.favoriteIcon}
          />
          <AppText variant="label" style={styles.favToggleText}>
            Saved
          </AppText>
        </Pressable>
      </View>

      <View style={styles.actionsRow}>
        <Pressable style={styles.filterBtn} onPress={onOpenFilters}>
          <AppText variant="label" style={styles.filterBtnText}>
            Filters
            {totalSelectedFilters > 0 ? ` (${totalSelectedFilters})` : ""}
          </AppText>
        </Pressable>

        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Search games or instructions"
          style={styles.search}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          placeholderTextColor={Colors.mutedText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    backgroundColor: Colors.pageBackground,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs / 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.pageBackground,
    paddingBottom: Spacing.xs / 2,
  },
  backBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  backIcon: {
    marginRight: 4,
  },
  backBtnText: {
    color: Colors.deepTeal,
    fontWeight: "600",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.deepTeal,
  },
  favToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: Colors.softTealTint,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoriteIcon: {
    marginRight: 6,
  },
  favToggleText: {
    color: Colors.deepTeal,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Spacing.sm,
  },
  filterBtn: {
    backgroundColor: Colors.primaryTeal,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm - 2,
    borderRadius: Radius.md,
    marginRight: Spacing.xs,
  },
  filterBtnText: {
    color: Colors.white,
    fontWeight: "600",
  },
  search: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm - 2,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
  },
});
