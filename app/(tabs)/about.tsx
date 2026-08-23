import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../../components/AppText";
import { BrandLogo } from "../../components/BrandLogo";
import SmoothScreen from "../../components/SmoothScreen";
import { Colors } from "../../theme/colors";
import { Radius, Shadows, Spacing } from "../../theme/layout";
import { Typography } from "../../theme/typography";

const howSteps = [
  {
    title: "Browse for ideas",
    hint: "Tap “Find games for me” to filter by supplies, ages, or activity type.",
  },
  {
    title: "Pick a game",
    hint: "Tap to open a game card for step-by-step instructions, supplies, and game tips.",
  },
  {
    title: "Play together",
    hint: "Try each game and star your favorites so you can always find them again.",
  },
];

export default function AboutScreen() {
  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <BrandLogo
            size={96}
            imageSize={96}
            shadow={false}
            containerStyle={styles.logo}
          />
          <AppText variant="title" style={styles.title}>
            About Family Play
          </AppText>
          <AppText variant="subtitle" style={styles.subtitle}>
            Family Play was created for busy families who want accessible, screen-free ways to
            connect. Every game here can start in your living room, using whatever supplies you
            already have. From paper to pillows to balloons, get creative and stay playful.
          </AppText>
          <AppText variant="subtitle" style={styles.subtitle}>
            When you activate your imagination, magic happens. Keep the magic growing. Star your
            favorite games or design your own.
          </AppText>
        </View>

        <View style={styles.howCard}>
          <AppText variant="label" style={styles.cardTitle}>
            How it works
          </AppText>
          {howSteps.map((step, idx) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepBadge}>
                <AppText variant="label" style={styles.stepNumber}>
                  {idx + 1}
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="subtitle" style={styles.stepTitle}>
                  {step.title}
                </AppText>
                <AppText variant="hint" style={styles.stepHint}>
                  {step.hint}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        </ScrollView>
      </SafeAreaView>
    </SmoothScreen>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.pageBackground },
  container: { flex: 1, backgroundColor: Colors.pageBackground },
  content: { padding: Spacing.lg, gap: Spacing.md },
  heroCard: {
    backgroundColor: Colors.softTealTint,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.primaryTeal,
    ...Shadows.card,
  },
  logo: {
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  title: { textAlign: "center" },
  subtitle: { textAlign: "center", color: Colors.text },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  cardTitle: {
    marginBottom: 6,
    fontSize: Typography.size.xl,
    fontWeight: "700",
  },
  body: { color: Colors.text },
  howCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.softTealTint,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepNumber: { color: Colors.deepTeal },
  stepTitle: { color: Colors.deepTeal, fontWeight: "700" },
  stepHint: { color: Colors.mutedText, lineHeight: 18 },
});
