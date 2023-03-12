const TelegramBot = require("node-telegram-bot-api");
const { generateText } = require("../services/gpt");
require("dotenv").config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

async function sendMessage(text, chatId) {
  const generatedText = await generateText(text);
  bot.sendMessage(chatId, generatedText);
}

module.exports = { sendMessage };
