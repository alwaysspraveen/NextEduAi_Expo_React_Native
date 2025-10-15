// backendServices.ts
import { environment } from "@/environment/environment";
import interceptor from "@/services/interceptor";

// ✅ Replace these with your real API base URLs
export const userApiUrl = `${environment.apiUrl}/users`;
export const classroomApiUrl = `${environment.apiUrl}/classes`;
export const subjectApiUrl = `${environment.apiUrl}/subjects`;
export const timetableApiUrl = `${environment.apiUrl}/timetable`;
export const attendanceApiUrl = `${environment.apiUrl}/attendance`;
export const materialsApiUrl = `${environment.apiUrl}/materials`;
export const leaveApiUrl = `${environment.apiUrl}/leaves`;
export const noticeApiUrl = `${environment.apiUrl}/notices`;
// Interfaces

export interface TTEntry {
  day: string;
  periodKey: string;
  subjectId?: string | null;
  teacherId?: string | null;
  roomId?: string | null;
}

export interface ClasswiseRow {
  classroom: { _id: string; name: string; section?: string };
  teacher?: { _id: string; name: string } | null;
  total: number;
  present: number;
  late: number;
  absent: number;
  unmarked: number;
  percentage: number;
  lastMarkedAt?: string;
}

export interface Substitution {
  date: string;
  classroomId: string;
  periodKey: string;
  subjectId?: string;
  absentTeacherId: string;
  substituteTeacherId?: string;
  mode: "SUBJECT" | "ALT_SUBJECT" | "SUPERVISION";
}

export interface PublishTimetableDto {
  classroomId: string;
  weekStart: string;
  entries: TTEntry[];
}

class BackendServices {
  createAnnouncement(arg0: {
    title: string;
    message: string;
    teacherId: string;
  }) {
    throw new Error("Method not implemented.");
  }
  // ✅ USERS
  async getUsers(role: string) {
    const res = await interceptor.get(`${userApiUrl}?role=${role}`);
    return res.data;
  }

  async addUser(data: FormData | object) {
    const res = await interceptor.post(userApiUrl, data);
    return res.data;
  }

  async updateUser(id: string, data: Partial<any> | FormData) {
    const res = await interceptor.put(`${userApiUrl}/${id}`, data);
    return res.data;
  }

  async deleteUser(id: string) {
    const res = await interceptor.delete(`${userApiUrl}/${id}`);
    return res.data;
  }

  // ✅ STUDENTS
  async addStudent(data: FormData | object) {
    const res = await interceptor.post(userApiUrl, data);
    return res.data;
  }

  async getStudentsByClass(classId: string) {
    const res = await interceptor.get(`${userApiUrl}/${classId}`);
    return res.data;
  }

  async updateStudent(id: string, data: Partial<any> | FormData) {
    const res = await interceptor.put(`${userApiUrl}/${id}`, data);
    return res.data;
  }

  async deleteStudent(id: string) {
    const res = await interceptor.delete(`${userApiUrl}/${id}`);
    return res.data;
  }

  // ✅ PARENTS
  async getParentsByClassSection(classId?: string, section?: string) {
    const params: any = {};
    if (classId) params.classId = classId;
    if (section) params.section = section;
    const res = await interceptor.get(`${userApiUrl}/parents`, { params });
    return res.data;
  }

  // ✅ CLASSROOMS
  async getClassrooms() {
    const res = await interceptor.get(classroomApiUrl);
    return res.data;
  }

  async getClassroomsById(id: string) {
    const res = await interceptor.get(`${classroomApiUrl}/by-classname/${id}`);
    return res.data;
  }

  async addClassroom(data: FormData) {
    const res = await interceptor.post(classroomApiUrl, data);
    return res.data;
  }

  async deleteClassroom(id: string) {
    const res = await interceptor.delete(
      `${classroomApiUrl}/delete-class/${id}`
    );
    return res.data;
  }

