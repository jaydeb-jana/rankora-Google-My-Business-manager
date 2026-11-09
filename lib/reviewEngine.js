/**
 * Live Google Gemini AI Review Generation Engine
 *
 * All reviews are generated 100% dynamically via live Google Gemini AI.
 * Hardcoded review templates are completely prohibited and eliminated.
 *
 * Privacy Protection:
 * Automatically sanitizes and excludes private personal data (phone numbers, email addresses,
 * owner private names) from public reviews.
 */

// Available languages metadata
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', native: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'German', flag: '🇩🇪' },
  { code: 'hi', name: 'Hindi', native: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'Bengali', flag: '🇧🇩' },
  { code: 'ar', name: 'Arabic', native: 'Arabic', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', native: 'Urdu', flag: '🇵🇰' },
];

/**
 * Weighted random language selection based strictly on the business's configured ratio.
 * For example: 50% English and 50% Bengali across 100 visits generates ~50 English reviews and ~50 Bengali reviews.
 */
export function resolveReviewLanguage(aiKnowledge, forceLanguage = null) {
  if (forceLanguage) return forceLanguage;
  const langs = aiKnowledge?.languages;
  if (!langs || !Array.isArray(langs) || langs.length === 0) return 'en';

  if (langs.length === 1) {
    return langs[0].code || 'en';
  }

  const totalWeight = langs.reduce((acc, l) => acc + (Number(l.ratio) > 0 ? Number(l.ratio) : 1), 0);
  let randomVal = Math.random() * totalWeight;
  for (const l of langs) {
    const weight = Number(l.ratio) > 0 ? Number(l.ratio) : 1;
    if (randomVal <= weight) {
      return l.code || 'en';
    }
    randomVal -= weight;
  }
  return langs[0]?.code || 'en';
}

/**
 * Strict privacy filter: strips any phone numbers, email addresses, or private sensitive markers
 */
export function sanitizePrivateInfo(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '') // remove email addresses
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g, '') // remove phone numbers
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Live Google Gemini review generator using the business account's verified API key.
 * Strictly respects privacy and weaves in all rich context from the AI knowledge page.
 */
