import {Ip} from 'infoportal-api-sdk'
import type * as Prisma from '@prisma/client'
import {Kobo} from 'kobo-sdk'
import {Defined} from 'yup'

export const mapForm = <
  T extends {
    kobo?: any | null
    category?: string | null
    deploymentStatus?: Ip.Form.DeploymentStatus | null
    serverId?: string | null
    id?: string
  },
>(
  _: T,
): Defined<
  T & {
    id: Ip.FormId
    serverId?: Ip.ServerId
    category?: string
    deploymentStatus?: string
    kobo?: Ip.Form.KoboInfo
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
  accountId?: Ip.ServerId
  koboId?: Kobo.FormId
} => _ as any

export const mapFormActionReport = <T extends {startedBy: string}>(
  _: T,
): Defined<
  T & {
    startedBy: Ip.User.Email
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
    id: Ip.Form.ActionId
    targetFormId: Ip.FormId
    formId: Ip.FormId
    type: Ip.Form.Action.Type
  }
> => _ as any

export const mapVersion = <T extends {id: string; uploadedBy: string}>(
  _: T,
): T & {id: Ip.Form.VersionId; uploadedBy: Ip.User.Email} => _ as any

export const mapFormActionLog = <
  T extends {submission: any | null; id: string; actionId: string | null; details: string | null},
>(
  _: T,
): Defined<T & {submission?: Ip.Submission; actionId?: Ip.Form.ActionId; id: Ip.Form.Action.LogId; details?: string}> =>
  _ as any

export const mapServer = <T extends {id: string; workspaceId: string}>(
  _: T,
): T & {id: Ip.ServerId; workspaceId: Ip.WorkspaceId} => _ as any

export const mapSubmission = <T extends {id: string}>(_: T): Defined<Omit<T, 'id'> & {id: Ip.SubmissionId}> => _ as any
