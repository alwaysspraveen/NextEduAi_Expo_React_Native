// theme/colors.ts
export type AppTheme = "light" | "dark";

export const lightColors = {
  primary: "#3588FE", // bright blue for actions
  secondary: "#E7EDFF", // pale blue background accents
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#F59E0B",
  background: "#FFFFFF", // app background
  surface: "#F7F8FA", // cards/containers
  text: "#3a3a3a", // dark gray (not pure black, easier on eyes)
  muted: "#6B7280", // subdued text/icons
  border: "#E5E7EB",
  headerBg: "#386BF6",
};

export const darkColors = {
  primary: "#3588FE", // lighter blue for visibility on dark bg
  secondary: "#1C2333", // deep navy
  success: "#22C55E",
  danger: "#F87171",
  warning: "#FBBF24",
  background: "#0B0F1A", // app background
  surface: "#1E2432", // cards/containers
  text: "#F9FAFB", // near-white
  muted: "#9CA3AF",
  border: "#1F2937",
  headerBg: "#0B0F1A",
};

export function getColors(theme: AppTheme) {
  return theme === "dark" ? darkColors : lightColors;
}
