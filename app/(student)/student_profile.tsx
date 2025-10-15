import Card from "@/components/Card";
import { useColors } from "@/theme/useColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsIcon from "../../assets/icons/setting.svg";
import ShieldAbout from "../../assets/icons/shield-about.svg";
import ShieldIcon from "../../assets/icons/shield-tick.svg";
import ProfileIcon from "../../assets/icons/user.svg";

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
  rightIcon = "chevron-forward",
  onPress,
  leftIcon,
  danger = false,
}: {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: keyof typeof Ionicons.glyphMap;
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

      {/* RIGHT CHEVRON */}
      <Ionicons
        name={rightIcon}
        size={20}
        color={danger ? c.danger : c.muted}
      />
    </Pressable>
  );
}

export default function Profile() {
  const [auth, setAuth] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
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

  const displayName = auth?.user?.fname || auth?.user?.name || "N/A";
  const email = auth?.user?.email || "No email";

  return (
    <View style={{ flex: 1, backgroundColor: c.surface }}>
      <StatusBar
        style={c.theme === "dark" ? "light" : "dark"}
        backgroundColor={c.surface}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View
          style={{
            alignItems: "center",
            paddingVertical: 24,
            marginBottom: 16,
            backgroundColor: c.background,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Image
            source={{
              uri: auth?.user?.avatar || "https://i.pravatar.cc/150?u=user",
            }}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              marginBottom: 12,
            }}
          />
          <Text style={{ fontSize: 18, fontWeight: "700", color: c.text }}>
            {displayName}
          </Text>
          <Text style={{ fontSize: 13, color: c.muted, marginTop: 4 }}>
            {email}
          </Text>
        </View>

        {/* Account */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: c.muted,
            marginBottom: 8,
            marginLeft: 4,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          Account
        </Text>
        <Card
          className="mb-5"
          style={{ backgroundColor: c.background, borderColor: c.border }}
        >
          <Row
            title="Change Password"
            leftIcon={<ProfileIcon width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/change-password")}
          />
          <Row
            title="Account"
            leftIcon={<ShieldIcon width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/change-password")}
          />
          <Row
            title="Settings"
            leftIcon={<SettingsIcon width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/settings")}
          />
          <Row
            title="About Us"
            leftIcon={<ShieldAbout width={28} color={c.muted} />}
            onPress={() => router.push("/(common)/about-us")}
          />
        </Card>

        {/* Settings */}
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: c.muted,
            marginBottom: 8,
            marginLeft: 4,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          Settings
        </Text>
        <Card style={{ backgroundColor: c.background, borderColor: c.border }}>
          <Row
            title="Logout"
            rightIcon={"log-out-outline"}
            danger
            onPress={() => setShowAlert(true)}
          />
        </Card>

        {/* Brand watermark / spacer */}
        <View style={{ alignItems: "center", marginTop: 28, opacity: 0.35 }}>
          {/* your logo component could go here */}
        </View>
      </ScrollView>

      {/* Confirm Logout */}
      <Modal
        isVisible={showAlert}
        onBackdropPress={() => setShowAlert(false)}
        useNativeDriver
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating
        backdropTransitionOutTiming={0}
      >
        <View
          style={{
            backgroundColor: c.background,
            padding: 20,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: c.border,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: c.text,
              marginBottom: 6,
            }}
          >
            Confirm Logout
          </Text>
          <Text style={{ color: c.muted, marginBottom: 16 }}>
            Are you sure you want to log out?
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 16,
            }}
          >
            <Pressable onPress={() => setShowAlert(false)}>
              <Text style={{ color: c.muted, fontWeight: "600" }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={async () => {
                try {
                  // Clear only what you own, safer than clear()
                  await AsyncStorage.multiRemove(["authData"]);
                } finally {
                  setShowAlert(false);
                  router.replace("/(auth)/login");
                }
              }}
            >
              <Text style={{ color: c.danger, fontWeight: "700" }}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
