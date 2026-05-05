export default function CompetitorTable({ competitors }) {
  return (
    <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6">
      <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-4 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center">🏆</span>
        Competitor Landscape
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Rating</th>
              <th className="pb-3 font-medium">Reviews</th>
              <th className="pb-3 font-medium">BSR</th>
              <th className="pb-3 font-medium">Key Strength</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {competitors.map((comp, i) => (
              <tr key={i} className="text-gray-300 hover:bg-gray-800/30 transition-colors">
                <td className="py-3 font-medium text-white">{comp.name}</td>
                <td className="py-3">
                  ${comp.price}
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                    comp.priceDiff.startsWith("-") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {comp.priceDiff.startsWith("-") ? "" : "+"}{comp.priceDiff}
                  </span>
                </td>
                <td className="py-3">
                  ⭐ {comp.rating}
                  <span className={`ml-1 text-xs ${
                    parseFloat(comp.ratingDiff) > 0 ? "text-red-400" : "text-emerald-400"
                  }`}>
                    ({comp.ratingDiff > 0 ? "+" : ""}{comp.ratingDiff})
                  </span>
                </td>
                <td className="py-3">{comp.totalReviews.toLocaleString()}</td>
                <td className="py-3">#{comp.bsr}</td>
                <td className="py-3 text-xs text-gray-400">{comp.strengths[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
