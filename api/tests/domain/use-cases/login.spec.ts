import { MockProxy, mock } from 'jest-mock-extended'
import { Encrypter } from '@/domain/contracts/gateways/encrypter'
import { HashComparer } from '@/domain/contracts/gateways/hash'
import { UserFindByEmailRepository } from '@/domain/contracts/repos/user-repo'
import { User } from '@/domain/entities/user'
import { LoginUseCase } from '@/domain/use-cases/login'

describe('Login UseCase', () => {
  let userRepo: MockProxy<UserFindByEmailRepository>
  let hashComparer: MockProxy<HashComparer>
  let encrypter: MockProxy<Encrypter>
  let sut: LoginUseCase
  let fakeUser: User

  beforeAll(() => {
    fakeUser = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      hashedPassword: 'hashed_password',
    }
    userRepo = mock()
    hashComparer = mock()
    encrypter = mock()
    userRepo.findByEmail.mockResolvedValue(fakeUser)
    hashComparer.compare.mockResolvedValue(true)
    encrypter.encrypt.mockResolvedValue('any_token')
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

    expect(encrypter.encrypt).toHaveBeenCalledWith(fakeUser.id)
    expect(encrypter.encrypt).toHaveBeenCalledTimes(1)
  })

  it('should return an user and token on success', async () => {
    const result = await sut.execute({
      email: 'any_email',
      password: 'any_password',
    })

    expect(result).toEqual({
      user: {
        id: fakeUser.id,
        email: fakeUser.email,
      },
      token: 'any_token',
    })
  })
})
