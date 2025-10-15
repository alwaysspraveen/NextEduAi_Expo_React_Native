// src/services/authService.ts
import { User } from "@/app/guards/AuthProvider";
import { environment } from "@/environment/environment";
import interceptor from "@/services/interceptor";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Auth = {
  message: string;
  token: string;
  user: User; // 👈 use your extended type here
  tenant?: {
    id: string;
    code: string;
    name: string;
  };
};

export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

class AuthService {
  // ✅ Login
  async login(email: string, password: string): Promise<Auth> {
    const res = await interceptor.post<Auth>(
      `${environment.apiUrl}/auth/login`,
      {
        email,
        password,
      }
    );

    // Save token
    await AsyncStorage.setItem("token", res.data.token);

    return res.data;
  }
  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    const res = await interceptor.put<Auth>(
      `${environment.apiUrl}/auth/change-password`,
      {
        currentPassword,
        newPassword,
        confirmPassword,
      }
    );
    return res.data;
  }

  // ✅ Logout
  async logout() {
    await AsyncStorage.clear();
  }

  // ✅ Check login
  async isLoggedIn(): Promise<boolean> {
    const token = await AsyncStorage.getItem("token");
    return !!token;
  }

  // ✅ Get token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem("token");
  }

  // ✅ Get user ID from token
  async getUserId(): Promise<string | null> {
    const token = await this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
    return null;
  }

  // ✅ Get role from token
  async getUserRole(): Promise<string | null> {
    const token = await this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role;
      } catch (e) {
        console.error("Error decoding token", e);
      }
    }
    return null;
  }

  // ✅ Role checks
  async isAdmin(): Promise<boolean> {
    return (await this.getUserRole()) === "admin";
  }

  async isStaff(): Promise<boolean> {
    return (await this.getUserRole()) === "staff";
  }
}

export default new AuthService();
