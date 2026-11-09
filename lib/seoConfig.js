export const PRODUCTION_DOMAIN = 'https://rankaro.com';

/**
 * Returns the fully qualified public domain for SEO purposes (canonical URLs,
 * sitemap.xml, robots.txt, Schema.org JSON-LD, OpenGraph).
 * Prevents 'http://localhost' from contaminating production indexing or Search Console.
 */
export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
    return PRODUCTION_DOMAIN;
  }

  return envUrl.replace(/\/$/, '');
}
