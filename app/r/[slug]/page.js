import { notFound } from 'next/navigation';
import { userRepo, activityRepo } from '@/lib/repositories';
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
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-[#dadce0] shadow-md">
          <div className="w-12 h-12 rounded-full bg-[#fce8e6] text-[#d93025] flex items-center justify-center mx-auto mb-4 font-bold text-lg">
            !
          </div>
          <h1 className="text-xl font-bold text-[#202124]">Review Page Not Found</h1>
          <p className="mt-2 text-xs text-[#5f6368] leading-relaxed">
            The review page for &quot;{slug}&quot; could not be located. The link may have changed or the business account is pending activation.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#1a73e8] bg-[#e8f0fe] rounded-lg hover:bg-[#d2e3fc]"
            >
              Back to Rankaro Home
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
