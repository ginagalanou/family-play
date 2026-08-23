import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { Colors } from "../theme/colors";
import { Typography } from "../theme/typography";

type Variant =
  | "heroTitle"
  | "tagline"
  | "title"
  | "subtitle"
  | "body"
  | "label"
  | "chip"
  | "hint";

export function AppText({
  variant = "body",
  style,
  ...props
}: TextProps & { variant?: Variant }) {
  return <Text {...props} style={[styles[variant], style]} />;
}

const styles = StyleSheet.create({
  heroTitle: {
    fontSize: Typography.size.xxl,
    fontWeight: Typography.weight.extrabold,
    color: Colors.deepTeal,
    fontFamily: Typography.fontFamily.extrabold,
    textAlign: "center",
  },
  tagline: {
    fontSize: Typography.size.xl,
    fontWeight: Typography.weight.bold,
    color: Colors.deepTeal,
    fontFamily: Typography.fontFamily.bold,
    textAlign: "center",
    lineHeight: Typography.lineHeight.relaxed,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: Typography.weight.bold,
    color: Colors.deepTeal,
    fontFamily: Typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.regular,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
    lineHeight: Typography.lineHeight.normal,
  },
  body: {
    fontSize: Typography.size.md,
    fontWeight: Typography.weight.regular,
    color: Colors.text,
    fontFamily: Typography.fontFamily.regular,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.semibold,
    color: Colors.deepTeal,
    fontFamily: Typography.fontFamily.semibold,
  },
  chip: {
    fontSize: Typography.size.xs,
    fontWeight: Typography.weight.semibold,
    color: Colors.deepTeal,
    fontFamily: Typography.fontFamily.semibold,
  },
  hint: {
    fontSize: Typography.size.sm,
    fontWeight: Typography.weight.regular,
    color: Colors.mutedText,
    fontFamily: Typography.fontFamily.regular,
    fontStyle: "italic",
  },
});
