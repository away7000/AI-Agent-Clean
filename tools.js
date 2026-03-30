import axios from "axios";
import * as cheerio from "cheerio";

export async function search(query) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  const { data } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const $ = cheerio.load(data);
  let results = [];

  $("h3").each((i, el) => {
    const title = $(el).text();
    const link = $(el).parent().attr("href");
    if (title && link) results.push({ title, link });
  });

  return results.slice(0, 5);
}

export async function read(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $("body").text().slice(0, 2000);
}