export async function generateGeminiReviewDrafts({
  apiKey,
  businessName,
  businessCategory = '',
  city = '',
  address = '',
  description = '',
  selectedServices = [],
  sentiment = 'exceptional',
  answers = {},
  aiKnowledge = null,
  forceLanguage = null,
}) {
  if (!apiKey) return null;

  const targetLang = resolveReviewLanguage(aiKnowledge, forceLanguage);
  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);
  const langName = langObj ? langObj.name : 'English';

  const serviceList = selectedServices
    .map((s) => (typeof s === 'string' ? s : s.name))
    .filter(Boolean);

  const shopContext = sanitizePrivateInfo(aiKnowledge?.shopDetails || '');
  const styleDirectives = sanitizePrivateInfo(aiKnowledge?.reviewStyleRules || '');
  const cleanCity = sanitizePrivateInfo(city);
  const cleanCategory = sanitizePrivateInfo(businessCategory);
  const customerExperience = sanitizePrivateInfo(answers?.experience || answers?.highlight || '');

  const isNegative = sentiment === 'terrible' || sentiment === 'critical';
  const isNeutral = sentiment === 'neutral' || sentiment === 'needs_improvement';

  const heroService = serviceList.length > 0 ? serviceList.join(', ') : (cleanCategory || 'Customer Service');

  let personaInstruction = '';
  let styleRequirements = '';
  let formatStyles = '';

  if (isNegative) {
    personaInstruction = `You are an expert Reputation Strategist drafting customer feedback for Google Maps.
The customer had an issue with "${heroService}" at "${businessName}" and wants to express honest, constructive dissatisfaction (1-2 stars).

CRITICAL GOAL - CONSTRUCTIVE SERVICE RECOVERY:
Do NOT write abusive, insulting, or toxic rants. Instead, write civilized, factual, and constructive reviews that clearly identify the service friction point (e.g. communication delay, turnaround time, or expectation gap) while acknowledging the team's baseline potential.
The goal is to give the customer an authentic, dignified voice while creating a professional bridge so management can reply publicly on Google Maps and demonstrate high-standard customer service recovery.`;

    styleRequirements = `Provide 3 VARIANT constructive review drafts in natural spoken ${langName}:
   - Draft 1: Direct & Objective (Clear statement of the friction with "${heroService}")
   - Draft 2: Service Timeline / Communication (Focus on response time, expectations, and desired improvement)
   - Draft 3: Constructive Opportunity (Fair feedback advising management on what needs polishing before giving them another try)`;

    formatStyles = `[
  { "id": "gemini_1", "title": "Objective Feedback", "description": "Clear statement of the service issue encountered", "text": "constructive review in ${langName}" },
  { "id": "gemini_2", "title": "Communication & Timeline", "description": "Feedback on response time and turnaround", "text": "constructive review in ${langName}" },
  { "id": "gemini_3", "title": "Constructive Advice", "description": "Constructive path for merchant improvement", "text": "constructive review in ${langName}" }
]`;
  } else if (isNeutral) {
    personaInstruction = `You are a real customer writing a balanced, realistic 3-star Google review for "${businessName}" reflecting an average experience with "${heroService}".`;
    styleRequirements = `Provide 3 VARIANT balanced review drafts in ${langName}. Mention that while "${heroService}" was completed, there were minor delays or clear areas for polish. Keep it fair, objective, and realistic.`;
    formatStyles = `[
  { "id": "gemini_1", "title": "Balanced & Honest", "description": "Fair assessment highlighting both acceptable points and drawbacks", "text": "balanced review in ${langName}" },
  { "id": "gemini_2", "title": "Standard Delivery", "description": "Reflects standard service with room for refinement", "text": "balanced review in ${langName}" },
  { "id": "gemini_3", "title": "Moderate Feedback", "description": "Objective feedback for prospective visitors", "text": "balanced review in ${langName}" }
]`;
  } else {
    personaInstruction = `You are a highly satisfied customer writing an authentic, high-converting 5-star Google Maps review for "${businessName}".

PRIMARY HERO SERVICE CENTERPIECE:
The customer specifically received: "${heroService}".
Every review draft MUST revolve around "${heroService}"—describing what was done, the care and skill involved, and the positive result. This directly triggers Google Maps "Review Justifications" when prospective clients search for this service!`;

    styleRequirements = `Provide 3 DISTINCT, HIGH-CONVERTING VARIANT positive review drafts in ${langName}:
   - Draft 1 (Hero Service In-Depth): Explains how "${heroService}" solved their need with high quality, incorporating concrete store details for maximum Google Maps Local SEO ranking signals.
   - Draft 2 (Quick, Punchy & High Impact): Crisp, punchy review (2-3 sentences) emphasizing prompt turnaround, fair pricing, and great results.
   - Draft 3 (Warm, Courteous & Personal): Focuses on polite and helpful staff behavior, transparent advice, and an enthusiastic community recommendation.`;

    formatStyles = `[
  { "id": "gemini_1", "title": "Hero Service In-Depth", "description": "Focuses on ${heroService} and tangible positive results", "text": "authentic review in ${langName}" },
  { "id": "gemini_2", "title": "Quick & High Impact", "description": "Crisp feedback on turnaround, pricing, and execution", "text": "authentic review in ${langName}" },
  { "id": "gemini_3", "title": "Warm Recommendation", "description": "Appreciative tone praising staff behavior and care", "text": "authentic review in ${langName}" }
]`;
  }

  const prompt = `${personaInstruction}

WRITE 3 VARIANT CUSTOMER REVIEWS IN ${langName.toUpperCase()}.

BUSINESS CONTEXT & METADATA:
- Business Name: ${businessName}
- Category: ${cleanCategory || 'Local Business'}
- City / Area: ${cleanCity || ''}
${address ? `- Location / Address: ${sanitizePrivateInfo(address)}` : ''}
${description ? `- Store Bio: ${sanitizePrivateInfo(description)}` : ''}
${shopContext ? `- Merchant Shop Details & Context (Weave in naturally): ${shopContext}` : ''}
${styleDirectives ? `- Merchant Tone & Writing Style Rules (Strictly adhere): ${styleDirectives}` : ''}
- Primary Selected Service(s): ${heroService}
${customerExperience ? `- Customer's Specific Feedback / Note: ${customerExperience}` : ''}
- Customer Sentiment: ${sentiment}

