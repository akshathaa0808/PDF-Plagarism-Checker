const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

function generateComparisonReport(data, res) {
  const { mainFile, results, avg, max, mainText, matches = [] } = data;

  if (!fs.existsSync("reports")) {
    fs.mkdirSync("reports");
  }

  const reportName = `report-${Date.now()}.pdf`;
  const reportPath = path.join("reports", reportName);

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(reportPath);

  doc.pipe(stream);

  /* =========================
     1. SUMMARY
  ========================= */

  doc.fontSize(20).text("PLAGIARISM REPORT", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Main File: ${mainFile}`);
  doc.text(`Average Similarity: ${Math.round(avg)}%`);
  doc.text(`Maximum Similarity: ${Math.round(max)}%`);

  doc.moveDown();
  doc.text("Top Matches:");
  results.slice(0, 5).forEach((r, i) => {
    doc.text(`${i + 1}. ${r.fileName} - ${r.similarity}%`);
  });

  doc.addPage();

  /* =========================
     2. MAIN CONTENT + HIGHLIGHT
  ========================= */

  doc.fontSize(16).text("MAIN DOCUMENT", { underline: true });
  doc.moveDown();

  const textChunks = mainText.split(". ");

  for (let chunk of textChunks) {
    const isCopied = matches.some(m =>
      m.chunk && chunk.includes(m.chunk.slice(0, 40))
    );

    if (isCopied) {
      doc
        .fillColor("red")
        .text(chunk.trim() + ".", { continued: false });

      doc.fillColor("black");
    } else {
      doc.text(chunk.trim() + ".");
    }
  }

  doc.end();

  stream.on("finish", () => {
    res.json({
      reportUrl: `/reports/${reportName}`
    });
  });
}

module.exports = { generateComparisonReport };