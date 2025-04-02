import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common'
import { BotAnalyzesService } from './bot-analyzes.service'
import { CreateBotAnalyzeDto } from './dto/create-bot-analyze.dto'
import { UpdateBotAnalyzeDto } from './dto/update-bot-analyze.dto'

@Controller('bot-analyzes')
export class BotAnalyzesController {
  constructor(private readonly botAnalyzesService: BotAnalyzesService) {}

  @Post()
  create(@Body() createBotAnalyzeDto: CreateBotAnalyzeDto) {
    return this.botAnalyzesService.create(createBotAnalyzeDto)
  }

  @Get()
  findAll() {
    return this.botAnalyzesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botAnalyzesService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBotAnalyzeDto: UpdateBotAnalyzeDto,
  ) {
    return this.botAnalyzesService.update(+id, updateBotAnalyzeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botAnalyzesService.remove(+id)
  }
}
