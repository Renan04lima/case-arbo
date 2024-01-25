import { Encrypter } from '@/domain/contracts/gateways/encrypter'
import { HashComparer } from '@/domain/contracts/gateways/hash'
import { UserFindByEmailRepository } from '@/domain/contracts/repos/user-repo'

export namespace LoginUseCase {
  export type Params = {
    email: string
    password: string
  }

  export type Result =
    | {
        user: {
          id: string
          email: string
        }
        token: string
      }
    | undefined
}

export class LoginUseCase {
  constructor(
    private readonly userRepo: UserFindByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: LoginUseCase.Params): Promise<LoginUseCase.Result> {
    const user = await this.userRepo.findByEmail(email)
    if (user === undefined) return undefined

    const isValid = await this.hashComparer.compare(
      password,
      user.hashedPassword,
    )
    if (!isValid) return undefined

    const token = await this.encrypter.encrypt(user.id)

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token,
    }
  }
}
