import { Body, Controller, Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto)
  }
  @Post('/predict')
  predict(@Body() createChatDto: { ventas: number[] }) {
    return this.chatService.predecirVentas(createChatDto.ventas)
  }
}
