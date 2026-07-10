import { getPublishedArticles } from "@/lib/articles";
import HomeClient from "@/components/HomeClient";
import { ArticleCardData } from "@/components/ArticleCard";

export default async function HomePage() {
  const articles = await getPublishedArticles();

  const toCard = (a: (typeof articles)[number]): ArticleCardData => ({
    id: a.id,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    readTime: a.readTime,
    date: a.date,
    thumbImage: a.thumbImage || a.coverImage,
  });

  const latestArticles = articles.slice(0, 3).map(toCard);
  const categoryArticles = articles
    .filter((a) => a.category === "تحليل المنتجات")
    .slice(0, 3)
    .map(toCard);

  return (
    <HomeClient
      latestArticles={latestArticles}
      categoryArticles={categoryArticles}
    />
  );
}
