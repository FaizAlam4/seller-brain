const express = require("express");
const router = express.Router();
const { analyzeProduct } = require("../controllers/analyze.controller");

router.post("/analyze", analyzeProduct);

module.exports = router;
