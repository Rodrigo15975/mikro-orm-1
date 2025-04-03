import { HfInference } from '@huggingface/inference'
import { EntityManager } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { CreateBotAnalyzeDto } from './dto/create-bot-analyze.dto'
import { BotAnalyze } from './entities/bot-analyze.entity'
import { HuggingFaceInference } from '@langchain/community/llms/hf'
import { ConversationChain } from 'langchain/chains'
import { PromptTemplate } from '@langchain/core/prompts'
import { ChainValues } from '@langchain/core/utils/types'

const promptTemplate = PromptTemplate.fromTemplate(`
  El usuario dijo: "{text}".
  El sentimiento detectado es: {sentiment}.
  ¿Cómo podrías responder a esta situación de forma empática y útil?
`)

@Injectable()
export class BotAnalyzesService {
  private readonly sentimentModel: HfInference = new HfInference(
    process.env.HUGGINGFACE_API_KEY,
  )

  private readonly chatModel: HuggingFaceInference = new HuggingFaceInference({
    apiKey: process.env.HUGGINGFACE_API_KEY,
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    temperature: 0.8,
    maxTokens: 200,
  })
  private readonly chain: ConversationChain = new ConversationChain({
    llm: this.chatModel,
    prompt: promptTemplate,
  })

  constructor(private readonly em: EntityManager) {}

  async evaluate({ text }: { text: string }) {
    // 1️⃣ Analizar sentimiento con Hugging Face
    const sentimentResult = await this.sentimentModel.textClassification({
      model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      inputs: text,
    })

    // Obtener el sentimiento dominante
    const sortedResults = sentimentResult.sort((a, b) => b.score - a.score)
    const sentiment = sortedResults[0].label // 'negative', 'neutral', 'positive'

    // Combina el texto y el sentimiento en una sola entrada
    const combinedInput = `${text} Sentimiento: ${sentiment}`

    // 2️⃣ Generar respuesta con Mixtral-8x7B
    const response: ChainValues = await this.chain.call({
      input: combinedInput, // Usa un solo valor de entrada
    })

    return {
      text,
      sentiment,
      response,
    }
  }

  async create(createBotAnalyzeDto: CreateBotAnalyzeDto) {
    const output = await this.sentimentModel.zeroShotClassification({
      inputs: createBotAnalyzeDto.encuesta,
      model: 'facebook/bart-large-mnli',
      parameters: {
        candidate_labels: [
          'Ingeniería Civil',
          'Medicina',
          'Ingeniería de Software',
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
