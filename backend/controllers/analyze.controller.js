const scraperService = require("../services/scraper.service");
const reviewAnalyzer = require("../services/reviewAnalyzer.service");
const competitorService = require("../services/competitor.service");
const revenueEstimator = require("../services/revenueEstimator.service");

async function analyzeProduct(req, res) {
  try {
    const { productUrl } = req.body;

    if (!productUrl || !productUrl.includes("amazon")) {
      return res.status(400).json({
        error: "Please provide a valid Amazon product URL.",
      });
    }

    // 1. Scrape product data and reviews
    const { product, reviews } = await scraperService.scrapeProduct(productUrl);

    // 2. Analyze reviews with AI
    const analysis = await reviewAnalyzer.analyze(reviews, product.title);

    // 3. Get competitor landscape
    const competitors = await competitorService.getCompetitors(product);

    // 4. Estimate revenue
    const estimatedRevenue = revenueEstimator.estimateRevenue(product);

    // 5. Return unified response
    res.json({
      product,
      summary: analysis.summary,
      positives: analysis.positives,
      negatives: analysis.negatives,
      opportunities: analysis.opportunities,
      actionTomorrow: analysis.actionTomorrow,
      competitors,
      estimatedRevenue,
    });
  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({
      error: error.message || "Failed to analyze product. Please try again.",
    });
  }
}

module.exports = { analyzeProduct };
