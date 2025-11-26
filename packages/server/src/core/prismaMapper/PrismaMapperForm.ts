import {Api} from '@infoportal/api-sdk'
import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {Defined} from 'yup'

export const mapForm = <
  T extends {
    kobo?: any | null
    category?: string | null
    deploymentStatus?: Api.Form.DeploymentStatus | null
    serverId?: string | null
    id?: string
  },
>(
  _: T,
): Defined<
  T & {
    id: Api.FormId
    serverId?: Api.ServerId
    category?: string
    deploymentStatus?: string
    kobo?: Api.Form.KoboInfo
  }
> => _ as any

export const mapKoboInfo = <
  T extends {
    accountId: string | null
    koboId: string | null
  },
>(
  _: T,
): Defined<T> & {
  accountId?: Api.ServerId
  koboId?: Kobo.FormId
} => _ as any

export const mapFormActionReport = <T extends {startedBy: string}>(
  _: T,
): Defined<
  T & {
    startedBy: Api.User.Email
  }
> => _ as any

export const mapFormAction = <
  T extends {
    id: string
    targetFormId: string
    formId: string
    type: Prisma.FormActionType
  },
>(
  _: T,
): Defined<
  T & {
    id: Api.Form.ActionId
    targetFormId: Api.FormId
    formId: Api.FormId
    type: Api.Form.Action.Type
  }
> => _ as any

export const mapVersion = <T extends {id: string; uploadedBy: string}>(
  _: T,
): T & {id: Api.Form.VersionId; uploadedBy: Api.User.Email} => _ as any

export const mapFormActionLog = <
  T extends {submission: any | null; id: string; actionId: string | null; details: string | null},
>(
  _: T,
): Defined<T & {submission?: Api.Submission; actionId?: Api.Form.ActionId; id: Api.Form.Action.LogId; details?: string}> =>
  _ as any

export const mapServer = <T extends {id: string; workspaceId: string}>(
  _: T,
): T & {id: Api.ServerId; workspaceId: Api.WorkspaceId} => _ as any

export const mapSubmission = <T extends {id: string}>(_: T): Defined<Omit<T, 'id'> & {id: Api.SubmissionId}> => _ as any
