// app/guards/AuthProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type User = {
  id: string;
  email: string;
  role: "TEACHER" | "STUDENT";
  name?: string; // if backend sometimes sends `name`
  fname?: string; // ✅ allow first name
  schoolName?: string; // ✅ map tenant.name here
  tenantId?: string;
  tenantCode?: string;
};

type AuthData = {
  user: User;
  token: string;
};

type AuthContextType = {
  authData: AuthData | null;
  login: (data: AuthData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthCtx = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("authData");
      if (stored) setAuthData(JSON.parse(stored));
      setLoading(false);
    })();
  }, []);

  const login = async (data: AuthData) => {
    await AsyncStorage.setItem("authData", JSON.stringify(data));
    setAuthData(data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("authData");
    setAuthData(null);
  };

  return (
    <AuthCtx.Provider value={{ authData, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
