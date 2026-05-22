import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "vb_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return (
    process.env.ADMIN_SECRET ||
    process.env.NEXT_PUBLIC_ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "dev-secret-change-me"
  );
}

function getPassword(): string {
  return (
    process.env.ADMIN_PASSWORD ||
    process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
    "admin"
  );
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = Buffer.from(getPassword(), "utf8");
  const got = Buffer.from(password, "utf8");
  if (expected.length !== got.length) return false;
  return timingSafeEqual(expected, got);
}

export function makeSessionToken(): string {
  const payload = `${Date.now() + SESSION_TTL_MS}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  if (expected.length !== sig.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  } catch {
    return false;
  }
  const expires = Number(payload);
  if (!Number.isFinite(expires)) return false;
  return Date.now() < expires;
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) {
    redirect("/admin/login");
  }
}
