import {PrismaClient} from '@prisma/client'
import {NextFunction, Request, Response} from 'express'
import * as yup from 'yup'
import merge from 'lodash.merge'

export class ControllerJsonStore {
  constructor(private prisma: PrismaClient) {}

  readonly get = async (req: Request, res: Response, next: NextFunction) => {
    const {key} = await yup
      .object({
        key: yup.string().required(),
      })
      .validate(req.params)
    const data = await this.prisma.jsonStore.findFirst({where: {key}})
    res.send(data)
  }

  readonly set = async (req: Request, res: Response, next: NextFunction) => {
    const {key, json} = await yup
      .object({
        key: yup.string().required(),
        json: yup.mixed().required(),
      })
      .validate(req.body)
    const exist = await this.prisma.jsonStore.findFirst({where: {key}})
    const email = req.session.user?.email ?? 'unknown'
    const data = exist
      ? await this.prisma.jsonStore.update({
          where: {key},
          data: {
            updatedAt: new Date(),
            updatedBy: email,
            value: json,
          },
        })
      : await this.prisma.jsonStore.create({
          data: {
            key,
            value: json as any,
            updatedBy: email,
          },
        })
    res.send(data)
  }

  readonly update = async (req: Request, res: Response, next: NextFunction) => {
    const {key, json} = await yup
      .object({
        key: yup.string().required(),
        json: yup.mixed().required(),
      })
      .validate(req.body)
    const email = req.session.user?.email ?? 'unknown'
    const current = await this.prisma.jsonStore.findFirst({where: {key}})
    const data = current
      ? await this.prisma.jsonStore.update({
          where: {key},
          data: {
            key,
            value: merge(current?.value, json),
            updatedBy: email,
          },
        })
      : await this.prisma.jsonStore.create({
          data: {
            key,
            value: json as any,
            updatedBy: email,
          },
        })
    res.send(data)
  }
}
