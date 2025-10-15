import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PdfIcon from "../assets/icons/pdf.svg";

type Props = {
  title: string; // e.g. "MATHS-CH-2025"
  teacherName: string; // e.g. "1st Std • A"
  fileName: string; // e.g. "01_Maths_Notes.pdf"
  dateTime: string; // e.g. "12:15 AM - 10 Sep 2025"
  onAskAI?: () => void; // button action
  onOpenFile?: () => void; // file pill action
};

export default function ContentCard({
  title,
  teacherName,
  fileName,
  dateTime,
  onAskAI,
  onOpenFile,
}: Props) {
  return (
    <View className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      {/* Top row: Icon + text + file pill */}
      <View className="flex-row items-center">
        {/* PDF Icon */}
        <PdfIcon width={32} height={32} />

        {/* Title + Teacher */}
        <View className="flex-1 ml-3">
          <Text
            className="font-semibold text-gray-900"
            style={{ fontSize: RFValue(14) }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            className="text-gray-500"
            style={{ fontSize: RFValue(12) }}
            numberOfLines={1}
          >
            {teacherName}
          </Text>
        </View>

        {/* File pill on right */}
        <TouchableOpacity
          onPress={onOpenFile}
          className="bg-green-100 rounded-full px-3 py-1 ml-auto"
        >
          <Text
            className="text-green-700 font-semibold"
            style={{ fontSize: RFValue(11) }}
            numberOfLines={1}
          >
            {fileName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom row: Date + Ask AI */}
      <View className="mt-3 flex-row items-center justify-between">
        {/* Date */}
        <View className="flex-row items-center">
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#2563EB"
            style={{ marginRight: 4 }}
          />
          <Text
            className="text-blue-600"
            style={{ fontSize: RFValue(12) }}
            numberOfLines={1}
          >
            {dateTime}
          </Text>
        </View>

        {/* Ask AI button */}
        {onAskAI && (
          <TouchableOpacity
            onPress={onAskAI}
            className="rounded-lg overflow-hidden"
          >
            <LinearGradient
              colors={["#6060EF", "#011056"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }} // left → right gradient
              style={{
                paddingVertical: 6,
                paddingHorizontal: 14,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <Ionicons
                name="sparkles"
                size={14}
                color="white"
                style={{ marginRight: 4 }}
              />
              <Text className="text-white font-semibold">Ask AI</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
