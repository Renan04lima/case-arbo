/* eslint-disable @typescript-eslint/no-unused-vars */
import { ServerError } from '@/application/errors/http'
import { Controller } from '@/application/controllers/controller'
import { HttpResponse } from '@/application/helpers/http'

import * as yup from 'yup'

jest.mock('yup')

class ControllerStub extends Controller {
  result: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  }
  constructor() {
    super()
  }

  async execute(httpRequest: any): Promise<HttpResponse> {
    return this.result
  }

  getValidationSchema(): yup.Schema<any> {
    return yup.object().shape({
      any_field: yup.string().required(),
    })
  }
}

describe('Controller', () => {
  let sut: ControllerStub

  beforeEach(() => {
    sut = new ControllerStub()
    jest.spyOn(sut, 'validate').mockImplementation(() => undefined)
  })

  it('should return 400 if validation fails', async () => {
    const error = new Error('any_error')
    jest.spyOn(sut, 'validate').mockImplementationOnce(() => error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('any_error'),
    })
  })

  it('should return 500 if authentication throws', async () => {
    const error = new Error('execute_error')
    jest.spyOn(sut, 'execute').mockRejectedValueOnce(error)

    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    })
  })

  it('should return same result as execute', async () => {
    const httpResponse = await sut.handle('any_value')

    expect(httpResponse).toEqual(sut.result)
  })
})
