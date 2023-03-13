const openai = require("../services/openai");

async function ask(text) {
  const response = await openai.ask(text);
  return response;
}

module.exports = { ask };
