import { ConnectionNotFoundError } from '@/infra/postgres/helpers/errors'
import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm'
import { config } from './config'

export class PgConnection {
  private static instance?: PgConnection
  private datasource?: DataSource
  private constructor () {}

  static getInstance (): PgConnection {
    if (PgConnection.instance === undefined) PgConnection.instance = new PgConnection()
    return PgConnection.instance
  }

  async connect (): Promise<DataSource> {
    this.datasource = new DataSource(config)
    return await this.datasource.initialize()
  }

  setFakeDb (connection: any): void {
    this.datasource = connection
  }

  async disconnect (): Promise<void> {
    if (!this.datasource?.isInitialized) throw new ConnectionNotFoundError()
    await this.datasource.destroy()
    this.datasource = undefined
  }

  getRepository<Entity extends ObjectLiteral> (entity: ObjectType<Entity>): Repository<Entity> {
    if (!this.datasource?.isInitialized) throw new ConnectionNotFoundError()
    return this.datasource.getRepository(entity)
  }
}