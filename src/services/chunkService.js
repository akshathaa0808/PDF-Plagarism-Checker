function getChunks(text = "", size = 150) {
  const cleaned = text
    .replace(/\s+/g, " ")
    .trim();

  const sentences = cleaned.split(".");
  const chunks = [];
  let current = "";
  for (let sentence of sentences) {
    sentence = sentence.trim();
    if (!sentence) continue;

    // HARD LIMIT per sentence
    const safeSentence = sentence.slice(0, 120);
    if ((current + safeSentence).length > size) {
      if (current.trim()) {
        chunks.push(current.trim());
      }
      current = safeSentence + ".";
    } else {
      current += safeSentence + ".";
    }
  }
  if (current.trim()) {
    chunks.push(current.trim());
  }
  // FINAL SAFETY LIMIT
  return chunks
    .map(c => c.slice(0, 350))
    .filter(c => c.length > 20);
}
module.exports = { getChunks };