// components/ToggleSwitch.tsx
import { useColors } from "@/theme/useColors";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable } from "react-native";

type Props = {
  value: boolean; // ← only required prop
  onChange?: (next: boolean) => void; // optional
};

export default function ToggleSwitch({ value, onChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const c = useColors();
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // animating colors/width => false
    }).start();
  }, [value, anim]);

  // 64x32 track → travel = 32
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 32],
  });

  const trackBg = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [c.muted, c.primary], // off → on
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onChange?.(!value)}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ width: 48, height: 26 }}
    >
      <Animated.View
        style={{
          flex: 1,
          borderRadius: 16,
          backgroundColor: trackBg as any,
          padding: 4,
        }}
      >
        <Animated.View
          style={{
            width: 18,
            height: 18,
            borderRadius: 12,
            backgroundColor: "#FFFFFF",
            transform: [{ translateX }],
            // tiny shadow
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            elevation: 2,
          }}
        />
      </Animated.View>
    </Pressable>
  );
}
