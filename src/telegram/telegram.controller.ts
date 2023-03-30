import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post('webhook')
  async webhook(@Body() body: any): Promise<any> {
    const { message } = body;
    if (message && message.text === 'a') {
      const chatId = message.chat.id;
      const reply = 'b';
      await this.telegramService.sendMessage(chatId, reply);
    }
    return { ok: true };
  }
}
