import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import {loadConfigSync} from '../lib/loadConfig';

export default getRequestConfig(async ({locale}) => {
  // Validate that the locale is supported
  const validLocale = routing.locales.includes(locale as any) ? locale : routing.defaultLocale;
  const config = loadConfigSync();

  return {
    locale: validLocale as string,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: config.person?.location || 'UTC'
  };
});
