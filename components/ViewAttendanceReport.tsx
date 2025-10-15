// components/AttendanceStatCard.tsx
import React from "react";
import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  name: string;          // "Arjun S"
  rollNo: string | number; // "01"
  percent: number;       // 90
  total: number;         // 9
  present: number;       // 5
  absent: number;        // 2
  leave: number;         // 2
};

const StatChip = ({
  value,
  label,
  bg,
  border,
  text,
}: {
  value: number | string;
  label: string;
  bg: string;
  border: string;
  text: string;
}) => (
  <View className={`flex-1 items-center rounded-xl px-3 py-2 border ${border}`} style={{ backgroundColor: bg }}>
    <Text className={`font-bold ${text}`} style={{ fontSize: RFValue(14) }}>
      {value}
    </Text>
    <Text className="mt-0.5 text-sm text-[#6B7280]">{label}</Text>
  </View>
);

export default function ViewAttendanceReport({
  name,
  rollNo,
  percent,
  total,
  present,
  absent,
  leave,
}: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Top row */}
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-gray-900" style={{ fontSize: RFValue(14) }}>
          {name} <Text className="text-gray-600">- RN : {String(rollNo).padStart(2, "0")}</Text>
        </Text>

        <View className="px-2.5 py-1 rounded-full items-center justify-center"
          style={{ backgroundColor: "#16A34A" /* green */ }}>
          <Text className="text-white font-semibold" style={{ fontSize: RFValue(12) }}>
            {pct}%
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-gray-200 my-3" />

      {/* Stat chips */}
      <View className="flex-row gap-2">
        <StatChip
          value={total}
          label="Total"
          bg="#F3F4F6"                 // gray-100
          border="border-gray-200"
          text="text-gray-700"
        />
        <StatChip
          value={present}
          label="Present"
          bg="#EAF9F0"                 // light green
          border="border-[#D6F2E0]"
          text="text-[#16A34A]"
        />
        <StatChip
          value={absent}
          label="Absent"
          bg="#FDECEE"                 // light red
          border="border-[#F9D7DC]"
          text="text-[#EF4444]"
        />
        <StatChip
          value={leave}
          label="Leave"
          bg="#FFF6E5"                 // light amber
          border="border-[#FFE7BF]"
          text="text-[#F59E0B]"
        />
      </View>
    </View>
  );
}
