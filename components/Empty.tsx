import { Text, View } from "react-native";

export default function Empty({ label }: { label: string }) {
  return (
    <View className="py-12 items-center">
      <Text className="text-gray-400">{label}</Text>
    </View>
  );
}
