import { ServerError, UnauthorizedError } from '@/application/errors/http'
import { LoginController } from '@/application/controllers/login'

describe('LoginController', () => {
  let sut: LoginController
  let auth: jest.Mock

  beforeEach(() => {
    auth = jest.fn()
    sut = new LoginController(auth)

    auth.mockResolvedValue({
      user: { id: 'user_id', email: 'user_email' },
      token: 'token_value',
    })
  })

  it('should call Authentication with correct params', async () => {
    await sut.handle({ email: 'any_email@email.com', password: 'any_password' })

    expect(auth).toHaveBeenCalledWith({
      email: 'any_email@email.com',
      password: 'any_password',
    })
    expect(auth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if invalid credentials are provided', async () => {
    auth.mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle({
      email: 'any_email@email.com',
      password: 'any_password',
    })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    })
  })

  it('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({
      email: 'any_email@email.com',
      password: 'any_password',
    })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        token: 'token_value',
        user: {
          email: 'user_email',
          id: 'user_id',
        },
      },
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('infra_error')
    auth.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({
      email: 'any_email@email.com',
      password: 'any_password',
    })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    })
  })
})
