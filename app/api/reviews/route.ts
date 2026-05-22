import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { readContent, writeContent } from "@/lib/content";
import type { Review } from "@/lib/content-types";

function makeAvatar(name: string): string {
  return name.trim().split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 2);
}

export async function POST(request: NextRequest) {
  let body: { kind?: "print" | "photo"; name?: string; detail?: string; quote?: string; rating?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const kind = body.kind;
  const name = (body.name ?? "").trim().slice(0, 80);
  const detail = (body.detail ?? "").trim().slice(0, 120);
  const quote = (body.quote ?? "").trim().slice(0, 1000);
  const rating = Number(body.rating);

  if (kind !== "print" && kind !== "photo") {
    return NextResponse.json({ ok: false, error: "invalid_kind" }, { status: 400 });
  }
  if (!name || !quote) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: "invalid_rating" }, { status: 400 });
  }

  const review: Review = {
    name,
    detail,
    avatar: makeAvatar(name),
    quote,
    rating: Math.round(rating),
  };

  try {
    const current = await readContent();
    const next = JSON.parse(JSON.stringify(current)) as typeof current;
    if (kind === "print") {
      next.print.reviews = [review, ...next.print.reviews];
    } else {
      next.photo.reviews = [review, ...next.photo.reviews];
    }
    await writeContent(next);
  } catch (err) {
    return NextResponse.json({ ok: false, error: "write_failed", detail: String(err) }, { status: 500 });
  }

  revalidatePath(kind === "print" ? "/impression" : "/photographie");
  return NextResponse.json({ ok: true, review });
}
