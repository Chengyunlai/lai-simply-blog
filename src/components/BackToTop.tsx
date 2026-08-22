"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function BackToTop() {
  const pathname = usePathname();
  const t = useTranslations("common");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const hasVerticalScroll = document.documentElement.scrollHeight > window.innerHeight;
      setVisible(hasVerticalScroll && window.scrollY > 0);
    };

    setVisible(false);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pathname]);

  if (!visible) return null;

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <button type="button" className="back-to-top" onClick={scrollToTop} aria-label={t("back_to_top")}>
      <span aria-hidden="true">↑</span>
    </button>
  );
}
