// components/HeaderModern.tsx
import { BADGE_POKE, bus } from "@/backend/eventBus";
import { notificationService } from "@/backend/notificationService";
import { useColors } from "@/theme/useColors";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Href, router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface AuthData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    fname: string;
    schoolName: string;
  };
  tenant: { id: string; code: string; name: string };
  token: string;
}

type SearchItem = { label: string; href: string };

const SEARCH_OPTIONS: SearchItem[] = [
  { label: "Timetable", href: "/timetable" },
  { label: "Assignments", href: "/assignments" },
  { label: "Attendance", href: "/attendance" },
  { label: "Exams", href: "/exams" },
  { label: "Contents", href: "/content" },
  { label: "Reports", href: "/reports" },
  { label: "Leave", href: "/leave" },
  { label: "Notifications", href: "/notifications" },
];

const ROLE_THEME: Record<string, { bg: string; text: string; ripple: string }> =
  {
    TEACHER: { bg: "#2563EB", text: "#FFFFFF", ripple: "#93C5FD" },
    STUDENT: { bg: "#16A34A", text: "#FFFFFF", ripple: "#86EFAC" },
    PRINCIPAL: { bg: "#DC2626", text: "#FFFFFF", ripple: "#FCA5A5" },
    PARENT: { bg: "#7C3AED", text: "#FFFFFF", ripple: "#C4B5FD" },
    DEFAULT: { bg: "#6B7280", text: "#FFFFFF", ripple: "#D1D5DB" },
  };

export default function HeaderModern({
  title,
  subtitle,
  onBellPress,
}: {
  title?: string;
  subtitle?: string;
  onBellPress?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const c = useColors();

  const [auth, setAuth] = useState<AuthData | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [focused, setFocused] = useState(false);

  // load auth + badge + bus
  useEffect(() => {
    const loadAuth = async () => {
      const stored = await AsyncStorage.getItem("authData");
      if (stored) setAuth(JSON.parse(stored));
    };
    loadAuth();
    refreshBadge();
    const sub = bus.on(BADGE_POKE, refreshBadge);
    const kbHide = Keyboard.addListener("keyboardDidHide", () =>
      setFocused(false)
    );
    return () => {
      sub.remove();
      kbHide.remove();
    };
  }, []);

  const refreshBadge = useCallback(async () => {
    try {
      const unread = await notificationService.getUnreadCount();
      setBadgeCount(unread);
    } catch (e) {
      console.error("Failed to load notifications:", e);
    }
  }, []);

  const userName = auth?.user?.fname || "Guest";
  const userRole = (auth?.user?.role || "USER").toUpperCase();
  const schoolName = auth?.user?.schoolName || "Your School";

  const roleTheme = ROLE_THEME[userRole] || ROLE_THEME.DEFAULT;

  // search
  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) return setResults([]);
    const lower = text.toLowerCase();
    setResults(
      SEARCH_OPTIONS.filter((opt) =>
        opt.label.toLowerCase().includes(lower)
      ).slice(0, 6)
    );
  };

  const navigateTo = (href: string) => {
    setQuery("");
    setResults([]);
    Keyboard.dismiss();
    router.push(href as Href);
  };

  // header heights
  const headerPadTop = 24;

  return (
    <View style={{ position: "relative" }}>
      {/* Gradient background */}
      <LinearGradient
        colors={[c.background, c.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: headerPadTop,
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          overflow: "hidden",
        }}
      >
        {/* Decorative blurs */}
        <View
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: "#60A5FA33",
            top: -50,
            right: -40,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: "#22C55E22",
            bottom: -40,
            left: -30,
          }}
        />

        {/* Top row: avatar + info +
         */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: "#ffffff22",
            }}
          />

          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text
              style={{
                color: c.text,
                fontWeight: "700",
                fontSize: RFValue(15),
              }}
              numberOfLines={1}
            >
              {`Hi, ${userName} 👋`}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <View
                style={{
                  backgroundColor: roleTheme.bg,
                  borderRadius: 999,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{
                    color: roleTheme.text,
                    fontWeight: "700",
                    fontSize: RFValue(10),
                    letterSpacing: 0.4,
                  }}
                >
                  {userRole}
                </Text>
              </View>

              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: c.text,
                  marginHorizontal: 8,
                }}
              />
              <Text
                style={{
                  color: c.text,
                  fontWeight: 500,
                  fontSize: RFValue(12),
                }}
                numberOfLines={1}
              >
                {schoolName}
              </Text>
            </View>
          </View>

          {/* Notifications */}
          <Pressable
            className="p-2 border border-muted dark:border-text-dark rounded-full"
            onPress={() => router.navigate("/(student_features)/notifications")}
          >
            <Ionicons name="notifications-outline" size={28} color={c.muted} />
            {badgeCount > 0 && (
              <View
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: "#F97316",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 4,
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 10, fontWeight: "700" }}
                >
                  {badgeCount > 9 ? "9+" : badgeCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search */}
        <View style={{ marginTop: 14 }}>
          <BlurView
            intensity={Platform.OS === "ios" ? 35 : 0}
            tint="light"
            style={{ borderRadius: 16 }}
          >
            <View
              style={{
                backgroundColor: c.background,
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 6 },
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <Feather name="search" size={18} color="#93C5FD" />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#94A3B8"
                value={query}
                onChangeText={handleSearch}
                onFocus={() => setFocused(true)}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  marginLeft: 8,
                  color: c.text,
                  fontSize: RFValue(13),
                }}
                autoCapitalize="none"
                returnKeyType="search"
              />
              {query.length > 0 && (
                <Pressable
                  onPress={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  android_ripple={{ color: "#E5E7EB", borderless: true }}
                  style={{ padding: 6, borderRadius: 999 }}
                >
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              )}
            </View>
          </BlurView>
        </View>
      </LinearGradient>

      {/* Suggestions card */}
      {results.length > 0 && focused && (
        <View
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            top: headerPadTop + 8 + 48 + 14 + 56, // avatar row + spacing + search height
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 16,
            elevation: 6,
            zIndex: 10,
          }}
        >
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={results}
            keyExtractor={(item) => item.href}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: "#F1F5F9" }} />
            )}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => navigateTo(item.href)}
                android_ripple={{ color: "#F1F5F9" }}
                style={({ pressed }) => [
                  {
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: pressed ? "#F8FAFC" : "white",
                  },
                ]}
              >
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={18}
                  color="#2563EB"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: "#0F172A",
                    fontSize: RFValue(13),
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
            ListFooterComponent={
              <TouchableOpacity
                onPress={() => {
                  setFocused(false);
                  Keyboard.dismiss();
                }}
                style={{ paddingVertical: 10, alignItems: "center" }}
              >
                <Text style={{ color: "#64748B", fontSize: 12 }}>Close</Text>
              </TouchableOpacity>
            }
          />
        </View>
      )}
    </View>
  );
}
