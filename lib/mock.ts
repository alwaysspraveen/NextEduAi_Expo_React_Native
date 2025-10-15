export const teacher = {
  name: "Yogita Shaje",
  role: "Teacher",
  classes: ["VII B", "VIII A"],
  subjects: ["English", "Science"],
};

export const notices = [
  {
    id: "n1",
    title: "School will remain closed on Friday",
    date: "17 Sep 2025",
  },
  { id: "n2", title: "PTM scheduled next week", date: "20 Sep 2025" },
];

export const todaySchedule = [
  {
    id: "t1",
    period: "09:00–09:45",
    class: "VII B",
    subject: "English",
    room: "205",
  },
  {
    id: "t2",
    period: "10:00–10:45",
    class: "VIII A",
    subject: "Science",
    room: "307",
  },
  {
    id: "t3",
    period: "11:00–11:45",
    class: "VII B",
    subject: "English",
    room: "205",
  },
];

export const homework = [
  {
    id: "h1",
    subject: "English",
    task: "Write an essay on ‘My Hobby’",
    due: "Today",
    done: false,
  },
  {
    id: "h2",
    subject: "Maths",
    task: "Algebra worksheet pg 42",
    due: "Tomorrow",
    done: true,
  },
  {
    id: "h3",
    subject: "Science",
    task: "Label parts of a flower",
    due: "Friday",
    done: false,
  },
];

export const students = [
  { id: "s1", name: "Anika", present: true },
  { id: "s2", name: "Ravi", present: false },
  { id: "s3", name: "Kabir", present: true },
  { id: "s4", name: "Sana", present: true },
];

export const menu = [
  { key: "timetable", title: "Timetable", icon: "calendar-outline" },
  { key: "assignments", title: "Assignments", icon: "document-text-outline" },
  { key: "attendance", title: "Attendance", icon: "checkmark-done-outline" },
  { key: "exams", title: "Exams", icon: "school-outline" },
  { key: "content", title: "Content", icon: "folder-open-outline" },
  { key: "(features)/chat", title: "Chat", icon: "chatbubbles-outline" },
  { key: "reports", title: "Reports", icon: "bar-chart-outline" },
  { key: "profile", title: "Profile", icon: "person-circle-outline" },
  { key: "leave", title: "Leave", icon: "time-outline" },
];

export const quizBank = [
  {
    id: "q1",
    type: "mcq",
    question: "Synonym of ‘Happy’?",
    options: ["Sad", "Joyful", "Angry", "Afraid"],
    answer: 1,
  },
  { id: "q2", type: "short", question: "Define photosynthesis." },
];
