/**
 * Scraper Service
 * Fetches real product info and reviews from Amazon via RapidAPI.
 * Falls back to mock data if no API key is configured.
 */

const axios = require("axios");
const config = require("../config");

const RAPIDAPI_HOST = "real-time-amazon-data.p.rapidapi.com";

function extractASIN(url) {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i) ||
                url.match(/\/product\/([A-Z0-9]{10})/i) ||
                url.match(/asin=([A-Z0-9]{10})/i) ||
                url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  return match ? match[1] : null;
}

async function resolveUrl(url) {
  // Handle shortened Amazon URLs (a.co, amzn.to, amzn.com)
  if (/^https?:\/\/(a\.co|amzn\.to|amzn\.com)\//i.test(url)) {
    try {
      const resp = await axios.head(url, { maxRedirects: 5 });
      return resp.request.res.responseUrl || url;
    } catch (err) {
      if (err.response && err.response.headers.location) {
        return err.response.headers.location;
      }
      // Try GET as fallback
      try {
        const resp = await axios.get(url, { maxRedirects: 5, headers: { "User-Agent": "Mozilla/5.0" } });
        return resp.request.res.responseUrl || url;
      } catch {
        return url;
      }
    }
  }
  return url;
}

async function scrapeProduct(productUrl) {
  const resolvedUrl = await resolveUrl(productUrl);
  const asin = extractASIN(resolvedUrl);

  if (!asin) {
    throw new Error("Invalid Amazon URL. Could not extract product ID.");
  }

  // Use real API if key is configured, otherwise fall back to mock
  if (!config.rapidApiKey || config.rapidApiKey.includes("your-rapidapi")) {
    console.log("No RapidAPI key — using mock data");
    return getMockData(asin);
  }

  try {
    const [productData, reviewsData] = await Promise.all([
      fetchProductDetails(asin),
      fetchProductReviews(asin),
    ]);

    return { product: productData, reviews: reviewsData };
  } catch (error) {
    console.error("RapidAPI error:", error.message);
    console.log("Falling back to mock data");
    return getMockData(asin);
  }
}

