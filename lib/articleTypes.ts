export const CATEGORIES = [
  "تحليل المنتجات",
  "المنتجات",
  "الاستراتيجية",
  "الشركات الناشئة",
];

export type BlockType = "p" | "h2" | "quote" | "image" | "divider" | "link";

export type ArticleBlock = {
  id: string;
  type: BlockType;
  html?: string;
  imgSrc?: string | null;
  caption?: string;
  layout?: "full" | "float-right" | "float-left";
  widthPct?: number;
  maxHeight?: number;
  linkText?: string;
  linkUrl?: string;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  status: "draft" | "published";
  date: string;
  readTime: string;
  coverImage: string | null;
  thumbImage: string | null;
  blocks: ArticleBlock[];
};

export function newId(): string {
  return "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function newBlockId(): string {
  return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}

export function formatDateAr(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ar", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function escapeHtml(str: string): string {
  return (str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
