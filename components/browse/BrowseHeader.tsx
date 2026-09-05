import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { AppText } from "../AppText";
import { BrandLogo } from "../BrandLogo";
import { Colors } from "../../theme/colors";
import { Radius, Spacing } from "../../theme/layout";

type BrowseHeaderProps = {
  query: string;
  collectionMode: "all" | "saved" | "created";
  totalSelectedFilters: number;
  onBackToAllGames: () => void;
  onOpenSaved: () => void;
  onOpenCreated: () => void;
  onOpenFilters: () => void;
  onChangeQuery: (value: string) => void;
};

export function BrowseHeader({
  query,
  collectionMode,
  totalSelectedFilters,
  onBackToAllGames,
  onOpenSaved,
  onOpenCreated,
  onOpenFilters,
  onChangeQuery,
}: BrowseHeaderProps) {
  const inCollection = collectionMode !== "all";
  const collectionTitle =
    collectionMode === "created" ? "Your Created Games" : "Saved games";
  const collectionIcon = collectionMode === "created" ? "create-outline" : "star";

  return (
    <View style={styles.stickyHeader}>
      {inCollection ? (
        <View style={styles.savedTopBar}>
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

          <View style={styles.savedTitle}>
            <Ionicons
              name={collectionIcon}
              size={18}
              color={Colors.deepTeal}
              style={styles.favoriteIcon}
            />
            <AppText variant="title" style={styles.savedHeader}>
              {collectionTitle}
            </AppText>
          </View>
        </View>
      ) : (
        <View style={styles.topBar}>
          <View style={styles.headerLeft}>
            <BrandLogo size={48} imageSize={32} borderRadius={14} />
            <AppText variant="title" style={styles.header}>
              Find a Game
            </AppText>
          </View>

          <View style={styles.collectionActions}>
            <Pressable style={styles.favToggle} onPress={onOpenSaved} hitSlop={10}>
              <Ionicons
                name="star-outline"
                size={18}
                color={Colors.deepTeal}
                style={styles.favoriteIcon}
              />
              <AppText variant="label" style={styles.favToggleText}>
                Saved
              </AppText>
            </Pressable>

            <Pressable style={styles.favToggle} onPress={onOpenCreated} hitSlop={10}>
              <Ionicons
                name="create-outline"
                size={18}
                color={Colors.deepTeal}
                style={styles.favoriteIcon}
              />
              <AppText variant="label" style={styles.favToggleText}>
                Created Games
              </AppText>
            </Pressable>
          </View>
        </View>
      )}

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
    flexWrap: "wrap",
    backgroundColor: Colors.pageBackground,
    paddingBottom: Spacing.xs / 2,
    gap: Spacing.xs,
  },
  savedTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.pageBackground,
    paddingBottom: Spacing.xs / 2,
    gap: Spacing.sm,
  },
  backBtnSmall: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
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
    flexShrink: 1,
  },
  collectionActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: Spacing.xs,
    flexShrink: 1,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.deepTeal,
    flexShrink: 1,
  },
  savedTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flexShrink: 1,
  },
  savedHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.deepTeal,
    flexShrink: 1,
  },
  favToggle: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
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
    flexShrink: 1,
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
