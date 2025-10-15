// app/(student)/assignments.tsx
import AssignmentCard from "@/components/AssignmentItemCard";
import TopHeader from "@/components/TopHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Assignment = {
  id: string;
  title: string;
  instructions: string;
  assignedDate: string;
  dueDate: string;
  status: "PENDING" | "DUE" | "SUBMITTED";
  subject: string;
};

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Write an Essay on 'My Hobby'",
    instructions: "Write at least 200 words. Handwriting should be neat.",
    assignedDate: "19 Oct 2025",
    dueDate: "21 Oct 2025",
    status: "PENDING",
    subject: "English",
  },
  {
    id: "2",
    title: "Science Worksheet - Chapter 5",
    instructions: "Complete all questions on page 45-47.",
    assignedDate: "15 Oct 2025",
    dueDate: "17 Oct 2025",
    status: "DUE",
    subject: "Science",
  },
  {
    id: "3",
    title: "Math Assignment - Algebra",
    instructions: "Solve the exercises 3A and 3B.",
    assignedDate: "12 Oct 2025",
    dueDate: "16 Oct 2025",
    status: "SUBMITTED",
    subject: "Math",
  },
];

export default function Assignments() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = useMemo(
    () =>
      Array.from(new Set(assignments.map((a) => a.subject))).map((s) => ({
        label: s,
        value: s,
      })),
    []
  );

  const filteredAssignments = useMemo(
    () =>
      selectedSubject ? assignments.filter((a) => a.subject === selectedSubject) : assignments,
    [selectedSubject]
  );

  return (
    <View className="flex-1 bg-white">
      <TopHeader title="Assignments" onBack={() => router.canGoBack() && router.back()} />

      {/* Filter Bar */}
      <View className="px-4 pt-3 pb-1 bg-white">
        <View className="rounded-2xl bg-gray-50 border border-gray-200 p-3">
          <Text className="text-gray-700 font-semibold mb-2">Filter</Text>

          {/* Row: Dropdown + Clear */}
          <View className="flex-row items-center">
            <View className="flex-1">
              <Dropdown
                data={[{ label: "All Subjects", value: null }, ...subjects]}
                value={selectedSubject}
                labelField="label"
                valueField="value"
                onChange={(item: any) => setSelectedSubject(item.value)}
                placeholder={selectedSubject ? "Change subject" : "Select Subject"}
                style={{
                  height: 44,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
                placeholderStyle={{ color: "#6B7280", fontSize: 14 }}
                selectedTextStyle={{ color: "#111827", fontSize: 14, fontWeight: "600" }}
                iconStyle={{ width: 20, height: 20 }}
                renderLeftIcon={() => (
                  <Ionicons name="book-outline" size={18} color="#2563EB" style={{ marginRight: 8 }} />
                )}
                containerStyle={{
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
                itemTextStyle={{ color: "#111827" }}
                renderItem={(item) => (
                  <View style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                    <Text style={{ color: "#111827" }}>{item.label}</Text>
                  </View>
                )}
              />
            </View>

            {/* Clear / All */}
            <TouchableOpacity
              onPress={() => setSelectedSubject(null)}
              className="ml-3 px-3 py-2 rounded-full bg-blue-50"
            >
              <Text className="text-blue-700 font-semibold text-xs">All</Text>
            </TouchableOpacity>
          </View>

          {/* Quick subject chips
          <View className="flex-row flex-wrap mt-3 -m-1">
            {subjects.map((s) => {
              const active = selectedSubject === s.value;
              return (
                <TouchableOpacity
                  key={s.value}
                  onPress={() => setSelectedSubject(active ? null : (s.value as string))}
                  className={`m-1 px-3 py-1.5 rounded-full border ${
                    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-xs font-semibold ${active ? "text-white" : "text-gray-700"}`}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View> */}
        </View>
      </View>

      {/* Section header */}
      <View className="px-4 mt-3 mb-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 font-semibold">
            {selectedSubject ? `${selectedSubject} Assignments` : "All Assignments"}
          </Text>
          <View className="px-2 py-1 rounded-full bg-gray-100">
            <Text className="text-gray-700 text-sm font-semibold">
              {filteredAssignments.length} item{filteredAssignments.length === 1 ? "" : "s"}
            </Text>
          </View>
        </View>
      </View>

      {/* List */}
      <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        {filteredAssignments.length === 0 ? (
          <View className="mt-10 items-center">
            <Ionicons name="documents-outline" size={26} color="#9CA3AF" />
            <Text className="text-gray-500 mt-2">No assignments for this filter</Text>
          </View>
        ) : (
          filteredAssignments.map((a) => <AssignmentCard key={a.id} item={a} />)
        )}
      </ScrollView>
    </View>
  );
}
