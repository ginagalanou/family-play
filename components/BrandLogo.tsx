import React from "react";
import { Image, StyleSheet, View } from "react-native";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";
import { Radius, Shadows } from "../theme/layout";

type BrandLogoProps = {
  size?: number;
  imageSize?: number;
  borderRadius?: number;
  tintColor?: string;
  shadow?: "card" | "pop" | false;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
};

export function BrandLogo({
  size = 48,
  imageSize = 32,
  borderRadius = Radius.md,
  tintColor = Colors.deepTeal,
  shadow = "card",
  containerStyle,
  imageStyle,
}: BrandLogoProps) {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
        },
        shadow ? Shadows[shadow] : null,
        containerStyle,
      ]}
    >
      <Image
        source={require("../assets/images/Parent-Child-Play-Logo.png")}
        style={[
          {
            width: imageSize,
            height: imageSize,
            tintColor,
          },
          imageStyle,
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
