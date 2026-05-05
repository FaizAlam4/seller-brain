export default function InsightsPanel({ positives, negatives, opportunities }) {
  return (
    <div className="space-y-6">
      {/* Positives vs Negatives */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Positives */}
        <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">✅</span>
            What customers love
          </h3>
          <div className="space-y-3 stagger-children">
            {positives.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.theme}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.frequency === "high" ? "bg-emerald-500/20 text-emerald-300" :
                    item.frequency === "medium" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-gray-700 text-gray-400"
                  }`}>
                    {item.frequency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Negatives */}
        <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xs uppercase tracking-widest text-red-400 font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">⚠️</span>
            What customers complain about
          </h3>
          <div className="space-y-3 stagger-children">
            {negatives.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{item.theme}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.frequency === "high" ? "bg-red-500/20 text-red-300" :
                    item.frequency === "medium" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-gray-700 text-gray-400"
                  }`}>
                    {item.frequency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 italic">"{item.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Opportunities */}
      <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">💡</span>
          Product Opportunities
        </h3>
        <div className="space-y-3">
          {opportunities.map((opp, i) => (
            <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-gray-800/50 transition">
              <span className="text-xs bg-amber-500/20 text-amber-300 rounded-full w-6 h-6 flex items-center justify-center shrink-0 font-semibold">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300">{opp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
