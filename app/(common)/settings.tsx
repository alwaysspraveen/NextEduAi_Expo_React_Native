import Card from "@/components/Card";
import ToggleSwitch from "@/components/ToggleSwitch";
import TopHeader from "@/components/TopHeader";
import { useColors } from "@/theme/useColors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BellIcon from "../../assets/icons/bell.svg";
import UpdateIcon from "../../assets/icons/update.svg";

export interface AuthData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    fname?: string;
    avatar?: string;
  };
  tenant: { id: string; code: string; name: string };
  token: string;
}

function Row({
  title,
  rightIcon = <Ionicons name="chevron-forward" size={20} color="#888" />,
  onPress,
  leftIcon,
  danger = false,
}: {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}) {
  const c = useColors();
  return (
    <Pressable
      android_ripple={{ color: c.border }}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        // remove justifyContent here
      }}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* LEFT SIDE */}
      <View
        style={{
          flex: 1, // ← take remaining space
          flexDirection: "row",
          alignItems: "center",
          gap: 16, // or use marginLeft on Text if needed
        }}
      >
        {!!leftIcon && <View>{leftIcon}</View>}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{
            flex: 1, // ← lets text push chevron to the edge
            fontSize: 16,
            color: danger ? c.danger : c.text,
            fontWeight: danger ? "600" : "400",
          }}
        >
          {title}
        </Text>
      </View>

      {/* RIGHT ICON */}
      <View>{rightIcon}</View>
    </Pressable>
  );
}

export default function Settings() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const c = useColors();
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("authData");
        if (raw && mounted) setAuth(JSON.parse(raw));
      } catch (err) {
        console.error("❌ Failed to load user", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: c.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatusBar
          style={c.theme === "dark" ? "light" : "dark"}
          backgroundColor={c.surface}
        />
        <ActivityIndicator size="large" color={c.muted} />
        <Text style={{ marginTop: 8, color: c.muted }}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <TopHeader
        title="Settings"
        onBack={() => router.canGoBack() && router.back()}
      />
      <StatusBar
        style={c.theme === "dark" ? "light" : "dark"}
        backgroundColor={c.surface}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Card
          className="mb-5"
          style={{ backgroundColor: c.background, borderColor: c.border }}
        >
          <Row
            title="Notification Alert"
            leftIcon={<BellIcon width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/change-password")}
            rightIcon={<ToggleSwitch value={false} onChange={() => {}} />}
          />
          <Row
            title="Auto App Update"
            leftIcon={<UpdateIcon width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/change-password")}
            rightIcon={<ToggleSwitch value={false} onChange={() => {}} />}
          />
          <Row
            title="Theme"
            leftIcon={
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={28}
                color={c.muted}
              />
            }
            onPress={() => router.push("/(common)/theme-settings")}
          />
        </Card>
      </ScrollView>
    </View>
  );
}
