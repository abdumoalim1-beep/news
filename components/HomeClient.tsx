"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import HomeHeader from "./HomeHeader";
import SiteFooter from "./SiteFooter";
import ArticleCard, { ArticleCardData } from "./ArticleCard";

const TOPICS = [
  {
    emoji: "📊",
    title: "تحليل المنتجات",
    desc: "أفكك أسباب نجاح المنتجات وقراراتها.",
  },
  {
    emoji: "🛠️",
    title: "بناء المنتجات",
    desc: "أشارك مبادئ بناء منتجات ناجحة.",
  },
  {
    emoji: "📈",
    title: "النمو",
    desc: "أستكشف استراتيجيات النمو والتوسع.",
  },
  {
    emoji: "🧠",
    title: "عقلية البنّاء",
    desc: "أشارك عقلية وأدوات من يبني شيئًا ذا قيمة.",
  },
];

export default function HomeClient({
  latestArticles,
  categoryArticles,
}: {
  latestArticles: ArticleCardData[];
  categoryArticles: ArticleCardData[];
}) {
  const { theme } = useTheme();
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 2200);
  }, []);

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
        <HomeHeader theme={theme} />

        {/* Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "64px 16px 56px",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: `0 0 0 4px ${theme.pageBg}, 0 0 0 5px ${theme.cardBorder}`,
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

          <div
            style={{
              marginTop: 18,
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              borderRadius: 100,
              padding: "8px 20px",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            عبدالله معلم
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3fae5c",
              }}
            />
          </div>

          <h1
            style={{
              margin: "26px 0 0",
              fontSize: 46,
              lineHeight: 1.35,
              fontWeight: 700,
              maxWidth: 700,
            }}
          >
            أكتب عن الشركات والمنتجات والنمو
          </h1>

          <p
            style={{
              margin: "22px 0 0",
              maxWidth: 560,
              fontSize: 16,
              lineHeight: 1.9,
              color: theme.muted,
            }}
          >
            مهندس ومهتم بعالم المنتجات. أسعى لفهم المبادئ التي تقف وراء نجاح
            الشركات والمنتجات، وأشارك ما أتعلمه مع المهتمين بصناعة المنتجات
            والنمو
          </p>

          <a
            href="#articles"
            style={{
              marginTop: 30,
              background: theme.text,
              color: theme.pageBg,
              borderRadius: 100,
              padding: "13px 26px",
              fontSize: 14,
              fontWeight: 500,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            أحدث المقالات
            <span style={{ fontSize: 15 }}>↖</span>
          </a>
        </div>

        {/* Quote strip */}
        <div
          style={{
            padding: "44px 16px 56px",
            borderTop: `1px solid ${theme.cardBorder}`,
          }}
        >
          <p
            style={{
              maxWidth: 640,
              margin: "0 auto",
              textAlign: "center",
              fontSize: 20,
              lineHeight: 1.9,
              fontWeight: 500,
            }}
          >
            <span style={{ color: "rgb(183, 180, 172)" }}>”</span>
            أؤمن أن أفضل طريقة لتعلم بناء المنتجات هي تفكيك المنتجات
            العظيمة&nbsp;
            <span style={{ color: "rgb(183, 180, 172)" }}>“</span>
          </p>
        </div>
      </div>

      {/* Topics */}
      <div
        style={{
          background: theme.cardBg,
          borderRadius: 28,
          margin: "0 auto",
          maxWidth: 1100,
          padding: "64px 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: 0,
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            أكتب عن الأفكار التي تساعد على بناء منتجات وشركات أفضل
          </h2>
          <div
            style={{
              marginTop: 20,
              background: theme.pillBg,
              border: `1px solid ${theme.pillBorder}`,
              borderRadius: 100,
              padding: "6px 18px",
              fontSize: 13,
              color: theme.muted,
              transform: "rotate(-2deg)",
            }}
          >
            الفئات
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            marginTop: 48,
          }}
        >
          {TOPICS.map((topic) => (
            <div key={topic.title} style={{ textAlign: "right" }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: theme.pageBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  marginBottom: 16,
                }}
              >
                {topic.emoji}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                {topic.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  lineHeight: 1.8,
                  color: theme.muted,
                }}
              >
                {topic.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest articles */}
      <div
        id="articles"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 4px 0" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
            أحدث المقالات
          </h2>
          <Link
            href="/articles"
            style={{
              fontSize: 13,
              color: theme.muted,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            عرض الكل <span>↖</span>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gap: "32px 28px",
            gridTemplateColumns: "repeat(3,1fr)",
          }}
        >
          {latestArticles.map((a) => (
            <ArticleCard key={a.id} article={a} theme={theme} />
          ))}
        </div>
      </div>

      {/* Category section */}
      {categoryArticles.length > 0 && (
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 4px 0" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: 36,
            }}
          >
            <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>
              تحليل المنتجات
            </h2>
            <Link
              href={`/articles?category=${encodeURIComponent(
                "تحليل المنتجات"
              )}`}
              style={{
                fontSize: 13,
                color: theme.muted,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              عرض الكل <span>↖</span>
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gap: "32px 28px",
              gridTemplateColumns: "repeat(3,1fr)",
            }}
          >
            {categoryArticles.map((a) => (
              <ArticleCard key={a.id} article={a} theme={theme} />
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div
        style={{
          maxWidth: 1100,
          margin: "88px auto 0",
          background: theme.cardBg,
          border: `1px solid ${theme.cardBorder}`,
          borderRadius: 24,
          padding: "48px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>
            اشترك لتصلك المقالات الجديدة
          </div>
          <div style={{ marginTop: 6, fontSize: 14, color: theme.muted }}>
            بريد واحد بالشهر تقريبًا، بدون سبام.
          </div>
        </div>
        <form
          onSubmit={onSubscribe}
          style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <input
            type="email"
            required
            placeholder="بريدك الإلكتروني"
            style={{
              fontSize: 14,
              border: `1px solid ${theme.pillBorder}`,
              background: theme.pillBg,
              color: theme.text,
              borderRadius: 100,
              padding: "12px 18px",
              width: 240,
            }}
          />
          <button
            type="submit"
            style={{
              background: theme.text,
              color: theme.pageBg,
              border: "none",
              borderRadius: 100,
              padding: "12px 22px",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {subscribed ? "تم الاشتراك!" : "اشترك"}
          </button>
        </form>
      </div>

      {/* Contact */}
      <div
        style={{
          maxWidth: 1100,
          margin: "24px auto 0",
          textAlign: "center",
          padding: "72px 16px",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            margin: "0 auto 22px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 20,
              height: 20,
              borderRadius: 6,
              background: theme.text,
            }}
          />
        </div>
        <h2
          style={{
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          عندك فكرة أو ملاحظة على أحد المقالات؟
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 28,
          }}
        >
          <a
            href="mailto:Abdu.moalim1@gmail.com"
            style={{
              background: theme.text,
              color: theme.pageBg,
              borderRadius: 100,
              padding: "13px 26px",
              fontSize: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            راسلني
          </a>
          <a
            href="https://wa.me/000000000"
            target="_blank"
            rel="noopener"
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.pillBorder}`,
              color: theme.text,
              borderRadius: 100,
              padding: "13px 26px",
              fontSize: 14,
            }}
          >
            واتساب
          </a>
        </div>
      </div>

      <SiteFooter theme={theme} />
    </div>
  );
}
