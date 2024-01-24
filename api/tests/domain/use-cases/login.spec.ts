import { MockProxy, mock } from 'jest-mock-extended'
import { before } from 'node:test'

type User = {
  id: string
  name: string
  email: string
  hashedPassword: string
}

interface UserFindByEmailRepository {
  findByEmail: (email: string) => Promise<User | undefined>
}

interface HashComparer {
  compare: (plaintext: string, digest: string) => Promise<boolean>
}

interface Encrypter {
  encrypt: (plaintext: string) => Promise<string>
}

namespace LoginUseCase {
  export type Params = {
    email: string
    password: string
  }
}

class LoginUseCase {
  constructor(
    private readonly userRepo: UserFindByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ email, password }: LoginUseCase.Params): Promise<undefined> {
    const user = await this.userRepo.findByEmail(email)
    if (user === undefined) return undefined

    const isValid = await this.hashComparer.compare(
      password,
      user.hashedPassword,
    )
    if (!isValid) return undefined

    await this.encrypter.encrypt(user.id)
  }
}

describe('Login UseCase', () => {
  let userRepo: MockProxy<UserFindByEmailRepository>
  let hashComparer: MockProxy<HashComparer>
  let encrypter: MockProxy<Encrypter>
  let sut: LoginUseCase

  beforeAll(() => {
    userRepo = mock()
    hashComparer = mock()
    encrypter = mock()
    userRepo.findByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      hashedPassword: 'hashed_password',
    })
    hashComparer.compare.mockResolvedValue(true)
  })

  beforeEach(() => {
    sut = new LoginUseCase(userRepo, hashComparer, encrypter)
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

  it('should call HashComparer with correct params', async () => {
    await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(hashComparer.compare).toHaveBeenCalledWith(
      'any_password',
      'hashed_password',
    )
    expect(hashComparer.compare).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if password is incorrect', async () => {
    hashComparer.compare.mockResolvedValueOnce(false)

    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    })

    expect(result).toBeUndefined()
  })

  it('should call Encrypter with correct plaintext', async () => {
    await sut.execute({ email: 'any_email', password: 'any_password' })

    expect(encrypter.encrypt).toHaveBeenCalledWith('any_id')
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })

  it.todo('should return an user and token on success')
})
