import { Theme } from "@/lib/theme";

export default function SocialLinks({ theme }: { theme: Theme }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontSize: 14,
        color: theme.muted,
      }}
    >
      <a
        href="https://www.linkedin.com/in/abdullah-moalim-1b7634272/"
        target="_blank"
        rel="noopener"
      >
        لينكدإن
      </a>
      <span style={{ color: "#d3d1cb" }}>/</span>
      <a href="https://x.com/m_wm1" target="_blank" rel="noopener">
        تويتر
      </a>
      <span style={{ color: "#d3d1cb" }}>/</span>
      <a
        href="https://www.instagram.com/abdu.moalim1/?hl=ar"
        target="_blank"
        rel="noopener"
      >
        إنستقرام
      </a>
    </div>
  );
}
