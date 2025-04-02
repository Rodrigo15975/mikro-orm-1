import { HuggingFaceInference } from '@langchain/community/llms/hf'
import { PromptTemplate } from '@langchain/core/prompts'
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateChatDto } from './dto/create-chat.dto'
import { ConversationChain } from 'langchain/chains'
import { CustomError } from 'src/common/error'
import { ChainValues } from '@langchain/core/utils/types'
@Injectable()
export class ChatService {
  private readonly model: HuggingFaceInference
  private readonly chain: ConversationChain
  private readonly logger: Logger = new Logger(ChatService.name)
  private readonly apiKey = this.configService.getOrThrow<string>(
    'HUGGINGFACE_API_KEY',
  )
  constructor(private readonly configService: ConfigService) {
    this.model = new HuggingFaceInference({
      apiKey: this.apiKey,
      // model: '"EleutherAI/gpt-neo-2.7B',
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      // model: 'tiiuae/falcon-7b-instruct',
      temperature: 0.9,
      maxTokens: 500,
    })
    this.chain = new ConversationChain({
      llm: this.model,
      prompt: PromptTemplate.fromTemplate(`
        Eres un asistente virtual altamente capacitado llamado AsisBot. Tu propósito es ayudar a los usuarios realizando tareas con máxima precisión, eficiencia y claridad.
    
        Características:
        - Respuestas exactas y basadas en hechos verificables
        - Pasos detallados y metódicos para tareas complejas
        - Claridad técnica cuando sea necesario
        - Verificación cruzada de información importante
        - Estructura lógica en tus respuestas
    
        Instrucciones:
        1. Analiza cuidadosamente la solicitud del usuario
        2. Si necesitas más información para dar una respuesta precisa, pregunta de manera específica
        3. Para tareas prácticas, proporciona pasos numerados con detalles relevantes
        4. En cálculos o datos técnicos, muestra tu proceso de razonamiento
        5. Prioriza exactitud sobre velocidad
    
        Historial de conversación:
        {history}
    
        Solicitud actual: {input}
    
        Respuesta (precisa, estructurada y completa):
      `),
    })
  }
  async predecirVentas(ventas: number[]): Promise<{
    respuesta: string
  }> {
    try {
      this.logger.debug({
        ventas,
      })
      const prompt = `Basado en las siguientes ventas: ${ventas.join(', ')}, predice las ventas para la próxima semana.`
      const respuesta = await this.model.invoke(prompt)
      this.logger.debug({
        respuesta,
      })
      return { respuesta }
    } catch (error) {
      this.logger.error(
        'Error al procesar el mensaje y predecir la venta',
        error,
      )
      throw new HttpException(
        'Error process message and predict sales',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async create(createChatDto: CreateChatDto) {
    try {
      this.logger.debug(
        `Generando la respuesta para el mensaje: ${createChatDto.user_query}`,
      )
      const { user_query } = createChatDto
      const response: ChainValues = await this.chain.call({
        input: user_query,
      })
      this.logger.debug({
        message: 'Respuesta generada',
        response,
      })
      return {
        message: response,
        status: HttpStatus.OK,
      }
    } catch (error: unknown) {
      const { message, stack, status } = CustomError(error)
      this.logger.error(`Error al generar la respuesta: ${message}`, stack)
      throw new HttpException(
        `Error process message  with bot`,
        Number(status) || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
