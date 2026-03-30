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
    // 🔥 pakai textise / reader proxy
    const api = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    const { data } = await axios.get(api, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    // ambil teks lebih bersih
    let text = $("article").text() || $("body").text();

    return text.replace(/\s+/g, " ").slice(0, 2000);

  } catch (err) {
    return "";
  }
}
