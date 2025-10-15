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

export default function TeacherLayout() {
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
            console.log("FCM token registered - Teacher Layout");
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
    <View className="flex-1" style={{ backgroundColor: c.background }}>
      <StatusBar
        style={theme === "dark" ? "light" : "dark"}
        translucent={false}
        backgroundColor={c.primary}
      />

      {Platform.OS === "android" && (
        <View style={{ height: insets.top, backgroundColor: c.background }} />
      )}
      <RoleGuard allowed={["TEACHER"]}>
        <SafeAreaView
          className="bg-surface dark:bg-background-dark"
          style={{ flex: 1, backgroundColor: c.surface }}
          edges={["bottom", "left", "right"]}
        >
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: true,
              tabBarHideOnKeyboard: true,
              tabBarActiveTintColor: c.primary,
              tabBarInactiveTintColor: "#94A3B8",

              // Item spacing
              tabBarItemStyle: { paddingVertical: 6 },

              // Label polish
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: "800",
                letterSpacing: 0.2,
                textTransform: "none",
                paddingTop: 6,

                lineHeight: 14,
              },

              // Bar styling (rounded, elevated “card”)
              tabBarStyle: {
                height: 72,
                paddingTop: 2,
                borderTopRightRadius: 24,
                borderTopLeftRadius: 24,
                backgroundColor: c.background,
              },
            }}
          >
            <Tabs.Screen
              name="index"
              options={{
                tabBarLabel: "Home",
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome5 name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="slidemenu"
              options={{
                tabBarLabel: "Menu",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="grid" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="timetable"
              options={{
                tabBarLabel: "Schedule",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar-outline" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                tabBarLabel: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" size={size} color={color} />
                ),
              }}
            />

            {/* Hidden routes */}
            <Tabs.Screen name="assignments" options={{ href: null }} />
            <Tabs.Screen name="exams" options={{ href: null }} />
            <Tabs.Screen name="reports" options={{ href: null }} />
            <Tabs.Screen name="grades" options={{ href: null }} />
            <Tabs.Screen name="_id" options={{ href: null }} />
          </Tabs>
        </SafeAreaView>
      </RoleGuard>
    </View>
  );
}
