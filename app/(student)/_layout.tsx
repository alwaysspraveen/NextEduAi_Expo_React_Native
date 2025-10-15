import { useColors } from "@/theme/useColors";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { getApp } from "@react-native-firebase/app";
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
} from "@react-native-firebase/messaging";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { notificationService } from "@/backend/notificationService";
import { useThemeCtx } from "@/theme/ThemeProvider";
import RoleGuard from "../guards/RoleGuard";

export default function StudentLayout() {
  const insets = useSafeAreaInsets();
  const c = useColors();
  const { theme } = useThemeCtx();

  useEffect(() => {
    let unsubscribeTokenRefresh: (() => void) | undefined;

    const setup = async () => {
      try {
        const app = getApp();
        const m = getMessaging(app);

        const status = await requestPermission(m);
        if (
          status === AuthorizationStatus.AUTHORIZED ||
          status === AuthorizationStatus.PROVISIONAL
        ) {
          console.log("Notification permission granted.");
        }

        try {
          const token = await getToken(m);
          if (token) {
            await notificationService.registerToken(token);
            console.log("FCM token registered - Student Layout");
          }
        } catch (e) {
          console.error("getToken/registerToken failed:", e);
        }

        unsubscribeTokenRefresh = onTokenRefresh(m, async (newToken) => {
          try {
            await notificationService.registerToken(newToken);
            console.log("FCM token refreshed & registered");
          } catch (e) {
            console.error("Failed to re-register refreshed FCM token:", e);
          }
        });
      } catch (e) {
        console.error("FCM setup failed:", e);
      }
    };

    setup();

    return () => {
      if (unsubscribeTokenRefresh) unsubscribeTokenRefresh();
    };
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: c.primary }}>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        translucent={false}
        backgroundColor={c.primary}
      />

      {Platform.OS === "android" && (
        <View style={{ height: insets.top, backgroundColor: c.background }} />
      )}

      <SafeAreaView
        className="bg-background dark:bg-background-dark"
        style={{ flex: 1, backgroundColor: c.background }}
        edges={["bottom", "left", "right"]}
      >
        <RoleGuard allowed={["STUDENT"]}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarActiveTintColor: c.primary,
              tabBarInactiveTintColor: "#94A3B8",
              sceneStyle: { backgroundColor: "transparent" },
              tabBarItemStyle: { paddingVertical: 6 },
              tabBarStyle: {
                position: "relative",
                left: 16,
                right: 16,
                height: 64,
                borderTopStartRadius: 16,
                borderTopEndRadius: 16,
                backgroundColor: c.background,
                borderTopWidth: 0,
                shadowColor: "#0F172A",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 12,
                elevation: 8,
                paddingTop: 10,
                paddingBottom: Platform.OS === "ios" ? 16 : 10,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="student_slidemenu"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="grid" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="student_timetable"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="student_profile"
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </RoleGuard>
      </SafeAreaView>
    </View>
  );
}
