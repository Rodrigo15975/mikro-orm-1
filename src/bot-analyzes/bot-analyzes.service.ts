import { HfInference } from '@huggingface/inference'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateBotAnalyzeDto } from './dto/create-bot-analyze.dto'
import { BotAnalyze } from './entities/bot-analyze.entity'
@Injectable()
export class BotAnalyzesService {
  private readonly model: HfInference = new HfInference(
    process.env.HUGGINGFACE_API_KEY,
  )

  constructor(private readonly em: EntityManager) {}
  async create(createBotAnalyzeDto: CreateBotAnalyzeDto) {
    const output = await this.model.zeroShotClassification({
      inputs: createBotAnalyzeDto.encuesta,
      model: 'facebook/bart-large-mnli',
      parameters: {
        candidate_labels: [
          'Ingeniería Civil',
          'Medicina',
          'Arte',
          'Ingeniería de Software',
          'Arquitectura',
        ],
      },
    })
    const maxScoreIndex = output[0].scores.indexOf(
      Math.max(...output[0].scores),
    )
    const recommendedCareer = output[0].labels[maxScoreIndex]

    const newEncuesta = this.em.create(BotAnalyze, {
      encuesta: createBotAnalyzeDto.encuesta,
    })

    await this.em.persistAndFlush(newEncuesta)

    return { recommendedCareer, output }
  }

  async findAll() {
    return await this.em.findAll(BotAnalyze.name, {
      cache: true,
      orderBy: [
        {
          encuesta: 'ASC',
        },
      ],
    })
  }
}
