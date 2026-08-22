import { getRequestConfig } from "next-intl/server";
import { defaultLocale, locales } from "./lib/i18n";

export default getRequestConfig(async ({ locale }) => {
  console.log("[i18n] Received locale:", locale);
  const activeLocale = locales.includes(locale as any) ? locale : defaultLocale;
  console.log("[i18n] Active locale:", activeLocale);
  
  return {
    locale: activeLocale as string,
    timeZone: "UTC",
    messages: (await import(`./messages/${activeLocale}.json`)).default,
  };
});
