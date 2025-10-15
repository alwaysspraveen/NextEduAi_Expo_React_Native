import api from "@/backend/api";
import auth from "@/backend/auth";
import LeaveCard from "@/components/LeaveCard";
import TopHeader from "@/components/TopHeader";
import { useColors } from "@/theme/useColors";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  RefreshControl,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

/* ---------- types ---------- */
type Leave = {
  _id: string;
  startDate: string; // ISO
  endDate: string; // ISO
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

/* ---------- utils ---------- */
const monthTitle = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "long", year: "numeric" });

const monthKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<"apply" | "view">("apply");

  // form state
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // list state
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------- data ---------- */
  useEffect(() => {
    (async () => {
      const id = await auth.getUserId();
      setTeacherId(id ?? null);
      if (!id) return;
      try {
        const res = await api.getLeaves(id);
        setLeaves(Array.isArray(res) ? res : []);
      } catch (e) {
        console.error("❌ Failed to fetch leaves", e);
      }
    })();
  }, []);

  const reload = async () => {
    if (!teacherId) return;
    try {
      const res = await api.getLeaves(teacherId);
      setLeaves(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("❌ Failed to fetch leaves", e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  /* ---------- submit ---------- */
  const handleSubmit = async () => {
    if (!reason.trim()) {
      Alert.alert("Missing fields", "Please enter a reason.");
      return;
    }
    if (!teacherId) {
      Alert.alert("Error", "No teacher ID found.");
      return;
    }
    if (!startDate || !endDate) {
      Alert.alert("Date range", "Please select start and end dates.");
      return;
    }

    try {
      setLoading(true);
      await api.applyLeave(
        teacherId,
        new Date(startDate),
        new Date(endDate),
        reason.trim()
      );
      Alert.alert("✅ Success", "Leave applied successfully!");
      setReason("");
      setStartDate(null);
      setEndDate(null);
      await reload();
      setActiveTab("view");
    } catch (err: any) {
      console.error("❌ Apply Leave failed:", err);
      Alert.alert("⚠️ Error", err?.message || "Failed to apply leave.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- grouping ---------- */
  const sections = useMemo(() => {
    const map = new Map<
      string,
      { title: string; sortKey: string; data: Leave[] }
    >();

    for (const l of leaves) {
      const d = new Date(l.startDate);
      const key = monthKey(d);
      const section = map.get(key) ?? {
        title: monthTitle(d),
        sortKey: key,
        data: [],
      };
      section.data.push(l);
      map.set(key, section);
    }

    return Array.from(map.values()).sort((a, b) =>
      b.sortKey > a.sortKey ? 1 : -1
    );
  }, [leaves]);

  /* ---------- calendar markings ---------- */
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    if (startDate) {
      marks[startDate] = {
        startingDay: true,
        color: "#2563EB",
        textColor: "white",
      };
    }
    if (endDate) {
      marks[endDate] = {
        endingDay: true,
        color: "#2563EB",
        textColor: "white",
      };

      // Fill between
      let d = new Date(startDate!);
      while (d < new Date(endDate)) {
        const ds = d.toISOString().split("T")[0];
        if (ds !== startDate && ds !== endDate) {
          marks[ds] = { color: "#93C5FD", textColor: "white" };
        }
        d.setDate(d.getDate() + 1);
      }
    }

    return marks;
  }, [startDate, endDate]);

  const onDayPress = (day: { dateString: string }) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };
  const c = useColors();
  return (
    <View className="flex-1">
      <StatusBar
        style={c.theme === "dark" ? "light" : "dark"}
        backgroundColor={c.surface}
      />
      <TopHeader
        title="Leave Management"
        onBack={() => router.canGoBack() && router.back()}
      />

      {/* Tabs */}
      <View className="flex-row bg-surface border-b border-gray-200 rounded-t-3xl">
        {(["apply", "view"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            disabled={loading}
            className={`flex-1 py-5 items-center ${
              activeTab === tab ? "border-b-2 border-primary" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === tab ? "text-primary" : "text-gray-500"
              }`}
            >
              {tab === "apply" ? "Apply Leave" : "My Leaves"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* APPLY */}
      {activeTab === "apply" && (
        <View className="p-4 bg-surface flex-1">
          <Text className="text-primary font-semibold mb-1">Select Dates</Text>

          <View className="rounded-xl bg-background dark:bg-background-dark p-2 border border-gray-200">
            <Calendar
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
            />
          </View>
          <Text className="text-primary font-semibold mt-4 mb-1">Reason</Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 mb-4"
            placeholder="Enter reason for leave"
            multiline
            value={reason}
            onChangeText={setReason}
            editable={!loading}
            textAlignVertical="top"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`py-3 rounded-xl items-center ${
              loading ? "bg-primary/70" : "bg-primary"
            }`}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Submitting..." : "Submit Leave"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* VIEW */}
      {activeTab === "view" && (
        <View className="p-4 bg-white flex-1">
          {leaves.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">No leaves yet.</Text>
            </View>
          ) : (
            <SectionList
              sections={sections}
              keyExtractor={(item) => item._id}
              stickySectionHeadersEnabled={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderSectionHeader={({ section: { title } }) => {
                const [month, year] = title.split(" ");
                return (
                  <View className="flex flex-row mt-2 mb-4 gap-2 items-center">
                    <Text className="text-primary font-bold">{month}</Text>
                    <Text className="text-primary">{year}</Text>
                  </View>
                );
              }}
              renderItem={({ item }) => (
                <View className="mb-2">
                  <LeaveCard
                    date={item.startDate}
                    status={item.status}
                    reason={item.reason}
                  />
                </View>
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </View>
      )}
    </View>
  );
}
