import { DataType, newDb } from 'pg-mem'

export const makeFakeDb = async (entities: any[]) => {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  })
  db.registerExtension('uuid-ossp', (schema) => {
    schema.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: () => 'mock-uuid',
      impure: true,
    })
  })
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'current_database',
  })
  db.public.registerFunction({
    implementation: () => 'test',
    name: 'version',
  })

  const connection = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: entities,
  })

  await connection.initialize()
  await connection.synchronize()
  return { db, connection }
}
