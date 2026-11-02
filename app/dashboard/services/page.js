import { getSessionUser } from '@/lib/auth';
import { userRepo } from '@/lib/repositories';
import ServicesManagerClient from './ServicesManagerClient';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const user = await getSessionUser();
  if (!user) return null;
  const freshUser = await userRepo.findById(user._id);

  const rawAiKnowledge = freshUser?.aiKnowledge || null;
  const initialAiKnowledge = rawAiKnowledge
    ? {
        shopDetails: rawAiKnowledge.shopDetails || '',
        reviewStyleRules: rawAiKnowledge.reviewStyleRules || '',
        languages: rawAiKnowledge.languages || [{ code: 'en', name: 'English', ratio: 100 }],
        hasGeminiKey: Boolean(rawAiKnowledge.geminiApiKey),
        isKeyVerified: Boolean(rawAiKnowledge.isKeyVerified),
        maskedGeminiKey: rawAiKnowledge.geminiApiKey
          ? rawAiKnowledge.geminiApiKey.length > 10
            ? `${rawAiKnowledge.geminiApiKey.slice(0, 6)}...${rawAiKnowledge.geminiApiKey.slice(-4)}`
            : '••••••••'
          : '',
      }
    : null;

  return (
    <ServicesManagerClient
      initialServices={freshUser?.services || []}
      initialAiKnowledge={initialAiKnowledge}
    />
  );
}
