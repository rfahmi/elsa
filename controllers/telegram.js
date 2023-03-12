// telegramController.js

const { generateText } = require("../services/gpt");

async function ask(text) {
  const generatedText = await generateText(text);
  //   console.log(generateText);
  return generatedText;
}

module.exports = { ask };
