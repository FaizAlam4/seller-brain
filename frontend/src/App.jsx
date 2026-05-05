import { useState } from "react";
import InputForm from "./components/InputForm";
import SummaryCard from "./components/SummaryCard";
import InsightsPanel from "./components/InsightsPanel";
import CompetitorTable from "./components/CompetitorTable";
import { analyzeProduct } from "./services/api";
import { downloadPDFReport } from "./services/reportGenerator";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeUrl, setActiveUrl] = useState(null);

  async function handleAnalyze(url) {
    setLoading(true);
    setError(null);
    setData(null);
    setActiveUrl(url);
    try {
      const result = await analyzeProduct(url);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setData(null);
    setError(null);
    setActiveUrl(null);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-gray-800/50 glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 18 L8 10 L12 14 L16 6 L20 8" />
              <circle cx="20" cy="8" r="2" fill="#34d399" stroke="#34d399" />
            </svg>
          </div>
          <h1 className="text-lg font-bold tracking-tight gradient-text">Revenue Lens AI</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[10px] px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 hidden sm:block">
              Free tier · Limited lookups for new URLs
            </span>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Input */}
        <div className="animate-fade-in-up">
          <InputForm onSubmit={handleAnalyze} loading={loading} onClear={handleClear} activeUrl={activeUrl} />
        </div>

        {/* Discover Products */}
        {!data && !loading && (
          <div className="animate-fade-in-up bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-violet-500/20 flex items-center justify-center text-[10px]">🔍</span>
              Find products to analyze
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Best Sellers", url: "https://www.amazon.com/Best-Sellers/zgbs", desc: "Top products by category" },
                { label: "New Releases", url: "https://www.amazon.com/gp/new-releases", desc: "Hot new arrivals" },
                { label: "Movers & Shakers", url: "https://www.amazon.com/gp/movers-and-shakers", desc: "Biggest rank gains (24h)" },
                { label: "Most Wished For", url: "https://www.amazon.com/gp/most-wished-for", desc: "Top wishlisted items" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-violet-500/40 hover:bg-violet-600/5 transition-all"
                >
                  <span className="text-sm font-medium text-gray-200 group-hover:text-violet-300 transition-colors">{link.label}</span>
                  <span className="block text-[10px] text-gray-500 mt-0.5">{link.desc}</span>
                </a>
              ))}
            </div>
            <p className="text-[10px] text-gray-600 mt-3">
              Copy any product URL from these pages and paste above to get AI-powered insights.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="animate-fade-in-up bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-red-300 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-fade-in flex flex-col items-center justify-center py-20 gap-6">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-violet-500/30 rounded-full" />
              <div className="absolute inset-0 w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-2 w-10 h-10 border-4 border-indigo-400/30 rounded-full" />
              <div className="absolute inset-2 w-10 h-10 border-4 border-indigo-400 border-b-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
            </div>
            <div className="text-center space-y-2">
              <p className="text-gray-300 font-medium">Analyzing product...</p>
              <p className="text-gray-500 text-xs">Scraping reviews → Running AI analysis → Generating insights</p>
            </div>
            <div className="w-64 h-1 rounded-full overflow-hidden bg-gray-800">
              <div className="h-full loading-bar rounded-full" />
            </div>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <div className="space-y-6 stagger-children">
            {/* Action Tomorrow — The killer section */}
            <div className="card-hover animate-pulse-glow bg-gradient-to-r from-violet-600/20 via-indigo-600/15 to-violet-600/20 border border-violet-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">🎯</span>
                What should you change tomorrow?
              </h2>
              <p className="text-lg text-white leading-relaxed font-medium relative z-10">
                {data.actionTomorrow}
              </p>
            </div>

            {/* Summary + Revenue */}
            <div className="grid md:grid-cols-2 gap-6">
              <SummaryCard
                summary={data.summary}
                product={data.product}
              />
              <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                  Revenue Estimate
                </h3>
                <div className="animate-count-up">
                  <span className="text-4xl font-extrabold text-emerald-400">
                    {data.estimatedRevenue.formattedRevenue}
                  </span>
                  <span className="text-sm text-gray-500 font-normal ml-2">/month</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm relative z-10">
                  <div className="p-3 rounded-xl bg-gray-800/50">
                    <p className="text-gray-500 text-xs">Daily Sales</p>
                    <p className="text-white font-semibold text-lg">{data.estimatedRevenue.estimatedDailySales}</p>
                    <p className="text-gray-500 text-xs">units</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-800/50">
                    <p className="text-gray-500 text-xs">Monthly Sales</p>
                    <p className="text-white font-semibold text-lg">{data.estimatedRevenue.estimatedMonthlySales.toLocaleString()}</p>
                    <p className="text-gray-500 text-xs">units</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-800/50">
                    <p className="text-gray-500 text-xs">Review Velocity</p>
                    <p className="text-white font-semibold text-lg">{data.estimatedRevenue.reviewVelocity}</p>
                    <p className="text-gray-500 text-xs">per month</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-800/50">
                    <p className="text-gray-500 text-xs">Confidence</p>
                    <p className={`font-semibold text-lg capitalize ${
                      data.estimatedRevenue.confidence === "high" ? "text-emerald-400" :
                      data.estimatedRevenue.confidence === "medium" ? "text-yellow-400" : "text-red-400"
                    }`}>{data.estimatedRevenue.confidence}</p>
                    <p className="text-gray-500 text-xs">level</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <InsightsPanel
              positives={data.positives}
              negatives={data.negatives}
              opportunities={data.opportunities}
            />

            {/* Competitors */}
            <CompetitorTable competitors={data.competitors} />

            {/* Download Report */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => downloadPDFReport(data)}
                className="group flex items-center gap-2 px-6 py-3 bg-gray-800/80 border border-gray-700 hover:border-violet-500/50 hover:bg-violet-600/10 rounded-xl text-sm text-gray-300 hover:text-violet-300 transition-all shadow-lg hover:shadow-violet-500/10"
              >
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF Report
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 mt-20 py-6">
        <p className="text-center text-xs text-gray-600">
          Built with React, Express & OpenAI — Revenue Lens AI © 2025
        </p>
      </footer>
    </div>
  );
}
