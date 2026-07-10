"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "كلمة السر غير صحيحة");
        setLoading(false);
        return;
      }
      router.refresh();
    } catch {
      setError("حدث خطأ، حاول مرة أخرى");
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: "inherit",
        background: "#efeeeb",
        color: "#1c1b1a",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "#ffffff",
          border: "1px solid #e6e4de",
          borderRadius: 20,
          padding: 40,
          width: 320,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#1c1b1a",
            margin: "0 auto 20px",
          }}
        />
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
          لوحة التحكم
        </div>
        {!configured ? (
          <div style={{ fontSize: 13, color: "#b23b3b" }}>
            لم يتم ضبط ADMIN_PASSWORD على الخادم بعد. أضِفه في متغيرات البيئة
            ثم أعد التشغيل.
          </div>
        ) : (
          <>
            <div style={{ fontSize: 13, color: "#86837e", marginBottom: 22 }}>
              هذه الصفحة خاصة، أدخل كلمة السر للدخول
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة السر"
              autoFocus
              style={{
                width: "100%",
                fontSize: 14,
                border: "1px solid #e2e0da",
                background: "#f7f6f3",
                borderRadius: 10,
                padding: "12px 14px",
                textAlign: "center",
              }}
            />
            {error && (
              <div style={{ color: "#b23b3b", fontSize: 13, marginTop: 10 }}>
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 16,
                width: "100%",
                background: "#1c1b1a",
                color: "#f7f6f3",
                border: "none",
                borderRadius: 10,
                padding: 12,
                fontSize: 14,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              دخول
            </button>
          </>
        )}
      </form>
    </div>
  );
}
