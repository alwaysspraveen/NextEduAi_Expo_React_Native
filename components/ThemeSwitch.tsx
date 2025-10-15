// components/ThemeToggle.tsx
import { useThemeCtx } from "@/theme/ThemeProvider";
import { useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

export default function ThemeSwitch() {
  const { theme, toggle } = useThemeCtx();
  const anim = useRef(new Animated.Value(theme === "light" ? 0 : 1)).current;

  // animate when theme changes
  Animated.timing(anim, {
    toValue: theme === "light" ? 0 : 1,
    duration: 250,
    useNativeDriver: false,
  }).start();

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28], // knob travel distance
  });

  return (
    <View className="flex-row items-center gap-3">
      <Text
        className={`font-semibold ${
          theme === "light" ? "text-text" : "dark:text-text-dark"
        }`}
      >
        Light
      </Text>

      <Pressable
        onPress={toggle}
        className="w-16 h-8 rounded-full bg-primary relative flex-row items-center px-1"
      >
        <Animated.View
          style={{ transform: [{ translateX }] }}
          className="w-6 h-6 rounded-full bg-white shadow"
        />
      </Pressable>

      <Text
        className={`font-semibold ${
          theme === "dark" ? "text-text-dark" : "text-text"
        }`}
      >
        Dark
      </Text>
    </View>
  );
}
