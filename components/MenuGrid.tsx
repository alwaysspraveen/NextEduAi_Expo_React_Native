import { Href, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type QAItem = {
  icon: React.ReactNode; // JSX element e.g. <CalenderIcon size={32} />
  label: string; // "Time Table"
  href?: string; // optional route to navigate
  onPress?: () => void; // optional handler (overrides href)
  count?: number; // optional badge
};

export default function QuickAccess({ items }: { items: QAItem[] }) {
  const router = useRouter();

  const handlePress = (item: QAItem) => {
    if (item.onPress) return item.onPress();
    if (item.href) router.push(item.href as Href);
  };

  return (
    <View className="flex-row flex-wrap justify-between">
      {items.map((item, i) => (
        <TouchableOpacity
          key={`${item.label}-${i}`}
          className="w-[48%] rounded-2xl dark:bg-background-dark bg-background mb-4 p-4 shadow items-center"
          activeOpacity={0.85}
          onPress={() => handlePress(item)}
        >
          {/* icon pill */}
          <View className="h-16 w-16 items-center justify-center dark:bg-surface-dark bg-surface rounded-full">
            {item.icon}
          </View>

          {/* label */}
          <Text className="mt-3 text-base font-semibold text-text dark:text-text-dark text-center">
            {item.label}
          </Text>

          {/* optional badge */}
          {typeof item.count === "number" && (
            <View className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-50">
              <Text className="text-xs font-semibold text-primary">
                {item.count}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}
