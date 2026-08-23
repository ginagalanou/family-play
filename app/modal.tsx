import { Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../components/AppText";
import { Colors } from "../theme/colors";

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.content}>
        <AppText variant="title" style={styles.title}>
          This is a modal
        </AppText>
        <Link href="/" dismissTo asChild>
          <Pressable style={styles.button} hitSlop={8}>
            <AppText variant="label" style={styles.buttonText}>
              Go to home screen
            </AppText>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { color: Colors.deepTeal, marginBottom: 16 },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primaryTeal,
  },
  buttonText: { color: Colors.white },
});
