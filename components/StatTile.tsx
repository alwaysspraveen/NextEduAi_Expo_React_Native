import { Text, View } from "react-native";

export default function StatTile({
  label,
  value,
  chip,
  color,
}: {
  label: string;
  value: string;
  chip?: string;
  color?: string;
}) {
  return (
    <View
      className={`
        ${color} "flex-1 bg-white rounded-2xl border border-gray-100 p-4 mr-3`}
    >
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-2xl font-bold text-gray-900 mt-1">{value}</Text>
      {chip ? (
        <Text className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full self-start">
          {chip}
        </Text>
      ) : null}
    </View>
  );
}