CRITICAL RULES FOR HIGH-RANKING GOOGLE REVIEWS:
1. HERO SERVICE FOCUS: Feature "${heroService}" as the anchor of the review. Explain the customer need, the quality of execution, and the satisfaction outcome.
2. NATURAL HUMAN VOICE: Write naturally as a real local customer sharing authentic feedback. Use contemporary, everyday spoken ${langName} (e.g. natural চলিত ভাষা if Bengali; modern conversational rhythm if English).
3. ZERO ROBOTIC CLICHES: NEVER use corporate AI clichés (such as "in conclusion", "top-notch", "look no further", "their technical acumen was evident", or repetitive buzzwords). Never sound like a robot or paid advertisement.
4. STRICT PRIVACY: NEVER invent or mention any phone numbers, email addresses, or private owner names.
5. CONCISE & PUNCHY: Keep each review between 2 and 4 natural sentences (approximately 35 to 65 words), optimal for mobile Google Maps reading.
6. NO AI MENTIONS: Never mention AI, Gemini, language models, prompts, or automated generators in the review text.
7. ${styleRequirements}

OUTPUT FORMAT:
Respond ONLY with a valid JSON array in this exact format:
${formatStyles}`;

  const candidateModels = [
    aiKnowledge?.geminiModel,
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.6-flash',
    'gemini-3.7-flash',
    'gemini-3.8-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[Gemini Review Gen HTTP Error with ${model}]:`, res.status);
        continue;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      // Parse JSON from Gemini response (clean JSON or fenced block)
      let parsed = null;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch {
            parsed = null;
          }
        }
      }

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: item.id || `gemini_${idx + 1}`,
          lang: targetLang,
          title: item.title || `AI Review Draft ${idx + 1}`,
          description: item.description || 'AI generated review draft',
          text: sanitizePrivateInfo(item.text),
        }));
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[Gemini Review Gen Exception with ${model}]:`, err.message);
    }
  }

  return null;
}

/**
 * High-level review generator: STRICTLY uses live Google Gemini AI.
 * HARDCODED TEMPLATES ARE PROHIBITED AND HAVE BEEN FULLY REMOVED.
 * If Gemini AI fails or API key is missing, returns an explicit error so merchant fallbackReviews can take over.
 */
export async function generateReviewDraftsWithAi(params) {
  const apiKey =
    params.apiKey ||
    params.aiKnowledge?.geminiApiKey ||
    process.env.GEMINI_API_KEY ||
    '';

  if (!apiKey) {
    return {
      success: false,
      error: 'System Error: Gemini API key is missing or not configured. Please add an API key in dashboard or settings.',
      drafts: [],
    };
  }

  try {
    const geminiDrafts = await generateGeminiReviewDrafts({
      ...params,
      apiKey,
    });
    if (geminiDrafts && Array.isArray(geminiDrafts) && geminiDrafts.length > 0) {
      return {
        success: true,
        drafts: geminiDrafts,
        isAiGenerated: true,
      };
    }
  } catch (e) {
    console.error('[Gemini Review Gen Error]:', e);
  }

  // Strictly NO template fallback: if Gemini failed or gave no response, return system error
  return {
    success: false,
    error: 'System Error: Gemini AI failed to respond. Please verify your API key and try again.',
    drafts: [],
  };
}
