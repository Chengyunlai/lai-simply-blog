import type { About, Blog, Home, Person, Social, Work } from "@/types";

function getLocaleValue(val: string | Record<string, string> | undefined | null, locale: string = "en"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[locale] || val.en || "";
}

function createPerson(config: any, locale: string = "en"): Person {
  const p = config?.person || {};
  const basePath = config?.site?.basePath || "";
  const rawAvatar = p.avatar || "/images/avatar.svg";
  return {
    name: p.name || "Your Name",
    role: getLocaleValue(p.role, locale),
    avatar: rawAvatar.startsWith("http") ? rawAvatar : `${basePath}${rawAvatar}`,
    email: p.email || "",
    location: p.location || "UTC",
    locationLabel: p.locationLabel || "Your City",
    languages: p.languages || ["en", "zh"],
    locale: p.locale || "en",
  };
}

function createSocial(config: any): Social {
  return (config?.social || []).map((link: any) => ({
    name: link.name || "",
    link: link.link || "",
  }));
}

function createHome(config: any, locale: string = "en"): Home {
  const site = config?.site || {};
  return {
    path: "/",
    image: "/images/og/home.svg",
    label: "Home",
    title: getLocaleValue(site.title, locale),
    description: getLocaleValue(site.description, locale),
  };
}

function createAbout(config: any, locale: string = "en"): About {
  const a = config?.about || {};
  const person = createPerson(config);
  
  const defaultIntroTitle = { en: "About Me", zh: "自我介绍" };
  const defaultIntroDesc = { en: "Write your self-introduction here.", zh: "在这里写你的自我介绍。" };
  const defaultTechnicalTitle = { en: "Interests", zh: "关注方向" };
  
  return {
    path: "/about",
    label: "About",
    title: `About ${person.name}`,
    description: `About ${person.name}: ${person.role}.`,
    intro: {
      display: a.intro?.display ?? true,
      title: getLocaleValue(a.intro?.title || defaultIntroTitle, locale),
      description: getLocaleValue(a.intro?.description || defaultIntroDesc, locale),
    },
    work: {
      display: a.work?.display ?? false,
      title: getLocaleValue(a.work?.title, locale),
      experiences: a.work?.experiences || [],
    },
    studies: {
      display: a.studies?.display ?? false,
      title: getLocaleValue(a.studies?.title, locale),
      institutions: a.studies?.institutions || [],
    },
    technical: {
      display: a.technical?.display ?? true,
      title: getLocaleValue(a.technical?.title || defaultTechnicalTitle, locale),
      skills: (a.technical?.skills || []).map((skill: any) => ({
        ...skill,
        description: skill.description || "",
      })),
    },
    calendar: a.calendar || { display: false, link: "" },
  };
}

function createBlog(config: any, locale: string = "en"): Blog {
  const site = config?.site || {};
  const person = createPerson(config, locale);
  return {
    path: "/blog",
    label: "Blog",
    title: getLocaleValue(site.title, locale) || "Blog",
    description: `Blog posts by ${person.name}`,
  };
}

function createWork(config: any, locale: string = "en"): Work {
  const site = config?.site || {};
  const person = createPerson(config, locale);
  return {
    path: "/work",
    label: "Projects",
    title: getLocaleValue(site.title, locale) || "Projects",
    description: `Open-source projects by ${person.name}`,
  };
}

function getConfig(): any {
  if (typeof window === "undefined") {
    const { loadConfigSync } = require("../lib/loadConfig");
    return loadConfigSync();
  }
  return require("../../blog.config.json");
}

const config = getConfig() || {};

// Static exports (default locale)
export const person: Person = createPerson(config);
export const social: Social = createSocial(config);
export const home: Home = createHome(config);
export const about: About = createAbout(config);
export const blog: Blog = createBlog(config);
export const work: Work = createWork(config);

// Locale-aware getter functions
export function getPerson(locale: string = "en"): Person {
  return createPerson(getConfig(), locale);
}

export function getSocial(): Social {
  return createSocial(getConfig());
}

export function getHome(locale: string = "en"): Home {
  return createHome(getConfig(), locale);
}

export function getAbout(locale: string = "en"): About {
  return createAbout(getConfig(), locale);
}

export function getBlog(locale: string = "en"): Blog {
  return createBlog(getConfig(), locale);
}

export function getWork(locale: string = "en"): Work {
  return createWork(getConfig(), locale);
}
