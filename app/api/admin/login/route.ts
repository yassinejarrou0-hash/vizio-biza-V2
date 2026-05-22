import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, makeSessionToken, verifyPassword } from "@/lib/auth";

const SEVEN_DAYS = 7 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const next = String(form.get("next") || "/admin");

  if (!verifyPassword(password)) {
    return NextResponse.redirect(new URL(`/admin/login?error=1&next=${encodeURIComponent(next)}`, request.url), 303);
  }

  const safeNext = next.startsWith("/admin") ? next : "/admin";
  const response = NextResponse.redirect(new URL(safeNext, request.url), 303);
  response.cookies.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
  return response;
}
