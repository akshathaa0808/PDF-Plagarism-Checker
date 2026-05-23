const pdfParse = require("pdf-parse");
async function extractText(buffer) {
  const data = await pdfParse(buffer);
  return (data.text || "")
    .replace(/\s+/g, " ")
    .trim();
}
module.exports = { extractText };