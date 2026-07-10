import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { Article } from "./articleTypes";

export * from "./articleTypes";
export type { Article, ArticleBlock, BlockType } from "./articleTypes";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export async function getAllArticles(): Promise<Article[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(ARTICLES_DIR);
  } catch {
    return [];
  }
  const articles = await Promise.all(
    files
      .filter((f) => f.endsWith(".json"))
      .map(async (f) => {
        const raw = await fs.readFile(path.join(ARTICLES_DIR, f), "utf-8");
        return JSON.parse(raw) as Article;
      })
  );
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPublishedArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.status === "published");
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const raw = await fs.readFile(
      path.join(ARTICLES_DIR, `${id}.json`),
      "utf-8"
    );
    return JSON.parse(raw) as Article;
  } catch {
    return null;
  }
}

export async function saveArticle(article: Article): Promise<void> {
  await fs.mkdir(ARTICLES_DIR, { recursive: true });
  await fs.writeFile(
    path.join(ARTICLES_DIR, `${article.id}.json`),
    JSON.stringify(article, null, 2) + "\n",
    "utf-8"
  );
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await fs.unlink(path.join(ARTICLES_DIR, `${id}.json`));
  } catch {
    // already gone
  }
}
