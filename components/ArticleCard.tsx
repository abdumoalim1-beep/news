import Link from "next/link";
import { Theme } from "@/lib/theme";
import { formatDateAr } from "@/lib/articleTypes";

export type ArticleCardData = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  thumbImage: string | null;
};

export default function ArticleCard({
  article,
  theme,
}: {
  article: ArticleCardData;
  theme: Theme;
}) {
  return (
    <Link
      href={`/articles/${encodeURIComponent(article.id)}`}
      className="card-link"
      style={{
        display: "block",
        borderRadius: 18,
        overflow: "hidden",
        background: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 10",
          background: theme.pillBg,
        }}
      >
        {article.thumbImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.thumbImage}
            alt={article.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
      </div>
      <div style={{ padding: "20px 20px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 12,
              background: theme.pillBg,
              border: `1px solid ${theme.pillBorder}`,
              borderRadius: 100,
              padding: "4px 12px",
              color: theme.muted,
              whiteSpace: "nowrap",
            }}
          >
            {article.category}
          </span>
          <span style={{ fontSize: 12, color: theme.muted }}>
            {article.readTime}
          </span>
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.6,
            marginBottom: 8,
          }}
        >
          {article.title}
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.8, color: theme.muted }}>
          {article.excerpt}
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: theme.muted }}>
          {formatDateAr(article.date)}
        </div>
      </div>
    </Link>
  );
}
