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

  // Final fallback — generic competitors
  return formatCompetitors(getGenericCompetitors(product), product);
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
  return [
    {
      name: "Top Competitor #1",
      price: Math.round(product.price * 1.3 * 100) / 100,
      rating: Math.min(5, product.rating + 0.2),
      totalReviews: Math.round(product.totalReviews * 1.5),
      bsr: Math.max(1, Math.round(product.bsr * 0.7)),
      strengths: ["Higher brand recognition", "More reviews", "Better marketing"],
      weaknesses: ["Higher price", "Less value", "Slower shipping"],
    },
    {
      name: "Top Competitor #2",
      price: Math.round(product.price * 0.85 * 100) / 100,
      rating: Math.max(3.5, product.rating - 0.3),
      totalReviews: Math.round(product.totalReviews * 0.6),
      bsr: Math.round(product.bsr * 1.5),
      strengths: ["Lower price", "Good value", "Fast delivery"],
      weaknesses: ["Lower quality", "Fewer reviews", "Less variety"],
    },
    {
      name: "Top Competitor #3",
      price: Math.round(product.price * 1.1 * 100) / 100,
      rating: product.rating,
      totalReviews: Math.round(product.totalReviews * 0.8),
      bsr: Math.round(product.bsr * 1.2),
      strengths: ["Similar quality", "Better packaging", "More colors"],
      weaknesses: ["Slightly pricier", "Less comfort", "Slower returns"],
    },
  ];
}

module.exports = { getCompetitors };
