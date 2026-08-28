import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { BrandLogo } from "../components/BrandLogo";
import SmoothScreen from "../components/SmoothScreen";
import { Colors } from "../theme/colors";
import { Radius, Shadows, Spacing } from "../theme/layout";
import { Typography } from "../theme/typography";

const SUPPORT_EMAIL = "galanouconsulting@gmail.com";

const faqs = [
  {
    title: "How do I find a game?",
    body: "Tap Find Games for Me from the home screen, then choose the supplies, age range, activity level, noise level, or number of players that fit your moment.",
  },
  {
    title: "Can I search by instructions?",
    body: "Yes. The Browse search looks at game names, supplies, age ranges, and instruction text.",
  },
  {
    title: "Can I add my own games?",
    body: "Yes. Use the Add tab to save a family favorite. Custom games appear in Browse and can be edited or deleted later.",
  },
  {
    title: "Why did my custom games disappear?",
    body: "Custom games and favorites are saved with the app install. If the app is deleted, reset, or moved to a new device, those saved items may not be available.",
  },
];

function openSupportEmail() {
  const subject = encodeURIComponent("Family Play Support");
  Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}`);
}

export default function SupportScreen() {
  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <BrandLogo
              size={84}
              imageSize={84}
              shadow={false}
              containerStyle={styles.logo}
            />
            <AppText variant="heroTitle" style={styles.title}>
              Family Play Support
            </AppText>
            <AppText variant="subtitle" style={styles.subtitle}>
              Help for the screen-free family games app by Galanou Consulting.
            </AppText>

            <Pressable style={styles.primaryButton} onPress={openSupportEmail} hitSlop={8}>
              <Ionicons name="mail-outline" size={20} color={Colors.white} />
              <AppText variant="label" style={styles.primaryButtonText}>
                Email Support
              </AppText>
            </Pressable>
          </View>

          <View style={styles.card}>
            <AppText variant="label" style={styles.sectionTitle}>
              Common Questions
            </AppText>
            {faqs.map((item) => (
              <View key={item.title} style={styles.faqItem}>
                <AppText variant="subtitle" style={styles.faqTitle}>
                  {item.title}
                </AppText>
                <AppText variant="body" style={styles.faqBody}>
                  {item.body}
                </AppText>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <AppText variant="label" style={styles.sectionTitle}>
              Contact
            </AppText>
            <AppText variant="body" style={styles.body}>
              For bugs, questions, or feedback, contact:
            </AppText>
            <Pressable style={styles.emailRow} onPress={openSupportEmail} hitSlop={8}>
              <Ionicons name="mail-outline" size={18} color={Colors.deepTeal} />
              <AppText variant="label" style={styles.emailText}>
                {SUPPORT_EMAIL}
              </AppText>
            </Pressable>
          </View>

          <Pressable style={styles.secondaryButton} onPress={() => router.push("/(tabs)")}>
            <Ionicons name="home-outline" size={18} color={Colors.deepTeal} />
            <AppText variant="label" style={styles.secondaryButtonText}>
              Open Family Play
            </AppText>
          </Pressable>
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
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  hero: {
    alignItems: "center",
    backgroundColor: Colors.heroMint,
    borderWidth: 1,
    borderColor: Colors.subtleTealBorder,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.sm,
    ...Shadows.card,
  },
  logo: {
    padding: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  title: {
    fontSize: 34,
    color: Colors.deepTeal,
  },
  subtitle: {
    maxWidth: 460,
    textAlign: "center",
    color: Colors.text,
  },
  primaryButton: {
    marginTop: Spacing.sm,
    minHeight: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.actionOrange,
    borderWidth: 1,
    borderColor: Colors.actionOrangeBorder,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: Typography.size.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.size.xl,
    fontWeight: "700",
  },
  faqItem: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 4,
  },
  faqTitle: {
    color: Colors.deepTeal,
    fontWeight: "700",
  },
  faqBody: {
    color: Colors.text,
    lineHeight: 22,
  },
  body: {
    color: Colors.text,
    lineHeight: 22,
  },
  emailRow: {
    minHeight: 44,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  emailText: {
    color: Colors.deepTeal,
    fontSize: Typography.size.md,
  },
  secondaryButton: {
    minHeight: 48,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
  },
  secondaryButtonText: {
    color: Colors.deepTeal,
  },
});
