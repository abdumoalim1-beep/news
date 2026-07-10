"use client";

import { useTheme } from "@/context/ThemeContext";
import BackHeader from "./BackHeader";
import SiteFooter from "./SiteFooter";
import ArticleCard, { ArticleCardData } from "./ArticleCard";

export default function ArticlesClient({
  pageTitle,
  articles,
}: {
  pageTitle: string;
  articles: ArticleCardData[];
}) {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.pageBg,
        color: theme.text,
        minHeight: "100vh",
        padding: "20px 20px 0",
        transition: "background 0.25s ease, color 0.25s ease",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <BackHeader theme={theme} />

        <div style={{ padding: "48px 4px 36px" }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0 }}>
            {pageTitle}
          </h1>
          <div style={{ marginTop: 8, fontSize: 14, color: theme.muted }}>
            {articles.length} مقالات
          </div>
        </div>
      </div>

      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "0 4px 80px" }}
      >
        <div className="articles-grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} theme={theme} />
          ))}
        </div>
      </div>

      <SiteFooter theme={theme} />
    </div>
  );
}
