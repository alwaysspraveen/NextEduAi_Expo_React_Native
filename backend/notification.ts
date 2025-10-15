import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  try {
    let token: string | undefined;

    // Only physical devices can receive push notifications
    if (!Device.isDevice) {
      alert("Must use physical device for Push Notifications");
      return;
    }

    // Check existing permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Ask if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Failed to get push token for notifications!");
      return;
    }

    // Get Expo push token
    const projectId = "YOUR_PROJECT_ID"; // ⚡ Required for SDK 48+
    const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
    token = data;

    console.log("✅ Expo Push Token:", token);

    // Android notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  } catch (error) {
    console.error("❌ Error getting push token", error);
  }
}
