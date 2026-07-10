import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { isAuthenticated } from "@/lib/auth";
import { commitFile, isGithubConfigured } from "@/lib/github";

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Kept comfortably under Vercel's serverless request body limit (4.5MB).
const MAX_SIZE = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرسال ملف" }, { status: 400 });
  }

  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "الملف كبير جدًا (الحد الأقصى 4 ميغابايت)" },
      { status: 400 }
    );
  }

  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isGithubConfigured()) {
    await commitFile(
      `public/uploads/${filename}`,
      buffer,
      `content: upload image ${filename}`
    );
    return NextResponse.json({ url: `/uploads/${filename}`, deploying: true });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, deploying: false });
}
