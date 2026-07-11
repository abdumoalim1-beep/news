import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById, formatDateAr } from "@/lib/articles";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/site";
import ArticleClient from "@/components/ArticleClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const article = await getArticleById(params.id);
  if (!article) return {};

  const url = `${SITE_URL}/articles/${encodeURIComponent(article.id)}`;
  const image =
    article.ogImage ||
    article.coverImage ||
    article.thumbImage ||
    DEFAULT_OG_IMAGE;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.date,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [image],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleById(params.id);
  if (!article) notFound();

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
