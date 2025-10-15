import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    LayoutAnimation,
    Platform,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

// ✅ Enable animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Assignment = {
  id: string;
  title: string;
  instructions?: string;
  assignedDate?: string;
  dueDate: string;
  status: "PENDING" | "SUBMITTED" | "DUE";
};

export default function AssignmentCard({ item }: { item: Assignment }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View className="bg-white rounded-2xl border border-gray-200 mb-4 shadow-sm overflow-hidden">
      {/* Top Row */}
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text className="font-semibold text-gray-900 flex-1">{item.title}</Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>

      {/* Collapsible Content */}
      {expanded && (
        <View className="px-4 pb-4">
          {/* Instructions */}
          {item.instructions && (
            <Text className="text-gray-600 mb-2">
              <Text className="font-semibold">Instruction:</Text>{" "}
              {item.instructions}
            </Text>
          )}

          {/* Dates */}
          {item.assignedDate && (
            <View className="flex-row items-center mb-1">
              <Ionicons
                name="calendar-outline"
                size={14}
                color="#2563EB"
                style={{ marginRight: 4 }}
              />
              <Text className="text-gray-700 text-sm">
                Assigned: {item.assignedDate}
              </Text>
            </View>
          )}

          <View className="flex-row items-center mb-2">
            <Ionicons
              name="calendar-outline"
              size={14}
              color="#2563EB"
              style={{ marginRight: 4 }}
            />
            <Text className="text-gray-700 text-sm">
              Submission: {item.dueDate}
            </Text>
          </View>

          {/* Status / Action */}
          {item.status === "PENDING" && (
            <TouchableOpacity className="bg-blue-600 rounded-xl py-2 px-4 items-center">
              <Text className="text-white font-semibold">Submit</Text>
            </TouchableOpacity>
          )}
          {item.status === "DUE" && (
            <View className="bg-red-100 rounded-full px-3 py-1 self-start">
              <Text className="text-red-600 font-semibold text-xs">Due</Text>
            </View>
          )}
          {item.status === "SUBMITTED" && (
            <View className="bg-green-100 rounded-full px-3 py-1 self-start">
              <Text className="text-green-600 font-semibold text-xs">
                Submitted
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
