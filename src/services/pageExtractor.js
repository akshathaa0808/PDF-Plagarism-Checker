const axios = require("axios");
const cheerio = require("cheerio");
async function extractPageText(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 8000,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });
    const $ = cheerio.load(data);
    // remove junk
    $("script, style, nav, footer, iframe").remove();

    const text = $("body").text();
    return text.replace(/\s+/g, " ").trim();

  } catch (err) {
    return "";
  }
}
module.exports = { extractPageText };