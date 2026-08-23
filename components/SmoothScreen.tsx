import { useIsFocused } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type SmoothScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FOCUS_ANIMATION_DURATION = 430;
const FOCUS_ENTER_DELAY = 60;
const FOCUS_SCALE_START = 0.985;
const FOCUS_TRANSLATE_START = 48;

export default function SmoothScreen({ children, style }: SmoothScreenProps) {
  const isFocused = useIsFocused();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(FOCUS_TRANSLATE_START);
  const scale = useSharedValue(FOCUS_SCALE_START);

  useEffect(() => {
    const timingConfig = {
      duration: isFocused ? FOCUS_ANIMATION_DURATION : FOCUS_ANIMATION_DURATION / 2,
      easing: Easing.out(Easing.cubic),
    };

    const enterTiming = (value: number) =>
      withDelay(FOCUS_ENTER_DELAY, withTiming(value, timingConfig));
    const exitTiming = (value: number) => withTiming(value, timingConfig);

    opacity.value = isFocused ? enterTiming(1) : exitTiming(0);
    translateY.value = isFocused
      ? enterTiming(0)
      : exitTiming(FOCUS_TRANSLATE_START);
    scale.value = isFocused ? enterTiming(1) : exitTiming(FOCUS_SCALE_START);
  }, [isFocused, opacity, translateY, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
