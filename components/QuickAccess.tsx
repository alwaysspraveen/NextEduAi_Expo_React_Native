import {
  CalenderIcon,
  ChatIcon,
  FolderIcon,
  StarIcon,
  SuccessIcon,
} from "@/assets/icons/icon";
import { router } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

type QuickAccessItemProps = {
  icon: React.ReactNode;
  label: string;
  onPressIcon?: () => void;
  onPressViewAll?: () => void;
};

function QuickAccessItem({ icon, label, onPressIcon }: QuickAccessItemProps) {
  return (
    <Pressable
      onPress={onPressIcon}
      className="flex flex-col items-center gap-2 flex-1"
    >
      <View className="flex flex-col items-center dark:bg-secondary-dark bg-secondary p-3 rounded-full">
        {icon}
      </View>
      <Text
        className="font-semibold text-surface-dark dark:text-surface"
        style={{ fontSize: RFValue(11) }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function MenuGrid() {
  const items = [
    {
      icon: <CalenderIcon size={32} />,
      label: "Schedule",
      onPressIcon: () => {
        router.navigate("/timetable");
      },
    },
    {
      icon: <SuccessIcon size={32} />,
      label: "Attendance",
      onPressIcon: () => {
        router.navigate("/teacher_attendance");
      },
    },
    {
      icon: <FolderIcon size={32} />,
      label: "Contents",
      onPressIcon: () => {
        router.navigate("/(teacher_features)/content");
      },
    },
    {
      icon: <ChatIcon size={32} />,
      label: "AI Chat",
      onPressIcon: () => {
        router.navigate("/chat");
      },
    },
  ];

  return (
    <View className="bg-background dark:bg-background-dark rounded-2xl gap-4 p-4 mb-5 shadow">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <StarIcon size={28} />
          <Text className="font-semibold text-text dark:text-text-dark ml-2 text-lg">
            Quick Access
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.navigate("/slidemenu")}>
          <Text className="text-sm font-semibold text-orange-400">
            View all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
      <View className="flex-row justify-between w-full">
        {items.map((item, idx) => (
          <QuickAccessItem
            key={idx}
            icon={item.icon}
            label={item.label}
            onPressIcon={item.onPressIcon}
          />
        ))}
      </View>
    </View>
  );
}
