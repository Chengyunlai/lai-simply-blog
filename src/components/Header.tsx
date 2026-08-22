"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n";
import { CONFIG_UPDATED_EVENT, type ConfigUpdatedDetail, type DisplayConfig } from "@/lib/configEvents";
import { useEffect, useState } from "react";
import { display, person, routes } from "@/resources";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

function TimeDisplay({ timeZone }: { timeZone: string }) {
  const locale = useLocale();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat(locale, {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone, locale]);

  return <span className="header-time">{time}</span>;
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const defaultDisplayConfig: DisplayConfig = {
  location: true,
  time: true,
  themeSwitcher: true,
  languageSwitcher: true,
};

function getDisplayConfig(value: unknown): DisplayConfig {
  const display = value && typeof value === "object" ? value as Partial<DisplayConfig> : {};
  return {
    location: typeof display.location === "boolean" ? display.location : defaultDisplayConfig.location,
    time: typeof display.time === "boolean" ? display.time : defaultDisplayConfig.time,
    themeSwitcher: typeof display.themeSwitcher === "boolean" ? display.themeSwitcher : defaultDisplayConfig.themeSwitcher,
    languageSwitcher: typeof display.languageSwitcher === "boolean" ? display.languageSwitcher : defaultDisplayConfig.languageSwitcher,
  };
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname() ?? "";
  const [isDev, setIsDev] = useState(false);
  const [displayConfig, setDisplayConfig] = useState<DisplayConfig>(() => getDisplayConfig(display));

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");

    if (process.env.NODE_ENV === "development") {
      fetch("/api/config")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.success) {
            setDisplayConfig(getDisplayConfig(data.config?.theme?.display));
          }
        })
        .catch(() => {
          // Keep the server-rendered configuration when the dev config API is unavailable.
        });
    }

    const handleConfigUpdate = (event: Event) => {
      const config = (event as CustomEvent<ConfigUpdatedDetail>).detail;
      setDisplayConfig(getDisplayConfig(config?.theme?.display));
    };
    window.addEventListener(CONFIG_UPDATED_EVENT, handleConfigUpdate);
    return () => window.removeEventListener(CONFIG_UPDATED_EVENT, handleConfigUpdate);
  }, []);

  const navItems = [
    { href: "/" as any, label: t("home"), show: routes["/"] },
    { href: "/work" as any, label: t("work"), show: routes["/work"] },
    { href: "/blog" as any, label: t("blog"), show: routes["/blog"] },
  ].filter((item) => item.show);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          {displayConfig.location && <span suppressHydrationWarning>{person.locationLabel || person.name}</span>}
        </div>
        <nav className="header-nav" suppressHydrationWarning>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`header-link ${pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          {isDev && (
            <Link href="/settings" className={`header-link ${pathname === "/settings" ? "active" : ""}`}>
              <SettingsIcon />
            </Link>
          )}
          {displayConfig.languageSwitcher && <LanguageSwitcher />}
          {displayConfig.themeSwitcher && <ThemeToggle />}
        </nav>
        <div className="header-right">
          {displayConfig.time && <TimeDisplay timeZone={person.location} />}
        </div>
      </div>
    </header>
  );
}
