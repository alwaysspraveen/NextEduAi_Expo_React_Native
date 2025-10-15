// app/(student)/attendance.tsx
import api from "@/backend/api";
import auth from "@/backend/auth";
import GaugeDial from "@/components/GaugeDial";
import TopHeader from "@/components/TopHeader";
import { useColors } from "@/theme/useColors";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isSunday,
  parseISO,
  startOfMonth,
} from "date-fns";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Calendar, type CalendarProps } from "react-native-calendars";

type Status = "present" | "absent" | "late";
type Attendance = {
  date: string; // "YYYY-MM-DD"
  status: Status;
  subject?: string;
  remark?: string;
};

type DayArg = Parameters<NonNullable<CalendarProps["onDayPress"]>>[0];

const COLORS = {
  presentBg: "#DCFCE7",
  presentText: "#166534",
  absentBg: "#FEE2E2",
  absentText: "#991B1B",
  lateBg: "#FEF3C7",
  lateText: "#92400E",
  selected: "#066DFF",
};

// precedence when multiple entries exist for the same day
const statusRank: Record<Status, number> = { absent: 3, late: 2, present: 1 };

export default function StudentAttendanceScreen() {
  const c = useColors();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const id = await auth.getUserId();
        if (!id) {
          console.warn("No user id found. Skipping attendance fetch.");
          return;
        }

        const items = await api.getAttendanceByStudent(id); // ← already an array
        setAttendance(items);
      } catch (e) {
        console.error("❌ Failed to fetch attendance", e);
      } finally {
        setLoading(false); // always stop the loader
      }
    })();
  }, []);

  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selected, setSelected] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // Build per-day best status (if duplicates exist, use highest precedence)
  const bestStatusByDate = useMemo(() => {
    const pick: Record<string, Status> = {};
    for (const a of attendance) {
      const cur = pick[a.date];
      if (!cur || statusRank[a.status] > statusRank[cur]) {
        pick[a.date] = a.status;
      }
    }
    return pick;
  }, [attendance]);

  const markedDates = useMemo(() => {
    const obj: Record<string, any> = {};

    const monthDate = parseISO(currentMonth + "-01");
    const allDays = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });

    // 1. Base coloring
    allDays.forEach((d) => {
      const dateStr = format(d, "yyyy-MM-dd");

      if (!isSunday(d)) {
        obj[dateStr] = {
          customStyles: {
            text: {
              color: "#1E88E5", // blue-900
              fontWeight: "500",
            },
          },
        };
      } else {
        obj[dateStr] = {
          customStyles: {
            text: { color: "#9CA3AF" },
          },
        };
      }
    });

    // 2. Attendance overlay
    Object.entries(bestStatusByDate).forEach(([date, status]) => {
      if (!obj[date]) obj[date] = { customStyles: { container: {}, text: {} } };

      if (status === "present") {
        obj[date].customStyles.container = {
          backgroundColor: COLORS.presentBg,
          borderRadius: 6,
        };
        obj[date].customStyles.text = {
          color: COLORS.presentText,
          fontWeight: "600",
        };
      } else if (status === "absent") {
        obj[date].customStyles.container = {
          backgroundColor: COLORS.absentBg,
          borderRadius: 6,
        };
        obj[date].customStyles.text = {
          color: COLORS.absentText,
          fontWeight: "700",
        };
      } else if (status === "late") {
        obj[date].customStyles.container = {
          backgroundColor: COLORS.lateBg,
          borderRadius: 6,
        };
        obj[date].customStyles.text = {
          color: COLORS.lateText,
          fontWeight: "600",
        };
      }
    });

    // 3. Today overlay
    const todayStr = format(new Date(), "yyyy-MM-dd");
    obj[todayStr] = {
      ...(obj[todayStr] || {}),
      customStyles: {
        container: {
          backgroundColor: "#2563EB", // blue-600
          borderRadius: 6,
        },
        text: {
          color: "#FFFFFF",
          fontWeight: "700",
        },
      },
    };

    // 4. Selected overlay (always last)
    obj[selected] = {
      ...(obj[selected] || {}),
      customStyles: {
        container: {
          backgroundColor: "#9DB6FF", // darker blue
          borderRadius: 50,
        },
        text: {
          color: "#0031BD",
          fontWeight: "700",
        },
      },
    };

    return obj;
  }, [bestStatusByDate, selected, currentMonth]);

  // Month summary
  const monthSummary = useMemo(() => {
    const monthDate = parseISO(currentMonth + "-01");
    const items = attendance.filter((a) =>
      isSameMonth(parseISO(a.date), monthDate)
    );
    const allDays = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });
    const total = items.length || 1;
    const workingDays = allDays.filter((d) => !isSunday(d)).length;
    const present = items.filter((a) => a.status === "present").length;
    const absent = items.filter((a) => a.status === "absent").length;
    const late = items.filter((a) => a.status === "late").length;
    const pct = Math.round((present / total) * 100);
    return { total, present, absent, late, pct, workingDays };
  }, [attendance, currentMonth]);

  const selectedDetails = attendance.filter((a) => a.date === selected);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#386BF6" />
        <Text className="mt-2 text-text dark:text-text-dark">
          Loading attendance...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <StatusBar
        style={c.theme === "dark" ? "light" : "dark"}
        backgroundColor={c.surface}
      />
      <TopHeader
        title="Attendance Report"
        onBack={() => router.canGoBack() && router.back()}
      />
      <View className="px-4 mt-2">
        <Calendar
          markingType="custom"
          markedDates={markedDates}
          onDayPress={(d: DayArg) => setSelected(d.dateString)}
          onMonthChange={(m) =>
            setCurrentMonth(`${m.year}-${String(m.month).padStart(2, "0")}`)
          }
          theme={{
            calendarBackground: c.background,
            dayTextColor: "#111827",
            monthTextColor: c.text,
            textDisabledColor: "#9CA3AF",
            arrowColor: "#386BF6",
          }}
          style={{ borderRadius: 16, overflow: "hidden" }}
        />

        {/* Month Summary */}
        <View className="mt-4 p-4 rounded-xl bg-background dark:bg-background-dark shadow-sm">
          {/* <View className="flex-row gap-4 border border-gray-100 p-2 justify-between mb-2 rounded-lg">
          <Legend
            color={COLORS.presentBg}
            label="Present"
            textColor={COLORS.presentText}
          />
          <Legend
            color={COLORS.absentBg}
            label="Absent"
            textColor={COLORS.absentText}
          />
          <Legend
            color={COLORS.lateBg}
            label="Late"
            textColor={COLORS.lateText}
          />
        </View> */}
          <Text className="text-text dark:text-text-dark font-semibold mb-1">
            {format(parseISO(currentMonth + "-01"), "MMMM yyyy")}
          </Text>
          <View className="flex-row">
            {/* 2×2 Grid on Left */}
            <View className="flex-1 flex-row flex-wrap -mx-1">
              {/* Present */}
              <View className="w-1/2 p-1">
                <View className="rounded-xl border border-[#D6F2E0] bg-[#DCFCE7] px-2 py-2 items-center">
                  <Text className="text-lg font-bold text-[#166534]">
                    {monthSummary.present}
                  </Text>
                  <Text className="text-xs font-semibold text-[#166534] mt-0.5">
                    Present
                  </Text>
                </View>
              </View>

              {/* Absent */}
              <View className="w-1/2 p-1">
                <View className="rounded-xl border border-[#F9D7DC] bg-[#FEE2E2] px-2 py-2 items-center">
                  <Text className="text-lg font-bold text-[#991B1B]">
                    {monthSummary.absent}
                  </Text>
                  <Text className="text-xs font-semibold text-[#991B1B] mt-0.5">
                    Absent
                  </Text>
                </View>
              </View>

              {/* Late */}
              <View className="w-1/2 p-1">
                <View className="rounded-xl border border-[#FFE7BF] bg-[#FEF3C7] px-2 py-2 items-center">
                  <Text className="text-lg font-bold text-[#92400E]">
                    {monthSummary.late}
                  </Text>
                  <Text className="text-xs font-semibold text-[#92400E] mt-0.5">
                    Late
                  </Text>
                </View>
              </View>

              {/* Total */}
              <View className="w-1/2 p-1">
                <View className="rounded-xl border border-[#a5ceff] bg-[#d3e7ff] px-2 py-2 items-center">
                  <Text className="text-lg font-bold text-[#1E3A8A]">
                    {monthSummary.workingDays}
                  </Text>
                  <Text className="text-xs font-semibold text-[#1E3A8A] mt-0.5">
                    Total days
                  </Text>
                </View>
              </View>
            </View>

            {/* GaugeDial on Right */}
            <View className="w-32 items-center justify-center ml-2">
              <GaugeDial value={monthSummary.pct} label="Attendance" />
            </View>
          </View>
        </View>

        {/* Selected Day Details */}
        <View className="mt-4 p-4 rounded-xl bg-background dark:bg-background-dark shadow-sm">
          <Text className="text-text dark:text-text-dark font-semibold mb-2">
            {format(parseISO(selected), "EEE, d MMM")}
          </Text>
          {selectedDetails.length === 0 ? (
            <Text className="text-muted dark:text-muted">
              No records for this day.
            </Text>
          ) : (
            selectedDetails.map((a, i) => (
              <View key={i} className="mb-2">
                <Text className="text-text dark:text-text">
                  {a.subject ?? "—"} · {a.status.toUpperCase()}
                </Text>
                {!!a.remark && (
                  <Text className="text-muted dark:text-muted mt-1">
                    Remark: {a.remark}
                  </Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* Filters */}
        <View className="flex-row gap-3 mt-4 w-full justify-between">
          <FilterChip
            label="This Month"
            onPress={() => setCurrentMonth(format(new Date(), "yyyy-MM"))}
          />
          <FilterChip
            label="Prev Month"
            onPress={() => {
              const d = new Date(currentMonth + "-01");
              d.setMonth(d.getMonth() - 1);
              setCurrentMonth(format(d, "yyyy-MM"));
            }}
          />
        </View>
      </View>
    </View>
  );
}

function FilterChip({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="px-3 py-2 rounded-full bg-primary"
    >
      <Text className="text-text-dark">{label}</Text>
    </TouchableOpacity>
  );
}
