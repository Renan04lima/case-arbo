import { adaptExpressRoute as adapt } from '@/main/adapters/express-router'
import { makeLoginController } from '@/main/factories'

import { Router } from 'express'

export default (router: Router): void => {
  router.post('/login', adapt(makeLoginController()))
}
