import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async webhook(@Body() body: any): Promise<any> {
    const { message } = body;
    if (message) {
      const text = message.text;
      const chatId = message.chat.id;
      await this.telegramService.sendMessage(chatId, text);
    }
    return { ok: true };
  }
}
