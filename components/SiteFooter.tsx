import { Theme } from "@/lib/theme";
import SocialLinks from "./SocialLinks";

export default function SiteFooter({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "24px 4px 32px",
        borderTop: `1px solid ${theme.cardBorder}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span style={{ fontSize: 13, color: theme.muted }}>
        © 2026 جميع الحقوق محفوظة
      </span>
      <SocialLinks theme={theme} />
    </div>
  );
}
