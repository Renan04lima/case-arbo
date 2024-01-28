import { UserFindByEmailRepository } from '@/domain/contracts/repos/user-repo'
import { PgUser } from '../entities/pg-user'
import { User } from '@/domain/entities/user'
import { PgConnection } from '../helpers/connection'

export class PgUserRepository implements UserFindByEmailRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    const pgUserRepo = PgConnection.getInstance().getRepository(PgUser)
    const pgUser = await pgUserRepo.findOne({ where: { email } })
    if (pgUser !== null) {
      return {
        id: pgUser.id,
        name: pgUser.name,
        email: pgUser.email,
        hashedPassword: pgUser.hashedPassword,
      }
    }
  }
}
