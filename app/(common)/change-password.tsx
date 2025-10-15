import auth from "@/backend/auth";
import TopHeader from "@/components/TopHeader";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../guards/AuthProvider";

export default function LoginScreen() {
  const { login } = useAuth(); // ✅ fully typed
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // focus state for “ring”
  const [focused, setFocused] = useState<
    null | "currentPassword" | "newPassword" | "confirmPassword"
  >(null);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await auth.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      if (!res?.user || !res?.token) throw new Error("Invalid response");

      const normalizedRole = String(res.user.role).trim().toUpperCase();

      await AsyncStorage.removeItem("authData");
      await login({
        user: {
          ...res.user,
          role: normalizedRole as "TEACHER" | "STUDENT",
          fname: res.user.fname || "",
          schoolName: res.tenant?.name || "",
          tenantId: res.tenant?.id || "",
          tenantCode: res.tenant?.code || "",
        },
        token: res.token,
      });

      // 👇 redirect based on role
      if (normalizedRole === "TEACHER") {
        router.replace("/(teacher)");
      } else {
        router.replace("/(student)");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", "Invalid credentials");
      await AsyncStorage.removeItem("authData");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <TopHeader title="Change Password" />
        <View className="p-4 flex-col gap-6">
          {/* Password */}
          <View className="">
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-text-dark">
              Current Password
            </Text>
            <View
              className={[
                "flex-row items-center rounded-2xl px-4 bg-background dark:bg-background-dark",
                "border",
                focused === "currentPassword"
                  ? "border-primary"
                  : "border-gray-300 dark:border-gray-500",
                focused === "currentPassword"
                  ? "shadow-[0px_0px_0px_3px_rgba(37,99,235,0.15)]"
                  : "shadow-sm",
              ].join(" ")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused === "currentPassword" ? "#2563eb" : "#9ca3af"}
              />
              <TextInput
                className="flex-1 px-3 py-4 text-[16px] text-gray-900 dark:text-text-dark"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={secure}
                returnKeyType="go"
                onFocus={() => setFocused("currentPassword")}
                onBlur={() =>
                  setFocused((prev) =>
                    prev === "currentPassword" ? null : prev
                  )
                }
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={secure ? "Show password" : "Hide password"}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-2">
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-text-dark">
              New Password
            </Text>
            <View
              className={[
                "flex-row items-center rounded-2xl px-4 bg-background dark:bg-background-dark",
                "border",
                focused === "newPassword"
                  ? "border-primary"
                  : "border-gray-300 dark:border-gray-500",
                focused === "newPassword"
                  ? "shadow-[0px_0px_0px_3px_rgba(37,99,235,0.15)]"
                  : "shadow-sm",
              ].join(" ")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused === "newPassword" ? "#2563eb" : "#9ca3af"}
              />
              <TextInput
                className="flex-1 px-3 py-4 text-[16px] text-gray-900 dark:text-text-dark"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={secure}
                returnKeyType="go"
                onFocus={() => setFocused("newPassword")}
                onBlur={() =>
                  setFocused((prev) => (prev === "newPassword" ? null : prev))
                }
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={secure ? "Show password" : "Hide password"}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View className="mb-2">
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-text-dark">
              Confirm Password
            </Text>
            <View
              className={[
                "flex-row items-center rounded-2xl px-4 bg-background dark:bg-background-dark",
                "border",
                focused === "confirmPassword"
                  ? "border-primary"
                  : "border-gray-300 dark:border-gray-500",
                focused === "confirmPassword"
                  ? "shadow-[0px_0px_0px_3px_rgba(37,99,235,0.15)]"
                  : "shadow-sm",
              ].join(" ")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused === "confirmPassword" ? "#2563eb" : "#9ca3af"}
              />
              <TextInput
                className="flex-1 px-3 py-4 text-[16px] text-gray-900 dark:text-text-dark"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secure}
                returnKeyType="go"
                onFocus={() => setFocused("confirmPassword")}
                onBlur={() =>
                  setFocused((prev) =>
                    prev === "confirmPassword" ? null : prev
                  )
                }
                onSubmitEditing={handleLogin}
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setSecure(!secure)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="button"
                accessibilityLabel={secure ? "Show password" : "Hide password"}
              >
                <Ionicons
                  name={secure ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6b7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Login */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={[
              "h-14 rounded-full items-center justify-center",
              loading ? "bg-blue-300" : "bg-primary",
              "shadow-md",
            ].join(" ")}
            accessibilityRole="button"
          >
            <Text className="text-white text-base font-semibold tracking-wide">
              {loading ? "Updating Password…" : "Update Password"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
