// useColors.ts
import { useThemeCtx } from "./ThemeProvider";

export function useColors() {
  const { colors, theme } = useThemeCtx();
  return { ...colors, theme }; // 👈 include theme here
}
