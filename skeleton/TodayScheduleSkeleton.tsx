import { ScrollView, View } from "react-native";
import Skeleton from "./Skeleton";

export default function TodayScheduleSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-4 mb-5 shadow">
      {/* Header skeleton */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <Skeleton height={22} width={22} rounded={`rounded-full`} />
          <Skeleton height={20} width={140} />
        </View>
        <Skeleton height={16} width={60} />
      </View>

      {/* Horizontal scroll skeleton */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingRight: 8 }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-3"
            style={{ width: 190 }}
          >
            {/* Subject + time pill */}
            <View className="flex-row justify-between items-center mb-2">
              <Skeleton height={16} width={110} />
              <Skeleton height={14} width={50} rounded={`rounded-lg`} />
            </View>
            {/* Subtitle */}
            <Skeleton height={14} width={80} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
