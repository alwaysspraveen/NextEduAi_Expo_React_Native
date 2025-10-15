import BackIcon from "@/assets/icons/back_arrow.svg";
import { useColors } from "@/theme/useColors";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  title?: string;
  subtitle?: string | React.ReactNode;
  onBack?: () => void; // show back if provided
  right?: React.ReactNode; // optional right-side action (e.g., <BellIcon/>)
};

export default function TopHeader({
  title = "Today’s Timetable",
  subtitle,
  onBack,
  right,
}: Props) {
  const c = useColors();
  return (
    <View className="bg-surface dark:bg-surface-dark ">
      <View className="p-3">
        <View className="flex-row items-center">
          {/* Back button (optional) */}
          <TouchableOpacity
            onPress={onBack}
            disabled={!onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="h-10 w-10 mr-6 rounded-full items-start pb-2 justify-start"
          >
            <BackIcon width={32} color={c.muted} />
          </TouchableOpacity>

          {/* Title & subtitle */}
          <View className="flex-1">
            <Text
              className="text-text dark:text-text-dark font-semibold"
              style={{ fontSize: RFValue(18) }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>

            {subtitle ? (
              typeof subtitle === "string" ? (
                <Text
                  className="text-text dark:text-text-dark  text-[12px] mt-0.5"
                  numberOfLines={1}
                >
                  {subtitle}
                </Text>
              ) : (
                <View className="mt-0.5">{subtitle}</View>
              )
            ) : null}
          </View>

          {/* Right action (optional) */}
          {right ? (
            <View className="ml-2">{right}</View>
          ) : (
            <View style={{ width: 10 }} />
          )}
        </View>
      </View>
    </View>
  );
}
