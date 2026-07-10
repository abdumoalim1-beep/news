"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggleButton() {
  const { dark, theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="تبديل الوضع الليلي"
      style={{
        width: 34,
        height: 34,
        borderRadius: 100,
        background: theme.pillBg,
        border: `1px solid ${theme.pillBorder}`,
        cursor: "pointer",
        fontSize: 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
