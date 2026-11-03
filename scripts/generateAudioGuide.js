/**
 * High-Quality Pre-rendered Humanistic Voice Generator
 * Uses Microsoft Edge Neural Speech engine for ultra-realistic studio voices (bn-IN and en-IN).
 * Output saved to public/audio/review_guide_bn.mp3 and review_guide_en.mp3
 */

const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const path = require('path');
const fs = require('fs');

const AUDIO_SCRIPTS = {
  bn: {
    voice: 'bn-IN-TanishaaNeural',
    text: 'আপনার জন্য একটি ফাইভ স্টার রিভিউ কপি করা হয়েছে। এবার ফাইভ স্টার সিলেক্ট করুন, লেখাটি পেস্ট করুন এবং Post বাটনে ক্লিক করুন।',
    filename: 'review_guide_bn.mp3',
  },
  en: {
    voice: 'en-IN-NeerjaExpressiveNeural',
    text: 'Your 5-star review has been automatically copied. Select 5 stars, paste your review, and tap Post!',
    filename: 'review_guide_en.mp3',
  },
};

async function generateVoice(key) {
  const { voice, text, filename } = AUDIO_SCRIPTS[key];
  const tts = new MsEdgeTTS();
  await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const { audioStream } = tts.toStream(text);
  const outDir = path.join(process.cwd(), 'public', 'audio');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, filename);
  const writeStream = fs.createWriteStream(outPath);
  audioStream.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log(`[TTS] Generated ${filename} (${fs.statSync(outPath).size} bytes)`);
      resolve();
    });
    writeStream.on('error', reject);
    audioStream.on('error', reject);
  });
}

async function main() {
  console.log('[TTS] Generating pre-recorded studio audio guides...');
  await generateVoice('bn');
  await generateVoice('en');
  console.log('[TTS] All audio guides generated successfully!');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('[TTS Error]:', err);
    process.exit(1);
  });
}

module.exports = { generateVoice, main };
