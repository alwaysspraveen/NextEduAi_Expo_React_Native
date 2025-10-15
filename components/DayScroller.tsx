import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  days?: string[];
  initialIndex?: number;
  onChange?: (index: number, label: string, shortLabel: string) => void;
};

const DEFAULT_DAYS = [
  { full: "Monday", short: "Mon" },
  { full: "Tuesday", short: "Tue" },
  { full: "Wednesday", short: "Wed" },
  { full: "Thursday", short: "Thu" },
  { full: "Friday", short: "Fri" },
  { full: "Saturday", short: "Sat" },
  { full: "Sunday", short: "Sun" },
];

const PADDING_H = 16;

export default function DayScroller({
  days = DEFAULT_DAYS.map((d) => d.full),
  initialIndex,
  onChange,
}: Props) {
  const todayIndex = useMemo(() => (new Date().getDay() + 6) % 7, []);
  const [active, setActive] = useState(initialIndex ?? todayIndex);

  const select = (i: number) => {
    setActive(i);
    const full = DEFAULT_DAYS[i].full;
    const short = DEFAULT_DAYS[i].short;
    onChange?.(i, full, short); // 👈 send both
  };

  return (
    <View className="rounded-t-3xl py-4">
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DEFAULT_DAYS}
        keyExtractor={(d, i) => `${d.full}-${i}`}
        contentContainerStyle={{ paddingHorizontal: PADDING_H }}
        renderItem={({ item, index }) => {
          const isActive = index === active;
          return (
            <Pressable
              onPress={() => select(index)}
              style={{ marginRight: 12 }}
              className={`px-4 py-2 rounded-full ${
                isActive
                  ? "bg-secondary dark:bg-background-dark"
                  : "bg-background dark:bg-background-dark"
              }`}
            >
              <Text
                style={{ fontSize: RFValue(12) }}
                className={`text-lg font-semibold ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {item.full}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
