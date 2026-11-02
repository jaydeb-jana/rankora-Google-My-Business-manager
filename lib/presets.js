/**
 * Sensible starter services and experience options for businesses.
 * Used during registration or when resetting services.
 */

export const DEFAULT_SERVICES = [];

export const INDUSTRY_TEMPLATES = {
  'Healthcare & Dental': [
    {
      id: 'dent_1',
      name: 'Gentle & Pain-Free Treatment',
      description: 'Careful bedside manner and patient comfort throughout the procedure.',
      category: 'Care Quality',
      suggestedKeywords: ['gentle', 'pain-free', 'comfortable', 'caring'],
    },
    {
      id: 'dent_2',
      name: 'Thorough Examination & Clear Explanations',
      description: 'Detailed assessment and honest explanations of recommended care options.',
      category: 'Consultation',
      suggestedKeywords: ['thorough checkup', 'clear explanation', 'informative'],
    },
    {
      id: 'dent_3',
      name: 'Friendly & Welcoming Front Desk',
      description: 'Quick check-in, courteous reception, and easy appointment scheduling.',
      category: 'Front Office',
      suggestedKeywords: ['courteous reception', 'easy booking', 'helpful front desk'],
    },
    {
      id: 'dent_4',
      name: 'State-of-the-Art Clean Facility',
      description: 'Modern, sterile equipment and hygienic environment.',
      category: 'Facility',
      suggestedKeywords: ['modern facility', 'spotless', 'clean clinic'],
    },
  ],
  'Home Services & Contracting': [
    {
      id: 'home_1',
      name: 'Punctual Arrival & Work Ethic',
      description: 'Arrived exactly on schedule and worked diligently until completion.',
      category: 'Reliability',
      suggestedKeywords: ['on-time arrival', 'diligent', 'dependable'],
    },
    {
      id: 'home_2',
      name: 'Clean Workspace & Tidy Cleanup',
      description: 'Respected home interior/property and left the area spotless afterwards.',
      category: 'Care',
      suggestedKeywords: ['left clean', 'tidy', 'respectful of home'],
    },
    {
      id: 'home_3',
      name: 'Expert Diagnosis & Lasting Fix',
      description: 'Quickly identified the root problem and executed a durable solution.',
      category: 'Expertise',
      suggestedKeywords: ['expert troubleshooting', 'fixed properly', 'knowledgeable'],
    },
    {
      id: 'home_4',
      name: 'Clear Upfront Estimate',
      description: 'Provided an accurate quote with no surprise add-ons.',
      category: 'Pricing',
      suggestedKeywords: ['accurate quote', 'transparent pricing', 'honest estimate'],
    },
  ],
  'Restaurant & Cafe': [
    {
      id: 'rest_1',
      name: 'Fresh, Flavorful Food & Drinks',
      description: 'Delicious taste, top-quality ingredients, and appetizing presentation.',
      category: 'Food Quality',
      suggestedKeywords: ['delicious', 'fresh ingredients', 'flavorful', 'great meal'],
    },
    {
      id: 'rest_2',
      name: 'Attentive & Courteous Table Service',
      description: 'Warm welcome, quick refills, and thoughtful hospitality throughout.',
      category: 'Hospitality',
      suggestedKeywords: ['attentive server', 'warm welcome', 'great hospitality'],
    },
    {
      id: 'rest_3',
      name: 'Inviting Ambience & Atmosphere',
      description: 'Pleasant lighting, good music, clean seating, and vibrant vibe.',
      category: 'Atmosphere',
      suggestedKeywords: ['cozy vibe', 'great atmosphere', 'clean dining area'],
    },
    {
      id: 'rest_4',
      name: 'Prompt Order Turnaround',
      description: 'Hot, fresh food served in a timely manner without long waits.',
      category: 'Speed',
      suggestedKeywords: ['quick service', 'hot and fresh', 'short wait'],
    },
  ],
  'Auto Repair & Detailing': [
    {
      id: 'auto_1',
      name: 'Honest Mechanical Inspection',
      description: 'Transparent diagnostic report without unnecessary upsells.',
      category: 'Integrity',
      suggestedKeywords: ['honest mechanic', 'clear diagnostic', 'no pushy upsells'],
    },
    {
      id: 'auto_2',
      name: 'Precision Repair & Quality Parts',
      description: 'Car runs smoothly with problem completely resolved.',
      category: 'Workmanship',
      suggestedKeywords: ['runs smoothly', 'issue resolved', 'skilled mechanics'],
    },
    {
      id: 'auto_3',
      name: 'Fast Turnaround Time',
      description: 'Vehicle completed on or before the promised hour.',
      category: 'Timeliness',
      suggestedKeywords: ['ready on time', 'fast turnaround', 'kept me updated'],
    },
    {
      id: 'auto_4',
      name: 'Fair & Detailed Invoicing',
      description: 'Itemized receipt explaining parts and labor clearly.',
      category: 'Value',
      suggestedKeywords: ['fair rate', 'itemized invoice', 'great value'],
    },
  ],
  'Computer Shop': [
    {
      id: 'comp_1',
      name: 'Expert PC & Laptop Repair',
      description: 'Quick hardware diagnosis, component replacement, and system optimization.',
      category: 'Repair Quality',
      suggestedKeywords: ['fast repair', 'laptop fixed', 'expert troubleshooting', 'skilled technician'],
    },
    {
      id: 'comp_2',
      name: 'Genuine Parts & Transparent Pricing',
      description: 'Original computer accessories and hardware at fair, honest rates.',
      category: 'Parts & Value',
      suggestedKeywords: ['genuine components', 'fair price', 'authentic parts', 'great deal'],
    },
    {
      id: 'comp_3',
      name: 'Fast Turnaround & Same-Day Service',
      description: 'Quick service delivery so customers can get back to work without long delays.',
      category: 'Speed',
      suggestedKeywords: ['quick turnaround', 'same day fix', 'fast service', 'on-time'],
    },
    {
      id: 'comp_4',
      name: 'Helpful & Friendly Tech Guidance',
      description: 'Patient, easy-to-understand explanations and honest recommendations.',
      category: 'Customer Service',
      suggestedKeywords: ['friendly staff', 'helpful advice', 'honest guidance', 'great support'],
    },
  ],
};
