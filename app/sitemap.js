import { getSiteUrl } from '@/lib/seoConfig';
import { blogArticles } from '@/lib/blogArticles';

export default function sitemap() {
  const baseUrl = getSiteUrl();
  const now = new Date().toISOString();

  const staticRoutes = [
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/features', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/solutions', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/how-it-works', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/compare', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/case-studies', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/blog', changeFrequency: 'daily', priority: 0.9 },
    { path: '/faq', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/roi-calculator', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/qr-guide', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/security', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/gdpr', changeFrequency: 'monthly', priority: 0.5 },
  ];

  const blogRoutes = blogArticles.map((article) => ({
    path: `/blog/${article.id}`,
    changeFrequency: 'weekly',
    priority: 0.85,
    lastModified: article.isoDate || now,
  }));

  return [...staticRoutes, ...blogRoutes].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: route.lastModified || now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
