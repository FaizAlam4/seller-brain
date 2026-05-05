# Revenue Lens AI

> Paste an Amazon product URL → get AI-powered revenue insights, review analysis, and actionable recommendations in seconds.

![Revenue Lens AI](https://img.shields.io/badge/Status-Active-emerald) ![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-violet)

## What It Does

Revenue Lens AI analyzes Amazon product listings and reviews to give sellers a competitive edge:

- **AI Review Analysis** — Extracts positive/negative themes from customer reviews using GPT-4o
- **Revenue Estimation** — Estimates monthly revenue from BSR data
- **Competitor Landscape** — Surfaces direct competitors with pricing/rating comparisons
- **"What Should You Change Tomorrow?"** — A single, high-impact AI recommendation that can immediately move revenue

## Tech Stack

| Layer    | Tech                        |
|----------|-----------------------------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend  | Node.js + Express           |
| AI       | OpenAI GPT-4o-mini          |
| Data     | Mock (Apify-ready)          |

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   └── analyze.controller.js
│   ├── services/
│   │   ├── scraper.service.js
│   │   ├── reviewAnalyzer.service.js
│   │   ├── competitor.service.js
│   │   └── revenueEstimator.service.js
│   ├── routes/
│   │   └── analyze.routes.js
│   ├── config/
│   ├── utils/
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── InputForm.jsx
│       │   ├── SummaryCard.jsx
│       │   ├── InsightsPanel.jsx
│       │   └── CompetitorTable.jsx
│       ├── services/
│       │   └── api.js
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (optional — works with mock data without it)

### 1. Clone the repo

```bash
git clone https://github.com/FaizAlam4/seller-brain.git
cd seller-brain
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env    # Add your OpenAI API key
npm install
npm run dev
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
  "productUrl": "https://www.amazon.com/dp/B0XXXXXXXXX"
}
```

**Response:**
```json
{
  "product": { "title": "...", "price": 49.99, "rating": 4.3, "bsr": 156 },
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

| Variable         | Description                          | Required |
|------------------|--------------------------------------|----------|
| `PORT`           | Backend server port (default: 3001)  | No       |
| `OPENAI_API_KEY` | OpenAI API key for review analysis   | No*      |

*Without an API key, the app uses realistic mock analysis data.

## Design Decisions

- **Mock-first architecture** — Works out of the box without API keys
- **Service-oriented backend** — Each service is independently testable and swappable
- **Single killer insight** — The "What should you change tomorrow?" section delivers immediate value

## License

MIT