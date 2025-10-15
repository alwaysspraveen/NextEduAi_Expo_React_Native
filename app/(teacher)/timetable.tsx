import api, { TodayScheduleItem } from "@/backend/api";
import auth from "@/backend/auth";
import DayScroller from "@/components/DayScroller";
import ScheduleCard from "@/components/ScheduleCard";
import TopHeader from "@/components/TopHeader";
import TimetableSkeleton from "@/skeleton/TimeTableSkeleton";
import { useColors } from "@/theme/useColors";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

const DAY_KEYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function fmtRange(start?: Date | string | null, end?: Date | string | null) {
  if (!start || !end) return undefined;
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  if (isNaN(+s) || isNaN(+e)) return undefined;
  return `${fmtTime(s)} – ${fmtTime(e)}`;
}
function minutesBetween(a?: Date | string | null, b?: Date | string | null) {
  if (!a || !b) return undefined;
  const s = typeof a === "string" ? new Date(a) : a;
  const e = typeof b === "string" ? new Date(b) : b;
  if (isNaN(+s) || isNaN(+e)) return undefined;
  return Math.max(0, Math.round((+e - +s) / 60000));
}
function todayShort(): (typeof DAY_KEYS)[number] {
  const d = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .slice(0, 3);
  return (DAY_KEYS.includes(d as any) ? d : "Mon") as any;
}

export default function Timetable() {
  const c = useColors();
  const [items, setItems] = useState<TodayScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState<(typeof DAY_KEYS)[number]>(todayShort());
  const [teacherId, setTeacherId] = useState<string | null>(null);
  function normalizeSchedule(r: unknown): TodayScheduleItem[] {
    if (Array.isArray(r)) return r as TodayScheduleItem[];
    if (r && typeof r === "object" && "items" in r) {
      const items = (r as { items?: unknown }).items;
      return Array.isArray(items) ? (items as TodayScheduleItem[]) : [];
    }
    return [];
  }
  useEffect(() => {
    auth.getUserId().then((id) => setTeacherId(id ?? null));
  }, []);

  const fetchForDay = useCallback(
    async (dayShort: (typeof DAY_KEYS)[number]) => {
      if (!teacherId) {
        setItems([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // 🔹 Call the by-day endpoint directly.
        const resp = await api.getTodayScheduleByTeacherByDay(
          teacherId,
          dayShort
        );
        const data = normalizeSchedule(resp);
        setItems(data);
      } catch (err) {
        console.error("❌ Failed to load schedule (by-day)", err);
        // fallback to "today" only if by-day fails
        try {
          const data = await api.getTodayScheduleByTeacher(teacherId);
          setItems(data);
        } catch (e2) {
          console.error("❌ Fallback (today) also failed", e2);
          setItems([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [teacherId]
  );

  useEffect(() => {
    if (teacherId) fetchForDay(day);
  }, [teacherId, day, fetchForDay]);

  const content = useMemo(() => {
    if (loading) {
      return <TimetableSkeleton />;
    }

    if (!items.length) {
      return (
        <View className="flex-1 items-center justify-center py-6">
          <LottieView
            source={require("../../assets/no_data.json")}
            autoPlay
            loop
            style={{ width: "100%", height: 200 }}
            resizeMode="contain"
          />
          <Text className="text-gray-400 mt-2 font-medium">
            No classes scheduled on {day}
          </Text>
        </View>
      );
    }

    return (
      <>
        {items.map((s: any, idx: number) => {
          const title = s.subjectName || s.subject || "—";
          const subtitle = s.classroom
            ? `${s.classroom}${s.room ? ` • Room No : ${s.room}` : ""}`
            : s.class || "";
          const timeLabel =
            fmtRange(s.start, s.end) || s.period || s.periodKey || "";
          const durationMin =
            s.durationMin ?? s.duration ?? minutesBetween(s.start, s.end);

          return (
            <View key={s.id ?? idx} className="mb-3">
              <ScheduleCard
                title={title}
                time={timeLabel}
                subtitle={subtitle}
                status={s.status}
                duration={
                  typeof durationMin === "number"
                    ? `${durationMin} Min`
                    : durationMin
                }
              />
            </View>
          );
        })}
        <Text className="text-gray-400 text-xs mt-4">
          Substitute / Leave handling is applied automatically where available.
        </Text>
      </>
    );
  }, [items, loading, day]);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <TopHeader
        title="Timetable"
        onBack={() => router.replace("/slidemenu")}
      />

      <DayScroller
        onChange={(_, full, short) => {
          setDay(short as (typeof DAY_KEYS)[number]); // ✅ short code direct
        }}
      />

      <ScrollView
        className="px-4"
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchForDay(day)} // 🔹 reuse your existing fetch
            tintColor={c.primary} // optional spinner color
          />
        }
      >
        {content}
      </ScrollView>
    </View>
  );
}
