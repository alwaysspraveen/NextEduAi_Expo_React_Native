import rag from "@/backend/rag";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Select a material and ask me anything!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<
    string | undefined
  >();
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    if (!selectedMaterial) {
      Alert.alert("No material", "Please select a material first.");
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await rag.chat(selectedMaterial, text, [
        ...messages.map((m) => ({
          role: (m.sender === "user" ? "user" : "assistant") as
            | "user"
            | "assistant",
          content: m.text,
        })),
        { role: "user" as const, content: text },
      ]);

      const botMsg: Message = {
        id: Date.now().toString(),
        text: res.ok
          ? res.output || "⚠️ Empty response"
          : "⚠️ " + (res.error || "Chat error."),
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ " + (err?.message || String(err)),
          sender: "bot",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with material selector */}
      <View className="px-4 py-3 bg-white border-b border-gray-200 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">
          AI Study Assistant
        </Text>
        <View className="flex-1 ml-4 border border-gray-300 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedMaterial}
            onValueChange={(value) => setSelectedMaterial(value)}
          >
            <Picker.Item label="Select Material" value={undefined} />
            <Picker.Item label="Maths - Ch1" value="EVS001" />
            <Picker.Item label="Science - Ch2" value="sci2" />
            <Picker.Item label="History - Ch3" value="hist3" />
          </Picker>
        </View>
      </View>

      {/* Chat Section */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              className={`px-4 my-2 flex-row ${
                item.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <View
                className={`px-4 py-2 rounded-2xl max-w-[75%] shadow ${
                  item.sender === "user"
                    ? "bg-blue-600 rounded-br-none"
                    : "bg-white rounded-bl-none border border-gray-200"
                }`}
              >
                <Text
                  className={`${
                    item.sender === "user" ? "text-white" : "text-gray-800"
                  } text-sm`}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Section */}
        <View className="flex-row items-center p-3 border-t border-gray-200 bg-white">
          <TextInput
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full mr-2"
            placeholder="Ask a question..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={sending}
            className="p-3 bg-blue-600 rounded-full"
          >
            {sending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
