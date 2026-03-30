const memory = new Map();

export function getMemory(userId) {
  if (!memory.has(userId)) {
    memory.set(userId, { history: [], lastQuery: null });
  }
  return memory.get(userId);
}

export function updateMemory(userId, input, output) {
  const mem = getMemory(userId);
  mem.history.push({ input, output });
  if (mem.history.length > 6) mem.history.shift();
  mem.lastQuery = input;
}