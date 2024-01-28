import { UnauthorizedError } from '@/application/errors/http'
import { BcryptAdapter } from '@/infra/gateways/bcrypt-adapter'
import { PgUser } from '@/infra/postgres/entities'
import { PgConnection } from '@/infra/postgres/helpers/connection'
import { app } from '@/main/config/app'
import { makeFakeDb } from '@/tests/infra/postgres/mocks/connection'

import { IBackup, IMemoryDb } from 'pg-mem'
import request from 'supertest'
import { Repository } from 'typeorm'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let db: IMemoryDb
    let backup: IBackup
    let pgUserRepo: Repository<PgUser>
    let hasher: BcryptAdapter

    beforeAll(async () => {
      db = await makeFakeDb([PgUser])

      backup = db.backup()
      pgUserRepo = PgConnection.getInstance().getRepository(PgUser)
      hasher = new BcryptAdapter(12)
    })

    afterAll(async () => {
      await PgConnection.getInstance().disconnect()
    })

    beforeEach(() => {
      backup.restore()
    })

    it('should return 200 with AccessToken', async () => {
      const hashedPassword = await hasher.hash('password')
      await pgUserRepo.save({
        name: 'any_name',
        email: 'email@email.com',
        hashedPassword,
      })

      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email: 'email@email.com', password: 'password' })

      expect(status).toBe(200)
      expect(body).toMatchObject({
        user: {
          id: 'mock-uuid',
          email: 'email@email.com',
        },
      })
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email: 'email@email.com', password: 'password' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
