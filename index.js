import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { handleAI } from "./agent.js";

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("🚀 AI Agent aktif (clean version)");
});

bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  const msg = await ctx.reply("⏳ Processing...");
  const res = await handleAI(userId, text);

  ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, res);
});

bot.launch();
console.log("Bot jalan 🚀");