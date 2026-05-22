import { Redis } from "@upstash/redis";
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
const KV_KEY = "vb:services";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function loadServicesSync(): ServiceData[] {
  try {
    return JSON.parse(readFileSync(SERVICES_PATH, "utf8")) as ServiceData[];
  } catch (err) {
    console.error("Failed to read content/services.json:", err);
    return [];
  }
}

// Sync export used by generateStaticParams at build time
export const services: ServiceData[] = loadServicesSync();

export async function readServices(): Promise<ServiceData[]> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<ServiceData[]>(KV_KEY);
    if (data) return data;
  }
  return loadServicesSync();
}

export async function getServiceBySlug(slug: string): Promise<ServiceData | undefined> {
  const all = await readServices();
  return all.find((s) => s.slug === slug);
}

export async function writeServices(next: ServiceData[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(KV_KEY, next);
    return;
  }
  writeFileSync(SERVICES_PATH, JSON.stringify(next, null, 2), "utf8");
}
