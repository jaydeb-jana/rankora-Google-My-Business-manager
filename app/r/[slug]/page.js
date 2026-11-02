import { notFound } from 'next/navigation';
import { userRepo, activityRepo } from '@/lib/repositories';
import { SearchX, AlertTriangle, ArrowLeft, Home, Building2 } from 'lucide-react';
import PublicReviewPageClient from './PublicReviewPageClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const user = await userRepo.findBySlug(slug);

  if (!user || !user.isVerified || user.role === 'admin' || user.email === 'ceo@arventventures.online') {
    return {
      title: 'Review Page Not Found - Rankaro',
    };
  }

  return {
    title: `Share Your Experience with ${user.businessName} - Rankaro`,
    description: `Leave an authentic, detailed Google review for ${user.businessName}.`,
  };
}

export default async function PublicReviewPage({ params }) {
  const { slug } = await params;
  const user = await userRepo.findBySlug(slug);

  if (!user || !user.isVerified || user.role === 'admin' || user.email === 'ceo@arventventures.online') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 text-[#202124]">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center border border-[#dadce0] shadow-xl animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-2xl bg-[#fce8e6] text-[#d93025] flex items-center justify-center mx-auto mb-5 shadow-xs">
            <SearchX className="w-8 h-8" />
          </div>

          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#d93025] bg-[#fce8e6] px-3 py-1 rounded-full mb-3">
            404 • Review Link Not Found
          </span>

          <h1 className="text-2xl font-black text-[#202124] tracking-tight mb-2">
            এই রিভিউ লিংকটি বর্তমানে বিদ্যমান নেই
          </h1>
          <p className="text-xs text-[#5f6368] font-mono bg-[#f1f3f4] px-3 py-1.5 rounded-lg inline-block max-w-full truncate mb-4">
            /r/{slug}
          </p>

          <p className="text-xs text-[#5f6368] leading-relaxed mb-6">
            আপনি যে রিভিউ লিংকটি খুঁজছেন তা আমাদের প্ল্যাটফর্মে বর্তমানে সক্রিয় বা বিদ্যমান নেই। লিংকটিতে টাইপিং ভুল থাকতে পারে, অথবা সংশ্লিষ্ট ব্যবসা প্রতিষ্ঠানের নাম পরিবর্তনের কারণে লিংকটি আপডেট হয়ে থাকতে পারে।
          </p>

          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#e8eaed] text-left text-xs text-[#5f6368] space-y-2 mb-6">
            <p className="font-semibold text-[#202124] flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ea8600]" />
              <span>সম্ভাব্য কারণসমূহ:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-[#5f6368] pl-1">
              <li>ইউআরএল-এর বানানে কোনো ভুল হয়েছে।</li>
              <li>ব্যবসাটির নতুন নাম অনুযায়ী লিংকটি আপডেট করা হয়েছে।</li>
              <li>অ্যাকাউন্টটি এখনো ভেরিফাই হয়নি বা নিষ্ক্রিয় রয়েছে।</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded-xl transition-colors shadow-2xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Homepage</span>
            </a>
            <a
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 text-xs font-semibold text-[#3c4043] bg-white hover:bg-[#f8f9fa] border border-[#dadce0] rounded-xl transition-colors shadow-2xs"
            >
              <Building2 className="w-3.5 h-3.5 text-[#5f6368]" />
              <span>Create Business Review Link</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Record visit
  userRepo.incrementStats(user.slug, 'totalVisits').catch(() => {});
  activityRepo.recordActivity({
    businessId: user._id,
    slug: user.slug,
    type: 'VISIT',
  }).catch(() => {});

  const businessData = {
    id: user._id.toString(),
    businessName: user.businessName,
    slug: user.slug,
    businessCategory: user.businessCategory,
    address: user.address,
    city: user.city,
    website: user.website,
    description: user.description || '',
    welcomeHeadline: user.welcomeHeadline || `How was your experience at ${user.businessName}?`,
    instructions:
      user.instructions ||
      'Select the services you received below. We will help draft an authentic review you can review and paste into Google.',
    services: user.services || [],
    googleReviewUrl: user.googleReviewUrl || '',
    logoUrl: user.logoUrl || '',
    aiKnowledge: user.aiKnowledge || null,
    hasGoogleUrl: Boolean(user.googleReviewUrl && user.googleReviewUrl.startsWith('http')),
  };

  return <PublicReviewPageClient business={businessData} />;
}
