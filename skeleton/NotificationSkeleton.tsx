import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function NotificationSkeleton() {
  return (
    <View className="bg-white rounded-2xl p-2 mb-5 shadow">
      {/* List skeletons */}
      <View className="gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            className="flex-row items-start gap-3 p-3 border-b border-gray-200 bg-white rounded-xl"
          >
            {/* Icon circle */}
            <View className="h-12 w-12 rounded-full overflow-hidden">
              <Skeleton height={48} width={48} />
            </View>

            {/* Texts */}
            <View className="flex-1 gap-2">
              <Skeleton height={16} width="70%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={12} width="40%" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
