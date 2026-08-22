import { readFileSync, existsSync } from "fs";
import { join } from "path";

const CONFIG_PATH = join(process.cwd(), "blog.config.json");

export function loadConfigSync(): any {
  if (!existsSync(CONFIG_PATH)) {
    return {};
  }
  try {
    const content = readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}
