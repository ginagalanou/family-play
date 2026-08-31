import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { BrandLogo } from "../../components/BrandLogo";
import SmoothScreen from "../../components/SmoothScreen";
import gamesData from "../../data/games.json";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";
import { Typography } from "../../theme/typography";
import { Game } from "../../types/game";
import { CustomGame, loadCustomGames } from "../../utils/customGames";
import { PresetKey } from "../../utils/presets";

const baseGames = gamesData as Game[];

const vibePresets: { key: PresetKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "noSupplies", label: "No supplies", icon: "cube-outline" },
  { key: "quiet", label: "Quiet", icon: "volume-mute-outline" },
  { key: "highEnergy", label: "High energy", icon: "flash-outline" },
  { key: "solo", label: "Single Player", icon: "person-outline" },
  { key: "group", label: "Group", icon: "people-circle-outline" },
  { key: "fiveMinute", label: "5-minute games", icon: "time-outline" },
];

const agePresets: { key: PresetKey; label: string }[] = [
  { key: "ageUnder2", label: "Under 2" },
  { key: "age2to4", label: "Ages 2–4" },
  { key: "age5to7", label: "Ages 5–7" },
  { key: "age8plus", label: "Ages 8+" },
];

export default function Explore() {
  const [customGames, setCustomGames] = useState<CustomGame[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadCustomGames().then((list) => {
        if (active) setCustomGames(list);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const allGames = useMemo<(Game | CustomGame)[]>(() => {
    return [...baseGames, ...customGames];
  }, [customGames]);

  const handlePreset = useCallback((key: PresetKey) => {
    router.push({ pathname: "/(tabs)/browse", params: { preset: key } });
  }, []);

  const handleSurprise = useCallback(() => {
    const random = allGames[Math.floor(Math.random() * allGames.length)];
    if (!random) return;
    router.push({ pathname: "/(tabs)/browse", params: { highlightId: random.id } });
  }, [allGames]);

  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headingRow}>
          <BrandLogo size={48} imageSize={32} borderRadius={14} />
          <AppText variant="title" style={styles.heading}>
            Explore
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText variant="label" style={styles.sectionTitle}>
            Browse by vibe
          </AppText>
          <View style={styles.grid}>
            {vibePresets.map((item) => (
              <Pressable
                key={item.key}
                style={styles.card}
                onPress={() => handlePreset(item.key)}
                hitSlop={8}
              >
                <View style={styles.iconBadge}>
                  <Ionicons name={item.icon} size={20} color={Colors.deepTeal} />
                </View>
                <AppText variant="subtitle" style={styles.cardLabel}>
                  {item.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="label" style={styles.sectionTitle}>
            Browse by age
          </AppText>
          <View style={styles.chipsWrap}>
            {agePresets.map((item) => (
              <Pressable
                key={item.key}
                style={styles.chip}
                onPress={() => handlePreset(item.key)}
                hitSlop={8}
              >
                <AppText variant="chip" style={styles.chipText}>
                  {item.label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText variant="label" style={styles.sectionTitle}>
            Surprise me
          </AppText>
          <Pressable style={styles.surprise} onPress={handleSurprise} hitSlop={10}>
            <View style={styles.surpriseIconWrap}>
              <Ionicons name="dice-outline" size={20} color={Colors.deepTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="label" style={styles.surpriseText}>
                Surprise me with a game
              </AppText>
              <AppText variant="hint" style={styles.surpriseHint}>
                We’ll open a random game in the list.
              </AppText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  </SmoothScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    rowGap: Spacing.lg,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  heading: {
    textAlign: "left",
    fontSize: 24,
    fontWeight: "700",
    color: Colors.deepTeal,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
    color: Colors.deepTeal,
    fontSize: Typography.size.xl,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  card: {
    width: "48%",
    backgroundColor: Colors.softTealTint,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  cardLabel: {
    color: Colors.deepTeal,
    fontWeight: "600",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.softTealTint,
    borderWidth: 1,
    borderColor: Colors.border,
    flexBasis: "48%",
    alignItems: "center",
  },
  chipText: {
    color: Colors.deepTeal,
    textAlign: "center",
  },
  surprise: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: Colors.warmAccent,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  surpriseIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  surpriseText: { color: Colors.text, marginBottom: 2 },
  surpriseHint: { color: Colors.mutedText },
});
