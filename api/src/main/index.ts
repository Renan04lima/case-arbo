import './config/module-alias'
import 'dotenv/config'
import { app } from './config/app'
import { env } from './config/env'

import 'reflect-metadata'
import { PgConnection } from '@/infra/postgres/helpers/connection'

if (process.env.NODE_ENV !== 'test') {
  PgConnection.getInstance()
    .connect()
    .then(() => {
      app.listen(env.appPort, () =>
        console.log(`Server running at http://localhost:${env.appPort}`),
      )
    })
    .catch((err) => {
      console.log(err)
    })
}
