const axios = require("axios");

async function fetchPageText(url) {
  try {
    const res = await axios.get(
      `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`,
      { timeout: 15000 }
    );

    return res.data || "";
  } catch (err) {
    return "";
  }
}

module.exports = { fetchPageText };