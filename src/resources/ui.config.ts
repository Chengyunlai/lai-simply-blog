function getEnValue(val: string | Record<string, string> | undefined | null): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val.en || "";
}

function getConfig(): any {
  if (typeof window === "undefined") {
    const { loadConfigSync } = require("../lib/loadConfig");
    return loadConfigSync();
  }
  return require("../../blog.config.json");
}

const config = getConfig() || {};

export const baseURL: string = config.site?.baseURL || "https://example.com";
export const basePath: string = config.site?.basePath || "";
export const routes = config.navigation?.routes || {};
export const display = config.theme?.display || { location: true, time: true, themeSwitcher: true, languageSwitcher: true };
export const style = config.theme?.style || { theme: "light", articleStyle: "default" };
export const articleStyle: string = style.articleStyle || "default";

export const fonts = {
  heading: { variable: "" },
  body: { variable: "" },
  label: { variable: "" },
  code: { variable: "" },
};

export const schema = {
  logo: "",
  type: "Person",
  name: config.person?.name || "Your Name",
  description: getEnValue(config.site?.description),
  email: config.person?.email || "",
};

export const sameAs = {
  threads: (config.social || []).find((s: any) => s.name === "Threads")?.link ?? "",
  linkedin: (config.social || []).find((s: any) => s.name === "LinkedIn")?.link ?? "",
  discord: (config.social || []).find((s: any) => s.name === "Discord")?.link ?? "",
};

export const socialSharing = {
  display: true,
  platforms: {
    x: true,
    linkedin: true,
    email: true,
    copyLink: true,
  },
};
