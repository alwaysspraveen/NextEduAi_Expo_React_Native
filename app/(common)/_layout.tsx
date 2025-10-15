import { useThemeCtx } from "@/theme/ThemeProvider";
import { useColors } from "@/theme/useColors";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Layout() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { theme, colors } = useThemeCtx();

  return (
    <View className="flex-1" style={{ backgroundColor: c.surface }}>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        translucent={false} // 👈 disables overlay, uses backgroundColor directly
        backgroundColor={c.background}
      />

      {Platform.OS === "android" && (
        <View style={{ height: insets.top, backgroundColor: c.surface }} /> // 👈 match primary, not surface
      )}

      {/* SafeArea also primary */}
      <SafeAreaView
        className="flex-1 bg-background dark:bg-background-dark"
        style={{ backgroundColor: c.surface }}
        edges={["bottom", "left", "right"]}
      >
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </SafeAreaView>
    </View>
  );
}
