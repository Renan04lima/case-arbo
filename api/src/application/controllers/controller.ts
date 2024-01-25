/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpResponse,
  badRequest,
  serverError,
} from '@/application/helpers/http'

import * as yup from 'yup'

export abstract class Controller {
  abstract execute(httpRequest: any): Promise<HttpResponse>

  abstract getValidationSchema(): yup.Schema

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      const error = this.validate(httpRequest)
      if (error) {
        return badRequest(error)
      }
      return await this.execute(httpRequest)
    } catch (error) {
      return serverError(error)
    }
  }

  validate(httpRequest: any): Error | undefined {
    try {
      this.getValidationSchema().validateSync(httpRequest, {
        abortEarly: false,
      })
      return undefined
    } catch (error) {
      return new Error((error as any).errors[0])
    }
  }
}
