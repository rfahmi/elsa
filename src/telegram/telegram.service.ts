import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { Telegraf } from 'telegraf';
import { clean } from 'utils/text';

@Injectable()
export class TelegramService {
  constructor(private readonly openaiService: OpenaiService) {}

  private bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  async sendMessage(chatId: number, message: string): Promise<void> {
    const response = await this.openaiService
      .ask(message)
      .catch((e) => e.message);

    if (Array.isArray(response)) {
      response.forEach(async (e) => {
        await this.bot.telegram.sendPhoto(chatId, e.url);
      });
    } else {
      await this.bot.telegram.sendMessage(chatId, clean(response), {
        parse_mode: 'MarkdownV2',
      });
    }
  }
}
