import { AppLogo } from "@/assets/icons/icon";
import api, { TodayScheduleItem } from "@/backend/api";
import auth from "@/backend/auth";
import Header from "@/components/Header";
import KPI from "@/components/Kpi";
import NoticeBoard from "@/components/NoticeBoard";
import QuickAccess from "@/components/QuickAccess";
import TodaySchedule from "@/components/TodaySchedule";
import { teacher } from "@/lib/mock";
import MenuGridSkeleton from "@/skeleton/MenuGridSkeleton";
import NoticeBoardSkeleton from "@/skeleton/NoticeBoardSkeleton";
import TodayScheduleSkeleton from "@/skeleton/TodayScheduleSkeleton";
import { useColors } from "@/theme/useColors";
import { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import BookIco from "../../assets/icons/book.svg";
import ClassroomIcon from "../../assets/icons/classroom.svg";

export default function Dashboard() {
  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const c = useColors();
  const todayClassesCount = todaySchedule.length;
  const [items, setItems] = useState<[]>([]);
  const totalSubjects = teacher?.subjects?.length ?? 0; // ✅ safer
  const fetchData = async () => {
    try {
      const res = await api.getNotices(""); // or "all"
      setItems(res);
    } catch (err) {
      console.error("Failed to load notices:", err);
    }
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);

      const teacherId = await auth.getUserId();
      if (!teacherId) {
        console.warn("⚠️ No teacherId found");
        setTodaySchedule([]);
        return;
      }
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const todayDay = weekdays[new Date().getDay()];

      // Call your API with teacherId + today’s day
      const data = await api.getTodayScheduleByTeacherByDay(
        teacherId,
        todayDay
      );
      setTodaySchedule(data ?? []);
    } catch (err) {
      console.error("❌ Failed to load schedule", err);
      setTodaySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <Header
        title="Dashboard"
        subtitle={`${teacher.name} • ${teacher.classes.join(", ")}`}
      />

      <ScrollView
        className="p-4"
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchSchedule}
            tintColor={c.primary}
          />
        }
      >
        {/* Quick Stats */}
        <View className="flex-row mb-5 gap-4">
          <KPI
            title="Today’s Classes"
            count={`${todayClassesCount}`}
            rightIcon={
              <ClassroomIcon
                width={50}
                height={50}
                fill={c.primary} // ✅ theme-aware
              />
            }
          />
          <KPI
            title="Total Subjects"
            count={`${totalSubjects}`}
            rightIcon={
              <BookIco
                width={50}
                height={50}
                fill={c.primary} // ✅ theme-aware
              />
            }
          />
        </View>

        {/* Quick Access Menu */}
        {loading ? <MenuGridSkeleton /> : <QuickAccess />}

        {/* Today’s Schedule */}
        {loading ? (
          <TodayScheduleSkeleton />
        ) : (
          <TodaySchedule
            title="Today's Schedule"
            items={todaySchedule.map((s) => ({
              id: s.id,
              subject: s.subject,
              time: s.period, // ✅ safer
              classLabel: `${s.class} • ${s.room}`,
            }))}
            onViewAll={() => {
              // navigate to full schedule
            }}
            onPressItem={(item) => {
              console.log("Tapped schedule item:", item);
            }}
          />
        )}

        {/* Notice Board */}
        {loading ? (
          <NoticeBoardSkeleton />
        ) : (
          <NoticeBoard
            items={items}
            onViewAll={() => {
              // navigate to full notice board page
            }}
            onPressItem={(item) => {
              console.log("Notice tapped:", item);
            }}
          />
        )}

        {/* Footer */}
        <View className="flex-1 w-full items-center mt-10 mb-5">
          <AppLogo size={144} />
          <Text className="font-bold text-2xl text-gray-400 dark:text-gray-500">
            Made with ❤️
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
