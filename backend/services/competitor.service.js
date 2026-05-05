/**
 * Competitor Service
 * Generates competitor product comparisons using AI for real products.
 * Falls back to category-based mock data for demo products.
 */

const OpenAI = require("openai");
const config = require("../config");

const groq = new OpenAI({
  apiKey: config.groqApiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

async function getCompetitors(product) {
  // For known demo ASINs, use hardcoded data
  const mockCompetitors = getMockCompetitors(product.title);
  if (mockCompetitors) return formatCompetitors(mockCompetitors, product);

  // For real products, use AI to generate relevant competitors
  if (config.groqApiKey) {
    try {
      return await getAICompetitors(product);
    } catch (err) {
      console.error("Competitor AI error:", err.message);
    }
  }

  // Final fallback — category-aware competitors based on product info
  return formatCompetitors(getSmartFallbackCompetitors(product), product);
}

async function getAICompetitors(product) {
  const prompt = `You are an Amazon product research expert. For this product:
"${product.title}" — priced at $${product.price}, rated ${product.rating}/5, with ${product.totalReviews} reviews.

Return a JSON array of exactly 9 real competitor products in the same category on Amazon. Each must have:
{
  "name": "Full product name (real product that exists on Amazon)",
  "price": number (realistic USD price),
  "rating": number (between 3.5 and 5.0),
  "totalReviews": number (realistic count),
  "bsr": number (realistic Best Seller Rank),
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"]
}

Rules:
- Products must be REAL competitors in the same category
- Prices should be realistic current Amazon prices
- Include a mix: 3 cheaper, 3 similar price, 3 premium
- Strengths/weaknesses should be relative to "${product.title}"

Return ONLY the JSON array. No markdown, no explanation.`;

  // Fallback chain: 70B (100K TPD) → Scout 17B (500K) → Qwen3 32B (500K) → 8B (500K)
  const models = [
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "qwen/qwen3-32b",
    "llama-3.1-8b-instant",
  ];

  for (const model of models) {
    try {
      const response = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content.trim();
      const cleaned = content.replace(/\*\*/g, "").replace(/\*/g, "");

      let competitors;
      try {
        competitors = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) competitors = JSON.parse(jsonMatch[1].trim());
        else {
          const rawMatch = cleaned.match(/\[[\s\S]*\]/);
          if (rawMatch) competitors = JSON.parse(rawMatch[0]);
          else throw new Error("Failed to parse competitor response");
        }
      }

      return formatCompetitors(competitors, product);
    } catch (err) {
      if (err.status === 429 || err.status === 503) {
        console.log(`Groq ${model} unavailable for competitors (${err.status}) — trying next model...`);
        continue;
      }
      throw err;
    }
  }
  throw new Error("All Groq models unavailable");
}

function formatCompetitors(competitors, product) {
  return competitors.map((c) => ({
    ...c,
    priceDiff: ((c.price - product.price) / product.price * 100).toFixed(0) + "%",
    ratingDiff: (c.rating - product.rating).toFixed(1),
  }));
}

function getMockCompetitors(title) {
  const titleLower = title.toLowerCase();

  if (titleLower.includes("sony") || titleLower.includes("xm5") || titleLower.includes("wh-1000")) {
    return [
      {
        name: "Apple AirPods Max",
        price: 449.00,
        rating: 4.5,
        totalReviews: 42100,
        bsr: 15,
        strengths: ["Premium build (aluminum)", "Spatial Audio", "Apple ecosystem"],
        weaknesses: ["Much heavier", "No folding", "Higher price"],
      },
      {
        name: "Bose QuietComfort Ultra",
        price: 379.00,
        rating: 4.4,
        totalReviews: 19800,
        bsr: 31,
        strengths: ["Immersive audio", "Comfortable fit", "CustomTune EQ"],
        weaknesses: ["Higher price", "Shorter battery (24hr)", "Bulkier"],
      },
      {
        name: "Sennheiser Momentum 4",
        price: 299.95,
        rating: 4.3,
        totalReviews: 8900,
        bsr: 67,
        strengths: ["Audiophile sound", "60-hr battery", "Lower price"],
        weaknesses: ["Weaker ANC", "Less brand recognition", "Creaky build"],
      },
    ];
  } else if (titleLower.includes("airpod") || titleLower.includes("apple")) {
    return [
      {
        name: "Sony WF-1000XM5",
        price: 279.99,
        rating: 4.4,
        totalReviews: 21300,
        bsr: 19,
        strengths: ["Better sound quality", "LDAC support", "Deeper bass"],
        weaknesses: ["Higher price", "Bulkier fit", "No ecosystem integration"],
      },
      {
        name: "Samsung Galaxy Buds3 Pro",
        price: 179.99,
        rating: 4.3,
        totalReviews: 15400,
        bsr: 28,
        strengths: ["Similar price", "Galaxy AI features", "Comfortable blade design"],
        weaknesses: ["Samsung-only features", "Average ANC", "Shorter battery"],
      },
      {
        name: "Bose QuietComfort Earbuds II",
        price: 199.00,
        rating: 4.3,
        totalReviews: 25600,
        bsr: 35,
        strengths: ["Best-in-class ANC", "CustomTune fit", "Rich bass"],
        weaknesses: ["No multipoint", "Bulky case", "No wireless charging"],
      },
    ];
  } else if (titleLower.includes("anker") || titleLower.includes("soundcore")) {
    return [
      {
        name: "Apple AirPods Pro 2",
        price: 189.99,
        rating: 4.7,
        totalReviews: 67800,
        bsr: 8,
        strengths: ["Apple ecosystem", "Adaptive Audio", "Tiny form factor"],
        weaknesses: ["3.5x the price", "Apple-only features", "Weak bass"],
      },
      {
        name: "Samsung Galaxy Buds FE",
        price: 59.99,
        rating: 4.2,
        totalReviews: 12300,
        bsr: 145,
        strengths: ["Similar price", "ANC", "Samsung SmartThings"],
        weaknesses: ["No LDAC", "Shorter battery", "Limited EQ"],
      },
      {
        name: "JBL Tune Beam",
        price: 49.95,
        rating: 4.1,
        totalReviews: 7600,
        bsr: 220,
        strengths: ["JBL bass", "Same price", "IP54 rating"],
        weaknesses: ["No multipoint", "Basic app", "Weaker ANC"],
      },
    ];
  }

  return null; // No mock match — will use AI
}

function getGenericCompetitors(product) {
  return getSmartFallbackCompetitors(product);
}

/**
 * Generates 9 plausible competitor entries when AI is unavailable.
 * Uses product price/rating/category to create realistic variations.
 */
function getSmartFallbackCompetitors(product) {
  const basePrice = product.price || 1000;
  const baseRating = product.rating || 4.0;
  const baseReviews = product.totalReviews || 1000;
  const baseBsr = product.bsr || 500;

  // Price multipliers: 3 cheaper, 3 similar, 3 premium
  const profiles = [
    { priceMultiplier: 0.5, ratingOffset: -0.4, reviewMultiplier: 2.5, bsrMultiplier: 0.4, tier: "budget" },
    { priceMultiplier: 0.65, ratingOffset: -0.2, reviewMultiplier: 1.8, bsrMultiplier: 0.6, tier: "budget" },
    { priceMultiplier: 0.8, ratingOffset: -0.1, reviewMultiplier: 1.2, bsrMultiplier: 0.8, tier: "budget" },
    { priceMultiplier: 0.95, ratingOffset: 0.1, reviewMultiplier: 0.9, bsrMultiplier: 1.1, tier: "similar" },
    { priceMultiplier: 1.05, ratingOffset: 0.0, reviewMultiplier: 1.1, bsrMultiplier: 0.9, tier: "similar" },
    { priceMultiplier: 1.15, ratingOffset: 0.1, reviewMultiplier: 0.7, bsrMultiplier: 1.3, tier: "similar" },
    { priceMultiplier: 1.5, ratingOffset: 0.2, reviewMultiplier: 0.5, bsrMultiplier: 1.8, tier: "premium" },
    { priceMultiplier: 2.0, ratingOffset: 0.3, reviewMultiplier: 0.4, bsrMultiplier: 2.5, tier: "premium" },
    { priceMultiplier: 2.8, ratingOffset: 0.3, reviewMultiplier: 0.3, bsrMultiplier: 3.0, tier: "premium" },
  ];

  const strengthsByTier = {
    budget: [
      ["Lower price point", "Mass market appeal", "Wide availability"],
      ["Aggressive pricing", "Multiple variants", "Fast shipping"],
      ["Value for money", "Good enough quality", "High volume sales"],
    ],
    similar: [
      ["Comparable quality", "Better packaging", "More color options"],
      ["Similar feature set", "Slightly better reviews", "Established brand"],
      ["Competitive pricing", "Good customer service", "Frequent deals"],
    ],
    premium: [
      ["Premium materials", "Superior build quality", "Brand prestige"],
      ["Advanced features", "Better warranty", "Premium experience"],
      ["Top-tier quality", "Innovation leader", "Loyal customer base"],
    ],
  };

  return profiles.map((profile, i) => {
    const tierStrengths = strengthsByTier[profile.tier];
    const strengthSet = tierStrengths[i % tierStrengths.length];
    const price = Math.round(basePrice * profile.priceMultiplier);
    const rating = Math.min(5.0, Math.max(3.5, baseRating + profile.ratingOffset));
    const reviews = Math.round(baseReviews * profile.reviewMultiplier);
    const bsr = Math.max(1, Math.round(baseBsr * profile.bsrMultiplier));

    return {
      name: `Competitor ${String.fromCharCode(65 + i)} (${profile.tier})`,
      price,
      rating: parseFloat(rating.toFixed(1)),
      totalReviews: reviews,
      bsr,
      strengths: strengthSet,
      weaknesses: [
        profile.tier === "budget" ? "Lower quality materials" : profile.tier === "premium" ? "High price barrier" : "Less differentiation",
        "Fewer customer insights",
        "Less market share in this segment",
      ],
    };
  });
}

module.exports = { getCompetitors };
