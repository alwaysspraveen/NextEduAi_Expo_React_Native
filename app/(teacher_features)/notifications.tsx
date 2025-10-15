import {
  NotificationPayload,
  notificationService,
} from "@/backend/notificationService";
import TopHeader from "@/components/TopHeader";
import NotificationSkeleton from "@/skeleton/NotificationSkeleton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotificationPage() {
  const [items, setItems] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // --- Debounce search (250ms) ---
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => setDebouncedQuery(query.trim()),
      250
    );
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationService.getUserNotifications();
      setItems(
        [...data].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        )
      );
    } catch (e) {
      console.error("Failed to load notifications:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  // --- Optimistic mark-one ---
  const markOne = useCallback(
    async (id: string) => {
      const before = items;
      const next = items.map((n) => (n._id === id ? { ...n, read: true } : n));
      setItems(next);
      try {
        await notificationService.markAsRead(id);
      } catch (e) {
        console.error("Mark-as-read failed:", e);
        setItems(before); // rollback
      }
    },
    [items]
  );

  // --- Optimistic mark-all ---
  const markAll = useCallback(async () => {
    const before = items;
    const next = items.map((n) => ({ ...n, read: true }));
    setItems(next);
    try {
      await notificationService.markAllAsRead();
    } catch (e) {
      console.error("Mark-all failed:", e);
      setItems(before); // rollback
    }
  }, [items]);

  // --- Derived list (filter + search) ---
  const filtered = useMemo(() => {
    let list = items;
    if (filter === "unread") list = list.filter((n) => !n.read);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.body?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, filter, debouncedQuery]);

  const renderItem = useCallback(
    ({ item }: { item: NotificationPayload }) => (
      <TouchableOpacity
        className="flex-row items-start gap-3 p-3 border-b border-border dark:border-border-dark"
        activeOpacity={0.8}
        onPress={() => markOne(item._id)}
      >
        <View
          className={`h-12 w-12 rounded-full items-center justify-center ${
            item.read
              ? "bg-muted dark:bg-muted-dark"
              : "bg-secondary dark:bg-secondary-dark"
          }`}
        >
          <Ionicons
            name={
              item.read
                ? "notifications-outline"
                : "notifications-circle-outline"
            }
            size={26}
            color={item.read ? "#94A3B8" : "#386BF6"}
          />
        </View>

        <View className="flex-1">
          <Text
            className={`font-semibold ${
              item.read
                ? "text-muted dark:text-muted-dark"
                : "text-text dark:text-text-dark"
            }`}
          >
            {item.title}
          </Text>
          <Text
            numberOfLines={1}
            className="text-muted dark:text-muted-dark text-base mt-1"
          >
            {item.body}
          </Text>
          <Text className="text-[11px] text-muted dark:text-muted-dark mt-1">
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>

        {!item.read && (
          <View className="h-2 w-2 rounded-full bg-primary mt-2" />
        )}
      </TouchableOpacity>
    ),
    [markOne]
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Top Header */}
      <TopHeader
        title="Notifications"
        onBack={() => router.canGoBack() && router.back()}
      />

      {/* Body */}
      <View className="flex-1 bg-surface dark:bg-surface-dark px-4 pt-3 rounded-t-3xl">
        {/* Search */}
        <View className="flex-row items-center bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-full px-3 py-2 mb-3">
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            className="ml-2 flex-1 text-text dark:text-text-dark"
            placeholderTextColor="#94A3B8"
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {!!debouncedQuery && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View className="flex-row gap-3 justify-between items-center mb-2">
          <View className="flex-row gap-3 mb-2">
            <TouchableOpacity
              className={`px-4 py-2 rounded-full border ${
                filter === "all"
                  ? "bg-primary border-primary"
                  : "border-border dark:border-border-dark"
              }`}
              onPress={() => setFilter("all")}
            >
              <Text
                className={
                  filter === "all"
                    ? "text-white"
                    : "text-text dark:text-text-dark"
                }
              >
                All {items.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-full border ${
                filter === "unread"
                  ? "bg-primary border-primary"
                  : "border-border dark:border-border-dark"
              }`}
              onPress={() => setFilter("unread")}
            >
              <Text
                className={
                  filter === "unread"
                    ? "text-white"
                    : "text-text dark:text-text-dark"
                }
              >
                Unread {items.filter((n) => !n.read).length}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={markAll}
            disabled={!items.some((n) => !n.read)}
          >
            <Text
              className={`${
                items.some((n) => !n.read)
                  ? "text-primary"
                  : "text-muted dark:text-muted-dark"
              }`}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        {/* List / Empty / Skeleton */}
        {loading ? (
          <NotificationSkeleton />
        ) : filtered.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#94A3B8"
            />
            <Text className="text-muted dark:text-muted-dark mt-3">
              No notifications found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            showsVerticalScrollIndicator={false}
            keyExtractor={(it) => it._id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            initialNumToRender={10}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </View>
  );
}
