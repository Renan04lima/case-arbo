import './config/module-alias'
import 'dotenv/config'
import { app } from './config/app'
import { env } from './config/env'

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from '@/infra/postgres/helpers/config'

export const ds = new DataSource(config)

if (process.env.NODE_ENV !== 'test') {
    ds.initialize().then(() => {
        app.listen(env.appPort, () => console.log(`Server running at http://localhost:${env.appPort}`))
    }).catch((err) => {
        console.log(err)
    })
}