async function fetchProductDetails(asin) {
  const response = await axios.get(
    `https://${RAPIDAPI_HOST}/product-details`,
    {
      params: { asin, country: "US" },
      headers: {
        "x-rapidapi-key": config.rapidApiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    }
  );

  const d = response.data.data;

  return {
    asin,
    title: d.product_title || "Unknown Product",
    price: parseFloat(d.product_price?.replace(/[^0-9.]/g, "")) || 0,
    rating: parseFloat(d.product_star_rating) || 0,
    totalReviews: parseInt(d.product_num_ratings) || 0,
    category: d.product_category || "Unknown",
    bsr: d.sales_rank?.[0]?.rank || 500,
    imageUrl: d.product_photo || "",
  };
}

async function fetchProductReviews(asin) {
  const response = await axios.get(
    `https://${RAPIDAPI_HOST}/product-reviews`,
    {
      params: { asin, country: "US", page: "1" },
      headers: {
        "x-rapidapi-key": config.rapidApiKey,
        "x-rapidapi-host": RAPIDAPI_HOST,
      },
    }
  );

  const reviews = response.data.data?.reviews || [];

  return reviews.map((r) => ({
    rating: r.review_star_rating || 3,
    title: r.review_title || "",
    body: r.review_comment || "",
  }));
}

function getMockData(asin) {
  const mockProducts = {
    // Sony WH-1000XM5
    B0BX8M4YN6: {
      product: {
        asin: "B0BX8M4YN6",
        title: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        price: 328.0,
        rating: 4.6,
        totalReviews: 34521,
        category: "Electronics > Headphones > Over-Ear",
        bsr: 23,
        imageUrl: "https://via.placeholder.com/300x300?text=Sony+XM5",
      },
      reviews: [
        { rating: 5, title: "Best ANC on the market", body: "Nothing else comes close. I fly weekly and these block out engine noise completely. Worth every penny at $328." },
        { rating: 5, title: "Upgraded from XM4", body: "Lighter, more comfortable, and the ANC is noticeably better. Multipoint connection works flawlessly between laptop and phone." },
        { rating: 4, title: "Almost perfect", body: "Sound quality is phenomenal. Only complaint is the new folding mechanism — they don't fold flat anymore, bigger case." },
        { rating: 5, title: "WFH essential", body: "Crystal clear calls, amazing music, and I can wear them 8+ hours without discomfort. My team says I sound like I'm in a studio." },
        { rating: 3, title: "Overpriced for what you get", body: "Good headphones but $328? The XM4 sounds 95% as good and costs $200 less. Sony is milking the brand." },
        { rating: 5, title: "Audiophile approved", body: "LDAC support + DSEE Extreme make these sound better than most wired headphones. Spotify sounds like lossless." },
        { rating: 4, title: "Comfortable but warm", body: "Ear pads are incredibly soft but they get hot after an hour. Not great for summer." },
        { rating: 2, title: "Touch controls are buggy", body: "Random pauses, accidental skips. I wish they had physical buttons. Software update didn't fix it." },
        { rating: 5, title: "Travel companion", body: "30-hour battery, quick charge, folds into case. I've taken these to 15 countries." },
        { rating: 4, title: "Build quality concerns", body: "Plastic headband creaks when I adjust them. For $328, I expected premium materials." },
        { rating: 5, title: "Music sounds alive", body: "The soundstage is wide and detailed. I'm hearing things in songs I never noticed before." },
        { rating: 3, title: "Mic is just okay", body: "Music and ANC are 10/10 but the call mic is average. Wind noise still bleeds through." },
        { rating: 5, title: "Seamless multipoint", body: "Switch between MacBook and iPhone instantly. No re-pairing, no lag. This alone is worth the upgrade." },
        { rating: 1, title: "Headband cracked at 6 months", body: "Used carefully, always in the case. Headband snapped. Sony warranty process is painful." },
        { rating: 4, title: "Speak to Chat is genius", body: "Start talking and music auto-pauses. Feels like the future. Though sometimes it triggers from coughing." },
        { rating: 5, title: "Replaced my home speakers", body: "I literally stopped using my desktop speakers. These sound better and don't bother my roommates." },
        { rating: 3, title: "No improvement in bass", body: "Coming from XM3, bass response hasn't improved. Mids and highs are better but bass heads won't notice a difference." },
        { rating: 4, title: "App is feature-rich", body: "EQ customization, adaptive sound control, Spotify integration. Sony Headphones Connect is one of the better companion apps." },
        { rating: 5, title: "Game changer for focus", body: "I put these on in the office and disappear into my work. Productivity up 2x easily." },
        { rating: 2, title: "Connectivity drops", body: "Randomly disconnects from my MacBook every few days. Have to re-pair. Never had this with AirPods Max." },
      ],
    },
    // Apple AirPods Pro 2
    B0D1XD1ZV3: {
      product: {
        asin: "B0D1XD1ZV3",
        title: "Apple AirPods Pro 2 (USB-C) with Active Noise Cancellation",
        price: 189.99,
        rating: 4.7,
        totalReviews: 67832,
        category: "Electronics > Headphones > In-Ear",
        bsr: 8,
        imageUrl: "https://via.placeholder.com/300x300?text=AirPods+Pro",
      },
      reviews: [
        { rating: 5, title: "Apple ecosystem perfection", body: "Switches between iPhone, iPad, Mac seamlessly. Spatial Audio with head tracking is mind-blowing for movies." },
        { rating: 5, title: "ANC rivals over-ears", body: "These tiny earbuds block as much noise as my old over-ear headphones. The adaptive transparency is magic." },
        { rating: 4, title: "Great but pricey for earbuds", body: "Sound is clean and balanced. ANC is top tier. But $190 for earbuds still feels steep when alternatives exist." },
        { rating: 5, title: "Hearing health features", body: "The hearing test and adaptive audio features are incredible. Apple is turning these into health devices, not just audio." },
        { rating: 3, title: "Bass is underwhelming", body: "If you like bass-heavy music, look elsewhere. These are neutral/flat sounding. Great for podcasts, meh for hip-hop." },
        { rating: 5, title: "Running partner", body: "IPX4 rated and they never fall out with the right tips. Adaptive transparency lets me hear traffic." },
        { rating: 5, title: "Conversation Awareness is next level", body: "Start talking and it automatically lowers volume and enhances voices in front of you. Feels futuristic." },
        { rating: 2, title: "Ear tips deteriorate fast", body: "Silicone tips turn yellow and lose grip after 3 months. $8 for replacements adds up." },
        { rating: 5, title: "Find My integration", body: "Lost one earbud in the couch. Played a sound from my phone and found it in 10 seconds. U1 chip is clutch." },
        { rating: 4, title: "Battery is adequate", body: "6 hours is fine for most use cases but I wish it was 8. The case charges fast though." },
        { rating: 5, title: "Personalized Spatial Audio", body: "Scanned my ears with iPhone camera and now audio is perfectly positioned. Movies feel like a theater." },
        { rating: 3, title: "Only great in Apple ecosystem", body: "Used with Android — no adaptive audio, no spatial audio, limited features. Half the product is locked to Apple." },
        { rating: 5, title: "Call quality is unmatched", body: "People can't tell I'm on earbuds. The beam-forming mics isolate my voice perfectly." },
        { rating: 4, title: "USB-C finally", body: "Was waiting for USB-C version. One cable for everything now. Should have been USB-C from day one." },
        { rating: 1, title: "ANC stopped working", body: "After 8 months, left AirPod ANC died. Apple wants $89 to replace ONE earbud. No thanks." },
        { rating: 5, title: "Volume control on stem", body: "Swipe up/down on the stem to adjust volume. Small thing but I use it 50 times a day. Genius UX." },
        { rating: 4, title: "Good not great for music", body: "Excellent all-rounder but if music is your #1 priority, Sony XM5 earbuds sound richer." },
        { rating: 5, title: "Smallest ANC earbuds", body: "My ears are tiny and these are the only ANC earbuds that fit. XS tips + light weight = perfect." },
        { rating: 3, title: "Case scratches easily", body: "The aluminum case looks great for a week then gets micro-scratches everywhere. Need a case for your case." },
        { rating: 5, title: "Lossless coming soon", body: "With the H2 chip, Apple can push lossless audio via update. Future-proof purchase." },
      ],
    },
    // Anker Soundcore Liberty 4
    B0B8NVGR53: {
      product: {
        asin: "B0B8NVGR53",
        title: "Soundcore by Anker Liberty 4 NC Wireless Earbuds",
        price: 54.99,
        rating: 4.2,
        totalReviews: 9876,
        category: "Electronics > Headphones > In-Ear",
        bsr: 287,
        imageUrl: "https://via.placeholder.com/300x300?text=Anker+Liberty",
      },
      reviews: [
        { rating: 5, title: "Budget king", body: "These compete with $150+ earbuds. The ANC is 80% as good as AirPods Pro at 1/3 the price. No brainer." },
        { rating: 4, title: "Incredible value", body: "LDAC support at $55? Anker is not playing fair. Sound quality is detailed and the app has full EQ control." },
        { rating: 5, title: "ANC actually works", body: "For $55 I expected gimmicky ANC. Nope — it blocks office chatter, AC noise, even some traffic. Impressed." },
        { rating: 3, title: "Bulky fit", body: "These stick out of my ears quite a bit. Not sleek. Also they press on my ear after 2 hours." },
        { rating: 5, title: "10 hours battery!", body: "With ANC on I get 8-9 hours. ANC off hits 10. Plus the case has 3 more charges. I charge once a week." },
        { rating: 4, title: "Soundcore app is great", body: "Custom EQ, ANC levels, tap controls — all customizable. One of the best companion apps I've used." },
        { rating: 2, title: "Bluetooth range is weak", body: "Walk 10 feet from my phone and audio starts cutting. My old $30 earbuds had better range." },
        { rating: 5, title: "Deep bass", body: "The 11mm drivers produce bass that I can feel. BassUp mode is amazing for EDM and hip-hop." },
        { rating: 3, title: "Call quality is meh", body: "Music sounds great but people say I sound muffled on calls. The 6 mics don't seem to help with wind." },
        { rating: 4, title: "Wireless charging case", body: "At this price you get wireless charging?? Anker really crammed everything in." },
        { rating: 5, title: "Perfect gym earbuds", body: "IPX4, secure fit with wings, and the bass keeps me going. Lost my pair and immediately bought another." },
        { rating: 2, title: "Touch controls unreliable", body: "Have to tap multiple times for it to register. Or it registers ghost touches in the wind." },
        { rating: 4, title: "Transparency mode works", body: "Not as natural as Apple's but functional. Can hear conversations and announcements clearly." },
        { rating: 5, title: "Gift recommendation", body: "Bought 3 pairs for family. Everyone loves them. Best gift under $60." },
        { rating: 3, title: "Hissing in quiet rooms", body: "With ANC on in silence, there's a faint hiss. Not noticeable with music but annoying in bed." },
        { rating: 4, title: "Fast charging works", body: "10 minutes = 2 hours playback. Forgot to charge before a flight and it saved me." },
        { rating: 1, title: "Left earbud died month 3", body: "Right still works fine. Left won't charge. Anker support says out of 30-day window." },
        { rating: 5, title: "Multipoint connection", body: "Connected to phone and laptop simultaneously. Switches audio source smoothly. Premium feature at budget price." },
        { rating: 4, title: "Carrying case is chunky", body: "Doesn't fit in my coin pocket like AirPods. It's the trade-off for that huge battery." },
        { rating: 3, title: "Ear tip selection limited", body: "Only 3 sizes included. Medium is too small, Large too big for me. Had to buy foam tips separately." },
      ],
    },
  };

  // Return matched mock or default
  const data = mockProducts[asin.toUpperCase()];
  if (data) return data;

  // Default fallback for unknown ASINs
  return {
    product: {
      asin,
      title: "Wireless Bluetooth Earbuds Pro - Active Noise Cancellation",
      price: 49.99,
      rating: 4.3,
      totalReviews: 12847,
      category: "Electronics > Headphones",
      bsr: 156,
      imageUrl: "https://via.placeholder.com/300x300?text=Product",
    },
    reviews: [
      { rating: 5, title: "Amazing sound quality!", body: "These earbuds have incredible bass and crystal clear mids. The noise cancellation is on par with earbuds twice the price. Battery lasts all day." },
      { rating: 5, title: "Best purchase this year", body: "Comfortable fit, great sound, and the case is compact. I use them for work calls and music. Highly recommend." },
      { rating: 4, title: "Great but not perfect", body: "Sound is excellent and ANC works well. However, the touch controls are too sensitive. I accidentally pause music all the time." },
      { rating: 5, title: "Replaced my AirPods", body: "Better sound quality than AirPods Pro at half the price. The transparency mode is natural sounding." },
      { rating: 3, title: "Good sound, mediocre fit", body: "Audio quality is impressive but they keep falling out during workouts. Not ideal for exercise." },
      { rating: 4, title: "Solid for the price", body: "Can't complain at this price point. ANC isn't as strong as Sony XM5 but very good for $50." },
      { rating: 2, title: "Connection issues", body: "Audio cuts out every few minutes when my phone is in my pocket. Had to return and get a replacement." },
      { rating: 5, title: "Perfect for commuting", body: "The ANC blocks out subway noise completely. Battery lasts my entire commute plus work day." },
      { rating: 1, title: "Broke after 2 weeks", body: "Left earbud stopped working after 14 days. Cheap build quality. The case hinge also feels flimsy." },
      { rating: 4, title: "Great call quality", body: "People on calls say I sound clearer than with my old headset. Wind noise reduction actually works." },
      { rating: 5, title: "Impressive ANC", body: "I work in an open office and these block out all the chatter. Can finally focus." },
      { rating: 3, title: "App needs work", body: "The companion app is buggy and crashes often. EQ settings don't save. Hardware is great though." },
      { rating: 4, title: "Comfortable for long use", body: "I wear these 6+ hours daily. No ear fatigue. The silicone tips are soft." },
      { rating: 2, title: "Disappointing battery", body: "Advertised 8 hours but I get maybe 5 with ANC on. Misleading marketing." },
      { rating: 5, title: "Gift hit!", body: "Bought for my husband and he loves them. Uses them every day for podcast and music." },
    ],
  };
}

module.exports = { scrapeProduct };
