import Header from "@/components/Header";
import { router } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Otp() {
  return (
    <View className="flex-1 bg-white">
      <Header title="OTP Login" subtitle="Enter 6-digit code" />
      <View className="p-4">
        <TextInput
          className="border border-gray-200 rounded-xl px-4 py-3 tracking-[10px] text-center text-lg"
          maxLength={6}
          keyboardType="numeric"
        />
        <TouchableOpacity
          className="bg-blue-600 rounded-xl py-3 items-center mt-6"
          onPress={() => router.replace("/(student)")}
        >
          <Text className="text-white font-semibold">Verify & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
