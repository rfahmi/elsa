import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { OpenaiModule } from './openai/openai.module';
@Module({
  imports: [TelegramModule, OpenaiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
