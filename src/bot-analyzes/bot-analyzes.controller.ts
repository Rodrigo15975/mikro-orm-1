import { Body, Controller, Get, Post } from '@nestjs/common'
import { BotAnalyzesService } from './bot-analyzes.service'
import { CreateBotAnalyzeDto } from './dto/create-bot-analyze.dto'

@Controller('bot-analyzes')
export class BotAnalyzesController {
  constructor(private readonly botAnalyzesService: BotAnalyzesService) {}

  @Post()
  create(@Body() createBotAnalyzeDto: CreateBotAnalyzeDto) {
    return this.botAnalyzesService.create(createBotAnalyzeDto)
  }

  @Post('evaluate')
  evaluate(@Body() createBotAnalyzeDto: { text: string }) {
    return this.botAnalyzesService.evaluate(createBotAnalyzeDto)
  }

  @Get()
  findAll() {
    return this.botAnalyzesService.findAll()
  }
}
