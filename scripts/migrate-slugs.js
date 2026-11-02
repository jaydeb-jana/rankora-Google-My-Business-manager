const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const envPath = path.resolve(process.cwd(), '.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const uriMatch = env.match(/MONGODB_URI=(.*)/);
const uri = uriMatch ? uriMatch[1].trim() : null;

if (!uri) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

function generateSlug(businessName) {
  if (!businessName || typeof businessName !== 'string') {
    return 'biz-' + Math.floor(100 + Math.random() * 900);
  }
  const clean = businessName
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return clean || 'biz-' + Math.floor(100 + Math.random() * 900);
}

async function migrate() {
  await mongoose.connect(uri);
  const usersCollection = mongoose.connection.collection('users');
  const activitiesCollection = mongoose.connection.collection('review_activities');

  const users = await usersCollection.find({}).toArray();
  console.log('Found', users.length, 'users to process.');

  const assignedSlugs = new Set();
  assignedSlugs.add('admin-console');

  for (const user of users) {
    if (user.email === 'ceo@arventventures.online') {
      console.log('Preserving admin user slug:', user.slug);
      continue;
    }

    const baseSlug = generateSlug(user.businessName);
    let candidate = baseSlug;

    while (assignedSlugs.has(candidate)) {
      candidate = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;
    }
    assignedSlugs.add(candidate);

    const oldSlug = user.slug;
    const updates = { slug: candidate };

    if (user.googleReviewUrl && user.googleReviewUrl.includes('/r/')) {
      console.log('Clearing loop-inducing Rankaro URL from googleReviewUrl for:', user.email);
      updates.googleReviewUrl = '';
    }

    await usersCollection.updateOne({ _id: user._id }, { $set: updates });

    if (oldSlug && oldSlug !== candidate) {
      await activitiesCollection.updateMany({ businessId: user._id }, { $set: { slug: candidate } });
    }

    console.log({
      email: user.email,
      businessName: user.businessName,
      oldSlug: oldSlug,
      newSlug: candidate,
    });
  }

  console.log('Migration successfully completed!');
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
