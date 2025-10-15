import { NotesIcon } from "@/assets/icons/icon";
import { Pressable, Text, View } from "react-native";

export type NoticeItem = {
  id: string;
  title: string; // e.g. "School will remain closed on Friday"
  subtitle?: string; // optional short body text
  time?: string; // e.g. "25 Sep 2025" or "10:30 AM"
  period?: string; // optional fallback
  classLabel?: string; // e.g. "1st Std - A"
};

export default function NoticeBoard({
  items,
  onViewAll,
  onPressItem,
}: {
  items: NoticeItem[];
  onViewAll?: () => void;
  onPressItem?: (item: NoticeItem) => void;
}) {
  return (
    <View className="bg-background dark:bg-background-dark rounded-2xl p-4 mb-5 shadow">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <NotesIcon size={28} />
          <Text className="ml-2 text-text dark:text-text-dark font-semibold text-lg">
            Notice Board
          </Text>
        </View>

        {onViewAll && (
          <Pressable onPress={onViewAll}>
            <Text className="text-orange-400 font-semibold text-sm">
              View All
            </Text>
          </Pressable>
        )}
      </View>

      {/* Notice list */}
      <View className="gap-3">
        {items.length === 0 ? (
          <View className="bg-background dark:bg-background-dark border border-surface-dark dark:border-surface rounded-2xl px-4 py-3">
            <Text className="text-gray-500 text-base">
              No notices right now 🎉
            </Text>
          </View>
        ) : (
          items.map((item) => {
            // Choose subtitle in priority order:
            // time > period > sub_body > classLabel
            const subtitle = item.subtitle;
            const time = item.time;

            return (
              <Pressable
                key={item.id}
                onPress={() => onPressItem?.(item)}
                className="bg-background dark:bg-background-dark border border-surface dark:border-surface-dark rounded-2xl px-4 py-3"
                android_ripple={{ color: "#eee" }}
              >
                {/* Title */}
                <Text
                  className="text-text dark:text-text-dark font-semibold text-lg"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>

                {/* Subtitle */}
                {!!subtitle && (
                  <Text
                    className="text-gray-500 text-base mt-1"
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Text>
                )}
                {!!time && (
                  <Text
                    className="text-gray-500 text-base mt-1"
                    numberOfLines={1}
                  >
                    {time}
                  </Text>
                )}
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}