  async updateClass(id: string, data: Partial<any>) {
    const res = await interceptor.put(`${classroomApiUrl}/${id}`, data);
    return res.data;
  }

  async getClassByTeacher(teacherId: string) {
    const res = await interceptor.get(
      `${classroomApiUrl}/by-teacher/${teacherId}`
    );
    return res.data;
  }

  // ✅ SUBJECTS
  async addSubject(data: FormData | object) {
    const res = await interceptor.post(subjectApiUrl, data);
    return res.data;
  }

  async getSubjectsByClass(id: string) {
    const res = await interceptor.get(`${subjectApiUrl}/by-class/${id}`);
    return res.data;
  }

  async deleteSubject(id: string) {
    const res = await interceptor.delete(`${subjectApiUrl}/${id}`);
    return res.data;
  }

  async updateSubject(id: string, data: Partial<any>) {
    const res = await interceptor.put(`${subjectApiUrl}/${id}`, data);
    return res.data;
  }

  async getSubjectsByClassandTeacher(classId: string, teacherId: string) {
    const res = await interceptor.get(
      `${subjectApiUrl}/by-class/${classId}/teacher/${teacherId}`
    );
    return res.data;
  }

  async getSubjectsByTeacher(teacherId: string) {
    const res = await interceptor.get(`${subjectApiUrl}/teacher/${teacherId}`);
    return res.data;
  }

  async getSubjects() {
    const res = await interceptor.get(subjectApiUrl);
    return res.data;
  }

  // ✅ TIMETABLE
  async getTimetable(classroomId: string, weekStartISO: string) {
    const res = await interceptor.get(timetableApiUrl, {
      params: { classroomId, weekStart: weekStartISO },
    });
    return res.data;
  }

  async generateTimetable(body: { classroomId: string; weekStart: string }) {
    const res = await interceptor.post(`${timetableApiUrl}/generate`, body);
    return res.data;
  }

  async validateTimetable(entries: any[]) {
    const res = await interceptor.post(`${timetableApiUrl}/validate`, {
      entries,
    });
    return res.data;
  }

  async publishTimetable(body: PublishTimetableDto) {
    const res = await interceptor.post(`${timetableApiUrl}/publish`, body);
    return res.data;
  }

  // ✅ ATTENDANCE
  async getAttendanceByClassAndDate(classId: string, date: string) {
    const res = await interceptor.get(`${attendanceApiUrl}/${classId}/${date}`);
    return res.data;
  }

  async getAttendanceByStudent(studentId: string) {
    const res = await interceptor.get(`${attendanceApiUrl}/${studentId}`);
    // return the array directly
    return res.data?.data || [];
  }

  async getAttendanceReportByClass(
    classId: string,
    year: string,
    month: string
  ) {
    const res = await interceptor.get(
      `${attendanceApiUrl}/students-monthly/${classId}/${year}/${month}`
    );
    return res.data;
  }
  async saveAttendance(data: any) {
    const res = await interceptor.post(attendanceApiUrl, data);
    return res.data;
  }

  async getClasswiseSummary(params: {
    date?: string;
    classroomId?: string;
    minPct?: number;
    onlyUnmarked?: boolean;
  }) {
    const res = await interceptor.get(`${attendanceApiUrl}/classwise-summary`, {
      params,
    });
    return res.data;
  }

  // ✅ LEAVES
  async getLeaves(teacherId: string) {
    const res = await interceptor.get(`${leaveApiUrl}/teacher/${teacherId}`);
    return res.data;
  }
  async applyLeave(
    teacherId: string,
    startDate: Date,
    endDate: Date,
    reason: string
  ) {
    const res = await interceptor.post("/leaves", {
      teacherId,
      startDate: startDate.toISOString(), // ✅ convert Date → string
      endDate: endDate.toISOString(),
      reason,
    });
    return res.data;
  }

  async approveLeave(leaveId: string) {
    const res = await interceptor.post(`${leaveApiUrl}/${leaveId}/approve`, {});
    return res.data;
  }

