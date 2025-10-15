// app/tabs/attendance.tsx
import api from "@/backend/api";
import auth from "@/backend/auth";
import TopHeader from "@/components/TopHeader";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Status = "P" | "A" | "L";

export default function TeacherAttendanceScreen() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [selectedClass, setSelectedClass] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"apply" | "view">("apply");
  // stats
  const totalStudents = students.length;
  const presentCount = Object.values(attendance).filter(
    (s) => s === "P"
  ).length;
  const absentCount = Object.values(attendance).filter((s) => s === "A").length;
  const leaveCount = Object.values(attendance).filter((s) => s === "L").length;

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const teacherId = await auth.getUserId();
      if (!teacherId) return;
      const res = await api.getClassByTeacher(teacherId);
      setClasses(res.map((c: any) => ({ label: c.name, value: c._id })));
    } catch (err) {
      Alert.alert("Error", "Unable to load classes.");
    }
  };

  const loadStudents = async () => {
    if (!selectedClass) {
      Alert.alert("Warning", "Please select a class.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.getStudentsByClass(selectedClass);
      const list = Array.isArray(res) ? res : res?.students ?? [];
      setStudents(list);
      const init: Record<string, Status> = {};
      for (const s of list) init[s._id] = "P"; // default present
      setAttendance(init);
    } catch (err) {
      Alert.alert("Error", "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (studentId: string, status: Status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const save = async () => {
    if (!selectedClass) return;
    setSaving(true);
    try {
      const payload = {
        classId: selectedClass,
        date: selectedDate.toISOString(),
        records: students.map((s) => ({
          student: s._id,
          status: attendance[s._id] || "P",
          note: s.note || "",
        })),
      };
      await api.saveAttendance(payload);
      Alert.alert("Success", "Attendance saved successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <TopHeader
        title="Attendance"
        onBack={() => router.canGoBack() && router.back()}
      />

      {/* Tabs */}
      <View className="flex-row bg-background dark:bg-background-dark border-b dark:border-gray-700 border-gray-200 rounded-t-3xl">
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
        <View className="bg-background dark:bg-background-dark flex-1 h-full">
          <View className="px-3 pt-3 bg-surface dark:bg-surface-dark">
            <View className="bg-background dark:bg-background-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
              {/* Row: class + date (same heights) */}
              <View className="flex-row gap-3">
                {/* Class */}
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-[#5C6B7A] dark:text-text-dark mb-2">
                    Select Class
                  </Text>
                  <View className="bg-surface dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-xl h-11 px-2 justify-center">
                    <Picker
                      selectedValue={selectedClass}
                      onValueChange={(val) => setSelectedClass(val)}
                      mode="dropdown"
                      style={{
                        height: 66, // keep equal to h-11
                        width: "100%",
                        marginTop: Platform.OS === "android" ? -2 : 0,
                      }}
                      dropdownIconColor="#64748B"
                    >
                      <Picker.Item label="Select Class" value={undefined} />
                      {classes.map((c) => (
                        <Picker.Item
                          key={c.value}
                          label={c.label}
                          value={c.value}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Date */}
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-[#5C6B7A] dark:text-text-dark mb-2">
                    Select Date
                  </Text>

                  {/* Use a tap-to-open input for a consistent 44px height on all platforms */}
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-surface dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-xl h-11 px-4 justify-center"
                  >
                    <Text className="text-gray-800 dark:text-text-dark">
                      {selectedDate.toDateString()}
                    </Text>
                  </TouchableOpacity>

                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "inline" : "calendar"}
                      onChange={(_, d) => {
                        setShowDatePicker(false);
                        if (d) setSelectedDate(d);
                      }}
                    />
                  )}
                </View>
              </View>

              {/* Actions */}
              <View className="flex-row mt-4 gap-3">
                <TouchableOpacity
                  onPress={loadStudents}
                  className="flex-1 h-11 rounded-xl items-center justify-center bg-[#2A62FF]"
                >
                  <Text className="text-white font-semibold">
                    Load Students
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={save}
                  disabled={saving || !students.length}
                  className={`flex-1 h-11 rounded-xl items-center justify-center ${
                    saving || !students.length ? "bg-[#E6ECF5]" : "bg-[#DDE6FF]"
                  }`}
                >
                  {saving ? (
                    <ActivityIndicator color="#2A62FF" />
                  ) : (
                    <Text className="text-[#2A62FF] font-semibold">Submit</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Stats */}
              <View className="flex-row mt-4 gap-3">
                <View className="flex-1 bg-white rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 items-center">
                  <Text className="text-lg font-bold text-[#334155]">
                    {totalStudents}
                  </Text>
                  <Text className="text-xs text-[#94A3B8] mt-0.5">Total</Text>
                </View>
                <View className="flex-1 bg-[#EAF9F0] rounded-xl border border-[#D6F2E0] px-4 py-3 items-center">
                  <Text className="text-lg font-bold text-[#16A34A]">
                    {presentCount}
                  </Text>
                  <Text className="text-xs text-[#16A34A] mt-0.5">Present</Text>
                </View>
                <View className="flex-1 bg-[#FDECEE] rounded-xl border border-[#F9D7DC] px-4 py-3 items-center">
                  <Text className="text-lg font-bold text-[#EF4444]">
                    {absentCount}
                  </Text>
                  <Text className="text-xs text-[#EF4444] mt-0.5">Absent</Text>
                </View>
                <View className="flex-1 bg-[#FFF6E5] rounded-xl border border-[#FFE7BF] px-4 py-3 items-center">
                  <Text className="text-lg font-bold text-[#F59E0B]">
                    {leaveCount}
                  </Text>
                  <Text className="text-xs text-[#F59E0B] mt-0.5">Leave</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-1 px-3 pt-2 bg-surface-dark dark:bg-surface-dark">
            <View className="flex-1 bg-background dark:bg-background-dark rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Header */}
              <View className="flex-row items-center px-4 py-3 border-b dark:border-gray-700 border-gray-200">
                <Text className="w-16 text-[12px] font-semibold text-[#64748B] dark:text-text-dark">
                  R. No
                </Text>
                <Text className="flex-1 text-[12px] font-semibold text-[#64748B] dark:text-text-dark">
                  Name
                </Text>
                <Text className="w-28 text-right text-[12px] font-semibold text-[#64748B] dark:text-text-dark">
                  Action
                </Text>
              </View>

              {/* List */}
              {loading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" />
                </View>
              ) : (
                <FlatList
                  data={students}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item, index }) => (
                    <View className="flex-row items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <Text className="w-16 text-[#475569] dark:text-text-dark">
                        {(item.rollNo ?? index + 1).toString().padStart(2, "0")}
                      </Text>

                      <Text className="flex-1 text-[#111827] dark:text-text-dark">
                        {item.name || `${item.fname} ${item.lname}`}
                      </Text>

                      <View className="w-28 flex-row justify-end">
                        {/* P */}
                        <TouchableOpacity
                          onPress={() => markAttendance(item._id, "P")}
                          className={`px-2.5 h-7 rounded-md mr-2 items-center justify-center ${
                            attendance[item._id] === "P"
                              ? "bg-[#22C55E]"
                              : "bg-[#E2E8F0]"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              attendance[item._id] === "P"
                                ? "text-white"
                                : "text-[#334155]"
                            }`}
                          >
                            P
                          </Text>
                        </TouchableOpacity>

                        {/* A */}
                        <TouchableOpacity
                          onPress={() => markAttendance(item._id, "A")}
                          className={`px-2.5 h-7 rounded-md mr-2 items-center justify-center ${
                            attendance[item._id] === "A"
                              ? "bg-[#EF4444]"
                              : "bg-[#E2E8F0]"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              attendance[item._id] === "A"
                                ? "text-white"
                                : "text-[#334155]"
                            }`}
                          >
                            A
                          </Text>
                        </TouchableOpacity>

                        {/* L */}
                        <TouchableOpacity
                          onPress={() => markAttendance(item._id, "L")}
                          className={`px-2.5 h-7 rounded-md items-center justify-center ${
                            attendance[item._id] === "L"
                              ? "bg-[#F59E0B]"
                              : "bg-[#E2E8F0]"
                          }`}
                        >
                          <Text
                            className={`text-xs font-bold ${
                              attendance[item._id] === "L"
                                ? "text-white"
                                : "text-[#334155]"
                            }`}
                          >
                            L
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </View>
        </View>
      )}

      {/* VIEW */}
      {/* {activeTab === "view" && (
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
      )} */}
    </View>
  );
}
