import defaultConfig from "../../blog.config";
import { deepMerge } from "./deepMerge";

export type BlogConfig = typeof defaultConfig;

let cachedConfig: BlogConfig | null = null;

async function loadUserConfig(): Promise<Partial<BlogConfig>> {
  try {
    const userConfig = await import(/* webpackIgnore: true */ "../../content/blog.config" as string);
    return (userConfig as any).default || {};
  } catch {
    return {};
  }
}

export async function getConfig(): Promise<BlogConfig> {
  if (cachedConfig) return cachedConfig;

  const userConfig = await loadUserConfig();
  cachedConfig = deepMerge(defaultConfig, userConfig) as BlogConfig;
  return cachedConfig;
}

export function getConfigSync(): BlogConfig {
  if (!cachedConfig) {
    throw new Error("Config not loaded. Call getConfig() first.");
  }
  return cachedConfig;
}

export function clearConfigCache() {
  cachedConfig = null;
}
