import { Controller } from '@/application/controllers'
import { RequestHandler } from 'express'


type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = (controller) => async (req, res) => {
    const { data, statusCode } = await controller.handle({ ...req.body })
    const json = statusCode === 200 ? data : { error: data.message }

    res.status(statusCode).json(json)
}