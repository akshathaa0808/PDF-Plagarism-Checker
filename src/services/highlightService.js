function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assignColors(sources) {
  const colors = [
    "#facc15",
    "#60a5fa",
    "#34d399",
    "#f87171",
    "#a78bfa",
    "#fb923c"
  ];

  const map = {};
  sources.forEach((src, i) => {
    map[src.title || src.fileName || src.source] = colors[i % colors.length];
  });

  return map;
}

function highlightText(text, matches) {
  let result = text;

  matches.forEach(m => {
    const color = m.color || "#facc15";
    const safeChunk = escapeRegex(m.chunk);

    const regex = new RegExp(safeChunk, "g");

    result = result.replace(
      regex,
      `<span style="
        background:${color};
        padding:2px 4px;
        border-radius:4px;
      ">${m.chunk}</span>`
    );
  });

  return result;
}

module.exports = { assignColors, highlightText };