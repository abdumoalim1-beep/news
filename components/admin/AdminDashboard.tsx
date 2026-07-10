"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Article, ArticleBlock, BlockType } from "@/lib/articleTypes";
import { CATEGORIES, newId, newBlockId, escapeHtml } from "@/lib/articleTypes";
import ImageUploader from "./ImageUploader";

const READ_TIME_OPTIONS = [
  "٥ دقائق",
  "١٠ دقائق",
  "١٥ دقيقة",
  "٢٠ دقيقة",
  "٢٥ دقيقة",
  "٣٠ دقيقة",
  "٣٥ دقيقة",
  "٤٠ دقيقة",
  "٤٥ دقيقة",
];

function emptyDraft(): Article {
  const id = newId();
  return {
    id,
    title: "",
    excerpt: "",
    category: CATEGORIES[0],
    status: "draft",
    date: new Date().toISOString().slice(0, 10),
    readTime: "٥ دقائق",
    coverImage: null,
    thumbImage: null,
    blocks: [],
  };
}

function textStyleFor(type: BlockType): React.CSSProperties {
  if (type === "h2")
    return {
      width: "100%",
      fontSize: 20,
      fontWeight: 700,
      lineHeight: 1.6,
      border: "none",
      background: "transparent",
      padding: "4px 0",
      minHeight: 32,
      outline: "none",
    };
  if (type === "quote")
    return {
      width: "100%",
      fontSize: 17,
      fontWeight: 600,
      lineHeight: 1.9,
      border: "none",
      background: "transparent",
      padding: "4px 0 4px 16px",
      borderRight: "3px solid #1c1b1a",
      minHeight: 40,
      outline: "none",
    };
  return {
    width: "100%",
    fontSize: 15,
    lineHeight: 1.9,
    border: "none",
    background: "transparent",
    padding: "4px 0",
    minHeight: 48,
    outline: "none",
  };
}

