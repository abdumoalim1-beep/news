"use client";

import { useEffect, useState } from "react";
import type { Article } from "@/lib/articleTypes";
import { formatDateAr } from "@/lib/articleTypes";
import ArticleClient from "@/components/ArticleClient";

const STORAGE_KEY = "admin_preview_article";

export default function AdminPreviewPage() {
  const [article, setArticle] = useState<Article | null | undefined>(
    undefined
  );

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      setArticle(raw ? (JSON.parse(raw) as Article) : null);
    } catch {
      setArticle(null);
    }
  }, []);

  if (article === undefined) return null;

  if (!article) {
    return (
      <div dir="rtl" lang="ar" style={{ padding: 40, textAlign: "center" }}>
        لا توجد معاينة متاحة. افتح المعاينة من لوحة التحكم.
      </div>
    );
  }

  return (
    <ArticleClient
      article={{
        id: article.id,
        title: article.title,
        category: article.category,
        coverImage: article.coverImage,
        readTime: article.readTime,
        dateLabel: formatDateAr(article.date),
        blocks: article.blocks,
      }}
    />
  );
}
