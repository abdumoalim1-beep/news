import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { Article, deleteArticle, saveArticle } from "@/lib/articles";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  const article = (await req.json().catch(() => null)) as Article | null;
  if (!article || article.id !== params.id) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  await saveArticle(article);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }
  await deleteArticle(params.id);
  return NextResponse.json({ ok: true });
}
