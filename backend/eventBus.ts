// src/utils/eventBus.ts
import { DeviceEventEmitter, EmitterSubscription } from "react-native";

export const REFRESH_ALL = "refresh:all"; // any push ⇒ screens refetch
export const BADGE_POKE = "badge:poke"; // header should re-pull count

export const bus = {
  emit(event: string, payload?: any) {
    DeviceEventEmitter.emit(event, payload);
  },
  on<T = any>(event: string, cb: (p: T) => void): EmitterSubscription {
    return DeviceEventEmitter.addListener(event, cb);
  },
};
