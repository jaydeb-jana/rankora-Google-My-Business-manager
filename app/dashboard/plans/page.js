import { getSessionUser } from '@/lib/auth';
import { userRepo, settingsRepo } from '@/lib/repositories';
import PlansClient from './PlansClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Plans & Pricing (Pro / Ultra) | RANKORA',
  description: 'Pro and Ultra Google Business Profile review automation plans by Arventa Ventures for RANKORA.',
};

export default async function PlansPage() {
  const user = await getSessionUser();
  const freshUser = user?._id ? await userRepo.findById(user._id) : user;
  const settings = await settingsRepo.getSettings();

  return <PlansClient user={freshUser || user} pricingConfig={settings?.pricing} />;
}
