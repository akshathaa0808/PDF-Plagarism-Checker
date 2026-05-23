const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const { extractText } = require("../services/pdfService");
const { getChunks } = require("../services/chunkService");
const { similarity } = require("../services/similarityService");
const { searchWeb } = require("../services/searchService");
const { fetchPageText } = require("../services/webFetchService");
const { cosineSimilarity } = require("../tfidfSimilarityService");

/* =========================
   MODE 1: PDF vs PDFs
========================= */

const comparePDFs = async (req, res) => {

  try {

    const main = req.files["pdf1"]?.[0];
    const others = req.files["pdfs"];

    if (!main || !others) {
      return res.status(400).json({
        error: "Missing PDFs"
      });
    }

    const mainText = await extractText(main.buffer);

    let results = [];

    for (let file of others) {

      const text = await extractText(file.buffer);
      const score = cosineSimilarity(mainText, text);
      results.push({
        fileName: file.originalname,
        similarity: Math.round(score)
      });
    }
    const avg =
      results.reduce((sum, r) => sum + r.similarity, 0)
      / results.length;
    const max =
      Math.max(...results.map(r => r.similarity));
    /* =========================
       GENERATE PDF REPORT
    ========================= */
    if (!fs.existsSync("reports")) {
      fs.mkdirSync("reports");
    }

    const reportName =
      `report-${Date.now()}.pdf`;

    const reportPath =
      path.join("reports", reportName);

    const doc = new PDFDocument({
      margin: 50
    });

    const stream =
      fs.createWriteStream(reportPath);

    doc.pipe(stream);

    /* TITLE */

    doc
      .fontSize(24)
      .fillColor("#84cc16")
      .text("Plagiarism Report", {
        align: "center"
      });

    doc.moveDown();

    /* MAIN FILE */

    doc
      .fontSize(16)
      .fillColor("black")
      .text(`Main File: ${main.originalname}`);

    doc.moveDown();

    /* OVERALL SCORE */

    doc
      .fontSize(20)
      .fillColor("#dc2626")
      .text(`Average Similarity: ${Math.round(avg)}%`);

    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .fillColor("black")
      .text(`Maximum Similarity: ${Math.round(max)}%`);

    doc.moveDown(2);

    /* RESULTS */

    doc
      .fontSize(18)
      .fillColor("#2563eb")
      .text("Comparison Results");

    doc.moveDown();

    results.forEach((r, index) => {

      doc
        .fontSize(14)
        .fillColor("black")
        .text(
          `${index + 1}. ${r.fileName}`
        );

      doc
        .fontSize(14)
        .fillColor("#dc2626")
        .text(
          `Similarity: ${r.similarity}%`
        );

      doc.moveDown();
    });

    /* PAGE 2 */

    doc.addPage();

    doc
      .fontSize(20)
      .fillColor("#84cc16")
      .text("Main PDF Content", {
        align: "center"
      });

    doc.moveDown();

    doc
      .fontSize(11)
      .fillColor("black")
      .text(mainText);

    doc.end();

    /* WAIT FOR PDF */

    stream.on("finish", () => {

      res.json({
        mainFile: main.originalname,
        percentage: Math.round(avg),
        maxSimilarity: Math.round(max),
        results,
        reportUrl: `/reports/${reportName}`
      });

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};

/* =========================
   MODE 2: INTERNET CHECK
========================= */

const internetCheck = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "No PDF uploaded"
      });
    }

    const text = await extractText(file.buffer);

    // reduce API cost (was 5 chunks → now safer + controlled)
    const chunks = getChunks(text).slice(0, 3);

    console.log("Total chunks used:", chunks.length);

    let matches = [];
    let total = 0;

    const seenQueries = new Set();

    for (let chunk of chunks) {
      if (!chunk || chunk.length < 80) continue;

      const safeQuery = chunk
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);

      if (seenQueries.has(safeQuery)) continue;
      seenQueries.add(safeQuery);

      const results = await searchWeb(safeQuery);

      // LIMIT external calls (IMPORTANT FOR CREDIT SAVING)
      const limitedResults = (results || []).slice(0, 2);

      for (let r of limitedResults) {
        const url = r.url || r.link || r.href || "";

        if (!url || typeof url !== "string") continue;
        if (!url.startsWith("http")) continue;

        const pageText = await fetchPageText(url);

        if (!pageText || pageText.length < 120) continue;

        const score = similarity(chunk, pageText);

        // FIX: normalize threshold properly (your old 3 was unreliable)
        if (score > 30) {
          matches.push({
            chunk,
            source: url,
            similarity: Math.round(score),
            flagged: true
          });

          total += score;

          // EARLY STOP (BIG CREDIT SAVER)
          if (matches.length >= 5) break;
        }
      }

      if (matches.length >= 5) break;
    }

    const finalScore =
      matches.length === 0
        ? 0
        : total / matches.length;

    res.json({
      mainFile: file.originalname,
      percentage: Math.round(finalScore),
      sources: matches
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Internet check failed"
    });
  }
};

module.exports = {
  comparePDFs,
  internetCheck
};