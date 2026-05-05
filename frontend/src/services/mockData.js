// Mock data for sample products — avoids API calls for demo purposes

const MOCK_DATA = {
  "https://www.amazon.in/dp/B0CX5B8VCT": {
    product: {
      asin: "B0CX5B8VCT",
      title: "boAt Rockerz 551ANC Hybrid Active Noise Cancelling Bluetooth Headphones",
      price: 1799,
      rating: 4.1,
      totalReviews: 12847,
      category: "Electronics > Headphones > Over-Ear",
      bsr: 45,
      imageUrl: "",
    },
    summary: "boAt Rockerz 551ANC is praised for excellent value-for-money ANC at a budget price point, with great bass and comfortable design. Key complaints center on ANC quality vs premium brands, build quality concerns after extended use, and occasional Bluetooth connectivity drops.",
    positives: [
      { theme: "Value for Money", frequency: "high", quote: "Best ANC headphones under ₹2000. Nothing else comes close at this price." },
      { theme: "Bass Performance", frequency: "high", quote: "The bass is punchy and deep. Perfect for EDM and Bollywood music." },
      { theme: "Comfort & Fit", frequency: "medium", quote: "Soft ear cushions and lightweight. I can wear these for 4-5 hours easily." },
      { theme: "Battery Life", frequency: "medium", quote: "Easily lasts 2-3 days on a single charge with moderate use." },
      { theme: "Fast Charging", frequency: "low", quote: "10 minutes of charging gives almost 2 hours of playback. Lifesaver." },
    ],
    negatives: [
      { theme: "ANC is Weak", frequency: "high", quote: "Don't expect Sony-level ANC. It reduces some noise but not significantly." },
      { theme: "Build Quality", frequency: "medium", quote: "Plastic feels cheap. Headband started creaking after 3 months of daily use." },
      { theme: "Bluetooth Drops", frequency: "medium", quote: "Occasional disconnection when phone is in pocket. Annoying during workouts." },
      { theme: "Mic Quality on Calls", frequency: "low", quote: "People complain they can't hear me clearly in noisy environments." },
      { theme: "No App Customization", frequency: "low", quote: "No companion app to tweak EQ or ANC levels. What you get is what you get." },
    ],
    opportunities: [
      "Add a companion app with EQ customization and ANC level controls to justify a slightly higher price point",
      "Upgrade the headband material to metal-reinforced plastic to address durability complaints",
      "Market the fast-charging feature more prominently — it's a unique selling point customers love but few know about before buying",
    ],
    actionTomorrow: "Add 'Fast Charge: 10 min = 2 hours playback' as the second bullet point in your listing — this feature has the highest surprise-and-delight factor in reviews but is buried in specs.",
    competitors: [
      { name: "JBL Tune 770NC", price: 3999, rating: 4.3, totalReviews: 8432, bsr: 32, priceDiff: "+122%", ratingDiff: "+0.2", strengths: ["Superior ANC", "JBL app support", "Brand reputation"] },
      { name: "Sony WH-CH520", price: 3490, rating: 4.4, totalReviews: 21543, bsr: 18, priceDiff: "+94%", ratingDiff: "+0.3", strengths: ["Sony sound quality", "30hr battery", "Multipoint connection"] },
      { name: "Zebronics Thunder", price: 999, rating: 3.8, totalReviews: 5621, bsr: 89, priceDiff: "-44%", ratingDiff: "-0.3", strengths: ["Ultra budget", "Decent bass", "Lightweight"] },
      { name: "boAt Rockerz 450", price: 1299, rating: 4.0, totalReviews: 45231, bsr: 28, priceDiff: "-28%", ratingDiff: "-0.1", strengths: ["Proven bestseller", "40hr battery", "Durable design"] },
      { name: "Oneplus Nord Buds 2", price: 2299, rating: 4.2, totalReviews: 9876, bsr: 55, priceDiff: "+28%", ratingDiff: "+0.1", strengths: ["OnePlus ecosystem", "Better ANC", "Premium feel"] },
      { name: "Realme Buds Wireless 3", price: 1499, rating: 4.0, totalReviews: 7654, bsr: 67, priceDiff: "-17%", ratingDiff: "-0.1", strengths: ["LDAC support", "Good mic", "Lightweight neckband"] },
      { name: "Marshall Major IV", price: 9999, rating: 4.5, totalReviews: 3210, bsr: 120, priceDiff: "+456%", ratingDiff: "+0.4", strengths: ["Premium build", "Iconic design", "Wireless charging"] },
      { name: "Skullcandy Crusher Evo", price: 7999, rating: 4.3, totalReviews: 4532, bsr: 95, priceDiff: "+345%", ratingDiff: "+0.2", strengths: ["Adjustable bass", "Personal sound", "Premium comfort"] },
      { name: "boAt Nirvana 751ANC", price: 2999, rating: 4.2, totalReviews: 6789, bsr: 41, priceDiff: "+67%", ratingDiff: "+0.1", strengths: ["Better ANC", "LDAC support", "Premium boAt tier"] },
    ],
    estimatedRevenue: {
      formattedRevenue: "₹23,18,200",
      estimatedDailySales: 43,
      estimatedMonthlySales: 1288,
      reviewVelocity: 856,
      confidence: "high",
    },
  },

  "https://www.amazon.in/dp/B0C5R1V6MJ": {
    product: {
      asin: "B0C5R1V6MJ",
      title: "ALPINO 22% High Protein Super Oats Chocolate 400g | Rolled Oats & Natural Peanut Butter",
      price: 171,
      rating: 4.2,
      totalReviews: 6308,
      category: "Grocery > Breakfast Foods > Oats",
      bsr: 156,
      imageUrl: "",
    },
    summary: "ALPINO Protein Oats is loved for its taste (especially chocolate flavor), high protein content, and convenience as a healthy breakfast option. Main complaints are about portion size for the price, overly sweet taste for some users, and misleading protein claims when prepared without milk.",
    positives: [
      { theme: "Great Chocolate Taste", frequency: "high", quote: "Doesn't taste like typical health food. The chocolate flavor is genuinely delicious." },
      { theme: "High Protein Content", frequency: "high", quote: "22g protein per serving is perfect for my post-workout breakfast. No need for separate protein shake." },
      { theme: "Convenient Preparation", frequency: "medium", quote: "Just add hot milk and it's ready in 2 minutes. Perfect for busy mornings." },
      { theme: "No Added Sugar", frequency: "medium", quote: "Finally a protein oats that doesn't dump sugar. Sweetness comes from natural sources." },
      { theme: "Filling & Satisfying", frequency: "medium", quote: "Keeps me full for 4-5 hours. No mid-morning snacking urge anymore." },
    ],
    negatives: [
      { theme: "Expensive for Quantity", frequency: "high", quote: "₹171 for 400g is steep. Regular oats cost ₹40 for the same amount." },
      { theme: "Too Sweet for Some", frequency: "medium", quote: "The chocolate flavor is overpowering. Wish there was a mild/unsweetened variant." },
      { theme: "Protein Claim Misleading", frequency: "medium", quote: "22g protein is only when mixed with 200ml milk. The oats alone have maybe 8-10g." },
      { theme: "Small Pack Finishes Fast", frequency: "low", quote: "400g lasts barely a week if you eat daily. The 1kg pack is better value." },
      { theme: "Texture Issues", frequency: "low", quote: "Gets too thick if you don't add enough liquid. Becomes paste-like and hard to eat." },
    ],
    opportunities: [
      "Launch an unsweetened/mild variant for customers who find the chocolate too sweet — this is a frequently requested feature",
      "Add clear per-serving protein breakdown (with and without milk) on the listing to address misleading claims perception",
      "Bundle deal with 1kg pack at a discount to solve the 'too expensive for quantity' complaint and increase AOV",
    ],
    actionTomorrow: "Update the listing's first image to show '22g protein per serving (with milk)' with an asterisk — addressing the misleading claim complaint will reduce negative reviews by ~20% and improve conversion.",
    competitors: [
      { name: "Yogabar Protein Oats", price: 199, rating: 4.1, totalReviews: 4532, bsr: 189, priceDiff: "+16%", ratingDiff: "-0.1", strengths: ["More flavors", "Better packaging", "Yoga brand trust"] },
      { name: "MuscleBlaze Protein Oats", price: 249, rating: 4.0, totalReviews: 3210, bsr: 234, priceDiff: "+46%", ratingDiff: "-0.2", strengths: ["Higher protein", "Gym brand loyalty", "Larger serving"] },
      { name: "True Elements Oats", price: 145, rating: 4.3, totalReviews: 8765, bsr: 98, priceDiff: "-15%", ratingDiff: "+0.1", strengths: ["Cheaper", "More reviews", "Natural ingredients"] },
      { name: "Quaker Oats (1kg)", price: 199, rating: 4.4, totalReviews: 34521, bsr: 12, priceDiff: "+16%", ratingDiff: "+0.2", strengths: ["Brand trust", "Bulk quantity", "Versatile use"] },
      { name: "Saffola Oats", price: 160, rating: 4.2, totalReviews: 12543, bsr: 45, priceDiff: "-6%", ratingDiff: "0.0", strengths: ["Masala flavors", "Heart-healthy brand", "Wide availability"] },
      { name: "Pintola Protein Oats", price: 189, rating: 4.0, totalReviews: 2345, bsr: 267, priceDiff: "+11%", ratingDiff: "-0.2", strengths: ["Peanut butter brand", "Natural ingredients", "No preservatives"] },
      { name: "Max Protein Oats", price: 225, rating: 3.9, totalReviews: 1876, bsr: 312, priceDiff: "+32%", ratingDiff: "-0.3", strengths: ["30g protein claim", "Gym-focused", "Multiple sizes"] },
      { name: "Bagrry's Protein Muesli", price: 350, rating: 4.3, totalReviews: 5643, bsr: 78, priceDiff: "+105%", ratingDiff: "+0.1", strengths: ["Premium category", "More variety", "Added nuts/seeds"] },
      { name: "Kellogg's Protein Granola", price: 299, rating: 4.1, totalReviews: 4321, bsr: 134, priceDiff: "+75%", ratingDiff: "-0.1", strengths: ["Global brand", "Crunchy texture", "Multiple flavors"] },
    ],
    estimatedRevenue: {
      formattedRevenue: "₹6,52,000",
      estimatedDailySales: 127,
      estimatedMonthlySales: 3810,
      reviewVelocity: 420,
      confidence: "high",
    },
  },

  "https://www.amazon.in/dp/B0DKLDX8FT": {
    product: {
      asin: "B0DKLDX8FT",
      title: "OnePlus Nord Buds 3 in-Ear TWS Earbuds with 32dB ANC, 12.4mm Titanium Drivers",
      price: 2299,
      rating: 4.2,
      totalReviews: 4521,
      category: "Electronics > Headphones > In-Ear",
      bsr: 34,
      imageUrl: "",
    },
    summary: "OnePlus Nord Buds 3 delivers strong ANC and impressive sound quality for the price, with seamless OnePlus ecosystem integration. Complaints focus on average call quality in noisy environments, ear tip fit issues for some users, and inconsistent touch controls.",
    positives: [
      { theme: "ANC at This Price", frequency: "high", quote: "32dB ANC actually works. Blocks out metro and office noise effectively for ₹2299." },
      { theme: "Sound Quality", frequency: "high", quote: "Titanium drivers make a real difference. Bass is tight, mids are clear, treble doesn't hurt." },
      { theme: "OnePlus Integration", frequency: "medium", quote: "Auto-connects to my OnePlus phone instantly. Dirac audio tuning in settings is a nice bonus." },
      { theme: "Battery Life", frequency: "medium", quote: "6 hours per charge with ANC on, 43 hours total with case. Lasts my entire work week." },
      { theme: "IP55 Rating", frequency: "low", quote: "Used these during monsoon jogs. Sweat and light rain didn't affect them at all." },
    ],
    negatives: [
      { theme: "Call Quality Outdoors", frequency: "high", quote: "In noisy environments, people say my voice cuts in and out. AI noise cancellation doesn't work well for calls." },
      { theme: "Ear Tip Fit Issues", frequency: "medium", quote: "Default tips don't seal well for smaller ears. Had to buy foam tips separately." },
      { theme: "Touch Controls Finicky", frequency: "medium", quote: "Accidental touches pause music when adjusting fit. Wish there was a lock mode." },
      { theme: "Non-OnePlus Experience", frequency: "low", quote: "Without a OnePlus phone, you lose half the features. No app for Samsung/iPhone users." },
      { theme: "Case Scratches Easily", frequency: "low", quote: "The glossy case picked up scratches within the first week. Needs a matte finish." },
    ],
    opportunities: [
      "Release a companion app for non-OnePlus phones (Samsung, iPhone) to unlock the full feature set and expand the addressable market",
      "Include multiple ear tip sizes (S/M/L foam tips) in the box to solve the fit complaint without extra purchase",
      "Add a touch-lock feature via firmware update to eliminate accidental pauses — this is a quick win with high review impact",
    ],
    actionTomorrow: "Add 'Works best with OnePlus phones' as a clear note in the listing and simultaneously announce a cross-platform app — this converts the ecosystem lock-in complaint into a selling point for OnePlus users while showing non-OP users that support is coming.",
    competitors: [
      { name: "Nothing Ear (a)", price: 4999, rating: 4.3, totalReviews: 6789, bsr: 28, priceDiff: "+117%", ratingDiff: "+0.1", strengths: ["Unique design", "Cross-platform app", "ChatGPT integration"] },
      { name: "boAt Airdopes 141 ANC", price: 1299, rating: 4.0, totalReviews: 23456, bsr: 15, priceDiff: "-43%", ratingDiff: "-0.2", strengths: ["Budget king", "Massive reviews", "Multiple colors"] },
      { name: "Realme Buds T300", price: 1799, rating: 4.1, totalReviews: 5432, bsr: 42, priceDiff: "-22%", ratingDiff: "-0.1", strengths: ["30dB ANC cheaper", "LDAC support", "Good app"] },
      { name: "Samsung Galaxy Buds FE", price: 4999, rating: 4.4, totalReviews: 8765, bsr: 38, priceDiff: "+117%", ratingDiff: "+0.2", strengths: ["Samsung ecosystem", "Premium ANC", "Multipoint"] },
      { name: "JBL Tune Beam", price: 3499, rating: 4.2, totalReviews: 4321, bsr: 52, priceDiff: "+52%", ratingDiff: "0.0", strengths: ["JBL sound", "App EQ", "4-mic system"] },
      { name: "Noise Buds VS104", price: 899, rating: 3.9, totalReviews: 67890, bsr: 8, priceDiff: "-61%", ratingDiff: "-0.3", strengths: ["Ultra budget", "Insane volume", "Many colorways"] },
      { name: "OnePlus Buds Pro 2", price: 7999, rating: 4.4, totalReviews: 3210, bsr: 65, priceDiff: "+248%", ratingDiff: "+0.2", strengths: ["Premium ANC", "Spatial audio", "Dynaudio tuning"] },
      { name: "Sony WF-C700N", price: 5990, rating: 4.5, totalReviews: 5643, bsr: 44, priceDiff: "+160%", ratingDiff: "+0.3", strengths: ["Sony ANC", "LDAC", "Multipoint"] },
      { name: "Oppo Enco Air 3 Pro", price: 2999, rating: 4.1, totalReviews: 2345, bsr: 78, priceDiff: "+30%", ratingDiff: "-0.1", strengths: ["49dB ANC", "Bamboo fiber driver", "Google Fast Pair"] },
    ],
    estimatedRevenue: {
      formattedRevenue: "₹15,34,000",
      estimatedDailySales: 22,
      estimatedMonthlySales: 667,
      reviewVelocity: 302,
      confidence: "medium",
    },
  },
};

export function getMockDataForUrl(url) {
  return MOCK_DATA[url] || null;
}

export const SAMPLE_URLS = Object.keys(MOCK_DATA);
