"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import BackHeader from "./BackHeader";
import SiteFooter from "./SiteFooter";
import type { ArticleBlock } from "@/lib/articleTypes";

export type ArticleDetail = {
  id: string;
  title: string;
  category: string;
  coverImage: string | null;
  readTime: string;
  dateLabel: string;
  blocks: ArticleBlock[];
};

function layoutStyle(layout?: string): React.CSSProperties {
  if (layout === "float-right")
    return { float: "right", width: "45%", margin: "6px 0 20px 24px" };
  if (layout === "float-left")
    return { float: "left", width: "45%", margin: "6px 24px 20px 0" };
  return { margin: "32px 0", clear: "both" };
}

export default function ArticleClient({ article }: { article: ArticleDetail }) {
  const { theme } = useTheme();
  const [scrollPct, setScrollPct] = useState(0);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = bodyRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const docHeight = document.documentElement.scrollHeight;
      const startY = window.scrollY + rect.top - 120;
      const total = docHeight - startY - window.innerHeight;
      const scrolled = window.scrollY - startY;
      let pct = total > 0 ? scrolled / total : 0;
      pct = Math.max(0, Math.min(1, pct));
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const segmentCount = 5;
  const activeIndex = Math.min(
    segmentCount - 1,
    Math.floor(scrollPct * segmentCount)
  );

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
      {/* Reading progress */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          right: 24,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 9,
          zIndex: 50,
        }}
      >
        {Array.from({ length: segmentCount }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === activeIndex ? 22 : 16,
              height: 3,
              borderRadius: 2,
              background: i === activeIndex ? theme.text : theme.cardBorder,
              transition: "all 0.15s ease",
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <BackHeader theme={theme} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "56px 16px 36px",
          }}
        >
          <span
            style={{
              fontSize: 13,
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 100,
              padding: "6px 16px",
              color: theme.muted,
            }}
          >
            {article.category}
          </span>
          <h1
            style={{
              margin: "22px 0 0",
              fontSize: 38,
              lineHeight: 1.5,
              fontWeight: 700,
              maxWidth: 760,
            }}
          >
            {article.title}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 20,
              fontSize: 13,
              color: theme.muted,
            }}
          >
            <span>عبدالله معلم</span>
            <span style={{ color: "#d3d1cb" }}>·</span>
            <span>{article.dateLabel}</span>
            <span style={{ color: "#d3d1cb" }}>·</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>

      {/* Cover */}
      {article.coverImage && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 4px" }}>
          <div
            style={{
              width: "100%",
              borderRadius: 20,
              overflow: "hidden",
              background: theme.pillBg,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.title}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div
        ref={bodyRef}
        id="article-body"
        style={{ maxWidth: 680, margin: "0 auto", padding: "56px 16px 0" }}
      >
        <div
          style={{
            fontSize: 18,
            lineHeight: 2.1,
            color: theme.text,
            overflow: "hidden",
          }}
        >
          {article.blocks.map((block) => {
            if (block.type === "p") {
              return (
                <p
                  key={block.id}
                  style={{ margin: "0 0 24px" }}
                  dangerouslySetInnerHTML={{ __html: block.html || "" }}
                />
              );
            }
            if (block.type === "h2") {
              return (
                <h2
                  key={block.id}
                  style={{ fontSize: 22, fontWeight: 700, margin: "40px 0 18px" }}
                  dangerouslySetInnerHTML={{ __html: block.html || "" }}
                />
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={block.id}
                  style={{
                    margin: "32px 0",
                    padding: "4px 24px",
                    borderRight: `3px solid ${theme.text}`,
                    fontSize: 19,
                    fontWeight: 600,
                  }}
                  dangerouslySetInnerHTML={{ __html: block.html || "" }}
                />
              );
            }
            if (block.type === "image" && block.imgSrc) {
              const justify =
                block.layout === "float-right"
                  ? "flex-end"
                  : block.layout === "float-left"
                  ? "flex-start"
                  : "center";
              return (
                <div key={block.id} style={layoutStyle(block.layout)}>
                  <div style={{ display: "flex", justifyContent: justify }}>
                    <div
                      style={{
                        position: "relative",
                        width: `${block.widthPct || 100}%`,
                        maxHeight: block.maxHeight || 500,
                        borderRadius: 14,
                        overflow: "hidden",
                        background: theme.pillBg,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={block.imgSrc}
                        alt={block.caption || ""}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                      <button
                        onClick={() => setLightboxSrc(block.imgSrc || null)}
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          background: "rgba(0,0,0,0.6)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        🔍 تكبير
                      </button>
                    </div>
                  </div>
                  {block.caption && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: theme.muted,
                        marginTop: 10,
                      }}
                    >
                      {block.caption}
                    </div>
                  )}
                </div>
              );
            }
            if (block.type === "divider") {
              return (
                <div
                  key={block.id}
                  style={{
                    clear: "both",
                    textAlign: "center",
                    fontSize: 20,
                    letterSpacing: 10,
                    color: theme.muted,
                    padding: "8px 0 32px",
                  }}
                >
                  • • •
                </div>
              );
            }
            if (block.type === "link" && block.linkUrl) {
              return (
                <a
                  key={block.id}
                  href={block.linkUrl}
                  target="_blank"
                  rel="noopener"
                  className="card-link"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    background: theme.cardBg,
                    border: `1px solid ${theme.cardBorder}`,
                    borderRadius: 14,
                    padding: "16px 20px",
                    margin: "8px 0 28px",
                    clear: "both",
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>
                    {block.linkText}
                  </span>
                  <span style={{ fontSize: 16, color: theme.muted }}>↖</span>
                </a>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* Author box */}
      <div style={{ maxWidth: 680, margin: "56px auto 0", padding: "0 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 18,
            padding: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: theme.pillBg,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/uploads/avatar.webp"
              alt="عبدالله معلم"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>عبدالله معلم</div>
            <div
              style={{
                marginTop: 4,
                fontSize: 13,
                lineHeight: 1.8,
                color: theme.muted,
              }}
            >
              مهندس ومهتم بعالم المنتجات، يكتب عن تحليل الشركات واستراتيجيات
              النمو.
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          maxWidth: 1100,
          margin: "72px auto 0",
          textAlign: "center",
          padding: "0 16px 72px",
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
          عندك فكرة أو ملاحظة على المقال؟
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 24,
          }}
        >
          <a
            href="mailto:Abdu.moalim1@gmail.com"
            className="fade-hover"
            style={{
              background: theme.text,
              color: theme.pageBg,
              borderRadius: 100,
              padding: "13px 26px",
              fontSize: 14,
            }}
          >
            راسلني
          </a>
          <a
            href="/"
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.text,
              borderRadius: 100,
              padding: "13px 26px",
              fontSize: 14,
            }}
          >
            مقالات أخرى
          </a>
        </div>
      </div>

      <SiteFooter theme={theme} />

      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 100,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            onClick={(e) => e.stopPropagation()}
            src={lightboxSrc}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}
