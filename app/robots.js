export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rankaro.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/dev/',
          '/login',
          '/register',
          '/forgot-password',
          '/r/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/dev/',
          '/login',
          '/register',
          '/forgot-password',
          '/r/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/dev/',
          '/login',
          '/register',
          '/forgot-password',
          '/r/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
