const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_MODEL = process.env.GPT_MODEL;
const GPT_TEMPERATURE = process.env.GPT_TEMPERATURE;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function generateText(prompt) {
  try {
    const completion = await openai.createChatCompletion({
      model: GPT_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: Number(GPT_TEMPERATURE),
    });

    return completion.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

module.exports = { generateText };
