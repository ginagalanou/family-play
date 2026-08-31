import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius, Spacing } from "../../theme/layout";
import { Typography } from "../../theme/typography";

type TabIconProps = {
  focused: boolean;
  activeName: keyof typeof Ionicons.glyphMap;
  inactiveName: keyof typeof Ionicons.glyphMap;
};

function TabIcon({ focused, activeName, inactiveName }: TabIconProps) {
  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Ionicons
        name={focused ? activeName : inactiveName}
        size={20}
        color={focused ? Colors.deepTeal : Colors.mutedText}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: Colors.pageBackground,
        },

        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.overlayTealBorder,
          justifyContent: "space-between",
          paddingHorizontal: Spacing.md,
          paddingTop: 8,
          shadowColor: Colors.shadow,
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.bold,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarActiveTintColor: Colors.deepTeal,
        tabBarInactiveTintColor: Colors.mutedText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} activeName="home" inactiveName="home-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="browse"
        options={{
          title: "Browse",
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} activeName="albums" inactiveName="albums-outline" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="add-circle"
              inactiveName="add-circle-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              activeName="information-circle"
              inactiveName="information-circle-outline"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="game/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    minWidth: 46,
    height: 30,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  iconPillActive: {
    backgroundColor: Colors.heroMint,
    borderWidth: 1,
    borderColor: Colors.subtleTealBorder,
  },
});
