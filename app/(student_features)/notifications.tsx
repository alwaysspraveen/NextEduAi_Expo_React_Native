import {
  NotificationPayload,
  notificationService,
} from "@/backend/notificationService";
import NotificationItem from "@/components/NotificationItem";
import TopHeader from "@/components/TopHeader";
import NotificationSkeleton from "@/skeleton/NotificationSkeleton";
import { Ionicons } from "@expo/vector-icons";
import { isAfter, isToday, isYesterday, parseISO, startOfWeek } from "date-fns";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshControl,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ----- helpers -----
const toDate = (d: string | number | Date) =>
  typeof d === "string" ? parseISO(d) : new Date(d);

function groupNotifications(items: NotificationPayload[]) {
  const today: NotificationPayload[] = [];
  const yesterday: NotificationPayload[] = [];
  const week: NotificationPayload[] = [];
  const earlier: NotificationPayload[] = [];

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Mon

  for (const n of items) {
    const dt = toDate(n.createdAt);
    if (isToday(dt)) today.push(n);
    else if (isYesterday(dt)) yesterday.push(n);
    else if (isAfter(dt, weekStart)) week.push(n);
    else earlier.push(n);
  }

  const sections = [
    { title: "Today", data: today },
    { title: "Yesterday", data: yesterday },
    { title: "This Week", data: week },
    { title: "Earlier", data: earlier },
  ].filter((s) => s.data.length > 0);

  return sections;
}

export default function NotificationPage() {
  const [items, setItems] = useState<NotificationPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // debounce search
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(
      () => setDebouncedQuery(query.trim()),
      250
    );
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
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

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  // optimistic mark one
  const markOne = useCallback(
    async (id: string) => {
      const before = items;
      const next = items.map((n) => (n._id === id ? { ...n, read: true } : n));
      setItems(next);
      try {
        await notificationService.markAsRead(id);
      } catch (e) {
        console.error("Mark-as-read failed:", e);
        setItems(before);
      }
    },
    [items]
  );

  // optimistic mark all
  const markAll = useCallback(async () => {
    const before = items;
    const next = items.map((n) => ({ ...n, read: true }));
    setItems(next);
    try {
      await notificationService.markAllAsRead();
    } catch (e) {
      console.error("Mark-all failed:", e);
      setItems(before);
    }
  }, [items]);

  // filter + search
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

  const sections = useMemo(() => groupNotifications(filtered), [filtered]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopHeader
        title="Notifications"
        onBack={() => router.canGoBack() && router.back()}
      />

      <View className="flex-1 bg-surface dark:bg-surface-dark px-4 pt-3 rounded-t-3xl">
        {/* Search */}
        <View className="flex-row items-center bg-white border border-gray-200 rounded-full px-3 py-2 mb-3">
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search notifications"
            className="ml-2 flex-1 text-gray-900"
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

        {/* Tabs + Mark all */}
        <View className="flex-row gap-3 justify-between items-center mb-2">
          <View className="flex-row gap-2">
            <TouchableOpacity
              className={`px-4 py-2 rounded-full border ${
                filter === "all"
                  ? "bg-primary border-primary"
                  : "border-gray-200"
              }`}
              onPress={() => setFilter("all")}
            >
              <Text
                className={filter === "all" ? "text-white" : "text-gray-900"}
              >
                All {items.length}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2 rounded-full border ${
                filter === "unread"
                  ? "bg-primary border-primary"
                  : "border-gray-200"
              }`}
              onPress={() => setFilter("unread")}
            >
              <Text
                className={filter === "unread" ? "text-white" : "text-gray-900"}
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
                items.some((n) => !n.read) ? "text-primary" : "text-gray-400"
              }`}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>

        {/* List / Empty / Skeleton */}
        {loading ? (
          <NotificationSkeleton />
        ) : sections.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#94A3B8"
            />
            <Text className="text-gray-500 mt-3">No notifications found</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(it) => it._id}
            renderItem={({ item }) => (
              <NotificationItem
                _id={item._id}
                title={item.title}
                body={item.body}
                createdAt={item.createdAt}
                read={item.read}
                onPress={() => markOne(item._id)}
              />
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View className="bg-transparent px-1 py-2">
                <Text className="text-xs font-semibold text-gray-500">
                  {title}
                </Text>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 16,
              backgroundColor: "white",
              borderRadius: 16,
            }}
            stickySectionHeadersEnabled={false}
          />
        )}
      </View>
    </View>
  );
}
