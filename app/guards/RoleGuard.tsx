// app/guards/RoleGuard.tsx
import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "./AuthProvider";

export default function RoleGuard({
  allowed,
  children,
}: {
  allowed: ("TEACHER" | "STUDENT")[];
  children: React.ReactNode;
}) {
  const { authData, loading } = useAuth();

  if (loading) return null; // splash/loader
  if (!authData) return <Redirect href="/(auth)/login" />;

  const role = authData.user.role;
  if (!allowed.includes(role)) {
    return <Redirect href={role === "TEACHER" ? "/(teacher)" : "/(student)"} />;
  }

  return <>{children}</>;
}
