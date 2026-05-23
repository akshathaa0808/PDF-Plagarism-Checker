const axios = require("axios");
const duckduckgo = require("duck-duck-scrape");
const cache = new Map();
async function searchWeb(query) {
     console.log("TAVILY CALL:", query.slice(0, 60));
  try {
    const cleaned = query.trim().slice(0, 200);
    if (cache.has(cleaned)) {
      console.log("⚡ Cache hit:", cleaned);
      return cache.get(cleaned);
    }
    const key = process.env.TAVILY_API_KEY;
    let results = [];
    if (key) {
      try {
        const res = await axios.post("https://api.tavily.com/search", {
          api_key: key,
          query: cleaned,
          search_depth: "basic",
          max_results: 5
        });
        results = (res.data?.results || []).map(r => ({
          title: r.title,
          url: r.url,
          snippet: r.content || ""
        }));
      } catch (err) {
        console.log("Tavily failed, using fallback");
      }
    }
    if (results.length === 0) {
      const duckduckgo = require("duck-duck-scrape");
      const ddg = await duckduckgo.search(cleaned);

      results = ddg.results.slice(0, 5).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.description || ""
      }));
    }
    cache.set(cleaned, results);
    return results;
  } catch (err) {
    console.error("Search error:", err.message);
    return [];
  }
}

module.exports = { searchWeb };

module.exports = { searchWeb };