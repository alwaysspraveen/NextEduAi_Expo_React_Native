import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type NotificationItemProps = {
  _id: string;
  title?: string;
  body?: string;
  createdAt: string | number | Date;
  read?: boolean;
  onPress?: () => void;
};

export default function NotificationItem({
  _id,
  title,
  body,
  createdAt,
  read,
  onPress,
}: NotificationItemProps) {
  const time = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Pressable
      android_ripple={{ color: "#F1F5F9" }}
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "white",
      }}
      className="flex-row items-start gap-3 border-b border-gray-100"
    >
      {/* Left icon bubble */}
      <View
        className={`h-11 w-11 rounded-full items-center justify-center ${
          read ? "bg-gray-100" : "bg-blue-50"
        }`}
      >
        <Ionicons
          name={read ? "notifications-outline" : "notifications"}
          size={22}
          color={read ? "#94A3B8" : "#2563EB"}
        />
      </View>

      {/* Text */}
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text
            numberOfLines={1}
            className={`flex-1 font-semibold ${
              read ? "text-gray-500" : "text-gray-900"
            }`}
          >
            {title || "Notification"}
          </Text>

          {/* time */}
          <Text className="ml-2 text-[11px] text-gray-400">{time}</Text>

          {/* unread dot */}
          {!read && <View className="ml-2 h-2 w-2 rounded-full bg-blue-500" />}
        </View>

        {!!body && (
          <Text numberOfLines={2} className="text-gray-600 mt-0.5">
            {body}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
