import { Text, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type Props = {
  title: string;
  count?: string;
  rightIcon?: any; // optional custom actions
};

export default function KPI({ count, title, rightIcon }: Props) {
  return (
    <View className="relative flex-1 bg-background dark:bg-background-dark p-4 rounded-2xl shadow overflow-hidden">
      {rightIcon && (
        <View className="absolute -bottom-3 -right-3 dark: dark:bg-gray-900 bg-surface rounded-full p-4">
          {rightIcon}
        </View>
      )}
      <View className=" flex-row items-center justify-between mb-4">
        <Text
          className=" dark:text-text-dark text-text  font-semibold"
          style={{ fontSize: RFValue(13) }}
        >
          {title}
        </Text>
      </View>
      <Text
        className="font-bold text-primary"
        style={{ fontSize: RFValue(24) }}
      >
        {count}
      </Text>
    </View>
  );
}
