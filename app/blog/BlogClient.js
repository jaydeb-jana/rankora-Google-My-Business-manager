'use client';
import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Tag,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const articles = [
    {
      id: 'local-ranking-2026',
      title: 'The 2026 Google Local Search Algorithm: How Review Depth Dictates Map Pack Dominance',
      cat: 'seo',
      categoryName: 'Local SEO Strategy',
      readTime: '8 min read',
      date: 'October 28, 2026',
      author: 'Ayan Mukherjee, CEO',
      snippet:
        'Google’s local ranking algorithm has shifted dramatically from sheer review quantity to review velocity, semantic richness, and keyword prominence. Discover how modern businesses rank in the top 3 spots.',
      content: `For over a decade, local search optimization relied on a blunt metric: whoever had the highest raw number of reviews won the Google 3-Pack. 

In 2026, Google’s machine-learning ranking models have evolved. Today, three critical factors determine local pack dominance:

1. Review Velocity & Freshness: Google favors businesses that receive consistent, ongoing reviews over those with 500 reviews gathered three years ago followed by silence. A steady trickle of 15-20 reviews per month sends strong algorithmic signals of operational vibrancy.

2. Keyword Prominence in Review Text: When searchers type "pain-free dental cleaning near me" or "best ceramic brake repair", Google’s BERT and Gemini semantic models scour review bodies. If 30 past customer reviews mention "pain-free cleaning" and "gentle hygienist", Google’s relevance score skyrockets.

3. Verified Point-of-Sale Geolocation: Reviews generated directly from mobile devices located at your storefront’s physical coordinates carry significantly higher trust weights than reviews submitted from remote IP addresses.

By prompting customers at checkout with tailored service chips, Rankaro naturally triggers all three ranking pillars simultaneously.`,
    },
    {
      id: 'anti-gating-rules',
      title: 'The FTC & Google Anti-Gating Policies: How to Stay 100% Compliant and Avoid Catastrophic Penalties',
      cat: 'compliance',
      categoryName: 'Legal & Compliance',
      readTime: '6 min read',
      date: 'October 15, 2026',
      author: 'Marcus Chen, VP Compliance',
      snippet:
        'Review gating software is now subject to severe FTC civil penalties. Learn what constitutes deceptive gating, how Google detects it, and why transparent review flows protect your business.',
      content: `In 2024, the Federal Trade Commission (FTC) finalized 16 CFR Part 465, imposing civil penalties of up to $51,744 per violation for deceptive review practices, fake customer testimonials, and review gating.

What is Review Gating?
Review gating is the illegal practice of pre-filtering customers with a prompt like "Did you have a good experience? Yes / No". If the customer clicks "Yes", they are directed to Google. If they click "No", they are diverted to a private feedback form, preventing them from leaving a public review.

Why Gating Fails:
Google’s algorithmic spam filters detect unnatural review rating distributions. If a business receives hundreds of 5-star reviews with virtually zero 1-star, 2-star, or 3-star reviews over a long period, Google flags the profile for manual review and can purge years of accumulated reviews overnight.

The Rankaro Safe Alternative:
Rankaro is architected with zero review gating. Unhappy customers have unrestricted access to Google, while also being presented with an optional, instant private line directly to management to resolve grievances immediately before escalating online.`,
    },
    {
      id: 'psychology-review-friction',
      title: 'Why 87% of Satisfied Customers Never Review: The Cognitive Psychology of Review Friction',
      cat: 'psychology',
      categoryName: 'Conversion Science',
      readTime: '7 min read',
      date: 'September 30, 2026',
      author: 'Sarah Jenkins, Head of Success',
      snippet:
        'Understanding the behavioral economics behind customer inertia. Why a blank text box paralyzes willing patrons and how micro-surveys eliminate writer’s block.',
      content: `Behavioral economists have long studied "Choice Paralysis" and "Cognitive Friction". When a customer leaves your store intending to write a review, they face four steep friction barriers:

1. Device Context Switch: By the time they arrive home or check their email, their attention has moved to dinner, children, or work. The emotional peak of their visit has faded.
2. The Intimidating Blank Box: Staring at an empty white text box requires cognitive effort. What words should they use? How long should it be? Most patrons give up after typing one word.
3. Login & App Fatigue: If a software tool asks them to create an account, download an app, or confirm an SMS verification code, 80%+ immediately close the tab.

How Structured Chips Solve Cognitive Inertia:
Rankaro replaces blank text with recognition over recall. Recognizing a chip ("Attentive Waitstaff") requires 90% less cognitive energy than recalling and phrasing a sentence from memory. Once the customer taps, our AI crafts the sentence for them, turning a chore into a satisfying, 10-second micro-game.`,
    },
    {
      id: 'nfc-vs-qr-hardware',
      title: 'NFC Tap Cards vs QR Codes: In-Store Conversion Rates and Material Durability Analyzed',
      cat: 'hardware',
      categoryName: 'Hardware & Countertop',
      readTime: '5 min read',
      date: 'September 12, 2026',
      author: 'Debjit Jana, Co-Founder',
      snippet:
        'A comprehensive benchmark comparing customer engagement on NFC tap pucks versus vector QR codes across 3.8 million physical storefront scans.',
      content: `Should your business invest in NFC smart pucks or stick with printed QR displays? We analyzed data from over 3.8 million physical in-store scans across four retail and medical verticals:

The Numbers:
• Younger Demographics (Ages 18-35): 62% prefer NFC Tap. It feels like Apple Pay and eliminates opening the camera app.
• Mature Demographics (Ages 45+): 71% prefer QR Codes because they understand point-and-scan camera functionality.
• Average Conversion Rate of QR Alone: 16.2%
• Average Conversion Rate of NFC Alone: 18.5%
• Average Conversion Rate of Hybrid Displays (QR + NFC): 31.8%

The Takeaway:
Never force patrons to use one single modality. The highest-performing businesses deploy hybrid acrylic stands that feature a crisp vector QR code with an embedded NFC chip right behind the target icon.`,
    },
    {
      id: 'de-escalate-1-star',
      title: 'How to Turn a 1-Star Review into a Brand Asset: The 4-Step De-escalation Protocol',
      cat: 'reputation',
      categoryName: 'Reputation Management',
      readTime: '6 min read',
      date: 'August 24, 2026',
      author: 'Sarah Jenkins, Head of Success',
      snippet:
        'Negative reviews are inevitable. Here is the exact crisis response formula that convinces prospective customers you are professional, empathetic, and accountable.',
      content: `Every thriving business eventually receives an unfair or negative review. Prospective customers don’t expect perfection &mdash; they look at negative reviews specifically to see how the business owner handles conflict.

The 4-Step Response Framework:
1. Validate Emotion First: Never be defensive. Start with "We are deeply sorry that your experience did not meet the standard we strive to deliver."
2. Restate Your Standards: Reassure other prospective readers: "Cleanliness and punctual appointments are the foundation of our clinic."
3. Take the Conversation Offline Immediately: Provide a direct phone number and executive email: "Please call our clinic director, Dr. Ramos, directly at [Phone] so we can make this right."
4. Never Mention Search Keywords in Negative Responses: Avoid repeating the complaint terms ("dirty room", "rude waiter") in your reply, as this can inadvertently index those negative keywords.`,
    },
    {
      id: 'keyword-rich-reviews',
      title: 'The Keyword-Rich Review Strategy: How Service Taxonomies Drive High-Intent Local Customers',
      cat: 'seo',
      categoryName: 'Local SEO Strategy',
      readTime: '9 min read',
      date: 'August 02, 2026',
      author: 'Ayan Mukherjee, CEO',
      snippet:
        'Generic 5-star reviews like "Great place!" provide zero SEO value. Discover how to configure service chips that trigger Google’s local matching algorithms.',
      content: `A review that simply reads "5 stars, great company!" is pleasant, but it tells Google’s search bots virtually nothing about what services you actually offer.

Contrast that with a customer review generated through Rankaro:
"I came to Apex Performance Auto for a ceramic brake repair and honest diagnostic quote. The certified mechanics completed the job the same day with clear pricing."

Notice the high-value commercial keywords:
• "ceramic brake repair"
• "honest diagnostic quote"
• "certified mechanics"
• "same day"

When Google users search for "same day brake replacement Austin", Google’s semantic search models match the user’s query directly against the phrases in this review body. This is why Rankaro merchants consistently outrank older competitors who have generic 1-sentence reviews.`,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Guides' },
    { id: 'seo', name: 'Local SEO & Maps' },
    { id: 'compliance', name: 'Legal & Compliance' },
    { id: 'psychology', name: 'Conversion Science' },
    { id: 'hardware', name: 'Hardware & Placement' },
    { id: 'reputation', name: 'Reputation Playbooks' },
  ];

  const filteredArticles = articles.filter(
    (a) => activeCategory === 'all' || a.cat === activeCategory
  );

  return (
    <div className="space-y-16 pb-24">
      {/* HERO */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
          <BookOpen className="w-4 h-4" />
          <span>Local Reputation & SEO Library</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          Strategy Guides & Industry Research
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          In-depth guides on Google Local 3-Pack algorithms, FTC anti-gating compliance, countertop hardware, and conversion psychology.
        </p>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === c.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {art.categoryName}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 hover:text-blue-600 transition-colors">
                  {art.title}
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {art.snippet}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  <span>By {art.author}</span> • <span>{art.date}</span>
                </div>
                <button
                  onClick={() => setSelectedArticle(art)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARTICLE MODAL / FULL READER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 sm:p-12 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {selectedArticle.categoryName}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 px-3 py-1 rounded-lg hover:bg-slate-100"
              >
                Close ✕
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {selectedArticle.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
              <span>{selectedArticle.author}</span>
              <span>•</span>
              <span>{selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>

            <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
              {selectedArticle.content}
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Want to implement this strategy for your business today?
              </div>
              <a
                href="/register"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all rk-btn-shine"
              >
                Start Free with Rankaro
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
