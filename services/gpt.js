const { OpenAIApi } = require("openai");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_MODEL = process.env.GPT_MODEL;
const GPT_TEMPERATURE = process.env.GPT_TEMPERATURE;

const openai = new OpenAIApi(OPENAI_API_KEY, {
  headers: {
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  },
});

async function generateText(prompt) {
  const completion = await openai.createCompletion({
    model: GPT_MODEL,
    prompt,
    maxTokens: 100,
    temperature: GPT_TEMPERATURE,
    n: 1,
    stop: "\n",
  });

  return completion.data.choices[0].text;
}

module.exports = { generateText };
