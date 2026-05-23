function wordSet(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
}
function jaccard(a, b) {
  const A = wordSet(a);
  const B = wordSet(b);
  const intersection = [...A].filter(x => B.has(x)).length;
  const union = new Set([...A, ...B]).size;

  return union === 0 ? 0 : (intersection / union) * 100;
}

function similarity(a, b) {
  const wordSim = jaccard(a, b);
  // sentence overlap boost
  const sentA = a.split(" ");
  const sentB = b.split(" ");
  let match = 0;
  for (let w of sentA) {
    if (sentB.includes(w)) match++;
  }
  const sentenceSim =
    sentA.length === 0 ? 0 : (match / sentA.length) * 100;
  return 0.6 * wordSim + 0.4 * sentenceSim;
}
module.exports = { similarity };