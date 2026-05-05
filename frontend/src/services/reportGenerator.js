import { jsPDF } from "jspdf";

const COLORS = {
  primary: [139, 92, 246],
  emerald: [52, 211, 153],
  red: [248, 113, 113],
  amber: [251, 191, 36],
  dark: [17, 17, 27],
  card: [30, 30, 45],
  text: [255, 255, 255],
  muted: [156, 163, 175],
  border: [55, 55, 75],
};

export function downloadPDFReport(data) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Line height multiplier relative to font size (mm per pt)
  const LINE_HEIGHT = 0.45; // mm per font-size pt

  function getLineHeight(fontSize) {
    return fontSize * LINE_HEIGHT;
  }

  function checkPage(needed = 20) {
    if (y + needed > pageHeight - 15) {
      doc.addPage();
      drawBackground();
      y = 20;
    }
  }

  function drawBackground() {
    doc.setFillColor(...COLORS.dark);
    doc.rect(0, 0, pageWidth, pageHeight, "F");
  }

  function drawRoundedRect(x, yPos, w, h, r, fillColor, borderColor) {
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, yPos, w, h, r, r, "F");
    if (borderColor) {
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(x, yPos, w, h, r, r, "S");
    }
  }

  function wrappedText(text, x, yStart, maxWidth, fontSize, color, fontStyle = "normal") {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", fontStyle);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text || ""), maxWidth);
    const lh = getLineHeight(fontSize);
    lines.forEach((line, i) => {
      checkPage(lh + 2);
      doc.text(line, x, yStart + i * lh);
    });
    return lines.length * lh;
  }

  function addSectionHeader(title, color) {
    checkPage(16);
    y += 10;
    doc.setFontSize(9);
    doc.setTextColor(...color);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + doc.getTextWidth(title) + 2, y);
    y += 7;
  }

  // === Page 1 — Header ===
  drawBackground();

  // Header bar
  doc.setFillColor(30, 20, 60);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 36, pageWidth, 4, "F");

  // Logo
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(margin, 10, 10, 10, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("R", margin + 3.5, 17.5);

  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("Revenue Lens AI", margin + 14, 16);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("Product Intelligence Report", margin + 14, 22);

  // Date
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 200);
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(dateStr, pageWidth - margin - doc.getTextWidth(dateStr), 16);

  y = 50;

  // === Product Card ===
  const productTitle = String(data.product?.title || "Unknown Product").substring(0, 80);
  const asinLine = `ASIN: ${data.product?.asin || "N/A"}  |  Category: ${data.product?.category || "N/A"}`;

  drawRoundedRect(margin, y, contentWidth, 30, 3, COLORS.card, COLORS.border);
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(productTitle, margin + 5, y + 8);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.muted);
  doc.text(asinLine, margin + 5, y + 14);

  // Stats row
  const stats = [
    { label: "Price", value: `$${data.product?.price || 0}`, color: COLORS.emerald },
    { label: "Rating", value: `${data.product?.rating || 0}/5`, color: COLORS.amber },
    { label: "Reviews", value: String(data.product?.totalReviews?.toLocaleString() || "0"), color: COLORS.text },
    { label: "BSR", value: `#${data.product?.bsr || 0}`, color: COLORS.text },
  ];
  const statSpacing = (contentWidth - 10) / 4;
  stats.forEach((s, i) => {
    const sx = margin + 5 + i * statSpacing;
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.text(s.label, sx, y + 21);
    doc.setTextColor(...s.color);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(String(s.value), sx, y + 27);
  });

  y += 36;

  // === Action Tomorrow ===
  const actionText = String(data.actionTomorrow || "No recommendation available.");
  doc.setFontSize(8);
  const actionLines = doc.splitTextToSize(actionText, contentWidth - 12);
  const actionBoxH = 10 + actionLines.length * getLineHeight(8) + 4;

  checkPage(actionBoxH + 5);
  drawRoundedRect(margin, y, contentWidth, actionBoxH, 3, [45, 30, 80], [139, 92, 246]);

  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("WHAT SHOULD YOU CHANGE TOMORROW?", margin + 5, y + 7);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const actionLh = getLineHeight(8);
  actionLines.forEach((line, i) => {
    doc.text(line, margin + 5, y + 13 + i * actionLh);
  });

  y += actionBoxH + 6;

  // === Revenue Estimate ===
  checkPage(34);
  drawRoundedRect(margin, y, contentWidth, 28, 3, COLORS.card, COLORS.border);

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.text("ESTIMATED MONTHLY REVENUE", margin + 5, y + 7);

  const revenueStr = String(data.estimatedRevenue?.formattedRevenue || "$0");
  doc.setTextColor(...COLORS.emerald);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(revenueStr, margin + 5, y + 16);
  const revenueWidth = doc.getTextWidth(revenueStr);

  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("/month", margin + 5 + revenueWidth + 3, y + 16);

  const dailySales = data.estimatedRevenue?.estimatedDailySales || 0;
  const monthlySales = data.estimatedRevenue?.estimatedMonthlySales?.toLocaleString() || "0";
  const confidence = data.estimatedRevenue?.confidence || "N/A";
  doc.setTextColor(...COLORS.muted);
  doc.setFontSize(7);
  doc.text(
    `Daily: ${dailySales} units   |   Monthly: ${monthlySales} units   |   Confidence: ${confidence}`,
    margin + 5,
    y + 23
  );

  y += 34;

  // === Executive Summary ===
  addSectionHeader("EXECUTIVE SUMMARY", COLORS.text);
  const summaryText = String(data.summary || "No summary available.");
  const summaryH = wrappedText(summaryText, margin + 2, y, contentWidth - 4, 8, COLORS.muted);
  y += summaryH + 6;

  // === Positives ===
  addSectionHeader("WHAT CUSTOMERS LOVE", COLORS.emerald);
  (data.positives || []).forEach((p) => {
    checkPage(16);
    // Theme line
    doc.setTextColor(...COLORS.emerald);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const themeStr = `> ${p.theme || "Unknown"}`;
    doc.text(themeStr, margin + 3, y);
    const themeWidth = doc.getTextWidth(themeStr);
    // Frequency
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const freqX = margin + 3 + themeWidth + 3;
    doc.text(`[${p.frequency || ""}]`, freqX, y);
    y += getLineHeight(8) + 1;

    // Quote (wrapped)
    const quoteText = `"${String(p.quote || "").substring(0, 120)}"`;
    doc.setFontSize(7);
    const quoteLines = doc.splitTextToSize(quoteText, contentWidth - 12);
    const qlh = getLineHeight(7);
    doc.setTextColor(130, 130, 150);
    quoteLines.forEach((line, i) => {
      checkPage(qlh + 2);
      doc.text(line, margin + 6, y + i * qlh);
    });
    y += quoteLines.length * qlh + 4;
  });

  // === Negatives ===
  addSectionHeader("WHAT CUSTOMERS COMPLAIN ABOUT", COLORS.red);
  (data.negatives || []).forEach((n) => {
    checkPage(16);
    doc.setTextColor(...COLORS.red);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    const themeStr = `> ${n.theme || "Unknown"}`;
    doc.text(themeStr, margin + 3, y);
    const themeWidth = doc.getTextWidth(themeStr);
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    const freqX = margin + 3 + themeWidth + 3;
    doc.text(`[${n.frequency || ""}]`, freqX, y);
    y += getLineHeight(8) + 1;

    const quoteText = `"${String(n.quote || "").substring(0, 120)}"`;
    doc.setFontSize(7);
    const quoteLines = doc.splitTextToSize(quoteText, contentWidth - 12);
    const qlh = getLineHeight(7);
    doc.setTextColor(130, 130, 150);
    quoteLines.forEach((line, i) => {
      checkPage(qlh + 2);
      doc.text(line, margin + 6, y + i * qlh);
    });
    y += quoteLines.length * qlh + 4;
  });

  // === Opportunities ===
  addSectionHeader("PRODUCT OPPORTUNITIES", COLORS.amber);
  (data.opportunities || []).forEach((o, i) => {
    checkPage(12);
    doc.setTextColor(...COLORS.amber);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}.`, margin + 3, y);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.text);
    const oppLines = doc.splitTextToSize(String(o || ""), contentWidth - 14);
    const olh = getLineHeight(8);
    oppLines.forEach((line, li) => {
      checkPage(olh + 2);
      doc.text(line, margin + 10, y + li * olh);
    });
    y += oppLines.length * olh + 4;
  });

  // === Competitors ===
  addSectionHeader("COMPETITOR LANDSCAPE", COLORS.primary);
  (data.competitors || []).forEach((c) => {
    const strengthsText = `Strengths: ${(c.strengths || []).join(", ")}`;
    doc.setFontSize(7);
    const strengthLines = doc.splitTextToSize(strengthsText, contentWidth - 10);
    const boxH = 14 + strengthLines.length * getLineHeight(7);

    checkPage(boxH + 4);
    drawRoundedRect(margin, y, contentWidth, boxH, 2, [25, 25, 40], COLORS.border);

    doc.setTextColor(...COLORS.text);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(String(c.name || ""), margin + 4, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...COLORS.muted);
    doc.setFontSize(7);
    const detailLine = `$${c.price || 0}  |  ${c.rating || 0}/5  |  ${(c.totalReviews || 0).toLocaleString()} reviews  |  BSR #${c.bsr || 0}`;
    doc.text(detailLine, margin + 4, y + 11);

    doc.setTextColor(...COLORS.emerald);
    doc.setFontSize(7);
    const slh = getLineHeight(7);
    strengthLines.forEach((line, i) => {
      doc.text(line, margin + 4, y + 16 + i * slh);
    });

    y += boxH + 5;
  });

  // === Footer ===
  checkPage(14);
  y += 8;
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setTextColor(100, 100, 120);
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("Generated by Revenue Lens AI - Product Intelligence Engine", margin, y);
  doc.text("revenueLens.ai", pageWidth - margin - doc.getTextWidth("revenueLens.ai"), y);

  // Save
  doc.save(`Revenue-Lens-Report-${data.product?.asin || "product"}.pdf`);
}
