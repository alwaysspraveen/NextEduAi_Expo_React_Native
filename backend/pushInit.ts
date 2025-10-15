// src/backend/pushInit.ts
import { getApp } from "@react-native-firebase/app";
import {
    getInitialNotification,
    getMessaging,
    onMessage,
    onNotificationOpenedApp,
    setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import { AppState } from "react-native";
import { BADGE_POKE, bus, REFRESH_ALL } from "./eventBus";

let started = false;

function fire() {
  // Only poke UI while app is visible. (On tap-open, handlers below cover it.)
  if (AppState.currentState === "active") {
    bus.emit(REFRESH_ALL);
    bus.emit(BADGE_POKE);
  }
}

export function startPushListeners() {
  if (started) return;
  started = true;

  const messaging = getMessaging(getApp());

  // Foreground push
  onMessage(messaging, fire);

  // App brought to foreground by tap
  onNotificationOpenedApp(messaging, fire);

  // App launched from quit by tap
  getInitialNotification(messaging).then((msg) => {
    if (msg) {
      // on app start, after auth & UI mount, components will subscribe and refetch
      bus.emit(REFRESH_ALL);
      bus.emit(BADGE_POKE);
    }
  });

  // Background headless (no UI here; keep empty)
  setBackgroundMessageHandler(messaging, async () => {});
}
