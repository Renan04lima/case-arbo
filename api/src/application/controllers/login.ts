import { HttpResponse, ok, unauthorized } from '@/application/helpers/http'
import { Controller } from '@/application/controllers/controller'
import { Authentication } from '@/domain/use-cases/authentication'

import * as yup from 'yup'

type HttpRequest = { email: string; password: string }
type Model =
  | {
      user: { id: string; email: string }
      token: string
    }
  | Error

export class LoginController extends Controller {
  constructor(private readonly auth: Authentication) {
    super()
  }

  async execute(req: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.auth(req)
    if (data === undefined) return unauthorized()

    return ok(data)
  }

  getValidationSchema(): yup.Schema<HttpRequest> {
    return yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().max(255).min(5).required(),
    })
  }
}
