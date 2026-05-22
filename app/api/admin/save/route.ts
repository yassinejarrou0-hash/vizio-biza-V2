import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/auth";
import { readContent, writeContent } from "@/lib/content";
import { writeServices, services as currentServices } from "@/lib/services";
import type { SiteContent, ServiceData } from "@/lib/content-types";

type Section =
  | "settings"
  | "landing"
  | "contact"
  | "hero-print"
  | "hero-photo"
  | "products"
  | "products-photo"
  | "reviews-print"
  | "reviews-photo"
  | "about-print"
  | "about-photo"
  | "featured3-print"
  | "featured3-photo"
  | "categories-print"
  | "categories-photo"
  | "promostrip-print"
  | "promostrip-photo"
  | "process-print"
  | "process-photo"
  | "bestsellers-print"
  | "bestsellers-photo"
  | "service"
  | "services-list";

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { section: Section; data: unknown; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const { section, data } = body;
  if (!section || data === undefined) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    if (section === "service") {
      if (!body.slug) {
        return NextResponse.json({ ok: false, error: "missing_slug" }, { status: 400 });
      }
      const list = [...currentServices];
      const idx = list.findIndex((x) => x.slug === body.slug);
      if (idx < 0) {
        return NextResponse.json({ ok: false, error: "service_not_found" }, { status: 404 });
      }
      list[idx] = data as ServiceData;
      writeServices(list);
      revalidatePath(`/services/${body.slug}`);
      revalidatePath("/impression");
      revalidatePath("/photographie");
      return NextResponse.json({ ok: true });
    }

    if (section === "services-list") {
      writeServices(data as ServiceData[]);
      revalidatePath("/impression");
      revalidatePath("/photographie");
      return NextResponse.json({ ok: true });
    }

    const current = await readContent();
    const next: SiteContent = JSON.parse(JSON.stringify(current));

    switch (section) {
      case "settings": next.settings = data as SiteContent["settings"]; break;
      case "landing": next.landing = data as SiteContent["landing"]; break;
      case "contact": next.contact = data as SiteContent["contact"]; break;
      case "hero-print": next.print.heroSlides = data as SiteContent["print"]["heroSlides"]; break;
      case "hero-photo": next.photo.heroSlides = data as SiteContent["photo"]["heroSlides"]; break;
      case "products": next.print.products = data as SiteContent["print"]["products"]; break;
      case "products-photo": next.photo.products = data as SiteContent["photo"]["products"]; break;
      case "reviews-print": next.print.reviews = data as SiteContent["print"]["reviews"]; break;
      case "reviews-photo": next.photo.reviews = data as SiteContent["photo"]["reviews"]; break;
      case "about-print": next.print.about = data as SiteContent["print"]["about"]; break;
      case "about-photo": next.photo.about = data as SiteContent["photo"]["about"]; break;
      case "featured3-print": next.print.featured3 = data as SiteContent["print"]["featured3"]; break;
      case "featured3-photo": next.photo.featured3 = data as SiteContent["photo"]["featured3"]; break;
      case "categories-print": next.print.categories = data as SiteContent["print"]["categories"]; break;
      case "categories-photo": next.photo.categories = data as SiteContent["photo"]["categories"]; break;
      case "promostrip-print": next.print.promoStrip = data as SiteContent["print"]["promoStrip"]; break;
      case "promostrip-photo": next.photo.promoStrip = data as SiteContent["photo"]["promoStrip"]; break;
      case "process-print": next.print.process = data as SiteContent["print"]["process"]; break;
      case "process-photo": next.photo.process = data as SiteContent["photo"]["process"]; break;
      case "bestsellers-print": next.print.bestsellers = data as SiteContent["print"]["bestsellers"]; break;
      case "bestsellers-photo": next.photo.bestsellers = data as SiteContent["photo"]["bestsellers"]; break;
      default: return NextResponse.json({ ok: false, error: "unknown_section" }, { status: 400 });
    }

    await writeContent(next);
  } catch (err) {
    return NextResponse.json({ ok: false, error: "write_failed", detail: String(err) }, { status: 500 });
  }

  revalidatePath("/impression");
  revalidatePath("/photographie");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
