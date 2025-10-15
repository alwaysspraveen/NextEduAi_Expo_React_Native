import Card from "@/components/Card";
import Empty from "@/components/Empty";
import ListItem from "@/components/ListItem";
import TopHeader from "@/components/TopHeader";
import { homework } from "@/lib/mock";
import { router } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Assignments() {
  return (
    <View className="flex-1 bg-white">
      <TopHeader title="Assignments" onBack={() => router.canGoBack()} />
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card className="mb-4">
          <Text className="text-base font-semibold mb-3">
            Create Assignment
          </Text>
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-2"
            placeholder="Title"
          />
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-2"
            placeholder="Subject / Class"
          />
          <TextInput
            className="border border-gray-200 rounded-xl px-4 py-3 mb-2"
            placeholder="Instructions"
            multiline
          />
          <TouchableOpacity className="bg-blue-600 rounded-xl py-3 items-center mt-1">
            <Text className="text-white font-semibold">Publish</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text className="text-base font-semibold mb-3">Pending Reviews</Text>
          {homework.filter((h) => !h.done).length === 0 ? (
            <Empty label="No pending submissions" />
          ) : (
            homework
              .filter((h) => !h.done)
              .map((h) => (
                <ListItem
                  key={h.id}
                  title={h.task}
                  subtitle={`${h.subject} • Due: ${h.due}`}
                  rightIcon="chevron-forward"
                />
              ))
          )}
        </Card>
      </ScrollView>
    </View>
  );
}
