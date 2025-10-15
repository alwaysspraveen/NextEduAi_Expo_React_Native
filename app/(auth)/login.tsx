import { AppLogo } from "@/assets/icons/icon";
import auth from "@/backend/auth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../guards/AuthProvider";

export default function LoginScreen() {
  const { login } = useAuth(); // ✅ fully typed
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  // focus state for “ring”
  const [focused, setFocused] = useState<null | "email" | "password">(null);
  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await auth.login(email, password);
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
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
        >
          {/* Header */}
          <View className="items-center mt-6 mb-10">
            <AppLogo size={140} />
            <Text className="mt-4 text-3xl font-bold text-gray-800 dark:text-text-dark">
              Welcome back
            </Text>
            <Text className="mt-1 text-gray-500 dark:text-text-dark">
              Please sign in to continue
            </Text>
          </View>

          {/* Email */}
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-text-dark">
              Email
            </Text>
            <View
              className={[
                "flex-row items-center rounded-2xl px-4 bg-background dark:bg-background-dark",
                "border",
                focused === "email" ? "border-primary" : "border-gray-300 dark:border-gray-500",
                focused === "email"
                  ? "shadow-[0px_0px_0px_3px_rgba(37,99,235,0.15)]"
                  : "shadow-sm",
              ].join(" ")}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={focused === "email" ? "#2563eb" : "#9ca3af"}
              />
              <TextInput
                className="flex-1 px-3 py-4 text-[16px] text-gray-900 dark:text-text-dark"
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onFocus={() => setFocused("email")}
                onBlur={() =>
                  setFocused((prev) => (prev === "email" ? null : prev))
                }
                onSubmitEditing={() => setFocused("password")}
                accessibilityLabel="Email"
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-2">
            <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-text-dark">
              Password
            </Text>
            <View
              className={[
                "flex-row items-center rounded-2xl px-4 bg-background dark:bg-background-dark",
                "border",
                focused === "password" ? "border-primary" : "border-gray-300 dark:border-gray-500",
                focused === "password"
                  ? "shadow-[0px_0px_0px_3px_rgba(37,99,235,0.15)]"
                  : "shadow-sm",
              ].join(" ")}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={focused === "password" ? "#2563eb" : "#9ca3af"}
              />
              <TextInput
                className="flex-1 px-3 py-4 text-[16px] text-gray-900 dark:text-text-dark"
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secure}
                returnKeyType="go"
                onFocus={() => setFocused("password")}
                onBlur={() =>
                  setFocused((prev) => (prev === "password" ? null : prev))
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

          {/* Forgot password */}
          <TouchableOpacity
            className="self-end mt-2 mb-6"
            onPress={() => {}}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-sm text-primary">Forgot password?</Text>
          </TouchableOpacity>

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
              {loading ? "Logging in…" : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-gray-200" />
            <Text className="mx-3 text-xs text-gray-400">OR</Text>
            <View className="flex-1 h-[1px] bg-gray-200" />
          </View>

          {/* Providers */}
          <View className="flex-row justify-center gap-4">
            <TouchableOpacity
              className="h-12 w-12 rounded-full border border-gray-300 items-center justify-center bg-white"
              onPress={() => {}}
              accessibilityLabel="Continue with Google"
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity
              className="h-12 w-12 rounded-full border border-gray-300 items-center justify-center bg-white"
              onPress={() => {}}
              accessibilityLabel="Continue with Apple"
            >
              <Ionicons name="logo-apple" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center mt-10">
            <Text className="text-sm text-gray-500">
              Don’t have an account?{" "}
              <Text className="text-primary font-semibold">Sign up</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
