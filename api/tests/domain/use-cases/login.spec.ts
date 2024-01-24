import { mock } from 'jest-mock-extended'

interface UserFindByEmailRepository {
  findByEmail: (email: string) => Promise<void>
}

namespace LoginUseCase {
  export type Params = {
    email: string
    password: string
  }
}

class LoginUseCase {
  constructor(private readonly userRepo: UserFindByEmailRepository) {}

  async execute({ email }: LoginUseCase.Params): Promise<void> {
    await this.userRepo.findByEmail(email)
  }
}

describe('Login UseCase', () => {
  it('should call UserFindByEmailRepository with correct email', async () => {
    const userRepo = mock<UserFindByEmailRepository>()
    const sut = new LoginUseCase(userRepo)

    await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(userRepo.findByEmail).toHaveBeenCalledWith('any_email')
    expect(userRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it.todo('should return null if user is not found')

  it.todo('should call HashComparer with correct plaintext')

  it.todo('should return null if password is incorrect')

  it.todo('should call Encrypter with correct params')

  it.todo('should return an user and token on success')
})
