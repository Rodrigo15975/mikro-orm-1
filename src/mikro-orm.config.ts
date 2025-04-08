import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql'
import * as dotenv from 'dotenv'
import { Logger } from '@nestjs/common'
dotenv.config()
const logger = new Logger('MikroORM')
logger.debug('Loading MikroORM configuration...')
export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  dbName: 'neondb',
  forceUtcTimezone: true,
  debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
  },
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      ssl: true,
    },
    ssl: {
      rejectUnauthorized: false,
      sslmode: 'require',
    },
  },
})