  async rejectLeave(id: string, remark: string) {
    const res = await interceptor.post(`${leaveApiUrl}/${id}/reject`, {
      remark,
    });
    return res.data;
  }

  async cancelLeave(id: string) {
    const res = await interceptor.post(`${leaveApiUrl}/${id}/cancel`, {});
    return res.data;
  }

  // ✅ MATERIALS
  async uploadMaterials(
    classId: string,
    subjectId: string,
    materialId: string
  ) {
    const res = await interceptor.post(materialsApiUrl, {
      classId,
      subjectId,
      materialId,
    });
    return res.data;
  }

  async getMaterialId(classId: string, subjectId: string) {
    const res = await interceptor.get(
      `${materialsApiUrl}/${classId}/${subjectId}`
    );
    return res.data;
  }

  // ✅ COUNTRIES / STATES / CITIES (public API)
  async getCountries() {
    const res = await interceptor.get(
      "https://countriesnow.space/api/v0.1/countries/currency"
    );
    return res.data;
  }

  async getStates(payload: { country: string }) {
    const res = await interceptor.post(
      "https://countriesnow.space/api/v0.1/countries/states",
      payload
    );
    return res.data;
  }

  async getCities(country: string, state: string) {
    const res = await interceptor.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      { country, state }
    );
    return res.data;
  }

  async getNotices(status: "all" | "" = "") {
    const res = await interceptor.get(`${noticeApiUrl}?status=${status}`);
    const data = res.data?.data || [];

    return data.map((n: any) => ({
      id: n._id,
      title: n.title,
      subtitle: n.body,
      time: n.publishAt ? new Date(n.publishAt).toLocaleDateString() : "",
      period: undefined,
      classLabel: n.publishedBy?.name || "Admin",
    }));
  }

  // ✅ SUBSTITUTIONS
  async getSubstitutions(classroomId: string, fromISO: string, toISO: string) {
    const res = await interceptor.get(`/api/substitutions`, {
      params: { classroomId, from: fromISO, to: toISO },
    });
    return res.data;
  }

  async getTodayScheduleByTeacher(teacherId: string) {
    try {
      const res = await interceptor.get(
        `${timetableApiUrl}/get-timetable/${teacherId}`
      );
      return mapTodaySchedule(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch timetable:", err);
      return [];
    }
  }

  async getTodayScheduleByTeacherByDay(teacherId: string, day: string) {
    try {
      const res = await interceptor.get(
        `${timetableApiUrl}/get-timetable/${teacherId}/${day}`
      );
      return mapTodaySchedule(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch timetable:", err);
      return [];
    }
  }
}

export default new BackendServices();

const PERIOD_MAP: Record<string, string> = {
  P1: "09:00 – 09:45 AM",
  P2: "10:00 – 10:45 AM",
  P3: "11:00 – 11:45 AM",
  P4: "12:00 – 12:45 PM",
  P5: "01:30 – 02:15 PM",
  P6: "02:30 – 03:15 PM",
};
export type TodayScheduleItem = {
  id: string;
  periodKey: string;
  period: string;
  class: string;
  subject: string;
  room: string;
  status: string;
  duration?: string;
  day: string;
  items?: TodayScheduleItem[]; // for by-day endpoint
};

function mapTodaySchedule(apiData: any): TodayScheduleItem[] {
  return (apiData.items || [])
    .map(
      (item: any, idx: number): TodayScheduleItem => ({
        id: `t${idx + 1}`,
        periodKey: item.periodKey,
        period: PERIOD_MAP[item.periodKey] || item.periodKey,
        class: item.classroom,
        subject: item.subjectName,
        day: item.day,
        room: item.room || "N/A",
        status: item.status,
        duration: item.durationMin,
      })
    )
    .sort((a: TodayScheduleItem, b: TodayScheduleItem) => {
      const keys = Object.keys(PERIOD_MAP);
      return keys.indexOf(a.periodKey) - keys.indexOf(b.periodKey);
    });
}
