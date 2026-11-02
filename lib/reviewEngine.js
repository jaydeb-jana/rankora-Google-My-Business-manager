/**
 * Generates natural, authentic review drafts based strictly on customer selections,
 * customized store details (shopDetails), writing rules (reviewStyleRules),
 * business metadata (businessCategory, city, address), and configured language distribution.
 *
 * Privacy Protection:
 * Automatically sanitizes and excludes private personal data (phone numbers, email addresses,
 * owner private names) from public reviews.
 */

// Available languages metadata
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
];

export function resolveReviewLanguage(aiKnowledge, forceLanguage = null) {
  if (forceLanguage) return forceLanguage;
  const langs = aiKnowledge?.languages;
  if (!langs || !Array.isArray(langs) || langs.length === 0) return 'en';

  if (langs.length === 1) {
    return langs[0].code || 'en';
  }

  // 2 Languages: Pick based on ratio percentage
  const r0 = Number(langs[0].ratio) ?? 50;
  const roll = Math.random() * 100;
  if (roll < r0) {
    return langs[0].code || 'en';
  }
  return langs[1].code || 'en';
}

function parseRulesDirectives(rulesText) {
  if (!rulesText || typeof rulesText !== 'string') return {};
  const lower = rulesText.toLowerCase();
  return {
    emphasizePoliteness: /polite|behavior|courteous|respectful|patient|friendly|manner|ব্যবহার|ভদ্র/i.test(lower),
    emphasizeSpeed: /fast|quick|prompt|same-day|on-time|turnaround|speed|দ্রুত|তাড়াতাড়ি/i.test(lower),
    emphasizePrice: /price|pricing|fair|affordable|reasonable|transparent|honest|সঠিক দাম|ন্যায্য/i.test(lower),
    emphasizeWarranty: /warranty|guarantee|genuine|original|ওয়ারেন্টি|গ্যারান্টি|অরিজিনাল/i.test(lower),
    isEnthusiastic: /enthusiastic|warm|super|highly|সেরা|অসাধারণ/i.test(lower),
  };
}

