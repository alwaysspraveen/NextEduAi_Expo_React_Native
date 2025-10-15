import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme as useNWColorScheme } from "nativewind";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { getColors, type AppTheme } from "./colors";

type Mode = "system" | AppTheme;

type Ctx = {
  mode: Mode;
  theme: AppTheme;
  colors: ReturnType<typeof getColors>;
  setMode: (m: Mode) => void;
  toggle: () => void;
  ready: boolean; // 👈 add hydration flag
};

const ThemeCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "app:theme-mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useRNColorScheme(); // "light" | "dark" | null
  const { setColorScheme } = useNWColorScheme();
  const [mode, setMode] = useState<Mode>("system");
  const [ready, setReady] = useState(false); // 👈 new state

  // 🧩 Load saved theme once on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark" || saved === "system") {
          setMode(saved);
        }
      } finally {
        setReady(true); // ✅ now ready to render
      }
    })();
  }, []);

  // 🧠 Decide effective theme
  const theme: AppTheme =
    mode === "system" ? ((system ?? "light") as AppTheme) : mode;

  // 🎨 Compute colors
  const colors = useMemo(() => getColors(theme), [theme]);

  // 💾 Persist selected mode
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, mode).catch(() => {});
  }, [mode]);

  // 🔄 Sync with NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme, setColorScheme]);

  // 🧭 Provide context
  const value: Ctx = useMemo(
    () => ({
      mode,
      theme,
      colors,
      ready,
      setMode,
      toggle: () => {
        if (mode === "system") {
          setMode("dark");
        } else {
          setMode(mode === "dark" ? "light" : "dark");
        }
      },
    }),
    [mode, theme, colors, ready]
  );

  // 🚫 Don’t render until theme is ready → avoids flicker
  if (!ready) return null;

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useThemeCtx() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useThemeCtx must be used within ThemeProvider");
  return ctx;
}
