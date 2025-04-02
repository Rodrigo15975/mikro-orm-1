import { Module } from '@nestjs/common';
import { BotAnalyzesService } from './bot-analyzes.service';
import { BotAnalyzesController } from './bot-analyzes.controller';

@Module({
  controllers: [BotAnalyzesController],
  providers: [BotAnalyzesService],
})
export class BotAnalyzesModule {}
