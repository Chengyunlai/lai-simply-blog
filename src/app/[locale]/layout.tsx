import "@/resources/custom.css";

import { BackToTop, Footer, Header, Providers } from "@/components";
import { I18nProvider } from "@/components/I18nProvider";
import { getHome, getPerson, baseURL } from "@/resources";
import { style } from "@/resources/ui.config";
import { getMessages, getTimeZone } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const home = getHome(locale);
  const person = getPerson(locale);
  return {
    title: home.title,
    description: home.description,
    metadataBase: new URL(baseURL),
    openGraph: {
      title: home.title,
      description: home.description,
      url: baseURL,
      siteName: home.title,
      images: [home.image],
      locale: person.locale ?? "zh-CN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: home.title,
      description: home.description,
      images: [home.image],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, timeZone] = await Promise.all([
    getMessages({ locale }),
    getTimeZone({ locale }),
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || '${style.theme}';
                  if (theme === 'system') {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <I18nProvider locale={locale} messages={messages} timeZone={timeZone}>
          <Providers>
            <Header />
            <main>{children}</main>
            <Footer />
            <BackToTop />
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
