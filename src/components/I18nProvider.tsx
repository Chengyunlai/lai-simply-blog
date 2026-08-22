"use client";

import { NextIntlClientProvider } from "next-intl";

export function I18nProvider({
  locale,
  messages,
  timeZone,
  children,
}: {
  locale: string;
  messages: Record<string, any>;
  timeZone: string;
  children: React.ReactNode;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      {children}
    </NextIntlClientProvider>
  );
}
