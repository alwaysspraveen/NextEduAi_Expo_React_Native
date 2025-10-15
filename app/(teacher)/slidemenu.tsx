import {
  BookIcon,
  CalenderIcon,
  ChatIcon,
  FolderIcon,
  OpenBookIcon,
  ReportIcon,
  SuccessIcon,
  TimerIcon,
} from "@/assets/icons/icon";
import MenuGrid from "@/components/MenuGrid";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SlideMenu() {
  const sections = [
    {
      title: "Academics",
      items: [
        {
          key: "timetable",
          label: "Time Table",
          icon: <CalenderIcon size={36} />,
          href: "/timetable" as const,
        },
        {
          key: "assignments",
          label: "Assignments",
          icon: <BookIcon size={36} />,
          href: "/assignments" as const,
        },
        {
          key: "exams",
          label: "Exams",
          icon: <OpenBookIcon size={36} />,
          href: "/exams" as const,
        },
        {
          key: "content",
          label: "Contents / Notes",
          icon: <FolderIcon size={36} />,
          href: "/(teacher_features)/content" as const,
        },
      ],
    },
    {
      title: "Reports & Evaluation",
      items: [
        {
          key: "attendance",
          label: "Attendance",
          icon: <SuccessIcon size={36} />,
          href: "/teacher_attendance" as const,
        },
        {
          key: "grades",
          label: "Grades / Marks Entry",
          icon: <ReportIcon size={36} />,
          href: "/grades" as const,
        },
        {
          key: "reports",
          label: "Reports",
          icon: <ReportIcon size={36} />,
          href: "/reports" as const,
        },
      ],
    },
    {
      title: "Communication",
      items: [
        {
          key: "announcements",
          label: "Announcements",
          icon: <ChatIcon size={36} />,
          href: "/announcements" as const,
        },
        {
          key: "chat",
          label: "AI Chat / Q&A",
          icon: <ChatIcon size={36} />,
          href: "/chat" as const,
        },
        {
          key: "students",
          label: "Student Profiles",
          icon: <BookIcon size={36} />,
          href: "/(student)/attendance" as const,
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          key: "leave",
          label: "Leave Requests",
          icon: <TimerIcon size={36} />,
          href: "/leave" as const,
        },
        {
          key: "calendar",
          label: "Calendar / Events",
          icon: <CalenderIcon size={36} />,
          href: "/calendar" as const,
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-surface dark:bg-surface-dark">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section) => (
          <View key={section.title} className="mb-6">
            <View className="border-b mb-4 border-gray-200">
              <Text className="text-xl font-bold text-text dark:text-text-dark mb-3">
                {section.title}
              </Text>
            </View>
            <MenuGrid items={section.items} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