function BlockEditor({
  block,
  index,
  onUpdate,
  onMove,
  onDelete,
  onOpenLightbox,
}: {
  block: ArticleBlock;
  index: number;
  onUpdate: (patch: Partial<ArticleBlock>) => void;
  onMove: (dir: 1 | -1) => void;
  onDelete: () => void;
  onOpenLightbox: (src: string) => void;
}) {
  const editableRef = useRef<HTMLDivElement | null>(null);
  const initedRef = useRef(false);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      editableRef.current = el;
      if (el && !initedRef.current) {
        el.innerHTML = block.html || "";
        initedRef.current = true;
      }
    },
    [block.html]
  );

  const applyCommand = (cmd: string, value?: string) => {
    const el = editableRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, value);
    onUpdate({ html: el.innerHTML });
  };

  const isImage = block.type === "image";
  const isDivider = block.type === "divider";
  const isLink = block.type === "link";
  const isText = !isImage && !isDivider && !isLink;

  const justify =
    block.layout === "float-right"
      ? "flex-end"
      : block.layout === "float-left"
      ? "flex-start"
      : "center";

  return (
    <div
      style={{ position: "relative", padding: "10px 0 10px 132px" }}
    >
      <div
        className="block-controls"
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <select
          value={block.type}
          onChange={(e) => onUpdate({ type: e.target.value as BlockType })}
          style={{
            fontSize: 11,
            border: "1px solid #e2e0da",
            background: "#ffffff",
            borderRadius: 7,
            padding: "5px 6px",
          }}
        >
          <option value="p">فقرة</option>
          <option value="h2">عنوان فرعي</option>
          <option value="quote">اقتباس</option>
          <option value="image">صورة</option>
          <option value="divider">فاصل</option>
          <option value="link">رابط</option>
        </select>
        <button
          onClick={() => onMove(-1)}
          style={{
            width: 24,
            height: 24,
            background: "#ffffff",
            border: "1px solid #e2e0da",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          ↑
        </button>
        <button
          onClick={() => onMove(1)}
          style={{
            width: 24,
            height: 24,
            background: "#ffffff",
            border: "1px solid #e2e0da",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          ↓
        </button>
        <button
          onClick={onDelete}
          style={{
            width: 24,
            height: 24,
            background: "#fdf1f0",
            border: "1px solid #f2ddda",
            color: "#b23b3b",
            borderRadius: 6,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {isImage && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 12, color: "#57544e" }}>
                موضع الصورة
              </label>
              <select
                value={block.layout || "full"}
                onChange={(e) =>
                  onUpdate({ layout: e.target.value as ArticleBlock["layout"] })
                }
                style={{
                  fontSize: 12,
                  border: "1px solid #e2e0da",
                  background: "#f7f6f3",
                  borderRadius: 8,
                  padding: "6px 10px",
                }}
              >
                <option value="full">تحت النص (سطر كامل)</option>
                <option value="float-right">بجانب النص - يمين</option>
                <option value="float-left">بجانب النص - يسار</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 12, color: "#57544e" }}>
                حجم الصورة
              </label>
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={block.widthPct || 100}
                onChange={(e) =>
                  onUpdate({ widthPct: parseInt(e.target.value, 10) })
                }
                style={{ width: 110 }}
              />
              <span style={{ fontSize: 11, color: "#86837e", minWidth: 32 }}>
                {block.widthPct || 100}%
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ fontSize: 12, color: "#57544e" }}>
                أقصى ارتفاع
              </label>
              <input
                type="range"
                min={200}
                max={900}
                step={20}
                value={block.maxHeight || 500}
                onChange={(e) =>
                  onUpdate({ maxHeight: parseInt(e.target.value, 10) })
                }
                style={{ width: 110 }}
              />
              <span style={{ fontSize: 11, color: "#86837e", minWidth: 40 }}>
                {block.maxHeight || 500}px
              </span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: justify }}>
            <div
              style={{
                position: "relative",
                width: `${block.widthPct || 100}%`,
                maxHeight: block.maxHeight || 500,
                height: 220,
                borderRadius: 10,
                overflow: "hidden",
                background: "#f7f6f3",
                marginBottom: 8,
              }}
            >
              <ImageUploader
                src={block.imgSrc}
                onChange={(url) => onUpdate({ imgSrc: url })}
                placeholder="صورة"
                fit="contain"
              />
              {block.imgSrc && (
                <button
                  onClick={() => onOpenLightbox(block.imgSrc!)}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  👁 عرض الصورة
                </button>
              )}
            </div>
          </div>
          <input
            value={block.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            placeholder="تعليق على الصورة (اختياري)"
            style={{
              width: "100%",
              fontSize: 13,
              border: "none",
              background: "transparent",
              padding: "4px 0",
              color: "#86837e",
            }}
          />
        </>
      )}

      {isDivider && (
        <div
          style={{
            textAlign: "center",
            fontSize: 15,
            letterSpacing: 6,
            color: "#b7b4ac",
            padding: "10px 0",
          }}
        >
          • • •
        </div>
      )}

      {isLink && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "#f7f6f3",
            borderRadius: 10,
            padding: 12,
          }}
        >
          <input
            value={block.linkText || ""}
            onChange={(e) => onUpdate({ linkText: e.target.value })}
            placeholder="نص الرابط (مثال: اطلع على المصدر)"
            style={{
              width: "100%",
              fontSize: 14,
              border: "none",
              background: "transparent",
              padding: "4px 0",
            }}
          />
          <input
            value={block.linkUrl || ""}
            onChange={(e) => onUpdate({ linkUrl: e.target.value })}
            placeholder="https://example.com"
            dir="ltr"
            style={{
              width: "100%",
              fontSize: 13,
              textAlign: "left",
              border: "none",
              background: "transparent",
              padding: "4px 0",
              color: "#57544e",
            }}
          />
        </div>
      )}

      {isText && (
        <>
          <div
            style={{ display: "flex", gap: 6, marginBottom: 6 }}
          >
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyCommand("bold")}
              style={{
                background: "#f7f6f3",
                border: "1px solid #e2e0da",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              B
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyCommand("italic")}
              style={{
                background: "#f7f6f3",
                border: "1px solid #e2e0da",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                fontStyle: "italic",
                cursor: "pointer",
              }}
            >
              I
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const el = editableRef.current;
                if (!el) return;
                const sel = window.getSelection();
                if (!sel || sel.isCollapsed) {
                  alert("حدد كلمة أو جملة أولاً");
                  return;
                }
                el.focus();
                try {
                  const range = sel.getRangeAt(0);
                  const span = document.createElement("span");
                  span.style.fontSize = "1.25em";
                  range.surroundContents(span);
                  sel.removeAllRanges();
                } catch {
                  // ignore selection edge cases
                }
                onUpdate({ html: el.innerHTML });
              }}
              style={{
                background: "#f7f6f3",
                border: "1px solid #e2e0da",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              A+
            </button>
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                const el = editableRef.current;
                if (!el) return;
                const sel = window.getSelection();
                if (!sel || sel.isCollapsed) {
                  alert("حدد كلمة أو جملة أولاً");
                  return;
                }
                const url = prompt("أدخل رابط الوجهة (URL)");
                if (!url) return;
                applyCommand("createLink", url);
              }}
              style={{
                background: "#f7f6f3",
                border: "1px solid #e2e0da",
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              🔗
            </button>
          </div>
          <div
            contentEditable
            ref={setRef}
            onInput={(e) =>
              onUpdate({ html: (e.target as HTMLDivElement).innerHTML })
            }
            style={textStyleFor(block.type)}
            suppressContentEditableWarning
          />
          <div style={{ fontSize: 11, color: "#b7b4ac", marginTop: 4 }}>
            حدد كلمة أو جملة، ثم اضغط B (عريض)، I (مائل)، A+ (تكبير)، أو 🔗
            (رابط)
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard({
  githubMode = false,
}: {
  githubMode?: boolean;
}) {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Article | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deployNotice, setDeployNotice] = useState<string | null>(null);
  const deployNoticeTimer = useRef<ReturnType<typeof setTimeout>>();

  const showDeployNotice = (message: string) => {
    setDeployNotice(message);
    clearTimeout(deployNoticeTimer.current);
    deployNoticeTimer.current = setTimeout(() => setDeployNotice(null), 6000);
  };

  const loadArticles = useCallback(async () => {
    const res = await fetch("/api/admin/articles");
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const onNewArticle = () => {
    const d = emptyDraft();
    setEditingId(d.id);
    setDraft(d);
  };

  const onEditArticle = (id: string) => {
    const found = articles.find((a) => a.id === id);
    if (found) {
      setEditingId(id);
      setDraft(JSON.parse(JSON.stringify(found)));
    }
  };

  const onBackToList = () => {
    setEditingId(null);
    setDraft(null);
  };

  const onDeleteArticle = async (id: string) => {
    if (!confirm("حذف هذا المقال؟")) return;
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => null);
    if (data?.deploying) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      showDeployNotice(
        "تم رفع الحذف إلى المستودع، سيختفي المقال من الموقع خلال دقيقة تقريبًا بعد إعادة النشر التلقائي."
      );
    } else {
      await loadArticles();
    }
  };

  const onToggleStatus = async (a: Article) => {
    const updated = {
      ...a,
      status: a.status === "published" ? ("draft" as const) : ("published" as const),
    };
    const res = await fetch(`/api/admin/articles/${encodeURIComponent(a.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    const data = await res.json().catch(() => null);
    if (data?.deploying) {
      setArticles((prev) => prev.map((x) => (x.id === a.id ? updated : x)));
      showDeployNotice(
        "تم رفع التغيير إلى المستودع، سيظهر على الموقع خلال دقيقة تقريبًا بعد إعادة النشر التلقائي."
      );
    } else {
      await loadArticles();
    }
  };

  const persistDraft = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const exists = articles.some((a) => a.id === draft.id);
      const res = await fetch(
        exists
          ? `/api/admin/articles/${encodeURIComponent(draft.id)}`
          : "/api/admin/articles",
        {
          method: exists ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        }
      );
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.deploying) {
          setArticles((prev) => {
            const withoutDraft = prev.filter((a) => a.id !== draft.id);
            return [draft, ...withoutDraft];
          });
          showDeployNotice(
            "تم رفع المقال إلى المستودع، سيظهر التحديث على الموقع خلال دقيقة تقريبًا بعد إعادة النشر التلقائي على فيرسل."
          );
        } else {
          await loadArticles();
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const onSave = async () => {
    await persistDraft();
    setEditingId(null);
    setDraft(null);
  };

  const onPreview = async () => {
    if (!draft) return;
    if (githubMode) {
      // Committed content isn't live until the next deploy finishes, so
      // preview the in-memory draft directly instead of the saved page.
      try {
        sessionStorage.setItem("admin_preview_article", JSON.stringify(draft));
      } catch {
        // ignore
      }
      window.open("/admin/preview", "_blank");
      return;
    }
    await persistDraft();
    window.open(`/articles/${encodeURIComponent(draft.id)}`, "_blank");
  };

  const updateDraft = (patch: Partial<Article>) =>
    setDraft((d) => (d ? { ...d, ...patch } : d));

  const updateBlock = (index: number, patch: Partial<ArticleBlock>) => {
    setDraft((d) => {
      if (!d) return d;
      const blocks = d.blocks.slice();
      blocks[index] = { ...blocks[index], ...patch };
      return { ...d, blocks };
    });
  };

  const moveBlock = (index: number, dir: 1 | -1) => {
    setDraft((d) => {
      if (!d) return d;
      const blocks = d.blocks.slice();
      const j = index + dir;
      if (j < 0 || j >= blocks.length) return d;
      [blocks[index], blocks[j]] = [blocks[j], blocks[index]];
      return { ...d, blocks };
    });
  };

  const deleteBlock = (index: number) => {
    setDraft((d) => {
      if (!d) return d;
      const blocks = d.blocks.slice();
      blocks.splice(index, 1);
      return { ...d, blocks };
    });
  };

  const addBlock = (type: BlockType) => {
    const block: ArticleBlock = { id: newBlockId(), type };
    if (type === "image") {
      block.layout = "full";
      block.widthPct = 100;
      block.maxHeight = 500;
      block.caption = "";
    } else if (type === "link") {
      block.linkText = "";
      block.linkUrl = "";
    } else if (type !== "divider") {
      block.html = "";
    }
    setDraft((d) => (d ? { ...d, blocks: [...d.blocks, block] } : d));
    setShowAddMenu(false);
  };

  const isListView = !editingId;

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: "inherit",
        background: "#efeeeb",
        color: "#1c1b1a",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 80px" }}>
        {deployNotice && (
          <div
            style={{
              background: "#eef3fb",
              border: "1px solid #cddcf2",
              color: "#274a78",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 13,
              marginBottom: 20,
              lineHeight: 1.7,
            }}
          >
            {deployNotice}
          </div>
        )}
        {isListView ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700 }}>لوحة التحكم</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={onLogout}
                  style={{
                    background: "#f7f6f3",
                    border: "1px solid #e2e0da",
                    borderRadius: 100,
                    padding: "11px 18px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  تسجيل الخروج
                </button>
                <button
                  onClick={onNewArticle}
                  style={{
                    background: "#1c1b1a",
                    color: "#f7f6f3",
                    border: "none",
                    borderRadius: 100,
                    padding: "11px 20px",
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  + مقال جديد
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {articles
                .slice()
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((a) => (
                  <div
                    key={a.id}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e6e4de",
                      borderRadius: 14,
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 6,
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: 700 }}>
                          {a.title || "(بدون عنوان)"}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 100,
                            background:
                              a.status === "published" ? "#eaf5ee" : "#f7f6f3",
                            color:
                              a.status === "published" ? "#2f8a52" : "#86837e",
                          }}
                        >
                          {a.status === "published" ? "منشور" : "مسودة"}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#86837e" }}>
                        {a.category} · {a.date}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => onToggleStatus(a)}
                        style={{
                          background: "#f7f6f3",
                          border: "1px solid #e2e0da",
                          borderRadius: 100,
                          padding: "8px 14px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        {a.status === "published" ? "إخفاء" : "نشر"}
                      </button>
                      <button
                        onClick={() => onEditArticle(a.id)}
                        style={{
                          background: "#f7f6f3",
                          border: "1px solid #e2e0da",
                          borderRadius: 100,
                          padding: "8px 14px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => onDeleteArticle(a.id)}
                        style={{
                          background: "#fdf1f0",
                          border: "1px solid #f2ddda",
                          color: "#b23b3b",
                          borderRadius: 100,
                          padding: "8px 14px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              {articles.length === 0 && (
                <div style={{ fontSize: 13, color: "#86837e", padding: "20px 0" }}>
                  لا توجد مقالات بعد.
                </div>
              )}
            </div>
          </>
        ) : (
          draft && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 24,
                }}
              >
                <button
                  onClick={onBackToList}
                  style={{
                    background: "#f7f6f3",
                    border: "1px solid #e2e0da",
                    borderRadius: 100,
                    padding: "9px 16px",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  ↗ رجوع
                </button>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={onPreview}
                    style={{
                      background: "#f7f6f3",
                      border: "1px solid #e2e0da",
                      borderRadius: 100,
                      padding: "11px 18px",
                      fontSize: 14,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    👁 معاينة
                  </button>
                  <button
                    onClick={onSave}
                    disabled={saving}
                    style={{
                      background: "#1c1b1a",
                      color: "#f7f6f3",
                      border: "none",
                      borderRadius: 100,
                      padding: "11px 22px",
                      fontSize: 14,
                      cursor: "pointer",
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    حفظ
                  </button>
                </div>
              </div>

              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e6e4de",
                  borderRadius: 18,
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#86837e",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    صورة الغلاف (تظهر أعلى المقال)
                  </label>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: 260,
                      maxHeight: 500,
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "#f7f6f3",
                    }}
                  >
                    <ImageUploader
                      src={draft.coverImage}
                      onChange={(url) => updateDraft({ coverImage: url })}
                      placeholder="صورة الغلاف"
                      fit="contain"
                    />
                    {draft.coverImage && (
                      <button
                        onClick={() => setLightboxSrc(draft.coverImage)}
                        style={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        👁 عرض الصورة
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#86837e",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    الصورة المصغّرة (تظهر في البطاقات وقوائم المقالات)
                  </label>
                  <div
                    style={{
                      width: 220,
                      aspectRatio: "16 / 10",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                  >
                    <ImageUploader
                      src={draft.thumbImage}
                      onChange={(url) => updateDraft({ thumbImage: url })}
                      placeholder="صورة مصغّرة"
                      fit="cover"
                    />
                  </div>
                  <div style={{ fontSize: 11, color: "#b7b4ac", marginTop: 6 }}>
                    يمكنك رفع نفس صورة الغلاف أو صورة مختلفة تناسب حجم البطاقة.
                  </div>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#86837e",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    العنوان
                  </label>
                  <input
                    value={draft.title}
                    onChange={(e) => updateDraft({ title: e.target.value })}
                    placeholder="عنوان المقال"
                    style={{
                      width: "100%",
                      fontSize: 16,
                      fontWeight: 600,
                      border: "1px solid #e2e0da",
                      background: "#f7f6f3",
                      borderRadius: 10,
                      padding: "12px 14px",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 12,
                      color: "#86837e",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    المقتطف (سطر تحت العنوان)
                  </label>
                  <input
                    value={draft.excerpt}
                    onChange={(e) => updateDraft({ excerpt: e.target.value })}
                    placeholder="جملة قصيرة تلخص المقال"
                    style={{
                      width: "100%",
                      fontSize: 14,
                      border: "1px solid #e2e0da",
                      background: "#f7f6f3",
                      borderRadius: 10,
                      padding: "12px 14px",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#86837e",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      الفئة
                    </label>
                    <select
                      value={draft.category}
                      onChange={(e) => updateDraft({ category: e.target.value })}
                      style={{
                        width: "100%",
                        fontSize: 14,
                        border: "1px solid #e2e0da",
                        background: "#f7f6f3",
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#86837e",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      حالة النشر
                    </label>
                    <select
                      value={draft.status}
                      onChange={(e) =>
                        updateDraft({ status: e.target.value as Article["status"] })
                      }
                      style={{
                        width: "100%",
                        fontSize: 14,
                        border: "1px solid #e2e0da",
                        background: "#f7f6f3",
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      <option value="draft">مسودة</option>
                      <option value="published">منشور</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: 140 }}>
                    <label
                      style={{
                        fontSize: 12,
                        color: "#86837e",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      مدة القراءة
                    </label>
                    <select
                      value={draft.readTime}
                      onChange={(e) => updateDraft({ readTime: e.target.value })}
                      style={{
                        width: "100%",
                        fontSize: 14,
                        border: "1px solid #e2e0da",
                        background: "#f7f6f3",
                        borderRadius: 10,
                        padding: "12px 14px",
                      }}
                    >
                      {READ_TIME_OPTIONS.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e6e4de",
                    marginTop: 6,
                    paddingTop: 22,
                  }}
                >
                  <label
                    style={{
                      fontSize: 12,
                      color: "#86837e",
                      display: "block",
                      marginBottom: 12,
                    }}
                  >
                    محتوى المقال
                  </label>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {draft.blocks.map((b, i) => (
                      <BlockEditor
                        key={b.id}
                        block={b}
                        index={i}
                        onUpdate={(patch) => updateBlock(i, patch)}
                        onMove={(dir) => moveBlock(i, dir)}
                        onDelete={() => deleteBlock(i)}
                        onOpenLightbox={(src) => setLightboxSrc(src)}
                      />
                    ))}
                  </div>

                  <div style={{ position: "relative", marginTop: 8 }}>
                    <button
                      onClick={() => setShowAddMenu((v) => !v)}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 100,
                        background: "#1c1b1a",
                        color: "#f7f6f3",
                        border: "none",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                    {showAddMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: 42,
                          right: 0,
                          background: "#ffffff",
                          border: "1px solid #e6e4de",
                          borderRadius: 12,
                          padding: 8,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          zIndex: 10,
                          minWidth: 170,
                        }}
                      >
                        {[
                          ["p", "فقرة"],
                          ["h2", "عنوان فرعي"],
                          ["quote", "اقتباس"],
                          ["image", "صورة"],
                          ["divider", "فاصل • • •"],
                          ["link", "رابط"],
                        ].map(([type, label]) => (
                          <button
                            key={type}
                            onClick={() => addBlock(type as BlockType)}
                            style={{
                              textAlign: "right",
                              background: "none",
                              border: "none",
                              borderRadius: 8,
                              padding: "9px 10px",
                              fontSize: 13,
                              cursor: "pointer",
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )
        )}
      </div>

      {lightboxSrc && (
        <div
          onClick={() => setLightboxSrc(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <button
            onClick={() => setLightboxSrc(null)}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              width: 40,
              height: 40,
              borderRadius: 100,
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            onClick={(e) => e.stopPropagation()}
            src={lightboxSrc}
            alt=""
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: 8,
              display: "block",
            }}
          />
        </div>
      )}
    </div>
  );
}
