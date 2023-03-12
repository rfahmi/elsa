const TelegramBot = require("node-telegram-bot-api");
const { generateText } = require("../services/gpt");
require("dotenv").config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const BASE_URL = process.env.BASE_URL;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
bot.setWebHook(`${BASE_URL}/bot`);

async function sendMessage(text, chatId) {
  const generatedText = await generateText(text);
  bot.sendMessage(chatId, generatedText);
}

module.exports = { sendMessage };
