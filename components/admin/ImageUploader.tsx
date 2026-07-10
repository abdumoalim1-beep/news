"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageUploader({
  src,
  onChange,
  placeholder,
  shape = "rect",
  fit = "cover",
  style,
}: {
  src: string | null | undefined;
  onChange: (url: string) => void;
  placeholder: string;
  shape?: "rect" | "circle";
  fit?: "cover" | "contain";
  style?: React.CSSProperties;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [remoteFailed, setRemoteFailed] = useState(false);

  useEffect(() => {
    setRemoteFailed(false);
  }, [src]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "فشل الرفع");
        setLocalPreview(null);
        return;
      }
      setDeploying(!!data.deploying);
      onChange(data.url);
    } catch {
      setError("فشل الرفع");
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const displaySrc = localPreview || (remoteFailed ? null : src);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: shape === "circle" ? "50%" : 12,
        overflow: "hidden",
        background: dragOver ? "#eceae4" : "#f7f6f3",
        border: dragOver ? "2px dashed #86837e" : "1px solid #e2e0da",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={onFileChange}
        style={{ display: "none" }}
      />
      {displaySrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={displaySrc}
          alt={placeholder}
          onError={() => {
            if (!localPreview) setRemoteFailed(true);
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            fontSize: 13,
            color: "#86837e",
            textAlign: "center",
            padding: 8,
          }}
        >
          {uploading
            ? "جارِ الرفع..."
            : remoteFailed
            ? "الصورة قيد النشر..."
            : placeholder}
        </div>
      )}
      {deploying && !uploading && (
        <div
          style={{
            position: "absolute",
            top: 4,
            insetInline: 4,
            fontSize: 11,
            color: "#1c1b1a",
            background: "rgba(255,255,255,0.85)",
            borderRadius: 6,
            padding: "2px 6px",
            textAlign: "center",
          }}
        >
          سيظهر التحديث بعد اكتمال النشر التلقائي (~دقيقة)
        </div>
      )}
      {error && (
        <div
          style={{
            position: "absolute",
            bottom: 4,
            insetInline: 4,
            fontSize: 11,
            color: "#fff",
            background: "rgba(178,59,59,0.9)",
            borderRadius: 6,
            padding: "2px 6px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
