import { PgUserRepository } from '@/infra/postgres/repos'
import { PgUser } from '@/infra/postgres/entities'

import { IBackup, IMemoryDb } from 'pg-mem'
import { Repository } from 'typeorm'
import { makeFakeDb } from '../mocks/connection'

describe('UserRepo', () => {
  let db: IMemoryDb
  let sut: PgUserRepository
  let connection: any
  let pgUserRepo: Repository<PgUser>
  let backup: IBackup

  beforeAll(async () => {
    ;({ db, connection } = await makeFakeDb([PgUser]))
    backup = db.backup()

    pgUserRepo = connection.getRepository(PgUser)
  })

  beforeEach(() => {
    backup.restore()
    sut = new PgUserRepository(pgUserRepo)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should return an account if email exists', async () => {
    await pgUserRepo.save({
      name: 'any_name',
      email: 'any_email',
      hashedPassword: 'any_hashed_password',
    })

    const account = await sut.findByEmail('any_email')

    expect(account).toEqual({
      id: 'mock-uuid',
      name: 'any_name',
      email: 'any_email',
      hashedPassword: 'any_hashed_password',
    })
  })

  it('should return undefined if email not exists', async () => {
    const account = await sut.findByEmail('any_email')

    expect(account).toBeUndefined()
  })
})
