/**
 * Review Analyzer Service
 * Uses Groq (Llama 3.3 70B) to extract actionable insights from product reviews.
 */

const OpenAI = require("openai");
const config = require("../config");

const groq = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

async function analyzeReviews(reviews, productTitle) {
  const reviewText = reviews
    .map((r) => `[${r.rating}★] ${r.title}: ${r.body}`)
    .join("\n");

  const prompt = `You are a product analyst for an e-commerce brand. Analyze these customer reviews for "${productTitle}" and return a JSON object with EXACTLY this structure:

{
  "summary": "2-sentence executive summary of overall customer sentiment.",
  "positives": [
    { "theme": "Short theme name", "frequency": "high", "quote": "Exact or paraphrased customer quote" }
  ],
  "negatives": [
    { "theme": "Short theme name", "frequency": "medium", "quote": "Exact or paraphrased customer quote" }
  ],
  "opportunities": [
    "Specific product improvement suggestion based on negative feedback"
  ],
  "actionTomorrow": "A single bold, specific action the seller should take tomorrow to boost revenue. Start with a verb."
}

Rules:
- "positives": exactly 5 items. Each must have "theme" (2-4 words), "frequency" ("high"|"medium"|"low"), "quote" (one sentence from reviews).
- "negatives": exactly 5 items. Same format as positives.
- "opportunities": exactly 3 strings. Each a concrete product improvement idea.
- "actionTomorrow": one sentence, starts with a verb, bold and money-focused.
- "summary": exactly 2 sentences.

Reviews:
${reviewText}

Return ONLY the JSON object. No markdown, no code fences, no extra text.`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content.trim();

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    // Strip markdown code fences if model wraps the response
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[1].trim());
    else {
      const rawMatch = content.match(/\{[\s\S]*\}/);
      if (rawMatch) parsed = JSON.parse(rawMatch[0]);
      else throw new Error("Failed to parse AI response");
    }
  }

  // Clean any markdown formatting from string values
  if (parsed.actionTomorrow) {
    parsed.actionTomorrow = parsed.actionTomorrow.replace(/\*\*/g, "").replace(/\*/g, "");
  }
  return parsed;
}

