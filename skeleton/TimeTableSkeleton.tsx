import { View } from "react-native";
import Skeleton from "./Skeleton";

export default function TimetableSkeleton() {
  return (
    <View className="flex-1">
      {/* List of period cards */}
      <View className="px-4">
        {[...Array(4)].map((_, i) => (
          <View
            key={i}
            className="bg-surface dark:bg-surface-dark 
                       border border-gray-300 dark:border-text-dark 
                       rounded-2xl p-4 mb-3"
          >
            {/* Title + subtitle */}
            <Skeleton height={14} width={120} rounded="rounded-full" />
            <Skeleton height={16} width="60%" />

            <View className="mt-2">
              <Skeleton height={14} width={120} rounded="rounded-full" />
              <Skeleton height={14} width="35%" />
            </View>

            {/* Time + status row */}
            <View className="mt-3 flex-row items-center">
              <Skeleton height={14} width={120} rounded="rounded-full" />
              <View className="ml-3">
                <Skeleton height={20} width={70} rounded="rounded-full" />
              </View>
            </View>

            {/* Duration pill */}
            <View className="mt-3 w-20">
              <Skeleton height={14} width="100%" rounded="rounded-full" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
