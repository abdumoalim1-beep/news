import { notFound } from "next/navigation";
import { getArticleById, formatDateAr } from "@/lib/articles";
import ArticleClient from "@/components/ArticleClient";

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
