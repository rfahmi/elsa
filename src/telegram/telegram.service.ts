import { Injectable } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  constructor(private readonly openaiService: OpenaiService) {}

  private bot = new Telegraf(process.env.TELEGRAM_TOKEN);

  async sendMessage(chatId: number, message: string): Promise<void> {
    const response = await this.openaiService
      .ask(message)
      .catch((e) => e.getMessage());
    await this.bot.telegram.sendMessage(chatId, response);
  }
}
