"use client";

import { person, social } from "@/resources";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-copy">
          <span suppressHydrationWarning>© {year} / {person.name}</span>
          <span className="footer-sep">/</span>
          <span>
            {t("built_with")} <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
          </span>
        </div>
        <div className="footer-links">
          {social.map((item: any) =>
            item.link ? (
              <a
                key={item.name}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                title={item.name}
              >
                {item.name}
              </a>
            ) : null
          )}
        </div>
      </div>
    </footer>
  );
}
