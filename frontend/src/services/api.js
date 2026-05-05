const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function analyzeProduct(productUrl) {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productUrl }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Analysis failed");
  }

  return response.json();
}
