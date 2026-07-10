import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sessionToken(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export function isAdminConfigured(): boolean {
  return !!getAdminPassword();
}

export function checkPassword(input: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  const a = Buffer.from(sessionToken(input));
  const b = Buffer.from(sessionToken(password));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const password = getAdminPassword();
  if (!password) return;
  cookies().set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  const cookie = cookies().get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(sessionToken(password));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
