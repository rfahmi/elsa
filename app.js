const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const { clean } = require("./utils/text");
require("dotenv").config();

const app = express();
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 3000;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });

const webhookPath = `/telegram/bot`;

app.use(bodyParser.json());

// Import controller
const { ask } = require("./controllers/telegram");

app.get("/", async (req, res) => {
  console.info("Project root called");
  res.send("E.L.S.A. at yout service");
});

app.post(webhookPath, async (req, res) => {
  const { message } = req.body;

  if (message) {
    const {
      text,
      chat: { id },
    } = message;

    // Call service to generate text using GPT
    const generatedText = await ask(text);

    // Send the generated text to user on Telegram
    try {
      bot.sendMessage(id, clean(generatedText), { parse_mode: "MarkdownV2" });
    } catch (e) {
      console.error(e);
      bot.sendMessage(id, "Internal Server Error: " + e.getMessage());
    }

    // Send 200 OK to Telegram
    res.status(200).send("OK");
  } else {
    // Send 400 Bad Request if no message received
    res.status(400).send("Bad Request");
  }
});

app.listen(PORT, () => {
  // Set URL webhook
  bot.setWebHook(`${BASE_URL}${webhookPath}`);
  console.info(`telegram bot webhook set to ${BASE_URL}${webhookPath}`);
  console.info(`Server running on port ${PORT}`);
});
