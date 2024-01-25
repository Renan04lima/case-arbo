import { JwtAdapter } from '@/infra/gateways/jwt-adapter'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('JwtAdapter', () => {
  let sut: JwtAdapter
  let fakeJwt: jest.Mocked<typeof jwt>
  let secret: string

  beforeAll(() => {
    secret = 'any_secret'
    fakeJwt = jwt as jest.Mocked<typeof jwt>
  })

  beforeEach(() => {
    sut = new JwtAdapter(secret)
  })

  describe('encrypt', () => {
    let key: string
    let token: string

    beforeAll(() => {
      key = 'any_key'
      token = 'any_token'
      fakeJwt.sign.mockImplementation(() => token)
    })

    it('should call sign with correct input', async () => {
      await sut.encrypt(key)

      expect(fakeJwt.sign).toHaveBeenCalledWith({ id: key }, secret)
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1)
    })

    it('should return a token', async () => {
      const encryptdToken = await sut.encrypt(key)

      expect(encryptdToken).toBe(token)
    })

    it('should rethrow if sign throws', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error')
      })

      const promise = sut.encrypt(key)

      await expect(promise).rejects.toThrow(new Error('token_error'))
    })
  })
})
