import { Metadata } from "next";
import { getPublishedArticles } from "@/lib/articles";
import ArticlesClient from "@/components/ArticlesClient";
import { ArticleCardData } from "@/components/ArticleCard";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { category?: string };
}): Promise<Metadata> {
  const title = searchParams.category
    ? `${searchParams.category} — عبدالله معلم`
    : "جميع المقالات — عبدالله معلم";
  return {
    title,
    openGraph: { title },
    twitter: { title },
  };
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const category = searchParams.category;
  const all = await getPublishedArticles();
  const filtered = category
    ? all.filter((a) => a.category === category)
    : all;

  const articles: ArticleCardData[] = filtered.map((a) => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    readTime: a.readTime,
    date: a.date,
    thumbImage: a.thumbImage || a.coverImage,
  }));

  return (
    <ArticlesClient
      pageTitle={category || "جميع المقالات"}
      articles={articles}
    />
  );
}
