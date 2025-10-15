// components/NoticeBoardSkeleton.tsx
import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function NoticeBoardSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-4 mb-5 shadow">
      {/* Header skeleton */}
      <View className="flex-row justify-between items-center mb-3">
        <Skeleton height={20} width={120} />
        <Skeleton height={16} width={60} />
      </View>

      {/* List skeletons */}
      <View className="gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            className="bg-white border border-gray-200 rounded-2xl px-4 py-3 gap-2"
          >
            <Skeleton height={16} width="80%" />
            <Skeleton height={14} width="40%" />
          </View>
        ))}
      </View>
    </View>
  );
}
