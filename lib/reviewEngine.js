/**
 * Generates natural, authentic review drafts based strictly on customer selections,
 * customized shop details, and configured language ratio distribution.
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
  const r1 = Number(langs[0].ratio) ?? 50;
  const roll = Math.random() * 100;
  if (roll < r1) {
    return langs[0].code || 'en';
  }
  return langs[1].code || 'en';
}

function extractShopHighlight(shopDetails) {
  if (!shopDetails || typeof shopDetails !== 'string') return '';
  const clean = shopDetails.trim();
  if (!clean) return '';
  // Take first sentence or up to 120 characters
  const firstSentence = clean.split(/[.?!।\n]/)[0]?.trim();
  return firstSentence && firstSentence.length <= 140 ? firstSentence : '';
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
  const highlight = answers.highlight?.trim();
  const additionalNotes = answers.additionalNotes?.trim();
  const shopHighlight = extractShopHighlight(aiKnowledge?.shopDetails);

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
    const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'এবং') : 'তাদের চমৎকার সেবা';

    if (sentiment === 'critical' || sentiment === 'needs_improvement') {
      return [
        {
          id: 'bn_constructive',
          lang: 'bn',
          title: 'সরাসরি ও গঠনমূলক মতামত',
          description: 'সার্ভিস পাওয়ার সংক্ষিপ্ত বিবরণ ও উন্নতির জায়গাগুলো তুলে ধরা।',
          text: `সম্প্রতি আমি ${businessName}-এ গিয়েছিলাম ${servicesPhrase} নিয়ে।${
            highlight ? ` বিশেষ করে ${highlight} সংক্রান্ত বিষয়ে।` : ''
          }${additionalNotes ? ` ${additionalNotes}।` : ''} আমার অভিজ্ঞতা আশানুরূপ ছিল না। আশা করব সার্ভিস ম্যানেজমেন্ট এই দিকগুলোতে নজর দেবে।`,
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
            staffMember ? ` ${staffMember} আমাদের সহায়তা করেছিলেন।` : ''
          } সামগ্রিকভাবে সার্ভিস ঠিকঠাক ছিল।${highlight ? ` ${highlight}।` : ''}`,
        },
      ];
    }

    // Positive / Exceptional (বাংলা)
    let bnDetailed = `${businessName}-এ আমার অভিজ্ঞতা সত্যিই অসাধারণ ছিল!`;
    if (serviceNames.length > 0) {
      bnDetailed += ` আমি মূলত ${servicesPhrase} এর জন্য তাদের সাথে যোগাযোগ করি এবং তাদের দক্ষতা ও কাজের মান খুবই প্রশংসনীয়।`;
    }
    if (shopHighlight) {
      bnDetailed += ` (${shopHighlight})।`;
    }
    if (staffMember) {
      bnDetailed += ` বিশেষ ধন্যবাদ জানাই ${staffMember}-কে, অত্যন্ত আন্তরিক ও ধৈর্য সহকারে সব বুঝিয়ে দিয়েছেন।`;
    }
    if (highlight) {
      bnDetailed += ` সবচেয়ে ভালো লেগেছে ${highlight}।`;
    }
    if (additionalNotes) {
      bnDetailed += ` ${additionalNotes}।`;
    }
    bnDetailed += ` দারুণ সার্ভিস এবং সঠিক দামের জন্য আমি যে কাউকে ${businessName} রেকমেন্ড করব।`;

    let bnConcise = `${businessName}-এর সার্ভিস অত্যন্ত দ্রুত ও বিশ্বাসযোগ্য।`;
    if (serviceNames.length > 0) {
      bnConcise += ` ${servicesPhrase} খুব নিখুঁতভাবে শেষ করে দিয়েছে।`;
    }
    if (staffMember) {
      bnConcise += ` ${staffMember}-এর ব্যবহারও চমৎকার ছিল।`;
    }
    bnConcise += ` কাজের মান ও সময়ানুবর্তিতা সত্যিই প্রশংসার দাবিদার। ৫ তারকা সার্ভিস!`;

    let bnWarm = `${businessName}-এর পুরো টিমকে অনেক অনেক ধন্যবাদ!`;
    if (serviceNames.length > 0) {
      bnWarm += ` ${servicesPhrase} এর ব্যাপারে তাদের যত্নশীলতা ও সৎ পরামর্শ আমাকে মুগ্ধ করেছে।`;
    }
    if (highlight) {
      bnWarm += ` বিশেষ করে ${highlight} এর বিষয়টি খুব ভালো লেগেছে।`;
    }
    bnWarm += ` এমন বিশ্বস্ত দোকান ও ভালো ব্যবহার আজকাল পাওয়া কঠিন। নিঃসন্দেহে সেরা অভিজ্ঞতা!`;

    return [
      {
        id: 'detailed',
        lang: 'bn',
        title: 'বিস্তারিত ও স্পষ্ট (বাংলা)',
        description: 'সার্ভিস ও বিশেষ সুবিধার বিস্তারিত বিবরণ।',
        text: bnDetailed.trim(),
      },
      {
        id: 'concise',
        lang: 'bn',
        title: 'সংক্ষিপ্ত ও জোরালো (বাংলা)',
        description: 'সহজ, স্পষ্ট ও আকর্ষণীয় ২-৩ লাইনের রিভিউ।',
        text: bnConcise.trim(),
      },
      {
        id: 'warm',
        lang: 'bn',
        title: 'আন্তরিক ও কৃতজ্ঞতাপূর্ণ (বাংলা)',
        description: 'ব্যবহার ও আন্তরিক কাস্টমার সার্ভিসের ওপর জোর দিয়ে।',
        text: bnWarm.trim(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // HINDI (हिंदी) REVIEW DRAFTS
  // ---------------------------------------------------------------------------
  if (lang === 'hi') {
    const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'और') : 'उनकी सेवा';

    let hiDetailed = `${businessName} के साथ मेरा अनुभव बेहद शानदार रहा!`;
    if (serviceNames.length > 0) {
      hiDetailed += ` मैंने विशेष रूप से ${servicesPhrase} के लिए संपर्क किया था और काम पूरी ईमानदारी से किया गया।`;
    }
    if (shopHighlight) {
      hiDetailed += ` (${shopHighlight})।`;
    }
    if (staffMember) {
      hiDetailed += ` ${staffMember} को खास धन्यवाद, जिन्होंने बहुत ही विनम्रता से मदद की।`;
    }
    if (highlight) {
      hiDetailed += ` सबसे अच्छी बात यह रही कि ${highlight}।`;
    }
    hiDetailed += ` समय पर काम और सही कीमत के लिए मैं ${businessName} की जोरदार सिफारिश करता हूँ।`;

    let hiConcise = `${businessName} की सर्विस बहुत ही तेज़ और भरोसेमंद है।`;
    if (serviceNames.length > 0) {
      hiConcise += ` ${servicesPhrase} का काम बहुत ही बढ़िया हुआ।`;
    }
    hiConcise += ` स्टाफ का व्यवहार बहुत अच्छा था। 5 स्टार रेटिंग!`;

    let hiWarm = `${businessName} की पूरी टीम को बहुत-बहुत धन्यवाद!`;
    if (serviceNames.length > 0) {
      hiWarm += ` ${servicesPhrase} के लिए यह सबसे बेहतरीन जगह है।`;
    }
    hiWarm += ` ग्राहकों का पूरा ध्यान रखा जाता है और सही सलाह दी जाती है।`;

    return [
      {
        id: 'detailed',
        lang: 'hi',
        title: 'विस्तृत एवं स्पष्ट (हिंदी)',
        description: 'सेवाओं और गुणवत्ता की विस्तृत समीक्षा।',
        text: hiDetailed.trim(),
      },
      {
        id: 'concise',
        lang: 'hi',
        title: 'संक्षिप्त एवं सीधा (हिंदी)',
        description: 'स्पष्ट और प्रभावशाली 2-3 पंक्तियों की समीक्षा।',
        text: hiConcise.trim(),
      },
      {
        id: 'warm',
        lang: 'hi',
        title: 'आत्मीय एवं सहायक (हिंदी)',
        description: 'स्टाफ के अच्छे व्यवहार पर केंद्रित समीक्षा।',
        text: hiWarm.trim(),
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // ENGLISH REVIEW DRAFTS (Default)
  // ---------------------------------------------------------------------------
  const servicesPhrase = serviceNames.length > 0 ? formatList(serviceNames, 'and') : 'their service';

  // Tone variations based on sentiment
  if (sentiment === 'critical' || sentiment === 'needs_improvement') {
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

  if (shopHighlight) {
    detailedText += ` It's clear why they are known for ${shopHighlight.toLowerCase().replace(/^(we are|we specialize in)\s*/i, '')}.`;
  }

  if (staffMember) {
    detailedText += ` A special thank you to ${staffMember}, who was attentive, courteous, and made sure every detail was taken care of.`;
  }

  if (highlight) {
    detailedText += ` What really stood out to me was ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
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
  if (highlight) {
    warmText += ` It was especially great that ${highlight.charAt(0).toLowerCase() + highlight.slice(1)}.`;
  }
  warmText += ` It is refreshing to find a business that truly takes pride in customer care!`;

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
