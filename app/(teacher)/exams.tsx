import Card from "@/components/Card";
import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import { quizBank } from "@/lib/mock";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Exams() {
  return (
    <View className="flex-1 bg-white">
      <Header title="Exams & Quizzes" subtitle="Create • Schedule • Results" />
      <ScrollView className="p-4">
        <Card className="mb-4">
          <Text className="text-base font-semibold mb-3">Create Quiz (MCQ)</Text>
          <TextInput className="border border-gray-200 rounded-xl px-4 py-3 mb-2" placeholder="Quiz title" />
          <TextInput className="border border-gray-200 rounded-xl px-4 py-3 mb-2" placeholder="Class / Subject" />
          <TouchableOpacity className="bg-blue-600 rounded-xl py-3 items-center">
            <Text className="text-white font-semibold">Add Questions</Text>
          </TouchableOpacity>
        </Card>

        <Card>
          <Text className="text-base font-semibold mb-3">Question Bank</Text>
          {quizBank.map(q => (
            <ListItem key={q.id} title={`${q.type.toUpperCase()} • ${q.question}`} rightIcon="add-circle-outline" />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}
