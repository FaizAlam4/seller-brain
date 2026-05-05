require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  groqApiKey: process.env.GROQ_API_KEY,
  rapidApiKey: process.env.RAPIDAPI_KEY,
  nodeEnv: process.env.NODE_ENV || "development",
};
