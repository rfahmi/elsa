// telegramController.js

const { generateText } = require("../services/gpt");

async function ask(text) {
  const generatedText = await generateText(text);
  return generatedText;
}

module.exports = { ask };
