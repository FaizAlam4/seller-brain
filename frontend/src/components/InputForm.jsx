import { useState } from "react";

const SAMPLE_PRODUCTS = [
  { label: "Sony WH-1000XM5 Headphones", url: "https://www.amazon.com/dp/B0BX8M4YN6" },
  { label: "Apple AirPods Pro 2", url: "https://www.amazon.com/dp/B0D1XD1ZV3" },
  { label: "Anker Soundcore Earbuds", url: "https://www.amazon.com/dp/B0B8NVGR53" },
];

export default function InputForm({ onSubmit, loading, onClear, activeUrl }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (url.trim()) onSubmit(url.trim());
  }

  function handleTryExample(exampleUrl) {
    setUrl(exampleUrl);
    onSubmit(exampleUrl);
  }

  function handleClear() {
    setUrl("");
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 gradient-text">Analyze any Amazon product</h2>
        <p className="text-gray-400 text-sm">
          Paste a product URL → get AI-powered revenue insights in seconds.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.amazon.com/dp/B0XXXXXXXXX"
            required
            disabled={loading}
            className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition group-hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition pointer-events-none" />
        </div>
        <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 sm:flex-none px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 whitespace-nowrap"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Analyze
            </span>
          )}
        </button>
        {activeUrl && (
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-3.5 bg-gray-800 border border-gray-700 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 rounded-xl text-sm text-gray-400 transition whitespace-nowrap group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:border-gray-700 disabled:hover:text-gray-400"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500">Try an example:</span>
        {SAMPLE_PRODUCTS.map((p) => (
          <button
            key={p.url}
            type="button"
            onClick={() => handleTryExample(p.url)}
            disabled={loading}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:opacity-50 ${
              activeUrl === p.url
                ? "bg-violet-600/30 border-violet-500 text-violet-200 ring-2 ring-violet-500/30 scale-105 shadow-md shadow-violet-500/10"
                : "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-violet-600/20 hover:border-violet-500/50 hover:text-violet-300 hover:scale-105"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {loading && (
        <p className="text-[11px] text-amber-400/80 mt-1 animate-pulse">
          This may take 30-60s on the first request as the server wakes up from inactivity.
        </p>
      )}
      <p className="text-[10px] text-gray-600 mt-1">
        Supports: amazon.com/dp/..., amazon.in/dp/..., a.co/..., amzn.to/..., amzn.in/d/... (share links)
      </p>
    </form>
  );
}
