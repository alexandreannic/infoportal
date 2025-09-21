import {PrismaClient} from '@prisma/client'
import {HttpError, Ip} from 'infoportal-api-sdk'
import {prismaMapper} from '../../../core/prismaMapper/PrismaMapper.js'
import {app, AppCacheKey} from '../../../index.js'

export class FormActionService {
  constructor(
    private prisma: PrismaClient,
    private cache = app.cache,
  ) {}

  readonly create = async ({
    workspaceId,
    ...data
  }: Ip.Form.Action.Payload.Create & {createdBy: Ip.User.Email}): Promise<Ip.Form.Action> => {
    if (data.formId === data.targetFormId) {
      throw new HttpError.BadRequest(`A form action cannot reference itself.`)
    }
    const action = await this.prisma.formAction
      .create({
        data,
      })
      .then(prismaMapper.form.mapFormAction)
    this.cache.clear(AppCacheKey.FormAction, action.formId)
    return action
  }

  readonly update = async ({
    workspaceId,
    id,
    formId,
    ...data
  }: Ip.Form.Action.Payload.Update & {createdBy: Ip.User.Email}): Promise<Ip.Form.Action> => {
    const action = await this.prisma.formAction
      .update({
        data,
        where: {
          id,
        },
      })
      .then(prismaMapper.form.mapFormAction)
    this.cache.clear(AppCacheKey.FormAction, action.formId)
    return action
  }

  readonly getActivesByForm = ({formId}: {formId: Ip.FormId}): Promise<Ip.Form.Action[]> => {
    return this.prisma.formAction
      .findMany({orderBy: {createdAt: 'desc'}, where: {formId, disabled: {not: true}, body: {not: null}}})
      .then(_ => _.filter(_ => !_.bodyErrors || _.bodyErrors == 0))
      .then(_ => _.map(prismaMapper.form.mapFormAction))
  }

  readonly getByForm = ({formId}: {formId: Ip.FormId}): Promise<Ip.Form.Action[]> => {
    return this.prisma.formAction
      .findMany({orderBy: {createdAt: 'desc'}, where: {formId}})
      .then(_ => _.map(prismaMapper.form.mapFormAction))
  }
}
