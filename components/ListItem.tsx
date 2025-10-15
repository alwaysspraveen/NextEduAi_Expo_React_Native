 // components/ListItem.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from "react-native";
import {
    GestureHandlerRootView,
    RectButton,
    Swipeable,
} from "react-native-gesture-handler";

type Props = {
  title: string;
  subtitle?: string;
  rightIcon?: any;           // Ionicons name
  rightIconColor?: string;
  onPress?: () => void;
  onPin?: () => void;        // swipe right action
  onDelete?: () => void;     // swipe right action
  style?: ViewStyle;
  leftActions?: ReactNode;   // optional custom actions
  rightActions?: ReactNode;  // optional custom actions
};

export default function ListItem({
  title,
  subtitle,
  rightIcon,
  rightIconColor = "#9CA3AF",
  onPress,
  onPin,
  onDelete,
  style,
  leftActions,
  rightActions,
}: Props) {
  const renderRightActions = () =>
    rightActions ?? (
      <View style={styles.actionsWrap}>
        {onPin && (
          <RectButton style={[styles.actionBtn, { backgroundColor: "#06b6d4" }]} onPress={onPin}>
            <Ionicons name="bookmark" size={20} color="#fff" />
            <Text style={styles.actionText}>Pin</Text>
          </RectButton>
        )}
        {onDelete && (
          <RectButton style={[styles.actionBtn, { backgroundColor: "#ef4444" }]} onPress={onDelete}>
            <Ionicons name="trash" size={20} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </RectButton>
        )}
      </View>
    );

  const renderLeftActions = () =>
    leftActions ?? null;

  return (
    // If your app root already uses GestureHandlerRootView, you can remove this wrapper.
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={[styles.card, style]}>
          <Pressable
            onPress={onPress}
            android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            style={({ pressed }) => [
              styles.row,
              pressed && Platform.OS === "ios" ? { opacity: 0.9 } : null,
            ]}
          >
            <View style={styles.texts}>
              <Text style={styles.title}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {!!rightIcon && (
              <Ionicons name={rightIcon} size={18} color={rightIconColor} />
            )}
          </Pressable>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    marginVertical: 6,
    // subtle border + shadow for “card” feel
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.9)",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  texts: { paddingVertical: 10, paddingRight: 10, flexShrink: 1 },
  title: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#64748B" },

  actionsWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  actionBtn: {
    width: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    marginTop: 4,
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});
