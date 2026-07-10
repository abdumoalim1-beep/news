import Link from "next/link";
import { Theme } from "@/lib/theme";
import SocialLinks from "./SocialLinks";
import ThemeToggleButton from "./ThemeToggleButton";

export default function BackHeader({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: "8px 4px 0",
      }}
    >
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 14,
          background: theme.pillBg,
          border: `1px solid ${theme.pillBorder}`,
          borderRadius: 100,
          padding: "7px 16px",
        }}
      >
        <span>↗</span> رجوع للرئيسية
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <SocialLinks theme={theme} />
        <ThemeToggleButton />
      </div>
    </div>
  );
}
