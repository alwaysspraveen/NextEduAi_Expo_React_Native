import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  title: string; // "Mathematics"
  time: string; // "10:30 – 11:30 AM"
  subtitle?: string; // "1 st • Room No : 102"
  status?: "Live" | string; // when truthy, shows green pill with text
  duration?: string; // "60 Min"
};
// inside ScheduleCard.tsx
const normalizeStatus = (s?: string) => {
  if (!s) return undefined;
  const x = s.toLowerCase();
  if (x.startsWith("substit")) return "Substituted";
  if (x.startsWith("cancel")) return "Cancelled";
  if (x.startsWith("live")) return "Live";
  if (x.startsWith("upcoming")) return "Upcoming";
  if (x.startsWith("completed")) return "Completed";
  return s;
};

const getStatusStyle = (status?: string) => {
  const s = normalizeStatus(status);
  switch (s) {
    case "Live":
      return {
        bg: "#10B98122",
        dot: "#10B981",
        text: "#059669",
        label: "Live",
      }; // green
    case "Completed":
      return {
        bg: "#10B98122",
        dot: "#10B981",
        text: "#059669",
        label: "Completed",
      }; // green
    case "Upcoming":
      return {
        bg: "#F59E0B22",
        dot: "#F59E0B",
        text: "#B45309",
        label: "Upcoming",
      }; // amber
    case "Substituted":
      return {
        bg: "#6366F122",
        dot: "#6366F1",
        text: "#4F46E5",
        label: "Substituted",
      }; // indigo

    case "Cancelled":
      return {
        bg: "#EF444422",
        dot: "#EF4444",
        text: "#B91C1C",
        label: "Cancelled",
      }; // red
    default:
      return undefined;
  }
};

export default function ScheduleCard({
  title,
  time,
  subtitle,
  status,
  duration,
}: Props) {
  return (
    <View className="bg-background dark:bg-background-dark rounded-2xl border border-gray-200 dark:border-gray-600 p-4 shadow-sm">
      {/* Top row: Title + Time */}
      <View className="flex-row items-start justify-between">
        <Text
          className="text-xl font-semibold text-gray-900 dark:text-text-dark"
          style={{ fontSize: RFValue(14) }}
        >
          {title}
        </Text>
        <Text
          className="text-base font-semibold text-primary"
          style={{ fontSize: RFValue(14) }}
        >
          {time}
        </Text>
      </View>

      {/* Bottom row: subtitle left, status+duration right */}
      <View className="mt-2 flex-row items-center justify-between">
        {/* subtitle */}
        {subtitle ? (
          <Text style={{ fontSize: RFValue(12) }} className="text-gray-500">
            {subtitle}
          </Text>
        ) : (
          <View />
        )}

        <View className="flex-row items-center">
          {/* Status pill (colored per status) */}
          {status
            ? (() => {
                const s = getStatusStyle(status);
                if (!s) return null;
                return (
                  <View
                    className="flex-row items-center justify-center rounded-full px-2 py-0.5 mr-2"
                    style={{ backgroundColor: s.bg }}
                  >
                    <View
                      className="w-2 h-2 rounded-full mr-1.5"
                      style={{ backgroundColor: s.dot }}
                    />
                    <Text
                      className="text-[12px] font-semibold"
                      style={{ color: s.text, fontSize: RFValue(10) }}
                    >
                      {s.label}
                    </Text>
                  </View>
                );
              })()
            : null}

          {/* Duration */}
          {duration !== undefined && duration !== null ? (
            <Text
              className="text-[13px] font-semibold text-gray-700 dark:text-text-dark"
              style={{ fontSize: RFValue(12) }}
            >
              {typeof duration === "number" ? `${duration} Min` : duration}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
