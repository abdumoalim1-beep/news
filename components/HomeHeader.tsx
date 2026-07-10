"use client";

import { useState, useCallback } from "react";
import { Theme } from "@/lib/theme";
import SocialLinks from "./SocialLinks";
import ThemeToggleButton from "./ThemeToggleButton";

export default function HomeHeader({ theme }: { theme: Theme }) {
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    try {
      navigator.clipboard.writeText("Abdu.moalim1@gmail.com");
    } catch {
      // ignore
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: "8px 4px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14, color: theme.muted }}>
          Abdu.moalim1@gmail.com
        </span>
        <button
          onClick={copyEmail}
          style={{
            background: theme.pillBg,
            border: `1px solid ${theme.pillBorder}`,
            borderRadius: 100,
            padding: "7px 16px",
            fontSize: 13,
            color: theme.text,
            cursor: "pointer",
          }}
        >
          {copied ? "تم النسخ" : "نسخ البريد"}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <SocialLinks theme={theme} />
        <ThemeToggleButton />
      </div>
    </div>
  );
}
