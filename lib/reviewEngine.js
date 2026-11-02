/**
 * Generates natural, authentic review drafts based strictly on customer selections,
 * customized store details (shopDetails), writing rules (reviewStyleRules),
 * and configured language distribution.
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
  const clean = shopDetails.trim();
  if (!clean) return '';
  // Take first 1 or 2 clean sentences
  const sentences = clean.split(/[.?!।\n]/).map((s) => s.trim()).filter(Boolean);
  if (sentences.length === 0) return '';
  const snippet = sentences[0];
  return snippet.length <= 150 ? snippet : snippet.slice(0, 147) + '...';
}

export function generateReviewDrafts({
  businessName = 'this business',
  selectedServices = [],
  sentiment = 'exceptional',
  answers = {},
  aiKnowledge = null,
  forceLanguage = null,
}) {
  const serviceNames = selectedServices.map((s) => (typeof s === 'string' ? s : s.name));
  const staffMember = answers.staffMember?.trim();
  const highlight = (answers.experience || answers.highlight || '')?.trim();
  const additionalNotes = answers.additionalNotes?.trim();

  // Full AI Knowledge Extraction
  const shopSnippet = extractShopContext(aiKnowledge?.shopDetails);
  const directives = parseRulesDirectives(aiKnowledge?.reviewStyleRules);
  const lang = resolveReviewLanguage(aiKnowledge, forceLanguage);

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
          text: `${businessName}-এ ${servicesPhrase} এর জন্য গিয়েছিলাম।${
            staffMember ? ` ${staffMember} সহায়তা করেছিলেন।` : ''
          } সামগ্রিকভাবে সার্ভিস ঠিকঠাক ছিল।${highlight ? ` ${highlight}।` : ''}`,
        },
      ];
    }

    // Positive / Exceptional (বাংলা)
    let bnDetailed = `${businessName}-এ আমার অভিজ্ঞতা সত্যিই দারুণ ছিল!`;
    if (serviceNames.length > 0) {
      bnDetailed += ` আমি মূলত ${servicesPhrase} এর জন্য যোগাযোগ করেছিলাম এবং কাজটি অত্যন্ত দক্ষতার সাথে সম্পন্ন হয়েছে।`;
    }
    if (shopSnippet) {
      bnDetailed += ` (${shopSnippet})।`;
    }
    if (staffMember) {
      bnDetailed += ` বিশেষ ধন্যবাদ জানাই ${staffMember}-কে, খুবই সাহায্য করেছেন।`;
    }
    if (directives.emphasizePoliteness) {
      bnDetailed += ` কর্মচারীদের ব্যবহার অত্যন্ত ভদ্র, ধৈর্যশীল ও আন্তরিক।`;
    }
    if (directives.emphasizeSpeed) {
      bnDetailed += ` সময় নষ্ট না করে খুব দ্রুত ডেলিভারি দিয়েছেন।`;
    }
    if (directives.emphasizePrice) {
      bnDetailed += ` চার্জ ও দাম সম্পূর্ণ যুক্তিযুক্ত ও স্বচ্ছ।`;
    }
    if (highlight) {
      bnDetailed += ` সবচেয়ে ভালো লেগেছে ${highlight}।`;
    }
    if (additionalNotes) {
      bnDetailed += ` ${additionalNotes}।`;
    }
    bnDetailed += ` ভালো কাজ ও নির্ভরযোগ্য সার্ভিসের জন্য আমি সবাইকে ${businessName} রেকমেন্ড করব।`;

    let bnConcise = `${businessName}-এর সার্ভিস খুবই দ্রুত, নির্ভরযোগ্য ও মানসম্মত।`;
    if (serviceNames.length > 0) {
      bnConcise += ` ${servicesPhrase} খুব নিখুঁতভাবে শেষ করে দেওয়া হয়েছে।`;
    }
    if (staffMember) {
      bnConcise += ` ${staffMember}-এর ব্যবহারও প্রশংসনীয়।`;
    }
    if (directives.emphasizeSpeed) {
      bnConcise += ` কথা অনুযায়ী সময়েই কাজ পেয়েছি।`;
    }
    bnConcise += ` কাজের গুণমান চমৎকার, ৫ তারকা রেটিং!`;

    let bnWarm = `${businessName}-এর পুরো টিমকে অনেক ধন্যবাদ!`;
    if (serviceNames.length > 0) {
      bnWarm += ` ${servicesPhrase} এর ক্ষেত্রে তাদের যত্নশীলতা ও সৎ পরামর্শ আমাকে মুগ্ধ করেছে।`;
    }
    if (directives.emphasizePoliteness) {
      bnWarm += ` এমন অমায়িক ব্যবহার আজকাল পাওয়া বিরল।`;
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

    let hiDetailed = `${businessName} के साथ मेरा अनुभव बहुत ही शानदार रहा!`;
    if (serviceNames.length > 0) {
      hiDetailed += ` मैंने विशेष रूप से ${servicesPhrase} के लिए संपर्क किया था और काम पूरी निष्ठा से किया गया।`;
    }
    if (shopSnippet) {
      hiDetailed += ` (${shopSnippet})।`;
    }
    if (staffMember) {
      hiDetailed += ` ${staffMember} को धन्यवाद, जिन्होंने बहुत अच्छे से मार्गदर्शन किया।`;
    }
    if (directives.emphasizePoliteness) {
      hiDetailed += ` स्टाफ का व्यवहार बहुत ही विनम्र और सहयोगी था।`;
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
    hiConcise += ` गुणवत्ता और समय की पाबंदी के लिए 5 स्टार रेटिंग!`;

    let hiWarm = `${businessName} की पूरी टीम का आभार!`;
    if (serviceNames.length > 0) {
      hiWarm += ` ${servicesPhrase} के लिए यह एक उत्कृष्ट स्थान है।`;
    }
    hiWarm += ` ग्राहकों का पूरा ध्यान रखा जाता है। बिल्कुल भरोसेमंद!`;

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
        description: 'संक्षिप्त एवं सीधा 2-3 पंक्तियों का ड्राफ्ट।',
        text: hiConcise.trim(),
      },
      {
        id: 'warm',
        lang: 'hi',
        title: 'Warm & Personal (हिंदी)',
        description: 'अच्छे व्यवहार पर केंद्रित समीक्षा।',
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
          staffMember ? `I dealt with ${staffMember}. ` : ''
        }${highlight ? `The main observation was: ${highlight}. ` : ''}There is clear room for improvement here, and I hope management addresses these points for future clients.`,
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
          staffMember ? ` ${staffMember} handled my visit.` : ''
        }${highlight ? ` ${highlight}.` : ''} Overall, the service was satisfactory and covered the basics.${
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
    ? `I had an outstanding experience with ${businessName}!`
    : `I had a very positive experience with ${businessName}.`;

  if (serviceNames.length > 0) {
    detailedText += ` I specifically used them for ${servicesPhrase}, and the entire process was handled with true professionalism.`;
  }

  if (shopSnippet) {
    detailedText += ` (${shopSnippet}).`;
  }

  if (staffMember) {
    detailedText += ` A special thank you to ${staffMember}, who was attentive, courteous, and made sure every detail was taken care of.`;
  }

  if (directives.emphasizePoliteness) {
    detailedText += ` The team's polite demeanor and patient explanations really stood out.`;
  }

  if (directives.emphasizeSpeed) {
    detailedText += ` The turnaround was impressively swift with no unnecessary waiting.`;
  }

  if (directives.emphasizePrice) {
    detailedText += ` Pricing was completely transparent and fair with zero surprise charges.`;
  }

  if (directives.emphasizeWarranty) {
    detailedText += ` Knowing they back their work with authentic quality gives great peace of mind.`;
  }

  if (highlight) {
    detailedText += ` What really stood out was ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
  }

  if (additionalNotes) {
    detailedText += ` ${additionalNotes}.`;
  }

  detailedText += isTopTier
    ? ` I highly recommend ${businessName} to anyone seeking dependable, top-tier service.`
    : ` Would definitely recommend their team based on my visit.`;

  // Option 2: Concise & Direct
  let conciseText = `Really impressed with ${businessName}.`;
  if (serviceNames.length > 0) {
    conciseText += ` They delivered excellent work on ${servicesPhrase}.`;
  }
  if (staffMember) {
    conciseText += ` Thanks to ${staffMember} for the great support.`;
  }
  if (directives.emphasizeSpeed) {
    conciseText += ` Fast turnaround and excellent communication.`;
  }
  if (highlight) {
    conciseText += ` ${highlight}.`;
  }
  conciseText += ` Professional, prompt, and easy to recommend.`;

  // Option 3: Warm & Personal
  let warmText = `Huge thanks to the team at ${businessName}!`;
  if (serviceNames.length > 0) {
    warmText += ` From the moment I reached out regarding ${servicesPhrase}, they were welcoming and thorough.`;
  }
  if (staffMember) {
    warmText += ` ${staffMember} went above and beyond to make the whole experience seamless.`;
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
