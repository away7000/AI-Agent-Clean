export function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

export function smartSummary(text) {
  const sentences = clean(text).split(". ");
  return sentences.slice(0, 5).join(". ") + "...";
}