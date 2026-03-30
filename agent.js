import { search, read } from "./tools.js";
import { smartSummary } from "./utils.js";
import { getMemory, updateMemory } from "./memory.js";

function detectIntent(input) {
  const t = input.toLowerCase();
  if (t.includes("http")) return "read";
  if (t.includes("cari") || t.includes("search")) return "search";
  if (t.includes("jelasin") || t.includes("apa")) return "research";
  return "chat";
}

export async function handleAI(userId, input) {
  const mem = getMemory(userId);
  const intent = detectIntent(input);

  let result = "";

  try {
    if (intent === "search") {
      const data = await search(input);
      result = data.map((x, i) => `${i + 1}. ${x.title}`).join("\n");
    } else if (intent === "read") {
      const data = await read(input);
      result = smartSummary(data);
    } else if (intent === "research") {
      const data = await search(input);
      let summary = "";

      for (let item of data.slice(0, 2)) {
        const content = await read(item.link);
        summary += smartSummary(content) + "\n\n";
      }

      result = `📊 Hasil riset:\n\n${summary}`;
    } else {
      result = mem.lastQuery
        ? `Lu sebelumnya nanya: "${mem.lastQuery}"\nSekarang: "${input}"`
        : "Tanya aja apa pun, gw bisa cari info 🌐";
    }

    updateMemory(userId, input, result);
    return result;

  } catch (err) {
    return "⚠️ Error ambil data";
  }
}