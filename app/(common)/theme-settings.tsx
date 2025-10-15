// app/(common)/theme-settings.tsx
import Card from "@/components/Card";
import TopHeader from "@/components/TopHeader";
import { useThemeCtx } from "@/theme/ThemeProvider";
import { useColors } from "@/theme/useColors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ModeKey = "light" | "dark" | "system";

export default function ThemeSettings() {
  const { mode, setMode } = useThemeCtx(); // "system" | "light" | "dark"
  const c = useColors();

  const options: { key: ModeKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "light",
      label: "Light",
      icon: <Ionicons name="sunny-outline" size={28} color={c.muted} />,
    },
    {
      key: "dark",
      label: "Dark",
      icon: <Ionicons name="moon-outline" size={28} color={c.muted} />,
    },
    {
      key: "system",
      label: "System Default",
      icon: (
        <MaterialCommunityIcons
          name="theme-light-dark"
          size={28}
          color={c.muted}
        />
      ),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <TopHeader
        title="Theme"
        onBack={() => router.canGoBack() && router.back()}
      />

      <View style={{ padding: 16 }}>
        <Card style={{ backgroundColor: c.background, borderColor: c.border }}>
          {options.map((opt, index) => {
            const selected = mode === opt.key;
            return (
              <View key={opt.key}>
                <Pressable
                  android_ripple={{ color: c.border }}
                  onPress={() => setMode(opt.key)}
                  style={styles.row}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={opt.label}
                >
                  {/* LEFT (icon + label) — same style as Settings.Row */}
                  <View style={styles.left}>
                    <View style={{ marginRight: 16 }}>{opt.icon}</View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ flex: 1, fontSize: 16, color: c.text }}
                    >
                      {opt.label}
                    </Text>
                  </View>

                  {/* RIGHT (radio indicator instead of chevron) */}
                  <View
                    style={[
                      styles.radioOuter,
                      { borderColor: selected ? c.primary : c.muted },
                    ]}
                  >
                    {selected ? (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: c.primary },
                        ]}
                      />
                    ) : null}
                  </View>
                </Pressable>

                {/* Divider between rows */}
                {index < options.length - 1 ? (
                  <View
                    style={{
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: c.border,
                      marginLeft:
                        28 /* icon */ +
                        16 /* gap */ +
                        0 /* padding inside Card row already handled */,
                    }}
                  />
                ) : null}
              </View>
            );
          })}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16, // matches your Settings row
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
