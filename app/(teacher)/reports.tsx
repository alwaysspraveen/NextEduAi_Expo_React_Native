import Card from "@/components/Card";
import Header from "@/components/Header";
import { ScrollView, Text, View } from "react-native";

export default function Reports() {
  return (
    <View className="flex-1 bg-white">
      <Header title="Reports & Analytics" subtitle="Progress • Insights" />
      <ScrollView className="p-4">
        <Card className="mb-4">
          <Text className="text-base font-semibold mb-2">Class Overview</Text>
          <Text className="text-gray-500">
            Avg score: 78% • Low performers: 5 • Toppers: 7
          </Text>
        </Card>
        <Card>
          <Text className="text-base font-semibold mb-2">AI Insight</Text>
          <Text className="text-gray-500">
            Students needing attention: Ravi (attendance 70%)
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
