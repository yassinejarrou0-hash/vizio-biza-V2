import { promises as fs } from "node:fs";
import path from "node:path";
import type { SiteContent } from "./content-types";

const CONTENT_PATH = path.join(process.cwd(), "content", "site.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(next: SiteContent): Promise<void> {
  const json = JSON.stringify(next, null, 2);
  await fs.writeFile(CONTENT_PATH, json, "utf8");
}