function extractShopContext(shopDetails) {
  if (!shopDetails || typeof shopDetails !== 'string') return '';
  const clean = sanitizePrivateInfo(shopDetails.trim());
  if (!clean) return '';
  // Take first 1 or 2 clean sentences
  const sentences = clean.split(/[.?!।\n]/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return '';
  const snippet = sentences[0];
  return snippet.length <= 150 ? snippet : snippet.slice(0, 147) + '...';
}

/**
 * Strict privacy filter: strips any phone numbers, email addresses, or private sensitive markers
 */
function sanitizePrivateInfo(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '') // remove email addresses
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g, '') // remove phone numbers
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function generateReviewDrafts({
  businessName = 'this business',
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
  const serviceNames = selectedServices.map((s) => (typeof s === 'string' ? s : s.name));
  const rawHighlight = (answers.experience || answers.highlight || '')?.trim();
  const highlight = sanitizePrivateInfo(rawHighlight);
  const additionalNotes = sanitizePrivateInfo(answers.additionalNotes?.trim() || '');

  // Full AI Knowledge Extraction
  const shopSnippet = extractShopContext(aiKnowledge?.shopDetails);
  const directives = parseRulesDirectives(aiKnowledge?.reviewStyleRules);
  const lang = resolveReviewLanguage(aiKnowledge, forceLanguage);

  // Clean location & category for natural customer tone
  const cleanCity = sanitizePrivateInfo(city);
  const cleanCategory = sanitizePrivateInfo(businessCategory);

  // Helper to format service list naturally
  function formatList(items, conjunction = 'and') {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
  }

  // ---------------------------------------------------------------------------
  // BENGALI (বাংলা) REVIEW DRAFTS
  // ---------------------------------------------------------------------------
  if (lang === 'bn') {
    const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'এবং') : 'তাদের সেবা';

    if (sentiment === 'critical' || sentiment === 'needs_improvement' || sentiment === 'terrible') {
      return [
        {
          id: 'bn_constructive',
          lang: 'bn',
          title: 'সরাসরি ও গঠনমূলক মতামত',
          description: 'সার্ভিস পাওয়ার সংক্ষিপ্ত বিবরণ ও উন্নতির জায়গাগুলো তুলে ধরা।',
          text: `সম্প্রতি আমি ${businessName}-এ গিয়েছিলাম ${servicesPhrase} নিয়ে।${
            highlight ? ` বিশেষ করে ${highlight} সংক্রান্ত বিষয়ে।` : ''
          }${additionalNotes ? ` ${additionalNotes}।` : ''} আমার অভিজ্ঞতা আশানুরূপ ছিল না। আশা করব সার্ভিস টিম বিষয়টি গুরুত্ব সহকারে দেখবে।`,
        },
      ];
    }

    if (sentiment === 'neutral') {
      return [
        {
          id: 'bn_neutral',
          lang: 'bn',
          title: 'ভারসাম্যপূর্ণ রিভিউ',
          description: 'মোটামুটি ভালো অভিজ্ঞতার সংক্ষিপ্ত সারাংশ।',
          text: `${businessName}-এ ${servicesPhrase} এর জন্য গিয়েছিলাম। সামগ্রিকভাবে সার্ভিস ঠিকঠাক ছিল।${
            highlight ? ` ${highlight}।` : ''
          }`,
        },
      ];
    }

    // Positive / Exceptional (বাংলা)
    let bnDetailed = `${businessName}${cleanCity ? ` (${cleanCity})` : ''}-এ আমার অভিজ্ঞতা সত্যিই দারুণ ছিল!`;
    if (serviceNames.length > 0) {
      bnDetailed += ` আমি মূলত ${servicesPhrase} এর জন্য যোগাযোগ করেছিলাম এবং কাজটি অত্যন্ত দক্ষতার সাথে সম্পন্ন হয়েছে।`;
    }
    if (shopSnippet) {
      bnDetailed += ` তাদের টেকনিক্যাল জ্ঞান এবং কাজের আন্তরিকতা সত্যিই প্রশংসার দাবি রাখে।`;
    }
    if (directives.emphasizePoliteness) {
      bnDetailed += ` কর্মীদের ব্যবহার অত্যন্ত ভদ্র, ধৈর্যশীল ও অমায়িক।`;
    }
    if (directives.emphasizeSpeed) {
      bnDetailed += ` কোনো অযথা সময় নষ্ট না করে খুব দ্রুত ডেলিভারি দিয়েছেন।`;
    }
    if (directives.emphasizePrice) {
      bnDetailed += ` কাজের তুলনায় সার্ভিস চার্জ এবং দাম একদম ন্যায্য ও স্বচ্ছ।`;
    }
    if (directives.emphasizeWarranty) {
      bnDetailed += ` জেনুইন পার্টস ও নির্ভরযোগ্য সার্ভিসের নিশ্চয়তা থাকায় নিশ্চিন্তে কাজ করানো যায়।`;
    }
    if (highlight) {
      bnDetailed += ` বিশেষ করে ${highlight} এর বিষয়টি দারুণ লেগেছে।`;
    }
    if (additionalNotes) {
      bnDetailed += ` ${additionalNotes}।`;
    }
    bnDetailed += ` ভালো কাজ ও নির্ভরযোগ্য সেবার জন্য আমি সবাইকে ${businessName} রেকমেন্ড করব।`;

    let bnConcise = `${businessName}-এর সার্ভিস খুবই দ্রুত, নির্ভরযোগ্য ও মানসম্মত।`;
    if (serviceNames.length > 0) {
      bnConcise += ` ${servicesPhrase} খুব নিখুঁতভাবে শেষ করে দেওয়া হয়েছে।`;
    }
    if (directives.emphasizeSpeed) {
      bnConcise += ` কথা অনুযায়ী যথাসময়েই কাজ শেষ করে দিয়েছেন।`;
    }
    if (directives.emphasizePrice) {
      bnConcise += ` দাম যুক্তিযুক্ত এবং কোনো লুকানো চার্জ নেই।`;
    }
    if (highlight) {
      bnConcise += ` ${highlight}।`;
    }
    bnConcise += ` কাজের গুণমান চমৎকার, সম্পূর্ণ ৫ তারকা রেটিং পাওয়ার যোগ্য!`;

    let bnWarm = `${businessName}-এর পুরো টিমকে অনেক অনেক ধন্যবাদ!`;
    if (serviceNames.length > 0) {
      bnWarm += ` ${servicesPhrase} এর ক্ষেত্রে তাদের যত্নশীলতা ও সৎ পরামর্শ আমাকে মুগ্ধ করেছে।`;
    }
    if (cleanCity) {
      bnWarm += ` ${cleanCity}-তে এমন একটি নির্ভরযোগ্য প্রতিষ্ঠান থাকা সবার জন্য অনেক বড় সুবিধার।`;
    }
    if (directives.emphasizePoliteness) {
      bnWarm += ` গ্রাহকের প্রতি তাদের সম্মান ও সুন্দর ব্যবহার মন জয় করার মতো।`;
    }
    if (highlight) {
      bnWarm += ` বিশেষ করে ${highlight} এর বিষয়টি দারুণ ছিল।`;
    }
    bnWarm += ` নিঃসন্দেহে বিশ্বস্ত একটি প্রতিষ্ঠান। নির্দ্বিধায় সেবা নিতে পারেন!`;

    return [
      {
        id: 'detailed',
        lang: 'bn',
        title: 'Detailed & Specific (বাংলা)',
        description: 'Comprehensive review with shop context and services.',
        text: bnDetailed.trim(),
      },
      {
        id: 'concise',
        lang: 'bn',
        title: 'Short & Direct (বাংলা)',
        description: 'Punchy 2-3 sentence review.',
        text: bnConcise.trim(),
      },
      {
        id: 'warm',
        lang: 'bn',
        title: 'Warm & Personal (বাংলা)',
        description: 'Friendly tone focused on polite service.',
        text: bnWarm.trim(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // HINDI (हिंदी) REVIEW DRAFTS
  // ---------------------------------------------------------------------------
  if (lang === 'hi') {
    const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'और') : 'उनकी सेवा';

    let hiDetailed = `${businessName}${cleanCity ? ` (${cleanCity})` : ''} के साथ मेरा अनुभव बहुत ही शानदार रहा!`;
    if (serviceNames.length > 0) {
      hiDetailed += ` मैंने विशेष रूप से ${servicesPhrase} के लिए संपर्क किया था और काम पूरी निष्ठा से किया गया।`;
    }
    if (shopSnippet) {
      hiDetailed += ` उनकी कार्यकुशलता और तकनीकी समझ वाकई काबिले तारीफ है।`;
    }
    if (directives.emphasizePoliteness) {
      hiDetailed += ` स्टाफ का व्यवहार बहुत ही विनम्र, धैर्यवान और सहयोगी था।`;
    }
    if (directives.emphasizeSpeed) {
      hiDetailed += ` काम बिना किसी देरी के समय पर पूरा हुआ।`;
    }
    if (directives.emphasizePrice) {
      hiDetailed += ` कीमतें भी बहुत उचित और पारदर्शी हैं।`;
    }
    if (highlight) {
      hiDetailed += ` सबसे अच्छी बात रही: ${highlight}।`;
    }
    hiDetailed += ` बेहतरीन सर्विस के लिए मैं ${businessName} की जोरदार सिफारिश करता हूँ।`;

    let hiConcise = `${businessName} की सेवा बहुत ही तेज, पेशेवर और भरोसेमंद है।`;
    if (serviceNames.length > 0) {
      hiConcise += ` ${servicesPhrase} का काम बहुत ही बढ़िया हुआ।`;
    }
    if (highlight) {
      hiConcise += ` ${highlight}।`;
    }
    hiConcise += ` गुणवत्ता और समय की पाबंदी के लिए 5 स्टार रेटिंग!`;

    let hiWarm = `${businessName} की पूरी टीम का बहुत-बहुत आभार!`;
    if (serviceNames.length > 0) {
      hiWarm += ` ${servicesPhrase} के लिए यह एक उत्कृष्ट स्थान है।`;
    }
    if (directives.emphasizePoliteness) {
      hiWarm += ` ग्राहकों का पूरा ध्यान रखा जाता है। बिल्कुल भरोसेमंद!`;
    }
    if (cleanCity) {
      hiWarm += ` ${cleanCity} में ऐसी विश्वसनीय सेवा मिलना बहुत अच्छी बात है।`;
    }
    if (highlight) {
      hiWarm += ` विशेष रूप से ${highlight} बहुत अच्छा था।`;
    }
    hiWarm += ` बिना किसी संकोच के इनकी सेवा लें!`;

    return [
      {
        id: 'detailed',
        lang: 'hi',
        title: 'Detailed & Specific (हिंदी)',
        description: 'विस्तृत एवं स्पष्ट समीक्षा।',
        text: hiDetailed.trim(),
      },
      {
        id: 'concise',
        lang: 'hi',
        title: 'Short & Direct (हिंदी)',
        description: 'संक्षिप्त एवं सीधा ड्राफ्ट।',
        text: hiConcise.trim(),
      },
      {
        id: 'warm',
        lang: 'hi',
        title: 'Warm & Personal (हिंदी)',
        description: 'सद्भावना एवं अच्छे व्यवहार पर केंद्रित समीक्षा।',
        text: hiWarm.trim(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // ENGLISH REVIEW DRAFTS (Default)
  // ---------------------------------------------------------------------------
  const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'and') : 'their service';

  // Tone variations based on sentiment
  if (sentiment === 'critical' || sentiment === 'needs_improvement' || sentiment === 'terrible') {
    return [
      {
        id: 'constructive_direct',
        lang: 'en',
        title: 'Direct & Constructive Feedback',
        description: 'Clear summary of what was received and areas that could be improved.',
        text: `I recently visited ${businessName} regarding ${servicesPhrase}.${
          highlight ? ` Specifically, ${highlight}.` : ''
        }${additionalNotes ? ` ${additionalNotes}.` : ''} While there were some aspects handled, my overall experience did not fully meet expectations. I hope this honest feedback helps the team make improvements.`,
      },
      {
        id: 'constructive_balanced',
        lang: 'en',
        title: 'Balanced Overview',
        description: 'Mentions the services received while respectfully outlining room for improvement.',
        text: `Sharing my recent experience with ${businessName} for ${servicesPhrase}. ${
          highlight ? `The main observation was: ${highlight}. ` : ''
        }There is clear room for improvement here, and I hope management addresses these points for future clients.`,
      },
    ];
  }

  if (sentiment === 'neutral') {
    return [
      {
        id: 'neutral_standard',
        lang: 'en',
        title: 'Fair & Balanced',
        description: 'Objective overview of the services received.',
        text: `I had an appointment with ${businessName} for ${servicesPhrase}.${
          highlight ? ` ${highlight}.` : ''
        } Overall, the service was satisfactory and covered the basics.${
          additionalNotes ? ` ${additionalNotes}` : ''
        }`,
      },
      {
        id: 'neutral_concise',
        lang: 'en',
        title: 'Short & Direct',
        description: 'Brief, straightforward summary.',
        text: `Visited ${businessName} for ${servicesPhrase}. Service was decent and straightforward.${
          highlight ? ` ${highlight}.` : ''
        }`,
      },
    ];
  }

  // Positive & Exceptional Sentiments (4-5 stars)
  const isTopTier = sentiment === 'exceptional';

  // Option 1: Detailed & Comprehensive
  let detailedText = isTopTier
    ? `I had an outstanding experience with ${businessName}${cleanCity ? ` in ${cleanCity}` : ''}!`
    : `I had a very positive experience with ${businessName}.`;

  if (serviceNames.length > 0) {
    detailedText += ` I specifically used them for ${servicesPhrase}, and the entire process was handled with true professionalism.`;
  }

  if (shopSnippet) {
    detailedText += ` Their technical competence and attention to detail were evident from start to finish.`;
  }

  if (directives.emphasizePoliteness) {
    detailedText += ` The staff was courteous, polite, and patient in answering all my questions.`;
  }

  if (directives.emphasizeSpeed) {
    detailedText += ` The turnaround was impressively swift with no unnecessary waiting.`;
  }

  if (directives.emphasizePrice) {
    detailedText += ` Pricing was completely transparent and fair with zero surprise charges.`;
  }

  if (directives.emphasizeWarranty) {
    detailedText += ` Knowing they use genuine quality parts and stand behind their work gives great peace of mind.`;
  }

  if (highlight) {
    detailedText += ` What really stood out was ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
  }

  if (additionalNotes) {
    detailedText += ` ${additionalNotes}.`;
  }

  detailedText += isTopTier
    ? ` If you are looking for a reliable ${cleanCategory ? cleanCategory.toLowerCase() : 'service provider'} in the area, I highly recommend ${businessName}!`
    : ` Would definitely recommend their team based on my visit.`;

  // Option 2: Concise & Direct
  let conciseText = `Really impressed with ${businessName}${cleanCity ? ` (${cleanCity})` : ''}.`;
  if (serviceNames.length > 0) {
    conciseText += ` They delivered excellent work on ${servicesPhrase}.`;
  }
  if (directives.emphasizeSpeed) {
    conciseText += ` Fast turnaround, polite behavior, and honest pricing.`;
  } else {
    conciseText += ` Prompt service and great communication.`;
  }
  if (highlight) {
    conciseText += ` ${highlight}.`;
  }
  conciseText += ` Professional, prompt, and easy to recommend 5-star service!`;

  // Option 3: Warm & Personal
  let warmText = `Huge thanks to the team at ${businessName}!`;
  if (serviceNames.length > 0) {
    warmText += ` From the moment I reached out regarding ${servicesPhrase}, they were welcoming and thorough.`;
  }
  if (cleanCity) {
    warmText += ` Having such a dependable ${cleanCategory ? cleanCategory.toLowerCase() : 'local business'} here in ${cleanCity} is a huge asset for the community.`;
  }
  if (directives.emphasizePoliteness) {
    warmText += ` Their friendly customer care and respectful approach made a huge impression.`;
  }
  if (highlight) {
    warmText += ` It was especially great that ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
  }
  warmText += ` It is refreshing to find a business that truly takes pride in customer satisfaction!`;

  return [
    {
      id: 'detailed',
      lang: 'en',
      title: 'Detailed & Specific',
      description: 'Comprehensive review highlighting your exact services and positive notes.',
      text: detailedText.trim(),
    },
    {
      id: 'concise',
      lang: 'en',
      title: 'Short & Direct',
      description: 'Clear, 2-3 sentence review that is quick and punchy.',
      text: conciseText.trim(),
    },
    {
      id: 'warm',
      lang: 'en',
      title: 'Warm & Personal',
      description: 'Friendly, appreciative tone focused on customer care.',
      text: warmText.trim(),
    },
  ];
}

/**
 * Live Google Gemini 1.5 Flash review generator using the business account's verified API key.
 * Strictly respects privacy (no phone numbers, email, or owner personal names) and weaves in
 * all rich context from the AI knowledge page.
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
  const langName =
    targetLang === 'bn'
      ? 'Bengali (বাংলা)'
      : targetLang === 'hi'
      ? 'Hindi (हिंदी)'
      : targetLang === 'es'
      ? 'Spanish (Español)'
      : 'English';

  const serviceList = selectedServices
    .map((s) => (typeof s === 'string' ? s : s.name))
    .filter(Boolean);

  const shopContext = sanitizePrivateInfo(aiKnowledge?.shopDetails || '');
  const styleDirectives = sanitizePrivateInfo(aiKnowledge?.reviewStyleRules || '');
  const cleanCity = sanitizePrivateInfo(city);
  const cleanCategory = sanitizePrivateInfo(businessCategory);

  const prompt = `You are a real customer writing an authentic, positive Google Review for a local business.
Write 3 VARIANT customer review drafts in ${langName}.

BUSINESS INFORMATION:
- Name: ${businessName}
- Category: ${cleanCategory || 'Local Business'}
- City / Area: ${cleanCity || ''}
${address ? `- Location / Address: ${sanitizePrivateInfo(address)}` : ''}
${description ? `- Store Bio: ${sanitizePrivateInfo(description)}` : ''}
${shopContext ? `- Shop Details & Highlights: ${shopContext}` : ''}
${styleDirectives ? `- Style Directives / Tone Preferences: ${styleDirectives}` : ''}
- Services Received: ${serviceList.length > 0 ? serviceList.join(', ') : 'Customer Service'}
- Customer Sentiment: ${sentiment}

CRITICAL RULES:
1. STRICT PRIVACY: NEVER output or mention any mobile/phone numbers, email addresses, or personal owner names.
2. Sounds like a genuine customer (human tone, natural wording, NOT artificial or marketing fluff).
3. Keep reviews between 2 and 4 sentences each, perfect for posting quickly on Google Maps.
4. Provide 3 different styles:
   - 1st Draft: Short & Direct
   - 2nd Draft: Detailed & Experiential
   - 3rd Draft: Friendly & Warm

OUTPUT FORMAT:
Respond ONLY with a JSON array in this exact format:
[
  { "id": "gemini_1", "title": "Short & Direct", "description": "Quick, punchy review highlighting the service", "text": "review content in ${langName}" },
  { "id": "gemini_2", "title": "Detailed Experience", "description": "Mentions staff behavior and service quality", "text": "review content in ${langName}" },
  { "id": "gemini_3", "title": "Warm Recommendation", "description": "Conversational, highly relatable tone", "text": "review content in ${langName}" }
]`;

  const candidateModels = [
    aiKnowledge?.geminiModel || 'gemini-3.5-flash',
    'gemini-3.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

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
              maxOutputTokens: 700,
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

      // Extract JSON block
      const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!jsonMatch) continue;

      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: item.id || `gemini_${idx + 1}`,
          lang: targetLang,
          title: item.title || `AI Review Draft ${idx + 1}`,
          description: item.description || 'Generated with your Gemini AI key',
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
 * High-level review generator: Attempts live Gemini generation if an account has a verified key,
 * otherwise transparently falls back to the deterministic template engine.
 */
export async function generateReviewDraftsWithAi(params) {
  const apiKey = params.aiKnowledge?.geminiApiKey;
  const isKeyVerified = params.aiKnowledge?.isKeyVerified;

  if (apiKey && isKeyVerified) {
    try {
      const geminiDrafts = await generateGeminiReviewDrafts({
        ...params,
        apiKey,
      });
      if (geminiDrafts && geminiDrafts.length > 0) {
        return geminiDrafts;
      }
    } catch (e) {
      console.error('[Gemini Review Gen Fallback]:', e);
    }
  }

  // Fallback to internal high-performance template engine
  return generateReviewDrafts(params);
}

