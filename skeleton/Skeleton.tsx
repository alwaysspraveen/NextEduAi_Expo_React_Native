import { View, ViewStyle } from "react-native";

type SkeletonProps = {
  height?: number;
  width?: number | string; // number (px) or percentage string
  rounded?: string; // Tailwind rounded class
};

export default function Skeleton({
  height = 20,
  width = "100%",
  rounded = "md",
}: SkeletonProps) {
  return (
    <View
      className={`bg-gray-200 dark:bg-gray-800 ${rounded}`}
      style={{ height, width } as ViewStyle}
    />
  );
}
