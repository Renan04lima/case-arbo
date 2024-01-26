import { Encrypter } from '@/domain/contracts/gateways/encrypter'
import { HashComparer } from '@/domain/contracts/gateways/hash'
import { UserFindByEmailRepository } from '@/domain/contracts/repos/user-repo'

type Params = {
  email: string
  password: string
}
type Result =
  | {
      user: {
        id: string
        email: string
      }
      token: string
    }
  | undefined

export type Authentication = (input: Params) => Promise<Result>

export type Setup = (
  userRepo: UserFindByEmailRepository,
  hashComparer: HashComparer,
  encrypter: Encrypter,
) => Authentication

export const setupAuthentication: Setup =
  (userRepo, hashComparer, encrypter) =>
  async ({ email, password }) => {
    const user = await userRepo.findByEmail(email)
    if (user === undefined) return undefined

    const isValid = await hashComparer.compare(password, user.hashedPassword)
    if (!isValid) return undefined

    const token = await encrypter.encrypt(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    }
  }
