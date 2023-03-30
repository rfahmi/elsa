import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { contexts } from '../../config/action_context';

@Injectable()
export class OpenaiService {
  private readonly GPT_TEMPERATURE = process.env.GPT_TEMPERATURE;
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  private openai;

  constructor() {
    const configuration = new Configuration({
      apiKey: this.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async ask(prompt: string): Promise<string> {
    try {
      let response = 'NO_RESPONSE';
      const context = await this.findContext(prompt);
      switch (context) {
        case 'CODING':
          response = await this.textCompletion(prompt, 'text-davinci-003');
          break;
        case 'SMARTHOME_CONTROL':
          response = 'TODO: integrate with tuya';
          break;
        case 'IMAGE_GENERATION':
          response = await this.createImage(prompt);
          break;
        default:
          response = await this.chatCompletion(prompt, 'gpt-3.5-turbo');
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

  async chatCompletion(prompt: string, model: string): Promise<string> {
    const completion = await this.openai.createChatCompletion({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: Number(this.GPT_TEMPERATURE),
    });

    return completion.data.choices[0].message.content;
  }

  async textCompletion(prompt: string, model: string): Promise<string> {
    const completion = await this.openai.createCompletion({
      model: model,
      prompt: prompt,
      max_tokens: 3000,
      temperature: Number(this.GPT_TEMPERATURE),
    });
    return completion.data.choices[0].text;
  }

  async createImage(prompt: string): Promise<string> {
    const completion = await this.openai.createImage({
      prompt,
      n: 1,
      size: '512x512',
    });
    return completion.data.data;
  }

  async findContext(prompt: string): Promise<string> {
    const sentenceList = contexts.map((x) => x.text);

    const [inputEmbedding, embeddings] = await Promise.all([
      this.openai.createEmbedding({
        input: prompt,
        model: 'text-embedding-ada-002',
      }),
      this.openai.createEmbedding({
        input: sentenceList,
        model: 'text-embedding-ada-002',
      }),
    ]);

    const similarities = [];
    for (const e of embeddings.data.data) {
      similarities.push(
        this.cosineSimilarity(
          e.embedding,
          inputEmbedding.data.data[0].embedding,
        ),
      );
    }

    const maxSimilarity = Math.max(...similarities);
    if (maxSimilarity >= 0.8) {
      const index = similarities.indexOf(maxSimilarity);
      console.warn(
        `similarity is ${maxSimilarity}, return ${contexts[index].id}`,
      );
      return contexts[index].id;
    } else {
      console.warn(`similarity is ${maxSimilarity}, return OTHER`);
      return 'OTHER';
    }
  }

  cosineSimilarity(a: Array<any>, b: Array<any>): number {
    // console.log(a, b);
    const dotProduct = a.reduce((acc, val, i) => {
      return acc + val * b[i];
    }, 0);

    const normA = Math.sqrt(
      a.reduce((acc, val) => {
        return acc + val * val;
      }, 0),
    );

    const normB = Math.sqrt(
      b.reduce((acc, val) => {
        return acc + val * val;
      }, 0),
    );

    return dotProduct / (normA * normB);
  }
}
