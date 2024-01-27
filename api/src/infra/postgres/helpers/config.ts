import { env } from '@/main/config/env'
import { DataSourceOptions } from 'typeorm'

export const config: DataSourceOptions = {
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: ['dist/infra/postgres/entities/index.js'],
}
