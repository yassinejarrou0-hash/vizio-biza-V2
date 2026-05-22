import { Redis } from "@upstash/redis";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteContent } from "./content-types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");
const KV_KEY = "vb:site";

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function readContent(): Promise<SiteContent> {
  const redis = getRedis();
  if (redis) {
    const data = await redis.get<SiteContent>(KV_KEY);
    if (data) return data;
  }
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(next: SiteContent): Promise<void> {
  const redis = getRedis();
  if (redis) {
    console.log("[writeContent] writing to KV");
    await redis.set(KV_KEY, next);
    console.log("[writeContent] KV write OK");
    return;
  }
  console.warn("[writeContent] KV env vars missing — writing to filesystem (ephemeral on Vercel!)");
  await fs.writeFile(CONTENT_PATH, JSON.stringify(next, null, 2), "utf8");
}
