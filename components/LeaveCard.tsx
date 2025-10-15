// components/LeaveCard.tsx
import React from "react";
import { Pressable, Text, View } from "react-native";

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function LeaveCard({
  date,
  status,
  reason,
  onPress,
}: {
  date: string | Date;
  status: LeaveStatus;
  reason: string;
  onPress?: () => void;
}) {
  const d = typeof date === "string" ? new Date(date) : date;

  const weekday = d.toLocaleDateString("en-US", { weekday: "short" }); // Tue
  const dayNum = d.getDate(); // 28

  // status styles
  const s =
    status === "APPROVED"
      ? { bg: "#DCFCE7", text: "#16A34A", label: "Approved" }
      : status === "REJECTED"
      ? { bg: "#FEE2E2", text: "#DC2626", label: "Rejected" }
      : { bg: "#FEF9C3", text: "#CA8A04", label: "Pending" };

  const Card = onPress ? Pressable : View;
  const cardProps = onPress
    ? { onPress, android_ripple: { color: "#0000000f" } }
    : {};

  return (
    <View className="flex-row items-stretch w-full">
      {/* Date chip */}
      <View className="w-16 items-center">
        <View className=" px-2 py-3 items-center">
          <Text className="text-gray-500 font-medium text-sm">{weekday}</Text>
          <Text className="text-gray-900 text-2xl font-semibold mt-1">
            {dayNum}
          </Text>
        </View>
      </View>

      {/* Card */}
      <Card
        {...cardProps}
        className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 ml-3 shadow-sm"
      >
        {/* Status pill */}
        <View className="flex-row items-center mb-2">
          <View
            style={{ backgroundColor: s.bg }}
            className="px-2 py-1 rounded-full"
          >
            <Text style={{ color: s.text }} className="text-xs font-semibold">
              {s.label}
            </Text>
          </View>
        </View>

        {/* Reason */}
        <Text className="text-gray-700">
          <Text className="font-semibold text-gray-800">Reason: </Text>
          {reason}
        </Text>
      </Card>
    </View>
  );
}
