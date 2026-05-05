import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold gradient-text">About Revenue Lens AI</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          The AI-powered product research tool that helps Amazon sellers and entrepreneurs
          make data-driven decisions — instantly.
        </p>
      </div>

      {/* What it does */}
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-2xl p-5 sm:p-8 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">What is Revenue Lens AI?</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Revenue Lens AI is a free product intelligence tool designed for Amazon sellers, dropshippers, and product researchers.
          Simply paste any Amazon product URL and get a complete breakdown of its market performance — including estimated revenue,
          customer sentiment from real reviews, competitor analysis, and AI-generated recommendations for what to do next.
        </p>
        <p className="text-sm text-gray-300 leading-relaxed">
          Whether you're validating a product idea, scouting the competition, or looking for gaps in the market,
          Revenue Lens AI gives you the insights you need in seconds — no sign-up required.
        </p>
      </div>

      {/* Features grid */}
      <div className="space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white">What you get</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard
            icon="💰"
            color="emerald"
            title="Revenue Estimates"
            description="Get estimated monthly revenue, daily sales volume, and review velocity for any product based on real data signals."
          />
          <FeatureCard
            icon="🧠"
            color="violet"
            title="AI Review Analysis"
            description="Understand what customers love and hate through AI-powered sentiment analysis of actual product reviews."
          />
          <FeatureCard
            icon="🏆"
            color="amber"
            title="Competitor Intel"
            description="See how the product stacks up against top competitors in price, ratings, and market position."
          />
          <FeatureCard
            icon="💡"
            color="blue"
            title="Opportunity Finder"
            description="Discover product gaps and untapped opportunities based on real customer feedback and pain points."
          />
          <FeatureCard
            icon="🎯"
            color="rose"
            title="Actionable Next Steps"
            description="Get a clear, specific recommendation on what to change or improve for better market positioning."
          />
          <FeatureCard
            icon="📄"
            color="cyan"
            title="PDF Reports"
            description="Download a comprehensive report to share with your team, investors, or keep for future reference."
          />
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-2xl p-5 sm:p-8 space-y-6">
        <h2 className="text-lg sm:text-xl font-bold text-white">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StepCard step={1} title="Paste a URL" description="Copy any Amazon product link and paste it into the search bar." />
          <StepCard step={2} title="AI analyzes" description="Our AI scrapes reviews, estimates revenue, and maps the competitive landscape." />
          <StepCard step={3} title="Get insights" description="Receive actionable intelligence in seconds — revenue, sentiment, opportunities, and more." />
        </div>
      </div>

      {/* Who it's for */}
      <div className="space-y-5">
        <h2 className="text-lg sm:text-xl font-bold text-white">Who it's for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-1">Amazon FBA Sellers</h4>
            <p className="text-xs text-gray-400">Validate product ideas before investing in inventory. Understand your competition's strengths and weaknesses.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-1">Product Researchers</h4>
            <p className="text-xs text-gray-400">Quickly assess market potential and find underserved niches by analyzing customer feedback patterns.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-1">Dropshippers</h4>
            <p className="text-xs text-gray-400">Find winning products with high demand and spot opportunities where existing sellers are falling short.</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-white mb-1">Brand Owners</h4>
            <p className="text-xs text-gray-400">Monitor competitor performance, understand customer sentiment, and improve your own listings.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 py-6">
        <p className="text-gray-400 text-sm">Ready to discover your next winning product?</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl font-semibold transition shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Start Analyzing
        </Link>
        <p className="text-[10px] text-gray-600">
          No sign-up required. Free to use. Works with amazon.com and amazon.in products.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, color, title, description }) {
  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-400",
    violet: "bg-violet-500/10 text-violet-400",
    amber: "bg-amber-500/10 text-amber-400",
    blue: "bg-blue-500/10 text-blue-400",
    rose: "bg-rose-500/10 text-rose-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/50 hover:border-violet-500/30 transition-colors">
      <div className={`w-8 h-8 rounded-lg ${colorMap[color]} flex items-center justify-center mb-2 text-sm`}>{icon}</div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-xl bg-gray-800/30">
      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-lg mb-3">
        {step}
      </div>
      <h4 className="text-sm font-semibold text-white mb-1">{title}</h4>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
