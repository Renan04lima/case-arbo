import { AuthenticationError } from "@/domain/entities/errors/authentication"
import { ServerError, UnauthorizedError } from "@/application/errors/http"
import { LoginController } from "@/application/controllers/login"

jest.mock('@/application/validation/composite')

describe('LoginController', () => {
    let sut: LoginController
    let facebookAuth: jest.Mock

    beforeEach(() => {
        facebookAuth = jest.fn()
        sut = new LoginController(facebookAuth)
        facebookAuth.mockResolvedValue({ accessToken: 'token_value' })
    })

  
    it('should call FacebookAuthentication with correct params', async () => {
        await sut.handle({ token: 'any_token' })

        expect(facebookAuth).toHaveBeenCalledWith({ token: 'any_token' })
        expect(facebookAuth).toHaveBeenCalledTimes(1)
    })

    it('should return 401 if invalid credentials are provided', async () => {
        facebookAuth.mockResolvedValueOnce(undefined)

        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 401,
            data: new UnauthorizedError()
        })
    })

    it('should return 200 if authentication succeeds', async () => {
        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 200,
            data: {
                accessToken: 'token_value'
            }
        })
    })

    it('should return 500 if authentication throws', async () => {
        const error = new Error('infra_error')
        facebookAuth.mockRejectedValueOnce(error)

        const httpResponse = await sut.handle({ token: 'any_token' })

        expect(httpResponse).toEqual({
            statusCode: 500,
            data: new ServerError(error)
        })
    })
})
