function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/* build term frequency */
function getTF(words) {
  const tf = {};
  for (let w of words) {
    tf[w] = (tf[w] || 0) + 1;
  }
  return tf;
}

/* cosine similarity */
function cosineSimilarity(textA, textB) {
  const wordsA = tokenize(textA);
  const wordsB = tokenize(textB);

  const tfA = getTF(wordsA);
  const tfB = getTF(wordsB);

  const allWords = new Set([...wordsA, ...wordsB]);

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let w of allWords) {
    const a = tfA[w] || 0;
    const b = tfB[w] || 0;

    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;

  return (dot / (Math.sqrt(magA) * Math.sqrt(magB))) * 100;
}

module.exports = { cosineSimilarity };