import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ServiceData } from "./content-types";

export type {
  ServiceData,
  ServiceVariant,
  ServiceCategory,
  Spec,
  FAQ,
  Related,
  SubService,
  WhyItem,
  ArticleBlock,
} from "./content-types";

const SERVICES_PATH = path.join(process.cwd(), "content", "services.json");

function loadServices(): ServiceData[] {
  try {
    return JSON.parse(readFileSync(SERVICES_PATH, "utf8")) as ServiceData[];
  } catch (err) {
    console.error("Failed to read content/services.json:", err);
    return [];
  }
}

export const services: ServiceData[] = loadServices();

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return loadServices().find((s) => s.slug === slug);
}

export function writeServices(next: ServiceData[]): void {
  writeFileSync(SERVICES_PATH, JSON.stringify(next, null, 2), "utf8");
}