// Fallback mock analysis when no API key is configured
function getMockAnalysis(productTitle = "") {
  const mockAnalyses = {
    sony: {
      summary: "The Sony XM5 dominates in noise cancellation and sound quality, justifying its premium price for frequent travelers and audiophiles. Key pain points are build durability, touch control reliability, and occasional Bluetooth drops.",
      positives: [
        { theme: "Industry-Leading ANC", frequency: "high", quote: "Nothing else comes close. Blocks out engine noise completely" },
        { theme: "Sound Quality", frequency: "high", quote: "Soundstage is wide and detailed. Hearing things in songs I never noticed" },
        { theme: "Multipoint Connection", frequency: "high", quote: "Switch between MacBook and iPhone instantly. No re-pairing" },
        { theme: "Comfort for Long Sessions", frequency: "medium", quote: "Can wear them 8+ hours without discomfort" },
        { theme: "Battery Life", frequency: "medium", quote: "30-hour battery, quick charge, folds into case" },
      ],
      negatives: [
        { theme: "Touch Controls Unreliable", frequency: "high", quote: "Random pauses, accidental skips. Wish they had physical buttons" },
        { theme: "Headband Durability", frequency: "medium", quote: "Headband cracked at 6 months. Plastic creaks when adjusting" },
        { theme: "Price vs Incremental Upgrade", frequency: "medium", quote: "XM4 sounds 95% as good and costs $200 less" },
        { theme: "Heat Buildup", frequency: "low", quote: "Ear pads get hot after an hour. Not great for summer" },
        { theme: "Microphone Quality", frequency: "low", quote: "Call mic is average. Wind noise still bleeds through" },
      ],
      opportunities: [
        "Add physical button option or sensitivity slider in Sony Headphones Connect app",
        "Upgrade headband material to metal/carbon fiber to address breakage complaints",
        "Market the multipoint feature more aggressively — it's the top reason people upgrade from XM4",
      ],
      actionTomorrow: "Run a split test on your listing: replace the first image with one showing a person on a flight with the XM5 on. 'Travel' is the #1 emotional trigger in positive reviews — yet your current listing leads with a studio photo that says nothing.",
    },
    airpods: {
      summary: "AirPods Pro 2 are the gold standard for Apple ecosystem users, praised for seamless device switching, adaptive audio, and ANC that rivals over-ear headphones. Complaints focus on Apple lock-in, bass response, and durability of tips/case.",
      positives: [
        { theme: "Ecosystem Integration", frequency: "high", quote: "Switches between iPhone, iPad, Mac seamlessly" },
        { theme: "Adaptive Audio & Transparency", frequency: "high", quote: "Conversation Awareness is next level. Feels futuristic" },
        { theme: "ANC Performance", frequency: "high", quote: "These tiny earbuds block as much noise as over-ear headphones" },
        { theme: "Call Quality", frequency: "medium", quote: "People can't tell I'm on earbuds. Beam-forming mics isolate my voice perfectly" },
        { theme: "Find My / U1 Chip", frequency: "medium", quote: "Lost one earbud in the couch. Found it in 10 seconds" },
      ],
      negatives: [
        { theme: "Apple Lock-In", frequency: "high", quote: "Used with Android — half the product is locked to Apple" },
        { theme: "Weak Bass Response", frequency: "medium", quote: "If you like bass-heavy music, look elsewhere. Meh for hip-hop" },
        { theme: "Ear Tip Degradation", frequency: "medium", quote: "Silicone tips turn yellow and lose grip after 3 months" },
        { theme: "Repair Cost", frequency: "low", quote: "Apple wants $89 to replace ONE earbud. No thanks" },
        { theme: "Case Scratches Easily", frequency: "low", quote: "Aluminum case gets micro-scratches everywhere after a week" },
      ],
      opportunities: [
        "Bundle premium foam ear tips in the box to address the tip degradation complaints",
        "Offer an extended warranty plan prominently since repair costs scare buyers",
        "Create Android compatibility guide content to capture cross-platform buyers",
      ],
      actionTomorrow: "Add 'Conversation Awareness' as the first bullet point in your listing — it's the feature customers call 'futuristic' and 'next level' but it's buried at bullet #4. Lead with magic, not specs.",
    },
    anker: {
      summary: "Anker Liberty 4 NC delivers 80% of premium earbud performance at 30% of the price, winning on value, battery life, and bass. Main complaints are Bluetooth range, fit comfort for smaller ears, and call quality.",
      positives: [
        { theme: "Unbeatable Value", frequency: "high", quote: "Compete with $150+ earbuds at 1/3 the price. No brainer" },
        { theme: "Battery Life", frequency: "high", quote: "10 hours ANC off, case has 3 more charges. Charge once a week" },
        { theme: "Bass Quality", frequency: "high", quote: "11mm drivers produce bass I can feel. BassUp mode is amazing" },
        { theme: "Feature-Rich App", frequency: "medium", quote: "Custom EQ, ANC levels, tap controls — all customizable" },
        { theme: "Multipoint Connection", frequency: "medium", quote: "Connected to phone and laptop simultaneously. Premium feature at budget price" },
      ],
      negatives: [
        { theme: "Bluetooth Range", frequency: "high", quote: "Walk 10 feet from phone and audio starts cutting" },
        { theme: "Bulky Fit", frequency: "medium", quote: "Stick out of ears quite a bit. Press on ear after 2 hours" },
        { theme: "Call Microphone Quality", frequency: "medium", quote: "People say I sound muffled on calls. 6 mics don't help with wind" },
        { theme: "Touch Control Reliability", frequency: "low", quote: "Have to tap multiple times for it to register" },
        { theme: "ANC Hiss", frequency: "low", quote: "Faint hiss with ANC on in silence. Annoying in bed" },
      ],
      opportunities: [
        "Upgrade Bluetooth chip to improve range — it's the #1 complaint and an easy hardware fix",
        "Include XS and XL ear tips + wing tips for better fit coverage",
        "Market the 10-hour battery as the hero stat — it's 2x most competitors",
      ],
      actionTomorrow: "Change your product title to lead with '10-Hour Battery' instead of 'Noise Canceling' — your battery is 2x the competition and it's what converts price-sensitive buyers who fear running out mid-day.",
    },
  };

  // Match by product title keywords
  const titleLower = productTitle.toLowerCase();
  if (titleLower.includes("sony") || titleLower.includes("xm5") || titleLower.includes("wh-1000")) {
    return mockAnalyses.sony;
  } else if (titleLower.includes("airpod") || titleLower.includes("apple")) {
    return mockAnalyses.airpods;
  } else if (titleLower.includes("anker") || titleLower.includes("soundcore") || titleLower.includes("liberty")) {
    return mockAnalyses.anker;
  }

  // Default fallback
  return mockAnalyses.anker;
}

async function analyze(reviews, productTitle) {
  if (!config.groqApiKey) {
    console.log("No Groq API key configured — using mock analysis");
    return getMockAnalysis(productTitle);
  }
  try {
    return await analyzeReviews(reviews, productTitle);
  } catch (err) {
    console.error("Groq API error — falling back to mock:", err.message);
    return getMockAnalysis(productTitle);
  }
}

module.exports = { analyze };
