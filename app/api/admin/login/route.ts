import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createSessionCookie, isAdminConfigured } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD غير مضبوط على الخادم" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;
  if (typeof password !== "string" || !checkPassword(password)) {
    return NextResponse.json({ error: "كلمة السر غير صحيحة" }, { status: 401 });
  }

  createSessionCookie();
  return NextResponse.json({ ok: true });
}
