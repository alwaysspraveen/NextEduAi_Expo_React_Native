// app/index.tsx
import { useColors } from "@/theme/useColors";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native"; // ✅ import StyleSheet
import { useAuth } from "./guards/AuthProvider";

export default function Index() {
  const { authData, loading } = useAuth();
  const router = useRouter();
  const c = useColors();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: c.background,
          justifyContent: "center",
          alignItems: "center",
        },
      }),
    [c.background]
  );
  useEffect(() => {
    if (!loading) {
      if (!authData) {
        router.replace("/(auth)/login");
      } else if (authData.user.role === "TEACHER") {
        router.replace("/(teacher)");
      } else {
        router.replace("/(student)");
      }
    }
  }, [authData, loading]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <LottieView
          source={require("../assets/lottie.json")}
          autoPlay
          loop
          style={{ width: 800, height: 800 }} // ✅ smaller than 800x800
        />
      )}
    </View>
  );
}
