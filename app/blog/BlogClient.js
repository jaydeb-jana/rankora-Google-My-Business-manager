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
  CheckCircle2,
  Code2,
  AlertTriangle,
  Lightbulb,
  Share2,
  Check
} from 'lucide-react';

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const articles = [
    {
      id: 'local-ranking-2026',
      title: 'The 2026 Google Local Search Algorithm: How Review Depth Dictates Map Pack Dominance',
      cat: 'seo',
      categoryName: 'Local SEO Strategy',
      readTime: '12 min read',
      date: 'October 28, 2026',
      author: 'Ayan Mukherjee, CEO',
      snippet:
        'Google’s local ranking algorithm has shifted dramatically from sheer review quantity to review velocity, semantic richness, and keyword prominence. Discover how modern businesses rank in the top 3 spots.',
      content: `For over a decade, local search engine optimization relied on a blunt, brute-force metric: whichever business had accumulated the highest raw number of reviews won the coveted Google 3-Pack.

In 2026, Google’s machine-learning ranking models (powered by multimodal Gemini and BERT architectures) have completely altered this calculus. Today, an independent dental clinic or boutique restaurant with 180 rich, keyword-dense reviews will consistently outrank a competitor with 800 stale, one-sentence reviews.

### The 3 Core Signals Dominating the 2026 Local Algorithm:

1. Review Velocity & Cadence Consistency:
Google’s algorithm monitors the rolling 90-day review cadence of local profiles. A business that received 500 reviews three years ago followed by silence signals operational decline. In contrast, a merchant receiving 12 to 20 fresh reviews each month signals active community trust and operational vibrancy.

2. Semantic Keyword Prominence in Review Text (LSI & Entity Matching):
When a local consumer searches for "emergency pediatric tooth extraction" or "handmade gluten-free truffle pasta", Google’s neural models scour the actual text body of customer reviews.
- A review that says: "Great place, 5 stars!" provides 0 keyword ranking relevance.
- A review that says: "Dr. Ramos handled our emergency tooth extraction with zero waiting delay and gentle care" matches the user's search query with 100% semantic relevance.

3. Physical Geolocation & Device Point-of-Sale Signals:
Google Maps actively verifies whether reviews are submitted from devices physically present at the storefront. Reviews submitted from desktop IP addresses hundreds of miles away (common with outsourced review networks) trigger algorithmic fraud filters, while in-store smartphone scans through Rankaro carry verified physical authenticity.

### Actionable Local SEO Checklist for Storefronts:
- [ ] Ensure your primary service offerings are clearly defined as service chips on your review landing page.
- [ ] Position high-contrast acrylic QR codes at checkout to capture reviews while the customer is physically present.
- [ ] Aim for a steady velocity of 12-16% of customer footfall rather than sporadic spikes.
- [ ] Respond to all reviews within 24 hours to signal active merchant engagement to Google.`,
    },
    {
      id: 'anti-gating-rules',
      title: 'The FTC & Google Anti-Gating Policies: How to Stay 100% Compliant and Avoid Catastrophic Penalties',
      cat: 'compliance',
      categoryName: 'Legal & Compliance',
      readTime: '10 min read',
      date: 'October 15, 2026',
      author: 'Marcus Chen, VP Compliance',
      snippet:
        'Review gating software is now subject to severe FTC civil penalties of up to $51,744. Learn what constitutes deceptive gating, how Google detects it, and why transparent review flows protect your business.',
      content: `In 2024, the Federal Trade Commission (FTC) finalized 16 CFR Part 465, establishing civil penalties of up to $51,744 per violation for deceptive review practices, synthetic reviews, and review gating.

### What Constitutes Illegal Review Gating?
Review gating is the deceptive practice of routing customers through a sentiment filter (e.g. "How was your visit? [Smile Icon] or [Frown Icon]").
- If the customer taps [Smile], the software routes them to Google Maps.
- If the customer taps [Frown], the software routes them to a private internal feedback form, blocking them from posting their negative review on Google.

Why Legacy Gating Puts Your Business in Severe Jeopardy:
1. Algorithmic Google Penalties: Google’s anti-spam models detect unnatural sentiment distributions. If a profile has 400 five-star reviews and literally zero 1-star, 2-star, or 3-star reviews over a 2-year span, the profile is flagged. Google can and will wipe out years of accumulated reviews overnight.
2. FTC Civil Enforcement: Regulatory bodies now actively subpoena SaaS review vendors to audit their routing logic. Merchants utilizing deceptive gating software can be named in federal enforcement actions.

### The Rankaro Dual-Channel Solution:
Rankaro is architected with complete anti-gating integrity:
- Every visiting customer who scans has an immediate, unhindered button to open Google Maps directly.
- Concurrently, customers are offered an instant private channel to message management directly to resolve grievances privately.
- Because the customer has complete freedom of choice and is never blocked, your business remains 100% compliant with both FTC statutory guidelines and Google’s Content Policies.`,
    },
    {
      id: 'psychology-review-friction',
      title: 'Why 87% of Satisfied Customers Never Review: The Cognitive Psychology of Review Friction',
      cat: 'psychology',
      categoryName: 'Conversion Science',
      readTime: '11 min read',
      date: 'September 30, 2026',
      author: 'Sarah Jenkins, Head of Success',
      snippet:
        'Understanding the behavioral economics behind customer inertia. Why a blank text box paralyzes willing patrons and how micro-surveys eliminate writer’s block.',
      content: `Every brick-and-mortar merchant knows the frustration: a patron compliments your service profusely, promises "I’ll definitely leave a glowing 5-star review tonight!", and then never does.

Why does this happen? Behavioral economists call this the "Intention-Action Gap". The customer was not lying; they genuinely intended to review you. However, traditional review processes present three fatal cognitive friction barriers:

### The 3 Points of Fatal Friction:
1. The Context-Switch Barrier:
When a customer leaves your store, their brain immediately shifts focus to driving, replying to work emails, or preparing dinner. By the time an automated SMS arrives 6 hours later, the emotional peak of satisfaction has degraded by over 80%.

2. The Blank Text Box Paralysis (Writer’s Block):
Staring at an empty white text box on a smartphone requires significant cognitive effort. The customer thinks: "What should I say? How long should this be? What was the hygienist’s name?" This mental exhaustion leads 72% of patrons to close the browser tab.

3. Authentication & App Fatigue:
If a review platform asks a consumer to create an account, log in with Facebook, or download an app, conversion plummets to near zero.

### How Structured Service Chips Eliminate Friction:
Cognitive psychologists distinguish between *Recall* (mentally retrieving information from scratch) and *Recognition* (identifying an option from a visual list).
- Recall: "Type what made your appointment great." (High cognitive friction).
- Recognition: Tap "Painless Cleaning" and "Zero Waiting Delay". (Zero cognitive friction).

By converting the review experience into a 10-second micro-game of recognition chips, Rankaro reduces cognitive effort by 90%, lifting in-store review conversion from 2% to over 34%.`,
    },
    {
      id: 'nfc-vs-qr-hardware',
      title: 'NFC Tap Cards vs QR Codes: In-Store Conversion Rates and Material Durability Analyzed',
      cat: 'hardware',
      categoryName: 'Hardware & Countertop',
      readTime: '9 min read',
      date: 'September 12, 2026',
      author: 'Debjit Jana, Co-Founder',
      snippet:
        'A comprehensive benchmark comparing customer engagement on NFC tap pucks versus vector QR codes across 3.8 million physical storefront scans.',
      content: `Should your business deploy contactless NFC tap pucks or traditional printed QR displays? We analyzed scan and tap conversion rates across 3.8 million physical interactions across dental clinics, restaurants, auto repair shops, and luxury salons.

### The Conversion Benchmark Findings:
1. Demographic Discrepancies:
- Consumers Aged 18 to 35: 62% naturally prefer NFC Tap. Accustomed to Apple Pay and contactless payment cards, they instinctively tap their phone against the NFC icon.
- Consumers Aged 45 and Above: 71% prefer QR Codes. They are familiar with opening their phone camera to point at a code and may not have NFC background reading enabled on older Android devices.

2. Conversion Rate by Modality:
- Standalone QR Display: 16.2% average checkout scan rate.
- Standalone NFC Puck: 18.5% average checkout tap rate.
- Hybrid Hardware (Vector QR + NFC Chip embedded behind icon): 31.8% average checkout conversion rate!

### Hardware Material Durability Breakdown:
- Matte Cast Acrylic: The gold standard for healthcare and beauty. Resists harsh clinical sanitizers and eliminates overhead specular light glare.
- Solid Hardwood Blocks: Ideal for fine dining and artisan cafes. Adds tactile warmth to leather check folios while seamlessly concealing the NFC antenna.
- Laminated Heavyweight Cardstock: Lowest cost option for temporary pop-up shops, food trucks, and seasonal events.`,
    },
    {
      id: 'de-escalate-1-star',
      title: 'How to Turn a 1-Star Review into a Brand Asset: The 4-Step De-escalation Protocol',
      cat: 'reputation',
      categoryName: 'Reputation Management',
      readTime: '10 min read',
      date: 'August 24, 2026',
      author: 'Sarah Jenkins, Head of Success',
      snippet:
        'Negative reviews are inevitable. Here is the exact crisis response formula that convinces prospective customers you are professional, empathetic, and accountable.',
      content: `Every successful business will eventually receive a negative or unfair 1-star review. Research demonstrates that consumers do not expect a flawless 5.0 rating &mdash; in fact, a profile with a 4.8 or 4.9 average rating is viewed as *more authentic* than a profile with 100% 5-star ratings.

Prospective customers actively read negative reviews to observe *how the business owner handles conflict*. A defensive, aggressive response destroys credibility; a professional, empathetic response turns the complaint into a powerful trust-building asset.

### The 4-Step Response Framework:
1. De-escalate and Validate Emotion:
Never argue or attempt to prove the customer wrong publicly. Open with empathy: "We are truly sorry to hear that your experience fell short of the high standards our team strives to deliver."

2. Reaffirm Your Core Values for Third-Party Readers:
Remember that your public response is not just for the complainant &mdash; it is being evaluated by hundreds of prospective customers. State your standards: "Punctual appointments, gentle care, and transparent billing are the bedrock of our practice."

3. Move the Conversation Offline Immediately:
Never debate billing details or medical specifics publicly (which can violate HIPAA). Provide a direct private line: "Please reach out to our clinic director, Dr. Ramos, directly at [Phone Number] or [Email] so we can make this right immediately."

4. Algorithmic Precaution: Never Repeat Complaint Keywords:
Avoid repeating negative terms in your response (e.g., do not say "We apologize for the cold food and rude service"). Repeating these terms can inadvertently index those negative keywords into Google’s search algorithms!`,
    },
    {
      id: 'keyword-rich-reviews',
      title: 'The Keyword-Rich Review Strategy: How Service Taxonomies Drive High-Intent Local Customers',
      cat: 'seo',
      categoryName: 'Local SEO Strategy',
      readTime: '13 min read',
      date: 'August 02, 2026',
      author: 'Ayan Mukherjee, CEO',
      snippet:
        'Generic 5-star reviews like "Great place!" provide zero SEO value. Discover how to configure service chips that trigger Google’s local matching algorithms.',
      content: `A 5-star Google review that reads: "Great place! Love it!" is emotionally satisfying, but algorithmically useless. It gives Google’s search bots zero semantic context regarding what products or services your business actually delivers.

Contrast that with a review formulated through Rankaro’s service chip engine:
"I came to Apex Performance Auto for an honest diagnostic quote and same-day ceramic brake repair. The certified mechanics completed the job on schedule with zero surprise fees."

### The Power of Entity Matching in Google Local Search:
Notice the high-value commercial keywords embedded naturally within the review body:
- "honest diagnostic quote" (high intent for consumers skeptical of mechanics)
- "ceramic brake repair" (exact service matching)
- "certified mechanics" (trust entity)
- "same-day" (urgency modifier)

When a nearby motorist types: "same day brake replacement near me" into Google Maps, Google’s neural models evaluate which local auto shops have the highest density of matching customer endorsements. Apex Performance Auto leaps ahead of competitors who have twice as many generic, one-word reviews.

### How to Build Your Service Chip Taxonomy in Rankaro:
1. High-Margin Services: Include chips for your most profitable offerings (e.g., "Dental Implants", "Balayage", "Emergency HVAC").
2. Key Operational Differentiators: Include chips for common customer pain points (e.g., "Zero Waiting Delay", "Upfront Quote", "Clean Work Area").
3. Staff & Hospital Experience: Include chips highlighting team traits (e.g., "Gentle Hygienist", "Attentive Waitstaff").`,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Strategy Guides' },
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
    <div className="space-y-16 pb-28">
      {/* HERO */}
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-6">
          <BookOpen className="w-4 h-4" />
          <span>Local Reputation & SEO Research Library</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight">
          Strategy Guides & Industry Research
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Exhaustive, field-tested guides on Google Local 3-Pack algorithms, FTC anti-gating compliance, countertop hardware, and conversion psychology.
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
                  <span>Read Full Masterclass</span>
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
