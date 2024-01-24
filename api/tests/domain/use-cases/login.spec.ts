import { MockProxy, mock } from 'jest-mock-extended'

interface UserFindByEmailRepository {
  findByEmail: (email: string) => Promise<undefined>
}

namespace LoginUseCase {
  export type Params = {
    email: string
    password: string
  }
}

class LoginUseCase {
  constructor(private readonly userRepo: UserFindByEmailRepository) {}

  async execute({ email }: LoginUseCase.Params): Promise<undefined> {
    await this.userRepo.findByEmail(email)
    return undefined
  }
}

describe('Login UseCase', () => {
    let userRepo: MockProxy<UserFindByEmailRepository>
    let sut: LoginUseCase

    beforeEach(()=>{
        userRepo = mock()
        sut = new LoginUseCase(userRepo)
    })

  it('should call UserFindByEmailRepository with correct email', async () => {
    await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(userRepo.findByEmail).toHaveBeenCalledWith('any_email')
    expect(userRepo.findByEmail).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if user is not found', async () => {
    userRepo.findByEmail.mockResolvedValueOnce(undefined)

    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    })

    expect(result).toBeUndefined()
  })

  it.todo('should call HashComparer with correct plaintext')

  it.todo('should return null if password is incorrect')

  it.todo('should call Encrypter with correct params')

  it.todo('should return an user and token on success')
})
