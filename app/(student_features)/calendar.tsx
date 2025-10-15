// app/(student)/events.tsx
import TopHeader from "@/components/TopHeader";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from "date-fns";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Calendar, type CalendarProps } from "react-native-calendars";

/* ---------------- Mock Data ---------------- */
type Event = {
  id: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  description?: string;
  type: "EXAM" | "HOLIDAY" | "ACTIVITY";
};

const mockEvents: Event[] = [
  {
    id: "1",
    date: "2025-10-05",
    title: "Math Exam",
    description: "Chapters 1–3",
    type: "EXAM",
  },
  {
    id: "2",
    date: "2025-10-10",
    title: "Sports Day",
    description: "Annual sports competition",
    type: "ACTIVITY",
  },
  {
    id: "3",
    date: "2025-10-15",
    title: "Holiday",
    description: "Dussehra",
    type: "HOLIDAY",
  },
  {
    id: "4",
    date: "2025-10-20",
    title: "Science Exhibition",
    description: "Display projects in hall",
    type: "ACTIVITY",
  },
];

/* ---------------- Colors ---------------- */
const EVENT_COLORS = {
  EXAM: { bg: "#FEE2E2", text: "#991B1B" }, // red
  HOLIDAY: { bg: "#DCFCE7", text: "#166534" }, // green
  ACTIVITY: { bg: "#DBEAFE", text: "#1E40AF" }, // blue
};

type DayArg = Parameters<NonNullable<CalendarProps["onDayPress"]>>[0];

export default function EventsCalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );
  const [selected, setSelected] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // group events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    for (const e of mockEvents) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, []);

  /* ---------------- Calendar Markings ---------------- */
  const markedDates = useMemo(() => {
    const obj: Record<string, any> = {};
    const monthDate = parseISO(currentMonth + "-01");
    const allDays = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });

    // Base – all dates normal
    allDays.forEach((d) => {
      const dateStr = format(d, "yyyy-MM-dd");
      obj[dateStr] = {
        customStyles: {
          container: { borderRadius: 6 },
          text: { color: "#111827" },
        },
      };
    });

    // Overlay events
    Object.entries(eventsByDate).forEach(([date, evs]) => {
      const first = evs[0];
      const color = EVENT_COLORS[first.type];
      obj[date] = {
        ...(obj[date] || {}),
        customStyles: {
          container: {
            backgroundColor: color.bg,
            borderRadius: 6,
          },
          text: { color: color.text, fontWeight: "700" },
        },
      };
    });

    // Selected overlay (always last)
    obj[selected] = {
      ...(obj[selected] || {}),
      customStyles: {
        container: {
          backgroundColor: "#1D4ED8",
          borderRadius: 50,
        },
        text: { color: "#FFFFFF", fontWeight: "700" },
      },
    };

    return obj;
  }, [eventsByDate, selected, currentMonth]);

  const selectedEvents = eventsByDate[selected] || [];

  return (
    <ScrollView className="flex-1 bg-surface dark:bg-surface-dark px-4 py-4">
      <TopHeader
        title="Events Calendar"
        onBack={() => router.canGoBack() && router.back()}
      />

      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={(d: DayArg) => setSelected(d.dateString)}
        onMonthChange={(m) =>
          setCurrentMonth(`${m.year}-${String(m.month).padStart(2, "0")}`)
        }
        theme={{
          calendarBackground: "#FFFFFF",
          dayTextColor: "#111827",
          monthTextColor: "#111827",
          textDisabledColor: "#9CA3AF",
          arrowColor: "#386BF6",
        }}
        style={{ borderRadius: 16, overflow: "hidden" }}
      />

      {/* Selected Day Details */}
      <View className="mt-4 p-4 rounded-xl bg-background dark:bg-background-dark shadow-sm">
        <Text className="text-text font-semibold mb-2">
          Events on {format(parseISO(selected), "EEE, d MMM")}
        </Text>
        {selectedEvents.length === 0 ? (
          <Text className="text-gray-500">No events.</Text>
        ) : (
          selectedEvents.map((ev) => (
            <View
              key={ev.id}
              className="mb-2 rounded-xl border border-gray-200 bg-white flex-row"
              style={{
                overflow: "hidden",
              }}
            >
              {/* Ribbon */}
              <View
                style={{
                  width: 6,
                  backgroundColor:
                    ev.type === "EXAM"
                      ? "#DC2626" // red
                      : ev.type === "HOLIDAY"
                      ? "#16A34A" // green
                      : "#2563EB", // blue for activity
                  borderTopLeftRadius: 12,
                  borderBottomLeftRadius: 12,
                }}
              />

              {/* Card Content */}
              <View className="flex-1 p-3">
                <Text className="font-semibold text-gray-900">{ev.title}</Text>
                {ev.description && (
                  <Text className="text-gray-600 mt-1">{ev.description}</Text>
                )}
                <Text className="text-xs text-gray-500 mt-1">
                  Type: {ev.type}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
