export default function SummaryCard({ summary, product }) {
  return (
    <div className="card-hover bg-gray-900/80 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
        Product Summary
      </h3>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-lg">
            📦
          </div>
          <div>
            <p className="font-semibold text-white text-sm leading-snug">{product.title}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold">${product.price}</span>
              <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-300">⭐ {product.rating}</span>
              <span className="px-2 py-0.5 rounded-md bg-gray-800">{product.totalReviews.toLocaleString()} reviews</span>
              <span className="px-2 py-0.5 rounded-md bg-gray-800">BSR #{product.bsr}</span>
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed border-t border-gray-800/50 pt-3">{summary}</p>
      </div>
    </div>
  );
}
