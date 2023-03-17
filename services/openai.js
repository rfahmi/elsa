const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const { sentences } = require("../configs/action_context");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_TEMPERATURE = process.env.GPT_TEMPERATURE;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function ask(prompt) {
  try {
    let response = "NO_RESPONSE";
    const context = await findContext(prompt);
    switch (context) {
      case "CODING":
        response = await textCompletion(prompt, "text-davinci-003");
        break;
      case "SMARTHOME_CONTROL":
        response = "TODO: integrate with tuya";
        break;
      case "IMAGE_GENERATION":
        response = await createImage(prompt);
        break;
      default:
        response = await chatCompletion(prompt, "gpt-3.5-turbo");
        break;
    }
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data.message;
    } else {
      return error.message;
    }
  }
}

async function chatCompletion(prompt, model) {
  const completion = await openai.createChatCompletion({
    model: model,
    messages: [{ role: "user", content: prompt }],
    temperature: Number(GPT_TEMPERATURE),
  });

  return completion.data.choices[0].message.content;
}

async function textCompletion(prompt, model) {
  const completion = await openai.createCompletion({
    model: model,
    prompt: prompt,
    max_tokens: 3000,
    temperature: Number(GPT_TEMPERATURE),
  });
  console.info(completion.data.choices);
  return completion.data.choices[0].text;
}

async function createImage(prompt) {
  const completion = await openai.createImage({
    prompt,
    n: 2,
    size: "512x512",
  });
  return completion.data.data;
}

async function findContext(prompt) {
  const inputEmbedding = await openai.createEmbedding({
    input: prompt,
    model: "text-embedding-ada-002",
  });
  const embeddings = await Promise.all(
    sentences.map(async (sentence) => {
      return await openai.createEmbedding({
        input: sentence.text,
        model: "text-embedding-ada-002",
      });
    })
  );

  const similarities = embeddings.map((embedding) => {
    // console.log();
    return cosineSimilarity(
      embedding.data.data[0].embedding,
      inputEmbedding.data.data[0].embedding
    );
  });

  console.log(similarities);

  const maxSimilarity = Math.max(...similarities);
  if (maxSimilarity >= 0.8) {
    const index = similarities.indexOf(maxSimilarity);
    console.warn(
      `similarity is ${maxSimilarity}, return ${sentences[index].id}`
    );
    return sentences[index].id;
  } else {
    console.warn(`similarity is ${maxSimilarity}, return OTHER`);
    return "OTHER";
  }
}

function cosineSimilarity(a, b) {
  // console.log(a, b);
  const dotProduct = a.reduce((acc, val, i) => {
    return acc + val * b[i];
  }, 0);

  const normA = Math.sqrt(
    a.reduce((acc, val) => {
      return acc + val * val;
    }, 0)
  );

  const normB = Math.sqrt(
    b.reduce((acc, val) => {
      return acc + val * val;
    }, 0)
  );

  return dotProduct / (normA * normB);
}

module.exports = { ask, findContext };
