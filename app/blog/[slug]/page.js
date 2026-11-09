import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogArticles } from '@/lib/blogArticles';
import { getSiteUrl } from '@/lib/seoConfig';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.id,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.id === slug);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/blog/${slug}`;

  return {
    title: article.title,
    description: article.snippet,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${article.title} | Rankaro`,
      description: article.snippet,
      url: canonicalUrl,
      siteName: 'Rankaro',
      type: 'article',
      publishedTime: article.isoDate,
      authors: [article.author],
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | Rankaro`,
      description: article.snippet,
      images: ['/logo.png'],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const article = blogArticles.find((a) => a.id === slug);

  if (!article) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/blog/${slug}`;
  const relatedArticles = blogArticles
    .filter((a) => a.id !== slug)
    .slice(0, 3);

  const articleSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.snippet,
      datePublished: article.isoDate,
      dateModified: article.isoDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
      author: {
        '@type': 'Person',
        name: article.author,
        jobTitle: article.authorRole,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Rankaro',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo.png`,
        },
      },
      image: `${siteUrl}/logo.png`,
      keywords: article.keywords.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${siteUrl}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: article.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  // Helper to render content with markdown-like sections
  const renderContent = (rawText) => {
    const blocks = rawText.split('\n\n');
    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      if (trimmed.startsWith('### ')) {
        return (
          <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-10 mb-4 tracking-tight">
            {trimmed.replace('### ', '')}
          </h2>
        );
      }

      if (trimmed.startsWith('1. ') || trimmed.startsWith('2. ') || trimmed.startsWith('3. ') || trimmed.startsWith('4. ')) {
        const lines = trimmed.split('\n');
        return (
          <div key={idx} className="my-5 p-5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <h3 className="font-bold text-slate-900 text-base mb-2">{lines[0]}</h3>
            {lines.slice(1).map((subline, sIdx) => (
              <p key={sIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed mt-1">
                {subline}
              </p>
            ))}
          </div>
        );
      }

      if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n');
        return (
          <ul key={idx} className="my-4 space-y-2.5">
            {items.map((item, iIdx) => {
              const text = item.replace(/^- (\[ \])?/, '').trim();
              return (
                <li key={iIdx} className="flex items-start space-x-3 text-slate-700 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={idx} className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <JsonLd schema={articleSchema} />
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-100 bg-slate-50/50 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex items-center space-x-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </div>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
          <header className="space-y-6 pb-8 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                {article.categoryName}
              </span>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <time dateTime={article.isoDate}>{article.date}</time>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed">
              {article.snippet}
            </p>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{article.author}</div>
                  <div className="text-xs text-slate-500">{article.authorRole} &bull; Rankaro Intelligence</div>
                </div>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">All Guides</span>
              </Link>
            </div>
          </header>

          {/* Article Body */}
          <div className="prose prose-slate max-w-none pt-10">
            {renderContent(article.content)}
          </div>

          {/* Key Takeaways Callout */}
          <div className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-3xl">
            <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Executive Implementation Summary</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Ready to automate your review velocity the ethical way?
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              Rankaro pairs physical countertop QR stands and tap cards with keyword-rich AI drafts, helping local businesses collect 100% compliant, rich 5-star Google reviews in 10 seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all rk-btn-shine"
              >
                <span>Launch Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/roi-calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <span>Calculate Your ROI</span>
              </Link>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
              Topics:
            </span>
            {article.keywords.map((kw, kIdx) => (
              <span
                key={kIdx}
                className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                #{kw}
              </span>
            ))}
          </div>

          {/* Related Articles */}
          <section className="mt-16 pt-10 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Related Strategy Masterclasses</h3>
                <p className="text-sm text-slate-500 mt-1">Deepen your knowledge of local SEO and review optimization</p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.id}`}
                  className="group flex flex-col p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all bg-white"
                >
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    {rel.categoryName}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {rel.snippet}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                    <span>{rel.readTime}</span>
                    <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center space-x-1">
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
