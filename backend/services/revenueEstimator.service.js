/**
 * Revenue Estimator Service
 * Estimates monthly revenue from price, BSR, and review velocity.
 */

function estimateRevenue(product) {
  const { price, bsr, totalReviews, rating } = product;

  // Estimate daily sales from BSR using Jungle Scout-style curve for Electronics
  // BSR 1 ≈ 300/day, BSR 10 ≈ 80/day, BSR 100 ≈ 20/day, BSR 1000 ≈ 3/day
  const estimatedDailySales = Math.max(1, Math.round(1200 / Math.pow(bsr, 0.72)));
  const estimatedMonthlySales = estimatedDailySales * 30;
  const estimatedMonthlyRevenue = Math.round(estimatedMonthlySales * price);

  // Review velocity (reviews per month, ~1-2% of buyers leave reviews)
  const productAge = Math.max(6, Math.round(totalReviews / (estimatedDailySales * 0.015)));
  const reviewVelocity = Math.round(totalReviews / productAge);

  // Confidence based on data quality
  const confidence = rating >= 4.0 && bsr < 500 ? "high" : bsr < 2000 ? "medium" : "low";

  return {
    estimatedDailySales,
    estimatedMonthlySales,
    estimatedMonthlyRevenue,
    formattedRevenue: `$${estimatedMonthlyRevenue.toLocaleString()}`,
    reviewVelocity,
    confidence,
    methodology: "BSR-based estimation (Electronics category curve)",
  };
}

module.exports = { estimateRevenue };
