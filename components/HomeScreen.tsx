import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "./AppText";
import SmoothScreen from "./SmoothScreen";
import { Colors } from "../theme/colors";
import { Radius, Shadows, Spacing } from "../theme/layout";
import { Typography } from "../theme/typography";

export function HomeScreen() {
  const { height, width } = useWindowDimensions();
  const compact = height < 740;
  const narrow = width < 360;
  const capHeight = compact ? 68 : 92;
  const logoSize = compact ? 78 : 96;
  const capCurveDepth = compact ? 18 : 26;
  const capCurveRadius =
    (Math.pow(width / 2, 2) + Math.pow(capCurveDepth, 2)) / (2 * capCurveDepth);
  const capCurveSize = capCurveRadius * 2;
  const imageScale = narrow ? 0.6 : compact ? 0.54 : 0.68;
  const imageSize = Math.min(width * imageScale, compact ? 204 : 286);

  return (
    <SmoothScreen style={styles.screen}>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.content}>
          <View style={[styles.brandBand, { height: capHeight }]}>
            <View
              style={[
                styles.capCurve,
                {
                  width: capCurveSize,
                  height: capCurveSize,
                  borderRadius: capCurveRadius,
                  left: (width - capCurveSize) / 2,
                  top: capHeight + capCurveDepth - capCurveSize,
                },
              ]}
            />
            <View style={[styles.logoStack, { width: logoSize, height: logoSize }]}>
              <Image
                source={require("../assets/images/Parent-Child-Play-Logo.png")}
                style={styles.logoMark}
                resizeMode="contain"
              />
              <Image
                source={require("../assets/images/Parent-Child-Play-Logo.png")}
                style={[styles.logoMark, styles.logoMarkWeight]}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={[styles.heroBand, compact && styles.heroBandCompact]}>
            <View style={styles.heroContent}>
              <AppText
                variant="heroTitle"
                style={[styles.title, compact && styles.titleCompact]}
              >
                Family Play
              </AppText>

              <View style={styles.copyBlock}>
                <AppText
                  variant="tagline"
                  style={[styles.tagline, compact && styles.taglineCompact]}
                >
                  Screen-free games for your family using supplies you have at home.
                </AppText>
              </View>

              <Image
                source={require("../assets/images/family-game-intro-current.png")}
                style={[styles.familyImage, { width: imageSize, height: imageSize }]}
                resizeMode="contain"
              />

              <View style={styles.actionStack}>
                <Pressable
                  style={[styles.btn, styles.btnPrimary]}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/browse",
                      params: { filterSession: String(Date.now()) },
                    })
                  }
                >
                  <View style={styles.btnContent}>
                    <AppText variant="label" style={styles.btnPrimaryText}>
                      Find Games for Me
                    </AppText>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={26}
                      color={Colors.white}
                      style={styles.btnArrow}
                    />
                  </View>
                </Pressable>

              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SmoothScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.brandTeal,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.brandTeal,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.heroMint,
  },
  brandBand: {
    backgroundColor: Colors.brandTeal,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
    zIndex: 2,
  },
  capCurve: {
    position: "absolute",
    backgroundColor: Colors.brandTeal,
  },
  logoStack: {
    zIndex: 3,
  },
  logoMark: {
    width: "100%",
    height: "100%",
    tintColor: Colors.white,
  },
  logoMarkWeight: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.72,
    transform: [{ translateX: 0.8 }, { translateY: 0.8 }],
  },
  heroBand: {
    flex: 1,
    backgroundColor: Colors.heroMint,
    paddingHorizontal: Spacing.xl,
    paddingTop: 58,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: "center",
  },
  heroBandCompact: {
    paddingTop: 46,
    paddingBottom: Spacing.sm,
  },
  heroContent: {
    width: "100%",
    maxWidth: 520,
    alignItems: "center",
    gap: Spacing.sm,
  },
  copyBlock: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: Spacing.xs,
  },
  title: {
    width: "100%",
    textAlign: "center",
    color: Colors.deepTeal,
    fontSize: 40,
    lineHeight: 46,
    marginBottom: 0,
  },
  titleCompact: {
    fontSize: 34,
    lineHeight: 38,
  },
  tagline: {
    width: "100%",
    maxWidth: 360,
    textAlign: "center",
    fontStyle: "normal",
    fontSize: Typography.size.lg,
    lineHeight: 24,
    color: Colors.text,
    fontWeight: "400",
  },
  taglineCompact: {
    fontSize: Typography.size.md,
    lineHeight: 21,
  },
  familyImage: {
    flexShrink: 0,
    alignSelf: "center",
  },
  actionStack: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  btn: {
    width: "100%",
    minHeight: 64,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  btnPrimary: {
    backgroundColor: Colors.actionOrange,
    borderWidth: 1,
    borderColor: Colors.actionOrangeBorder,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 18,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnArrow: {
    marginLeft: Spacing.md,
    marginTop: 1,
  },
});
