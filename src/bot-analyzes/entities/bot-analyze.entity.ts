import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { v4 } from 'uuid'

@Entity({
  tableName: 'bot_analyze',
})
export class BotAnalyze {
  @PrimaryKey({
    type: 'uuid',
    index: true,
    unique: true,
    defaultRaw: 'gen_random_uuid()',
  })
  uuid: string

  @Property({
    type: 'text',
  })
  encuesta!: string

  @Property()
  createdAt?: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt?: Date = new Date()

  constructor(encuesta: string) {
    this.encuesta = encuesta.toLowerCase()
  }
}
