import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { Article, getAllArticles, saveArticle } from "@/lib/articles";
import { isGithubConfigured } from "@/lib/github";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  const articles = await getAllArticles();
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  const article = (await req.json().catch(() => null)) as Article | null;
  if (!article || !article.id || typeof article.title !== "string") {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  await saveArticle(article);
  return NextResponse.json({ ok: true, deploying: isGithubConfigured() });
}
