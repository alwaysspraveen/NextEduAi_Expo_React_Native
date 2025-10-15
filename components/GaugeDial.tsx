import React from "react";
import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

type Props = {
  value: number; // 0 - 100
  size?: number; // diameter in px
  stroke?: number; // ring thickness
  label?: string; // e.g. "Attendance"
};

const ringColor = (pct: number) => {
  if (pct >= 90) return "#16A34A"; // green-600
  if (pct >= 75) return "#3B82F6"; // blue-500
  if (pct >= 60) return "#F59E0B"; // amber-500
  if (pct >= 40) return "#FB923C"; // orange-400
  return "#EF4444"; // red-500
};

export default function AttendanceDial({
  value,
  size = 88,
  stroke = 8,
  label = "Attendance",
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (pct / 100) * circumference;
  const dashOffset = circumference - progress;
  const color = ringColor(pct);

  return (
    <View className="items-center" style={{ width: size }}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB" // gray-200
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
          />
          {/* progress */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={dashOffset}
            // start from top (rotate -90deg)
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* center text */}
        <View
          className="absolute items-center justify-center"
          style={{ inset: 0 }}
        >
          <View className="flex-row items-baseline">
            <Text
              className="font-semibold text-[#1F2937] dark:text-text-dark"
              style={{ fontSize: 20 }}
            >
              {pct}
            </Text>
            <Text
              className="text-[#6B7280] dark:text-gray-100"
              style={{ marginLeft: 1 }}
            >
              %
            </Text>
          </View>
        </View>
      </View>

      {!!label && (
        <Text className="mt-1 text-[#111827] dark:text-text-dark">{label}</Text>
      )}
    </View>
  );
}
