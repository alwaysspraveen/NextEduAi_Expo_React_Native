import { environment } from "@/environment/environment";
import interceptor from "@/services/interceptor";
import auth from "./auth";

export interface NotificationPayload {
  _id: string;
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  read: boolean;
  createdAt: string;
}

export const notificationService = {
  async getUserNotifications(): Promise<NotificationPayload[]> {
    const userId = await auth.getUserId();
    const res = await interceptor.get(
      `${environment.apiUrl}/push-notify/${userId}`
    );
    return res.data; // ✅ axios returns { data, status, headers... }
  },

  async registerToken(token: string): Promise<void> {
    if (!token) return;
    await interceptor.post(`${environment.apiUrl}/push-notify/register-token`, {
      token,
    });
  },

  async markAsRead(id: string): Promise<NotificationPayload> {
    const res = await interceptor.patch(
      `${environment.apiUrl}/push-notify/read/${id}`
    );
    return res.data;
  },

  async markAllAsRead(): Promise<void> {
    const userId = await auth.getUserId();
    await interceptor.patch(
      `${environment.apiUrl}/push-notify/read-all/${userId}`
    );
  },

  async getUnreadCount(): Promise<number> {
    const userId = await auth.getUserId();
    const res = await interceptor.get(
      `${environment.apiUrl}/push-notify/unread-count/${userId}`
    );
    if (!res.data) return 0;
    return res.data.unread;
  },
};
