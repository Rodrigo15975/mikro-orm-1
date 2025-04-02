import { Module } from '@nestjs/common'
import { ChatModule } from './chat/chat.module'
import { ConfigModule } from '@nestjs/config'
import { BotAnalyzesModule } from './bot-analyzes/bot-analyzes.module'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import mikroOrmConfig from './mikro-orm.config'

@Module({
  imports: [
    MikroOrmModule.forRoot({ ...mikroOrmConfig, autoLoadEntities: true }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ChatModule,
    BotAnalyzesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
