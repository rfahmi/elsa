import { Controller, Get } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Get('ask')
  async ask(): Promise<any> {
    return await this.openaiService.ask('say hi');
  }
}
