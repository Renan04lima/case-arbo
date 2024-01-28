import { LoginController } from '@/application/controllers'
import { setupAuthentication } from '@/domain/use-cases/authentication'
import { BcryptAdapter } from '@/infra/gateways/bcrypt-adapter'
import { JwtAdapter } from '@/infra/gateways/jwt-adapter'
import { PgUserRepository } from '@/infra/postgres/repos'
import { env } from '../config/env'

export const makeLoginController = (): LoginController => {
  return new LoginController(
    setupAuthentication(
      new PgUserRepository(),
      new BcryptAdapter(12),
      new JwtAdapter(env.jwtSecret),
    ),
  )
}
