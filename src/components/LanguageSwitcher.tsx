"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = () => {
    const nextLocale = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      className="lang-switcher"
      onClick={switchLocale}
      aria-label={locale === "en" ? "Switch to Chinese" : "Switch to English"}
    >
      {locale === "en" ? "中" : "EN"}
    </button>
  );
}
