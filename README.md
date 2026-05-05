# Revenue Lens AI

> Paste any Amazon product URL → get AI-powered revenue insights, review analysis, competitor landscape, and actionable recommendations in seconds.

![Revenue Lens AI](https://img.shields.io/badge/Status-Active-emerald) ![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-violet)

## What It Does

Revenue Lens AI analyzes Amazon product listings by scraping real product data and reviews, then uses AI to extract actionable business intelligence:

- **Real Data Scraping** — Fetches live product info and customer reviews directly from Amazon (supports both .com and .in)
- **AI Review Analysis** — Extracts positive/negative sentiment themes from real customer reviews using Groq Llama 3.3 70B
- **Revenue Estimation** — Estimates monthly revenue based on BSR, review velocity, and pricing data
- **Competitor Landscape** — AI-generated competitor comparisons with pricing, ratings, and strategic strengths
- **"What Should You Change Tomorrow?"** — A single, high-impact AI recommendation to move revenue immediately
- **PDF Reports** — Download a comprehensive analysis report to share with your team

## How It Works

1. **Paste a URL** — Any Amazon product link (full URL, short links like `amzn.in/d/...`, `a.co/...`)
2. **Data Collection** — Scrapes the product page for title, price, rating, BSR, and inline customer reviews
3. **AI Analysis** — Sends reviews to Groq (Llama 3.3 70B) for sentiment analysis and opportunity detection
4. **Competitor Intel** — AI generates a competitive landscape with 9 real competitor products
5. **Results** — Unified dashboard with revenue estimates, insights, and next steps

### Data Pipeline

```
Amazon URL → URL Resolution → ASIN Extraction → Direct Scraping (cheerio)
                                                        ↓
Product Details + Reviews → Groq AI Analysis → Revenue Estimation
                                                        ↓
                                              Unified JSON Response
```

### Fallback Chain

The scraper uses a resilient multi-layer fallback:

1. **RapidAPI** (if key configured & quota available)
2. **Direct Scraping** with cheerio (no API key needed — works always)
3. **Mock Data** (last resort for demo purposes)

The AI also falls back through multiple models if rate-limited:
`llama-3.3-70b-versatile` → `llama-4-scout-17b` → `qwen3-32b` → `llama-3.1-8b-instant`

## Tech Stack

| Layer    | Tech                                    |
|----------|-----------------------------------------|
| Frontend | React 18 (Vite) + Tailwind CSS + React Router |
| Backend  | Node.js + Express                       |
| AI       | Groq (Llama 3.3 70B Versatile)          |
| Scraping | Cheerio + Axios (direct HTML parsing)   |
| Data API | RapidAPI Real-Time Amazon Data (optional) |

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   └── analyze.controller.js
│   ├── services/
│   │   ├── scraper.service.js        # Amazon scraping (RapidAPI + direct fallback)
│   │   ├── reviewAnalyzer.service.js  # Groq AI sentiment analysis
│   │   ├── competitor.service.js      # AI competitor generation
│   │   └── revenueEstimator.service.js
│   ├── routes/
│   │   └── analyze.routes.js
│   ├── config/
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx            # Responsive nav with mobile menu
│       │   ├── InputForm.jsx
│       │   ├── SummaryCard.jsx
│       │   ├── InsightsPanel.jsx
│       │   └── CompetitorTable.jsx
│       ├── pages/
│       │   └── AboutPage.jsx         # About page with features & how-it-works
│       ├── services/
│       │   ├── api.js
│       │   └── reportGenerator.js    # PDF report generation
│       ├── App.jsx                   # Routing setup
│       └── main.jsx
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Groq API key (free at [console.groq.com](https://console.groq.com))
- RapidAPI key (optional — app works without it via direct scraping)

### 1. Clone the repo

```bash
git clone https://github.com/FaizAlam4/seller-brain.git
cd seller-brain
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env    # Add your API keys
npm install
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and paste any Amazon product URL.

## API

### POST `/api/analyze`

**Request:**
```json
{
  "productUrl": "https://www.amazon.in/dp/B0C5R1V6MJ"
}
```

**Supported URL formats:**
- `amazon.com/dp/...` or `amazon.in/dp/...`
- `amazon.com/product/...`
- Short links: `amzn.in/d/...`, `amzn.to/...`, `a.co/...`

**Response:**
```json
{
  "product": { "title": "...", "price": 171, "rating": 4.2, "totalReviews": 6308, "bsr": 500 },
  "summary": "Executive summary of customer sentiment",
  "positives": [{ "theme": "...", "frequency": "high", "quote": "..." }],
  "negatives": [{ "theme": "...", "frequency": "medium", "quote": "..." }],
  "opportunities": ["Improvement suggestion 1"],
  "actionTomorrow": "Specific action to increase revenue immediately",
  "competitors": [{ "name": "...", "price": 79.99, "rating": 4.5 }],
  "estimatedRevenue": { "formattedRevenue": "$45,000", "estimatedMonthlySales": 900 }
}
```

## Environment Variables

| Variable       | Description                              | Required |
|----------------|------------------------------------------|----------|
| `PORT`         | Backend server port (default: 3001)      | No       |
| `GROQ_API_KEY` | Groq API key for AI analysis             | Yes      |
| `RAPIDAPI_KEY` | RapidAPI key (optional — direct scraping works without it) | No |
| `NODE_ENV`     | Environment (development/production)     | No       |

## Design Decisions

- **Direct scraping fallback** — Works without any paid API keys; cheerio parses Amazon's server-rendered HTML
- **Multi-model AI fallback** — If one Groq model is rate-limited, automatically tries the next
- **Service-oriented backend** — Each service is independently testable and swappable
- **Mobile-first responsive UI** — Full functionality on mobile screens
- **Single killer insight** — The "What should you change tomorrow?" section delivers immediate actionable value
- **No sign-up required** — Zero friction to get value from the tool

## License

MIT