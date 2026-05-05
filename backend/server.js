const express = require("express");
const cors = require("cors");
const config = require("./config");
const analyzeRoutes = require("./routes/analyze.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", analyzeRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(config.port, () => {
  console.log(`Revenue Lens AI server running on port ${config.port}`);

  // Keep-alive: ping self every 14 minutes to prevent Render free tier sleep
  if (config.nodeEnv === "production" && process.env.RENDER_EXTERNAL_URL) {
    setInterval(() => {
      fetch(`${process.env.RENDER_EXTERNAL_URL}/health`).catch(() => {});
    }, 14 * 60 * 1000);
  }
});
