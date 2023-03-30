import { Module } from '@nestjs/common';
import { OpenaiService } from 'src/openai/openai.service';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';

@Module({
  controllers: [TelegramController],
  providers: [TelegramService, OpenaiService],
})
export class TelegramModule {}
