import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export type TodayScheduleItem = {
  id: string;
  subject: string;
  time?: string; // "10:25PM"
  period?: string; // fallback if time not present
  classLabel: string; // "1st Std - A"
};

export default function TodaySchedule({
  title,
  items,
  onViewAll,
  onPressItem,
}: {
  title: string;
  items: TodayScheduleItem[];
  onViewAll?: () => void;
  onPressItem?: (item: TodayScheduleItem) => void;
}) {
  const c = useColors();
  return (
    <View className="dark:bg-background-dark bg-background rounded-2xl p-4 mb-5 shadow">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={22} color={c.primary} />
          <Text className="ml-2 text-primary dark:text-text-dark font-semibold text-lg">
            {title}
          </Text>
        </View>
        <Pressable onPress={() => router.replace("/timetable")}>
          <Text className="text-orange-400 font-semibold text-sm">
            View All
          </Text>
        </Pressable>
      </View>

      {items.length === 0 ? (
        // Empty state: full width, centered
        <View className="flex-1 items-center justify-center py-6">
          <LottieView
            source={require("../assets/no_data.json")}
            autoPlay
            loop
            style={{ width: "100%", height: 100 }}
            resizeMode="contain"
          />
          <Text className="text-gray-400 mt-2 font-medium">
            No classes scheduled today
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 8 }}
        >
          <View className="flex-row gap-4">
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => router.replace("/timetable")}
                className="bg-background dark:bg-background-dark rounded-xl border dark:border-gray-800 border-gray-200 p-3 mr-1"
                android_ripple={{ color: "#eee" }}
                // fixed width for nice carousel feel; tweak as you like
                style={{ width: 190 }}
              >
                {/* Title + time pill */}
                <View className="flex-row items-center gap-2 p-1 justify-between">
                  <Text
                    className="text-gray-800 dark:text-text-dark font-bold"
                    style={{ fontSize: RFValue(14) }}
                    numberOfLines={1}
                  >
                    {item.subject}
                  </Text>
                  {item.time || item.period ? (
                    <View className="bg-green-500 px-2 py-0.5 rounded-full">
                      <Text
                        className="text-text-dark text-sm font-semibold"
                        style={{ fontSize: RFValue(10) }}
                      >
                        {item.time ?? item.period}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Subtitle */}
                <Text
                  className="text-gray-500 mt-1"
                  style={{ fontSize: RFValue(12) }}
                  numberOfLines={1}
                >
                  {item.classLabel}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
