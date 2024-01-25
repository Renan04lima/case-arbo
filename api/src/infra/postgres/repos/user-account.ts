import { UserFindByEmailRepository } from '@/domain/contracts/repos/user-repo'
import { PgUser } from '../entities/pg-user'
import { Repository } from 'typeorm'
import { User } from '@/domain/entities/user'

export class PgUserRepository implements UserFindByEmailRepository {
  private readonly pgUserRepo: Repository<PgUser>

  constructor(repo: Repository<PgUser>) {
    this.pgUserRepo = repo
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const pgUser = await this.pgUserRepo.findOne({ where: { email } })
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
