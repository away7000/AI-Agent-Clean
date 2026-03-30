import axios from "axios";
import * as cheerio from "cheerio";

// 🔍 SEARCH (DuckDuckGo)
export async function search(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  const { data } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  const $ = cheerio.load(data);
  let results = [];

  $(".result__a").each((i, el) => {
    const title = $(el).text();
    const link = $(el).attr("href");

    if (title && link) {
      results.push({ title, link });
    }
  });

  return results.slice(0, 5);
}

// 🌐 READ
export async function read(url) {
  try {
    // 1️⃣ DIRECT (cepat kalau ga diblok)
    try {
      const { data } = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        timeout: 5000
      });

      let $ = cheerio.load(data);
      let text = $("article").text() || $("body").text();

      if (text && text.length > 300) {
        return clean(text);
      }
    } catch {}

    // 2️⃣ ALLORIGINS (bypass CORS)
    try {
      const proxy = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const { data } = await axios.get(proxy);

      let $ = cheerio.load(data);
      let text = $("article").text() || $("body").text();

      if (text && text.length > 300) {
        return clean(text);
      }
    } catch {}

    // 3️⃣ JINA AI READER (PALING KUAT 🔥)
    try {
      const jina = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`;
      const { data } = await axios.get(jina);

      if (data && data.length > 300) {
        return clean(data);
      }
    } catch {}

    // 4️⃣ FALLBACK PARAH
    return "⚠️ Konten tidak bisa diambil (site terlalu protected)";

  } catch {
    return "⚠️ Error ambil konten";
  }
}

// helper
function clean(text) {
  return text.replace(/\s+/g, " ").slice(0, 2000);
}
